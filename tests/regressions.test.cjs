const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { test } = require('node:test')
const ts = require('typescript')
const dayjs = require('dayjs')
const root = path.join(__dirname, '..')

// Execute real project modules with explicit dependency mocks; no API/DB imports.
function load(file, dependencies = {}, globals = {}) {
  const code = ts.transpileModule(readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
  }).outputText
  const evaluated = { exports: {} }
  vm.runInNewContext(
    code,
    {
      module: evaluated,
      exports: evaluated.exports,
      require(name) {
        if (Object.hasOwn(dependencies, name)) return dependencies[name]
        throw new Error(`Unmocked dependency: ${name}`)
      },
      console: { error() {}, log() {} },
      ...globals,
    },
    { filename: file }
  )
  return evaluated.exports
}
const utils = load('src/utils/utils.ts', {
  '@/graphql/generated': { UserCellTransferStatus: {} },
})
const auth = load('src/utils/authSession.ts')
const flush = () => new Promise((resolve) => setImmediate(resolve))

for (const input of [
  null,
  '',
  '{bad',
  'null',
  '[]',
  '{"accessToken":42}',
  '{"accessToken":" "}',
]) {
  test(`invalid stored token is rejected: ${input}`, () =>
    assert.equal(auth.parseStoredAccessToken(input), null))
}
test('valid stored token is preserved', () =>
  assert.equal(auth.parseStoredAccessToken('{"accessToken":"token"}'), 'token'))
test('unknown exception values never cause another exception', () => {
  for (const input of [null, undefined, 42, {}, { message: null }])
    assert.equal(
      utils.makeErrorMessage(input),
      '알 수 없는 오류가 발생했습니다'
    )
  assert.equal(utils.makeErrorMessage('실패: details'), '실패')
  assert.equal(utils.makeErrorMessage(new Error('저장 실패')), '저장 실패')
})
test('unknown service IDs retain every attendance without mutating input', () => {
  const input = [
    { churchServiceId: '1', userId: 'a' },
    { churchServiceId: '6', userId: 'b' },
    { churchServiceId: '6', userId: 'c' },
    { churchServiceId: '', userId: 'd' },
  ]
  const before = JSON.stringify(input)
  const groups = utils.groupByChurchService(input)
  assert.equal(groups.length, 7)
  assert.equal(
    groups.find((g) => g.serviceId === '6').tempAttendanceList.length,
    2
  )
  assert.equal(
    groups.reduce((n, g) => n + g.tempAttendanceList.length, 0),
    4
  )
  assert.equal(JSON.stringify(input), before)
  assert.equal(utils.getServiceName('1'), '1부예배')
  assert.match(utils.getServiceName('6'), /미등록 예배/)
  assert.equal(utils.groupByChurchService([]).length, 5)
})

function meetingHook(
  mutateAsync,
  { selected, roster = [{ id: 'u1', name: '회원' }] } = {}
) {
  const success = [],
    errors = [],
    submitting = []
  let stateIndex = 0
  const state = {
    tempAttendanceList:
      selected === undefined
        ? [
            {
              userId: 'u1',
              userName: '회원',
              cellId: 'c1',
              cellName: '셀',
              baseDateString: '2026-11-01',
            },
          ]
        : selected,
  }
  const hook = load('src/hooks/useCellMeeting.ts', {
    react: {
      useEffect() {},
      useRef: (value) => ({ current: value }),
      useState: (value) => {
        const index = stateIndex++
        return [
          value,
          (next) => {
            if (index === 2) submitting.push(next)
          },
        ]
      },
    },
    recoil: { useRecoilState: () => [state, () => {}] },
    '@/client/graphqlRequestClient': {},
    '@/firebase/cellMeeting/cellmeeting': {
      onSaveCellMeeting() {},
      getCellMeetingSubmissionStatus() {},
    },
    '@/graphql/generated': {
      useFindMyCellMembersQuery: () => ({ data: { myCellMembers: roster } }),
    },
    '@/stores/cellMeetingState': { cellMeetingState: {} },
    '@/utils/dateUtils': { getMostRecentSunday: () => dayjs('2026-11-01') },
    '@/utils/utils': utils,
    '@tanstack/react-query': {
      useQueryClient: () => ({ invalidateQueries() {} }),
      useQuery: () => ({}),
      useMutation: () => ({ mutateAsync }),
    },
    'react-hot-toast': {
      success: (msg) => success.push(msg),
      error: (msg) => errors.push(msg),
    },
  }).default({ cellId: 'c1', cellName: '셀' })
  return { hook, success, errors, submitting }
}
test('meeting success waits for persistence and ignores concurrent clicks', async () => {
  let resolve,
    calls = 0
  const pending = new Promise((r) => {
    resolve = r
  })
  const { hook, success, submitting } = meetingHook(() => {
    calls++
    return pending
  })
  const saved = hook.onSaveHandler()
  await hook.onSaveHandler()
  assert.equal(calls, 1)
  assert.equal(success.length, 0)
  assert.deepEqual(submitting, [true])
  resolve()
  await saved
  assert.equal(success.length, 1)
  assert.deepEqual(submitting, [true, false])
})
test('meeting failure shows error, releases lock and allows retry', async () => {
  let calls = 0
  const { hook, errors, success, submitting } = meetingHook(async () => {
    calls++
    throw new Error('저장 실패')
  })
  await hook.onSaveHandler()
  await hook.onSaveHandler()
  assert.equal(calls, 2)
  assert.equal(success.length, 0)
  assert.deepEqual(errors, ['저장 실패', '저장 실패'])
  assert.deepEqual(submitting, [true, false, true, false])
})
for (const options of [
  { selected: [] },
  { selected: null },
  { roster: [] },
  {
    selected: [{ userId: 'other', cellId: 'c1', baseDateString: '2026-11-01' }],
  },
]) {
  test(`meeting rejects invalid submission: ${JSON.stringify(
    options
  )}`, async () => {
    let calls = 0
    const { hook, errors, success } = meetingHook(async () => {
      calls++
    }, options)
    await hook.onSaveHandler()
    assert.equal(calls, 0)
    assert.equal(success.length, 0)
    assert.equal(errors.length, 1)
  })
}

const constants = {
  CELLMEETING_COLLCTION: {
    CELLMEETINGS: 'meetings',
    DATA: 'data',
    CELLLIST: 'cells',
    CELLHISTORY: 'history',
    MEMBERLIST: 'members',
    HISTORY: 'history',
  },
  EVALUATIONFORM_COLLCTION: {
    EVALUATIONFORM: 'evaluations',
    SETTINGS: 'settings',
    MEMBERLIST: 'members',
    SUBMISSION: 'submission',
  },
}
function firestoreModule(file, { exists = () => false, failure } = {}) {
  const committed = [],
    reads = [],
    staged = []
  const evaluated = load(file, {
    '@/client/firebaseConfig': { db: {} },
    '@/constants/constants': constants,
    '@/utils/utils': utils,
    '@/types/evalutation': {
      EvaluationSubmissionStatus: {
        INPROGRESS: 'INPROGRESS',
        COMPLETE: 'COMPLETE',
      },
      IndividualSubmissionCheckType: {},
    },
    'react-hot-toast': { error() {} },
    'firebase/firestore': {
      doc: (_db, ...parts) => parts.join('/'),
      getDoc: async () => {
        throw new Error('unexpected nontransaction read')
      },
      serverTimestamp: () => 'timestamp',
      runTransaction: async (_db, action) => {
        await action({
          get: async (ref) => {
            assert.equal(staged.length, 0, 'all reads must precede writes')
            reads.push(ref)
            return {
              exists: () => exists(ref),
              data: () => ({ isActive: true, seasonName: '2026' }),
            }
          },
          set: (ref, data) => staged.push({ ref, data }),
          update: (ref, data) => staged.push({ ref, data }),
        })
        if (failure) throw failure
        committed.push(...staged)
      },
    },
  })
  return { module: evaluated, committed, reads }
}
const submission = {
  cellId: 'c1',
  baseDateString: '2026-11-01',
  submitDataForCell: { cellId: 'c1' },
  submitDataForMember: [{ userId: 'u1' }],
  submitDataForAbsentMember: [{ userId: 'u2' }],
}
test('meeting transaction commits cell and members together, preserving existing records', async () => {
  const { module, committed } = firestoreModule(
    'src/firebase/cellMeeting/cellmeeting.ts',
    { exists: (ref) => ref.includes('/members/u1/') }
  )
  await module.onSaveCellMeeting(submission)
  assert.equal(committed.length, 2)
  assert.ok(committed.some((w) => w.ref.includes('/members/u2/')))
  assert.ok(committed.some((w) => w.ref.includes('/cells/c1/')))
})
test('meeting transaction failure propagates and commits nothing', async () => {
  const { module, committed } = firestoreModule(
    'src/firebase/cellMeeting/cellmeeting.ts',
    { failure: new Error('permission denied') }
  )
  await assert.rejects(
    module.onSaveCellMeeting(submission),
    /permission denied/
  )
  assert.equal(committed.length, 0)
})
test('already submitted meeting cannot be reported as a new success', async () => {
  const { module, committed } = firestoreModule(
    'src/firebase/cellMeeting/cellmeeting.ts',
    { exists: () => true }
  )
  await assert.rejects(module.onSaveCellMeeting(submission), /이미 제출/)
  assert.equal(committed.length, 0)
})
test('evaluation missing settings rejects with a readable Error', async () => {
  const { module } = firestoreModule('src/firebase/evaluation/evaluation.ts')
  await assert.rejects(
    module.createIndividaulEvaluation({}),
    /세팅이 설정되지 않았습니다/
  )
  await assert.rejects(
    module.createCellEvaluationFormFinalSubmission({ cellId: 'c1' }),
    /세팅이 설정되지 않았습니다/
  )
})
test('evaluation preserves string failures and does not resolve as success', async () => {
  const { module } = firestoreModule('src/firebase/evaluation/evaluation.ts', {
    exists: () => true,
    failure: '저장 거절',
  })
  await assert.rejects(
    module.createCellEvaluationFormFinalSubmission({ cellId: 'c1' }),
    /저장 거절/
  )
})
test('evaluation cannot finalize a missing cell submission', async () => {
  const { module } = firestoreModule('src/firebase/evaluation/evaluation.ts', {
    exists: (ref) => ref.endsWith('/settings'),
  })
  await assert.rejects(
    module.createCellEvaluationFormFinalSubmission({ cellId: 'c1' }),
    /저장된 셀원정보가 없습니다/
  )
})

function authHook(storageThrows = false) {
  const values = new Map(),
    resets = [],
    headers = [],
    routes = []
  let clears = 0
  const deps = {
    react: { useCallback: (fn) => fn },
    recoil: {
      useRecoilState: (key) => [null, (value) => values.set(key, value)],
      useSetRecoilState: (key) => (value) => values.set(key, value),
      useResetRecoilState: (key) => () => resets.push(key),
    },
    '@/client/graphqlRequestClient': {
      setHeader: (...args) => headers.push(args),
    },
    '@/constants/constants': { INTOUCH_LEADERS_ACCESS_TOKEN: 'token' },
    '@/types/attendance': {
      AttendanceStatus: { NOT_SUBMITTED: 'NOT_SUBMITTED' },
    },
    '@/utils/dateUtils': {
      getTodayString: (date) => date.format('YYYY-MM-DD'),
    },
    dayjs,
    '@tanstack/react-query': {
      useQueryClient: () => ({ clear: () => clears++ }),
    },
    'next/router': {
      useRouter: () => ({ replace: async (route) => routes.push(route) }),
    },
  }
  for (const [file, key] of [
    ['attendaceState', 'attendanceState'],
    ['cellMeetingState', 'cellMeetingState'],
    ['stateUserInfo', 'stateUserInfo'],
    ['cellDayCartState', 'cellDayCartState'],
    ['cellDayOrderState', 'cellDayOrderState'],
    ['stateSetting', 'stateSetting'],
  ])
    deps['@/stores/' + file] = { [key]: key }
  const { useAuth: invokeAuth } = load('src/hooks/useAuth.ts', deps, {
    localStorage: {
      removeItem() {
        if (storageThrows) throw new Error('blocked')
      },
    },
  })
  return {
    hook: invokeAuth(),
    values,
    resets,
    headers,
    routes,
    get clears() {
      return clears
    },
  }
}
for (const blocked of [false, true])
  test(`logout clears user/cache/cart/order even with storage blocked=${blocked}`, async () => {
    const state = authHook(blocked)
    state.hook.onLogOutHandler()
    await flush()
    assert.equal(state.clears, 1)
    assert.equal(state.values.get('stateUserInfo'), null)
    assert.deepEqual(state.resets, [
      'cellDayCartState',
      'cellDayOrderState',
      'stateSetting',
    ])
    assert.deepEqual(state.headers, [['authorization', '']])
    assert.deepEqual(state.routes, ['/'])
    assert.equal(state.values.get('attendanceState').tempAttendanceList, null)
  })

for (const scenario of ['malformed', 'expired', 'valid', 'unmounted'])
  test(`session bootstrap: ${scenario}`, async () => {
    let effect,
      cleared = 0,
      finished = 0,
      user = null,
      requests = 0
    const routes = []
    const router = {
      isReady: true,
      asPath: '/home',
      replace: async (route) => routes.push(route),
    }
    const Splash = load(
      'src/components/Templates/SplashScreen/SplashScreen.tsx',
      {
        react: {
          createElement: () => null,
          useEffect: (fn) => {
            effect = fn
          },
        },
        'next/router': { useRouter: () => router },
        '@/hooks/useAuth': {
          useAuth: () => ({
            setUserInfo: (value) => {
              user = value
            },
            clearSession: () => {
              cleared++
            },
          }),
        },
        '@/constants/constants': { INTOUCH_LEADERS_ACCESS_TOKEN: 'token' },
        '@components/Atoms/Layout/Layout': () => null,
        '@components/Atoms/Container/Container': () => null,
        '@/graphql/generated': { MeDocument: 'me' },
        '@/utils/authSession': auth,
        '@/client/graphqlRequestClient': {
          setHeader() {},
          request: async () => {
            requests++
            if (scenario === 'expired') throw new Error('401')
            return { me: { id: 'u1', name: '회원', roles: [] } }
          },
        },
      },
      {
        localStorage: {
          getItem: () =>
            scenario === 'malformed' ? '{bad' : '{"accessToken":"token"}',
        },
        window: { location: { replace: (route) => routes.push(route) } },
      }
    ).default
    Splash({ onFinished: () => finished++ })
    const cleanup = effect()
    if (scenario === 'unmounted') cleanup()
    await flush()
    if (scenario === 'unmounted') {
      assert.equal(user, null)
      assert.equal(finished, 0)
    } else if (scenario === 'valid') {
      assert.equal(user.id, 'u1')
      assert.equal(cleared, 0)
      assert.equal(finished, 1)
    } else {
      assert.equal(cleared, 1)
      assert.equal(user, null)
      assert.deepEqual(routes, ['/'])
      assert.equal(finished, 1)
    }
    if (scenario === 'malformed') assert.equal(requests, 0)
  })

test('order hook uses the current account cell and hides previous account data immediately', () => {
  const effects = [],
    queries = [],
    updates = []
  const hook = load('src/hooks/useOrderState.ts', {
    react: { useEffect: (fn) => effects.push(fn) },
    recoil: {
      useRecoilValue: () => ({ cell: { id: 'new-cell' } }),
      useRecoilState: () => [
        { cellId: 'old-cell', orderStatus: 'COMPLETE', orderNumber: 'private' },
        (value) => updates.push(value),
      ],
    },
    '@/firebase/dallant/cellday': { getOrderStatement() {} },
    '@/stores/cellDayOrderState': { cellDayOrderState: {} },
    '@/stores/stateUserInfo': { stateUserInfo: {} },
    '@/types/cellday': { OrderStatus: { NOT_SUBMITTED: 'NOT_SUBMITTED' } },
    '@tanstack/react-query': {
      useQuery: (key) => {
        queries.push(key)
        return { data: undefined }
      },
    },
  }).default()
  assert.equal(queries[0][1], 'new-cell')
  assert.equal(hook.orderState.cellId, 'new-cell')
  assert.equal(hook.orderState.orderNumber, undefined)
  effects.forEach((fn) => fn())
  assert.equal(updates[0].cellId, 'new-cell')
})

for (const fails of [false, true])
  test(`login verifies profile before storing token or navigating, profile failure=${fails}`, async () => {
    let options,
      cleared = 0,
      user = null
    const routes = [],
      saved = [],
      errors = []
    const Login = load(
      'src/pages/index.tsx',
      {
        'react/jsx-runtime': {},
        react: {
          createElement: () => null,
          useRef: (value) => ({ current: value }),
          useState: (value) => [value, () => {}],
        },
        'next/head': () => null,
        'next/router': {
          useRouter: () => ({ replace: async (route) => routes.push(route) }),
        },
        'react-hot-toast': { toast: { error: (msg) => errors.push(msg) } },
        'react-hook-form': {
          useForm: () => ({
            handleSubmit: (fn) => fn,
            register: () => ({}),
            formState: { errors: {} },
          }),
        },
        '@/graphql/generated': {
          MeDocument: 'me',
          useLoginMutation: (_client, opts) => {
            options = opts
            return { mutate() {}, isLoading: false }
          },
        },
        '@/client/graphqlRequestClient': {
          setHeader() {},
          request: async () => {
            assert.equal(saved.length, 0)
            if (fails) throw new Error('401')
            return { me: { id: 'u1', name: '회원', roles: [] } }
          },
        },
        '@/hooks/useAuth': {
          useAuth: () => ({
            clearSession: () => cleared++,
            setUserInfo: (value) => {
              user = value
            },
          }),
        },
        '@components/Atoms/Spinner': () => null,
        '@/constants/constants': { INTOUCH_LEADERS_ACCESS_TOKEN: 'token' },
      },
      {
        React: require('react'),
        localStorage: { setItem: (...args) => saved.push(args) },
      }
    ).default
    Login()
    await options.onSuccess({ login: { accessToken: 'token' } })
    if (fails) {
      assert.equal(cleared, 1)
      assert.equal(saved.length, 0)
      assert.equal(routes.length, 0)
      assert.equal(user, null)
      assert.equal(errors.length, 1)
    } else {
      assert.equal(saved.length, 1)
      assert.deepEqual(routes, ['/home'])
      assert.equal(user.id, 'u1')
    }
  })

// Deterministic hook lifecycle harness: checks dependencies and bounded rerenders.
function hookLifecycle() {
  const slots = []
  let cursor = 0,
    dirty = false,
    effects = []
  const same = (a, b) =>
    a && a.length === b.length && a.every((v, i) => Object.is(v, b[i]))
  const react = {
    createElement: (...args) => args,
    useState(initial) {
      const i = cursor++
      if (!slots[i])
        slots[i] = {
          value: initial,
          set(value) {
            const next =
              typeof value === 'function' ? value(slots[i].value) : value
            if (!Object.is(next, slots[i].value)) {
              slots[i].value = next
              dirty = true
            }
          },
        }
      return [slots[i].value, slots[i].set]
    },
    useEffect(fn, deps) {
      const i = cursor++
      if (!same(slots[i]?.deps, deps)) {
        const previous = slots[i]
        slots[i] = { deps }
        effects.push(() => {
          previous?.cleanup?.()
          slots[i].cleanup = fn()
        })
      }
    },
    useCallback(fn, deps) {
      const i = cursor++
      if (!same(slots[i]?.deps, deps)) slots[i] = { deps, value: fn }
      return slots[i].value
    },
  }
  return {
    react,
    render(fn) {
      let output
      for (let count = 0; count < 20; count++) {
        cursor = 0
        dirty = false
        effects = []
        output = fn()
        effects.forEach((effect) => effect())
        if (!dirty) return output
      }
      throw new Error('Render loop detected')
    },
    dispose() {
      slots.forEach((slot) => slot?.cleanup?.())
    },
  }
}

test('attendance server synchronization preserves local edits until query data changes', () => {
  const life = hookLifecycle()
  let state = {
    submitDate: '2026-11-01',
    status: 'NOT_SUBMITTED',
    tempAttendanceList: null,
    attendanceList: null,
  }
  let query = {
      isLoading: false,
      data: { myCellAttendance: { __typename: 'CellAttendanceNotSubmitted' } },
    },
    writes = 0
  const setState = (next) => {
    writes++
    state = typeof next === 'function' ? next(state) : next
  }
  const hook = load('src/hooks/useAttendance.ts', {
    react: life.react,
    recoil: { useRecoilState: () => [state, setState] },
    '@/client/graphqlRequestClient': {},
    '@/stores/attendaceState': { attendanceState: {} },
    '@/types/attendance': {
      AttendanceStatus: {
        NOT_SUBMITTED: 'NOT_SUBMITTED',
        TEMPORARY_SAVE: 'TEMPORARY_SAVE',
        COMPLETE: 'COMPLETE',
      },
    },
    '@tanstack/react-query': {
      useQueryClient: () => ({ invalidateQueries() {} }),
    },
    '@/graphql/generated': {
      useFindmyCellAttendanceQuery: () => query,
      useSubmitAttendanceMutation: () => ({ mutateAsync() {} }),
    },
  }).default
  life.render(hook)
  state = { ...state, tempAttendanceList: [{ userId: 'draft' }] }
  life.render(hook)
  assert.equal(writes, 1)
  assert.equal(state.tempAttendanceList[0].userId, 'draft')
  query = {
    isLoading: false,
    data: {
      myCellAttendance: {
        __typename: 'CellAttendanceTempSaved',
        tempSavedAttendanceHistories: [{ userId: 'saved' }],
      },
    },
  }
  life.render(hook)
  assert.equal(state.tempAttendanceList[0].userId, 'saved')
  assert.equal(state.submitDate, '2026-11-01')
  query = {
    isLoading: false,
    data: {
      myCellAttendance: {
        __typename: 'CellAttendanceCompleted',
        userChurchServiceHistories: [{ id: 'complete' }],
      },
    },
  }
  life.render(hook)
  assert.equal(state.status, 'COMPLETE')
  assert.equal(state.tempAttendanceList, null)
})

test('evaluation countdown callback stays stable across start/end transitions', () => {
  const life = hookLifecycle()
  const dates = load('src/utils/dateUtils.ts', { dayjs })
  const hook = load('src/hooks/useCheckEvaluationPeriods.ts', {
    react: life.react,
    dayjs,
    '@/firebase/evaluation/evaluation': { getEvalutationSettings() {} },
    '@/utils/dateUtils': dates,
    '@tanstack/react-query': {
      useQuery: () => ({ isLoading: false, isFetching: false, data: null }),
    },
  }).useCheckEvaluationPeriods
  let result = life.render(hook)
  const update = result.updateEntryCountdown
  const startDate = dayjs('2026-11-04T12:00:00'),
    targetDate = startDate.add(10, 'second')
  update({
    currentDate: startDate.subtract(1, 'second'),
    startDate,
    targetDate,
  })
  result = life.render(hook)
  assert.equal(result.statusCode, 'notStarted')
  update({ currentDate: startDate.add(2, 'second'), startDate, targetDate })
  result = life.render(hook)
  assert.equal(result.statusCode, null)
  assert.equal(result.message, null)
  assert.equal(result.countDown.seconds, 8)
  assert.equal(result.updateEntryCountdown, update)
  update({ currentDate: targetDate.add(1, 'second'), startDate, targetDate })
  result = life.render(hook)
  assert.equal(result.statusCode, 'completed')
  assert.equal(result.countDown, null)
})

test('dallant cell query follows delayed leader data and cell changes without stale totals', () => {
  const life = hookLifecycle()
  let user = {},
    members,
    account
  const queryKeys = []
  const hook = load('src/hooks/useCellDallant.ts', {
    react: life.react,
    recoil: { useRecoilValue: () => user },
    '@/client/graphqlRequestClient': {},
    '@/stores/stateUserInfo': { stateUserInfo: {} },
    '@/firebase/dallant/dallant': { getCellDallant() {} },
    'react-hot-toast': { error() {} },
    '@/graphql/generated': {
      RoleType: { CellLeader: 'leader' },
      useFindMyCellMembersQuery: () => ({
        data: members,
        isLoading: false,
        isFetching: false,
      }),
    },
    '@tanstack/react-query': {
      useQuery: (key) => {
        queryKeys.push(key)
        return { data: account, isLoading: false, isFetching: false }
      },
    },
  }).default
  assert.equal(life.render(hook).cellInfo, null)
  members = {
    myCellMembers: [{ id: 'u1', roles: ['leader'], cell: { id: 'c1' } }],
  }
  account = {
    cellId: 'c1',
    totalAmount: 10,
    members: [{ userId: 'u1', totalAmount: 10 }],
  }
  let result = life.render(hook)
  assert.equal(queryKeys.at(-1)[1], 'c1')
  assert.equal(result.cellInfo.totalAmount, 10)
  user = { cell: { id: 'c2' } }
  result = life.render(hook)
  assert.equal(queryKeys.at(-1)[1], 'c2')
  assert.equal(result.cellInfo, null)
  assert.equal(result.cellMember, null)
  user = {}
  members = { myCellMembers: [] }
  account = undefined
  result = life.render(hook)
  assert.equal(queryKeys.at(-1)[1], '')
  assert.equal(result.cellInfo, null)
})

const evaluationTypes = load('src/types/evalutation.ts')
for (const worship of Object.values(evaluationTypes.WORSHIP_TYPE)) {
  for (const meeting of Object.values(evaluationTypes.MEETING_GRADE)) {
    test(`evaluation grade keeps existing rule: ${worship} / ${meeting}`, () => {
      const life = hookLifecycle()
      let submit, grade
      const form = { worship, meeting, description: '' }
      const deps = {
        react: life.react,
        '@/client/graphqlRequestClient': {},
        '@/types/evalutation': evaluationTypes,
        '@/utils/utils': utils,
        '@/firebase/evaluation/evaluation': {
          createIndividaulEvaluation() {},
          getIndividaulEvaluationSubmission() {},
        },
        '@/graphql/generated': {
          UserGrade: { A: 'A', B: 'B', C: 'C', D: 'D' },
          useFindMyCellMemberQuery: () => ({
            data: {
              user: { id: 'u1', name: '회원', cell: { id: 'c1', name: '셀' } },
            },
          }),
          useUpdateUserMutation: () => ({
            mutate: ({ input }) => {
              grade = input.grade
            },
          }),
        },
        '@tanstack/react-query': {
          useQueryClient: () => ({ invalidateQueries() {} }),
          useQuery: () => ({ isLoading: false, isFetching: false }),
          useMutation: () => ({ mutate() {} }),
        },
        'next/router': {
          useRouter: () => ({
            query: { id: 'u1', seasonName: '2026' },
            back() {},
          }),
        },
        'react-hook-form': {
          useForm: () => ({
            handleSubmit: (fn) => {
              submit = fn
              return fn
            },
            watch: (key) => form[key],
            setValue() {},
            formState: { errors: {} },
          }),
        },
        'react-hot-toast': { success() {}, error() {} },
        '@heroicons/react/20/solid': { ChevronLeftIcon: () => null },
      }
      for (const name of [
        'Atoms/Container/Container',
        'Atoms/Skeleton',
        'Blocks/EvaluationForm/DescriptionTextArea',
        'Blocks/EvaluationForm/MeetingRadioGroup',
        'Blocks/EvaluationForm/WorshipRadioGroup',
      ])
        deps['@/components/' + name] = () => null
      const Screen = load(
        'src/components/Templates/Cell/CellEvaluationDetailScreen/index.tsx',
        deps
      ).default
      life.render(() => Screen({}))
      submit(form)
      const expected =
        worship === evaluationTypes.WORSHIP_TYPE.ABSENT
          ? 'D'
          : worship === evaluationTypes.WORSHIP_TYPE.OTHERS_SERVICES
          ? 'C'
          : meeting === evaluationTypes.MEETING_GRADE.THIRD
          ? 'B'
          : 'A'
      assert.equal(grade, expected)
    })
  }
}

test('countdown timer uses the current clock and cleans up without recreating on parent renders', () => {
  const life = hookLifecycle()
  let now = '2026-11-04T12:00:00',
    created = 0,
    cleared = 0,
    tick
  const calls = []
  const deps = {
    react: life.react,
    dayjs: () => dayjs(now),
    '@/hooks/useCheckEvaluationPeriods': {
      EntryDateStatusCode: { NOTSTARTED: 'notStarted', COMPLETED: 'completed' },
    },
  }
  for (const name of [
    'Atoms/Skeleton',
    'Atoms/CountDown/CountDown',
    'Atoms/Alerts/EvaluationFormAlerts/ShutdownAlert/ShutdownAlert',
    'Atoms/Alerts/EvaluationFormAlerts/DurationAlertCard',
    'Atoms/Alerts/EvaluationFormAlerts/ClosureDateAlert',
    'Atoms/Alerts/EvaluationFormAlerts/PreStartDateAlert',
  ])
    deps['@/components/' + name] = () => null
  const Header = load(
    'src/components/Organisms/Cell/CellEvaluationForm/CellEvaluationFormEntryHeader.tsx',
    deps,
    {
      setInterval: (fn) => {
        created++
        tick = fn
        return 1
      },
      clearInterval: () => cleared++,
    }
  ).default
  const props = {
    isLoading: false,
    isActive: true,
    entryStartDate: dayjs(now),
    entryEndDate: dayjs(now).add(1, 'hour'),
    statusCode: null,
    countDown: null,
    updateEntryCountdown: (value) => calls.push(value.currentDate),
  }
  life.render(() => Header({ ...props, today: dayjs(now) }))
  tick()
  now = '2026-11-04T12:00:01'
  life.render(() => Header({ ...props, today: dayjs(now) }))
  tick()
  assert.equal(calls[1].diff(calls[0], 'second'), 1)
  assert.equal(created, 1)
  life.dispose()
  assert.equal(cleared, 1)
})

test('submission callback remains stable and repeated status reports do not loop', () => {
  const life = hookLifecycle()
  let callback
  const react = {
    ...life.react,
    createElement: (type, props, ...children) => {
      if (props?.onHandleCheckSubmission)
        callback = props.onHandleCheckSubmission
      return [type, props, children]
    },
  }
  const deps = {
    react,
    dayjs,
    '@/graphql/generated': { RoleType: { CellLeader: 'leader' } },
    '@/types/evalutation': evaluationTypes,
    '@/hooks/useFindCellMembers': {
      useFindCellMembers: () => ({
        data: { myCellMembers: [{ id: 'u1', name: '회원', roles: [] }] },
      }),
    },
    '@/hooks/useAuth': {
      useAuth: () => ({ userInfo: { cell: { id: 'c1' } } }),
    },
    '@/firebase/evaluation/evaluation': {
      createCellEvaluationFormFinalSubmission() {},
      getCellSubmissionStatus() {},
    },
    '@tanstack/react-query': {
      useQueryClient: () => ({ invalidateQueries() {} }),
      useQuery: () => ({}),
      useMutation: () => ({ mutate() {} }),
    },
    'react-hot-toast': { success() {}, error() {} },
    './CellEvaluationFormListItem': () => null,
    './CellEvaluationFormSubmissionModal': () => null,
  }
  for (const name of [
    'Atoms/EmptyStates/EmptyStateSimple',
    'Atoms/Skeleton',
    'Atoms/Buttons/Button',
  ])
    deps['@/components/' + name] = () => null
  const List = load(
    'src/components/Organisms/Cell/CellEvaluationForm/CellEvaluationFormList.tsx',
    deps
  ).default
  life.render(() => List({ seasonName: '2026' }))
  const initial = callback
  callback('u1', evaluationTypes.IndividualSubmissionCheckType.SAVED)
  life.render(() => List({ seasonName: '2026' }))
  assert.equal(callback, initial)
  callback('u1', evaluationTypes.IndividualSubmissionCheckType.SAVED)
  life.render(() => List({ seasonName: '2026' }))
  assert.equal(callback, initial)
})
