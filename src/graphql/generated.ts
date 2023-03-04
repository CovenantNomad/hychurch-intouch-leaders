import { GraphQLClient } from 'graphql-request'
import { RequestInit } from 'graphql-request/dist/types.dom'
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}

function fetcher<TData, TVariables extends { [key: string]: any }>(
  client: GraphQLClient,
  query: string,
  variables?: TVariables,
  requestHeaders?: RequestInit['headers']
) {
  return async (): Promise<TData> =>
    client.request({
      document: query,
      variables,
      requestHeaders,
    })
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type BetweenFilter = {
  max: Scalars['String']
  min: Scalars['String']
}

/** 셀 */
export type Cell = {
  __typename?: 'Cell'
  /** 비고 */
  description?: Maybe<Scalars['String']>
  /** 아이디 */
  id: Scalars['ID']
  /** 셀원 */
  leaders: Array<User>
  /** 셀원 */
  members: Array<User>
  /** 셀 이름 */
  name: Scalars['String']
  /** Cell 관련 통계값 */
  statistics: StatisticsOfCell
  /** 해당 셀로의 셀원 이동 신청 내역 */
  transfersIn: Array<UserCellTransfer>
  /** 해당 셀로의 셀원 이동 신청 내역 */
  transfersOut: Array<UserCellTransfer>
}

/** 셀 */
export type CellTransfersInArgs = {
  orderDate?: InputMaybe<DateFilter>
  status?: InputMaybe<Array<UserCellTransferStatus>>
}

/** 셀 */
export type CellTransfersOutArgs = {
  orderDate?: InputMaybe<DateFilter>
  status?: InputMaybe<Array<UserCellTransferStatus>>
}

/** 예배 */
export type ChurchService = {
  __typename?: 'ChurchService'
  /** 비고 */
  description?: Maybe<Scalars['String']>
  /** 아이디 */
  id: Scalars['ID']
  /** 예배 활성화 여부 */
  isActive: Scalars['Boolean']
  /** 예배 이름 (1부 예배, 2부 예배, 등) */
  name: Scalars['String']
  /** 예배 시작 시간 (8:00, 9:30, 11:30, 14:15 등) */
  startAt: Scalars['String']
}

export type CreateCellInput = {
  /** 셀 리더 ID */
  cellLeaderId: Scalars['ID']
  /** 비고 */
  description?: InputMaybe<Scalars['String']>
  /** 셀 이름 */
  name: Scalars['String']
}

export type CreateCellPayload = {
  __typename?: 'CreateCellPayload'
  cell: Cell
}

export type CreateUserCellTransferInput = {
  /** from 셀 id */
  fromCellId: Scalars['ID']
  /** 셀원 이동 신청일자 (yyyy-MM-dd) */
  orderDate: Scalars['String']
  /** to 셀 id */
  toCellId: Scalars['ID']
  /** 이동할 셀원 id */
  userId: Scalars['ID']
}

export type CreateUserCellTransferPayload = {
  __typename?: 'CreateUserCellTransferPayload'
  success: Scalars['Boolean']
}

export type DateFilter = {
  between: BetweenFilter
}

export type DeleteCellInput = {
  /** 셀 아이디 */
  cellId: Scalars['Int']
  /** 셀리더를 이동시킬 타겟셀 아이디 */
  targetCellId: Scalars['Int']
}

export type DeleteCellPayload = {
  __typename?: 'DeleteCellPayload'
  /** 삭제된 셀 */
  cell: Cell
}

export type FindCellsPayload = {
  __typename?: 'FindCellsPayload'
  nodes: Array<Cell>
  totalCount: Scalars['Int']
}

export type FindUsersPayload = {
  __typename?: 'FindUsersPayload'
  nodes: Array<User>
  totalCount: Scalars['Int']
}

export enum Gender {
  /** 남성 */
  Man = 'MAN',
  /** 여성 */
  Woman = 'WOMAN',
}

export type LoginInput = {
  /** 로그인 비밀번호 */
  password: Scalars['String']
  /** 전화번호 */
  phone: Scalars['String']
}

export type LoginPayload = {
  __typename?: 'LoginPayload'
  /** 토큰 */
  accessToken: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  createCell: CreateCellPayload
  /** 셀원 이동 신청 (단건) */
  createUserCellTransfer: CreateUserCellTransferPayload
  deleteCell: DeleteCellPayload
  login: LoginPayload
  /** 새가족 등록을 처리합니다. */
  registerNewUser: RegisterNewUserPayload
  resetUserPassword: ResetUserPasswordPayload
  signUp: SignUpPayload
  /** 셀장이 셀원들의 예배 출석 이력 다건을 기록합니다. */
  submitCellMemberChurchServiceAttendanceHistories: SubmitCellMemberChurchServiceAttendanceHistoriesPayload
  /** 사용자 정보를 업데이트 합니다. */
  updateUser: UpdateUserPayload
  updateUserCellTransfer: UpdateUserCellTransferPayload
}

export type MutationCreateCellArgs = {
  input: CreateCellInput
}

export type MutationCreateUserCellTransferArgs = {
  input: CreateUserCellTransferInput
}

export type MutationDeleteCellArgs = {
  input: DeleteCellInput
}

export type MutationLoginArgs = {
  input: LoginInput
}

export type MutationRegisterNewUserArgs = {
  input: RegisterNewUserInput
}

export type MutationResetUserPasswordArgs = {
  input: ResetUserPasswordInput
}

export type MutationSignUpArgs = {
  input: SignUpInput
}

export type MutationSubmitCellMemberChurchServiceAttendanceHistoriesArgs = {
  input: SubmitCellMemberChurchServiceAttendanceHistoriesInput
}

export type MutationUpdateUserArgs = {
  input: UpdateUserInput
}

export type MutationUpdateUserCellTransferArgs = {
  input: UpdateUserCellTransferInput
}

export type Query = {
  __typename?: 'Query'
  /** 셀 단건 조회 */
  findCell: Cell
  /** 셀 전체 조회 */
  findCells: FindCellsPayload
  findChurchServices: Array<ChurchService>
  /** 전체 사용자 조회 */
  findUsers: FindUsersPayload
  /** 로그인한 사용자의 정보를 조회합니다. */
  me: User
  /** 셀원 조회. 셀장만 셀원 조회가 가능합니다. */
  myCellMembers?: Maybe<Array<User>>
  /** 사용자 정보를 조회합니다. */
  user: User
}

export type QueryFindCellArgs = {
  id: Scalars['Float']
}

export type QueryFindCellsArgs = {
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryFindUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>
  name?: InputMaybe<Scalars['String']>
  offset?: InputMaybe<Scalars['Int']>
}

export type QueryUserArgs = {
  id: Scalars['ID']
}

export type RegisterNewUserInput = {
  /** 주소 */
  address?: InputMaybe<Scalars['String']>
  /** 생년월일(yyyy-MM-dd) */
  birthday: Scalars['String']
  /** 비고 */
  description?: InputMaybe<Scalars['String']>
  /** 성별 */
  gender: Gender
  /** 이름 */
  name: Scalars['String']
  /** 전화번호 */
  phone: Scalars['String']
}

export type RegisterNewUserPayload = {
  __typename?: 'RegisterNewUserPayload'
  user: User
}

export type ResetUserPasswordInput = {
  userId: Scalars['ID']
}

export type ResetUserPasswordPayload = {
  __typename?: 'ResetUserPasswordPayload'
  user: User
}

export enum RoleType {
  /** 관리자 (목사님, 간사님) */
  Admin = 'ADMIN',
  /** 셀 리더 */
  CellLeader = 'CELL_LEADER',
  /** 운영자 (개발자 등) */
  Operator = 'OPERATOR',
  /** 부 리더 */
  ViceLeader = 'VICE_LEADER',
}

export type SignUpInput = {
  /** 회원 가입 인증 번호 */
  authenticationNumber: Scalars['String']
  /** 비고 */
  description?: InputMaybe<Scalars['String']>
  /** 이름 */
  name: Scalars['String']
  /** 로그인 비밀번호 */
  password: Scalars['String']
  /** 전화번호 */
  phone: Scalars['String']
}

export type SignUpPayload = {
  __typename?: 'SignUpPayload'
  user: User
}

export type StatisticsOfCell = {
  __typename?: 'StatisticsOfCell'
  countOfActiveMembers: Scalars['Int']
  totalCountOfMembers: Scalars['Int']
}

export type SubmitCellMemberChurchServiceAttendanceHistoriesInput = {
  /** 셀원 예배 출석이력 제출 기준일자(yyyy-MM-dd). 예) 2022년 5월 29일 예배에 대한 제출이면 2022-05-29 로 입력 */
  baseDate: Scalars['String']
  /** 셀원 출석 이력 목록 */
  userChurchServiceHistories: Array<UserChurchServiceHistoryInput>
}

export type SubmitCellMemberChurchServiceAttendanceHistoriesPayload = {
  __typename?: 'SubmitCellMemberChurchServiceAttendanceHistoriesPayload'
  /** 처리된 출석이력 건수 */
  processedAttendanceHistoryCount: Scalars['Int']
  /** 출석이력 제출요청 건수 */
  requestedAttendanceHistoryCount: Scalars['Int']
}

export type UpdateUserCellTransferInput = {
  id: Scalars['ID']
  /** ORDERED 상태로의 업데이트는 지원하지 않습니다. 오직 CANCELED 또는 CONFIRMED 상태로의 업데이트만 가능합니다. */
  status: UserCellTransferStatus
}

export type UpdateUserCellTransferPayload = {
  __typename?: 'UpdateUserCellTransferPayload'
  userCellTransfer: UserCellTransfer
}

export type UpdateUserInput = {
  /** 주소 */
  address?: InputMaybe<Scalars['String']>
  /** 생년월일(yyyy-MM-dd) */
  birthday: Scalars['String']
  /** 비고 */
  description?: InputMaybe<Scalars['String']>
  /** 성별 */
  gender: Gender
  /** 아이디 */
  id: Scalars['ID']
  /** 자주 출석하는 지 여부 */
  isActive: Scalars['Boolean']
  /** 이름 */
  name: Scalars['String']
  /** 전화번호 */
  phone: Scalars['String']
}

export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload'
  user: User
}

/** 사용자(인터치 소속 성도, 간사님, 목사님) */
export type User = {
  __typename?: 'User'
  /** 주소 */
  address?: Maybe<Scalars['String']>
  /** 생년월일(yyyy-MM-dd) */
  birthday?: Maybe<Scalars['String']>
  /** 사용자가 속한 셀 */
  cell?: Maybe<Cell>
  /** 비고 */
  description?: Maybe<Scalars['String']>
  /** 성별 */
  gender?: Maybe<Gender>
  /** 아이디 */
  id: Scalars['ID']
  /** 자주 출석하는 지 여부 */
  isActive: Scalars['Boolean']
  /** 이름 */
  name: Scalars['String']
  /** 전화번호 */
  phone: Scalars['String']
  /** Roles */
  roles: Array<RoleType>
  userChurchServiceHistories: Array<UserChurchServiceHistory>
}

/** 사용자(인터치 소속 성도, 간사님, 목사님) */
export type UserUserChurchServiceHistoriesArgs = {
  baseDate: Scalars['String']
}

/** 셀원의 셀 이동 신청 내역 */
export type UserCellTransfer = {
  __typename?: 'UserCellTransfer'
  /** 신청처리 완료일자 */
  completeDate?: Maybe<Scalars['String']>
  fromCell: Cell
  id: Scalars['ID']
  /** 신청일자 */
  orderDate: Scalars['String']
  status: UserCellTransferStatus
  toCell: Cell
  /** 셀원 */
  user: User
}

/** 셀원 이동 신청 상태 */
export enum UserCellTransferStatus {
  /** 거절됨 */
  Canceled = 'CANCELED',
  /** 승인됨 */
  Confirmed = 'CONFIRMED',
  /** 신청됨 */
  Ordered = 'ORDERED',
}

/** 셀원 예배 출석 이력 */
export type UserChurchServiceHistory = {
  __typename?: 'UserChurchServiceHistory'
  /** 예배 출석일 (yyyy-MM-dd) */
  attendedAt: Scalars['String']
  churchService: ChurchService
  /** 비고 */
  description?: Maybe<Scalars['String']>
  /** 셀원 예배 출석 이력 식별자 */
  id: Scalars['ID']
  /** 성전/온라인 여부 (true => 온라인) */
  isOnline: Scalars['Boolean']
  user: User
}

export type UserChurchServiceHistoryInput = {
  /** 예배 출석일 (yyyy-MM-dd) */
  attendedAt: Scalars['String']
  /** 예배 아이디 */
  churchServiceId: Scalars['ID']
  /** 비고 */
  description?: InputMaybe<Scalars['String']>
  /** 성전/온라인 여부 (true => 온라인) */
  isOnline: Scalars['Boolean']
  /** 사용자(셀원) 아이디 */
  userId: Scalars['ID']
}

export type LoginMutationVariables = Exact<{
  input: LoginInput
}>

export type LoginMutation = {
  __typename?: 'Mutation'
  login: { __typename?: 'LoginPayload'; accessToken: string }
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename?: 'Query'
  me: {
    __typename?: 'User'
    id: string
    name: string
    roles: Array<RoleType>
    cell?: { __typename?: 'Cell'; id: string; name: string } | null
  }
}

export type CreateUserCellTransferMutationVariables = Exact<{
  input: CreateUserCellTransferInput
}>

export type CreateUserCellTransferMutation = {
  __typename?: 'Mutation'
  createUserCellTransfer: {
    __typename?: 'CreateUserCellTransferPayload'
    success: boolean
  }
}

export type FindCellQueryVariables = Exact<{
  id: Scalars['Float']
}>

export type FindCellQuery = {
  __typename?: 'Query'
  findCell: {
    __typename?: 'Cell'
    id: string
    name: string
    leaders: Array<{
      __typename?: 'User'
      id: string
      name: string
      roles: Array<RoleType>
    }>
    members: Array<{
      __typename?: 'User'
      id: string
      name: string
      phone: string
      isActive: boolean
      birthday?: string | null
      gender?: Gender | null
      address?: string | null
      roles: Array<RoleType>
      cell?: { __typename?: 'Cell'; id: string; name: string } | null
    }>
    statistics: {
      __typename?: 'StatisticsOfCell'
      totalCountOfMembers: number
      countOfActiveMembers: number
    }
  }
}

export type FindMyCellMemberQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type FindMyCellMemberQuery = {
  __typename?: 'Query'
  user: {
    __typename?: 'User'
    id: string
    name: string
    phone: string
    isActive: boolean
    birthday?: string | null
    gender?: Gender | null
    address?: string | null
    description?: string | null
    roles: Array<RoleType>
    cell?: { __typename?: 'Cell'; id: string; name: string } | null
  }
}

export type FindMyCellMembersQueryVariables = Exact<{ [key: string]: never }>

export type FindMyCellMembersQuery = {
  __typename?: 'Query'
  myCellMembers?: Array<{
    __typename?: 'User'
    id: string
    name: string
    phone: string
    isActive: boolean
    birthday?: string | null
    gender?: Gender | null
    address?: string | null
    description?: string | null
    roles: Array<RoleType>
    cell?: { __typename?: 'Cell'; id: string; name: string } | null
  }> | null
}

export type FindUserCellTransferRegisterQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>
  id: Scalars['Float']
  transferOutStatus?: InputMaybe<
    Array<UserCellTransferStatus> | UserCellTransferStatus
  >
  transferOutDateFilter?: InputMaybe<DateFilter>
}>

export type FindUserCellTransferRegisterQuery = {
  __typename?: 'Query'
  findCells: {
    __typename?: 'FindCellsPayload'
    nodes: Array<{ __typename?: 'Cell'; id: string; name: string }>
  }
  findCell: {
    __typename?: 'Cell'
    members: Array<{
      __typename?: 'User'
      id: string
      name: string
      isActive: boolean
      roles: Array<RoleType>
    }>
    transfersOut: Array<{
      __typename?: 'UserCellTransfer'
      id: string
      status: UserCellTransferStatus
      user: {
        __typename?: 'User'
        id: string
        name: string
        gender?: Gender | null
      }
      fromCell: { __typename?: 'Cell'; id: string; name: string }
      toCell: { __typename?: 'Cell'; id: string; name: string }
    }>
  }
}

export type FindUserCellTransferRequestQueryVariables = Exact<{
  id: Scalars['Float']
  transferInStatus?: InputMaybe<
    Array<UserCellTransferStatus> | UserCellTransferStatus
  >
  transferInDateFilter?: InputMaybe<DateFilter>
}>

export type FindUserCellTransferRequestQuery = {
  __typename?: 'Query'
  findCell: {
    __typename?: 'Cell'
    transfersIn: Array<{
      __typename?: 'UserCellTransfer'
      id: string
      status: UserCellTransferStatus
      orderDate: string
      completeDate?: string | null
      user: {
        __typename?: 'User'
        id: string
        name: string
        gender?: Gender | null
      }
      fromCell: { __typename?: 'Cell'; id: string; name: string }
      toCell: { __typename?: 'Cell'; id: string; name: string }
    }>
  }
}

export type FindUserCellTransferResultQueryVariables = Exact<{
  id: Scalars['Float']
  transferInStatus?: InputMaybe<
    Array<UserCellTransferStatus> | UserCellTransferStatus
  >
  transferOutStatus?: InputMaybe<
    Array<UserCellTransferStatus> | UserCellTransferStatus
  >
  transferInDateFilter?: InputMaybe<DateFilter>
  transferOutDateFilter?: InputMaybe<DateFilter>
}>

export type FindUserCellTransferResultQuery = {
  __typename?: 'Query'
  findCell: {
    __typename?: 'Cell'
    transfersIn: Array<{
      __typename?: 'UserCellTransfer'
      id: string
      status: UserCellTransferStatus
      orderDate: string
      completeDate?: string | null
      user: {
        __typename?: 'User'
        id: string
        name: string
        gender?: Gender | null
      }
      fromCell: { __typename?: 'Cell'; id: string; name: string }
      toCell: { __typename?: 'Cell'; id: string; name: string }
    }>
    transfersOut: Array<{
      __typename?: 'UserCellTransfer'
      id: string
      status: UserCellTransferStatus
      orderDate: string
      completeDate?: string | null
      user: {
        __typename?: 'User'
        id: string
        name: string
        gender?: Gender | null
      }
      fromCell: { __typename?: 'Cell'; id: string; name: string }
      toCell: { __typename?: 'Cell'; id: string; name: string }
    }>
  }
}

export type FindUsersQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']>
  limit?: InputMaybe<Scalars['Int']>
  offset?: InputMaybe<Scalars['Int']>
}>

export type FindUsersQuery = {
  __typename?: 'Query'
  findUsers: {
    __typename?: 'FindUsersPayload'
    totalCount: number
    nodes: Array<{
      __typename?: 'User'
      id: string
      name: string
      phone: string
      isActive: boolean
      birthday?: string | null
      gender?: Gender | null
      address?: string | null
      description?: string | null
      roles: Array<RoleType>
      cell?: { __typename?: 'Cell'; id: string; name: string } | null
    }>
  }
}

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput
}>

export type UpdateUserMutation = {
  __typename?: 'Mutation'
  updateUser: {
    __typename?: 'UpdateUserPayload'
    user: {
      __typename?: 'User'
      id: string
      name: string
      phone: string
      isActive: boolean
      birthday?: string | null
      gender?: Gender | null
      address?: string | null
      roles: Array<RoleType>
      description?: string | null
      cell?: { __typename?: 'Cell'; id: string; name: string } | null
    }
  }
}

export type UpdateUserCellTransferMutationVariables = Exact<{
  input: UpdateUserCellTransferInput
}>

export type UpdateUserCellTransferMutation = {
  __typename?: 'Mutation'
  updateUserCellTransfer: {
    __typename?: 'UpdateUserCellTransferPayload'
    userCellTransfer: {
      __typename?: 'UserCellTransfer'
      id: string
      status: UserCellTransferStatus
      orderDate: string
      completeDate?: string | null
      user: { __typename?: 'User'; id: string; name: string }
      fromCell: { __typename?: 'Cell'; id: string; name: string }
      toCell: { __typename?: 'Cell'; id: string; name: string }
    }
  }
}

export const LoginDocument = `
    mutation login($input: LoginInput!) {
  login(input: $input) {
    accessToken
  }
}
    `
export const useLoginMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    LoginMutation,
    TError,
    LoginMutationVariables,
    TContext
  >,
  headers?: RequestInit['headers']
) =>
  useMutation<LoginMutation, TError, LoginMutationVariables, TContext>(
    ['login'],
    (variables?: LoginMutationVariables) =>
      fetcher<LoginMutation, LoginMutationVariables>(
        client,
        LoginDocument,
        variables,
        headers
      )(),
    options
  )
useLoginMutation.getKey = () => ['login']

export const MeDocument = `
    query me {
  me {
    id
    name
    roles
    cell {
      id
      name
    }
  }
}
    `
export const useMeQuery = <TData = MeQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: MeQueryVariables,
  options?: UseQueryOptions<MeQuery, TError, TData>,
  headers?: RequestInit['headers']
) =>
  useQuery<MeQuery, TError, TData>(
    variables === undefined ? ['me'] : ['me', variables],
    fetcher<MeQuery, MeQueryVariables>(client, MeDocument, variables, headers),
    options
  )

useMeQuery.getKey = (variables?: MeQueryVariables) =>
  variables === undefined ? ['me'] : ['me', variables]
export const CreateUserCellTransferDocument = `
    mutation createUserCellTransfer($input: CreateUserCellTransferInput!) {
  createUserCellTransfer(input: $input) {
    success
  }
}
    `
export const useCreateUserCellTransferMutation = <
  TError = unknown,
  TContext = unknown
>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    CreateUserCellTransferMutation,
    TError,
    CreateUserCellTransferMutationVariables,
    TContext
  >,
  headers?: RequestInit['headers']
) =>
  useMutation<
    CreateUserCellTransferMutation,
    TError,
    CreateUserCellTransferMutationVariables,
    TContext
  >(
    ['createUserCellTransfer'],
    (variables?: CreateUserCellTransferMutationVariables) =>
      fetcher<
        CreateUserCellTransferMutation,
        CreateUserCellTransferMutationVariables
      >(client, CreateUserCellTransferDocument, variables, headers)(),
    options
  )
useCreateUserCellTransferMutation.getKey = () => ['createUserCellTransfer']

export const FindCellDocument = `
    query findCell($id: Float!) {
  findCell(id: $id) {
    id
    name
    leaders {
      id
      name
      roles
    }
    members {
      id
      name
      phone
      isActive
      birthday
      gender
      address
      cell {
        id
        name
      }
      roles
    }
    statistics {
      totalCountOfMembers
      countOfActiveMembers
    }
  }
}
    `
export const useFindCellQuery = <TData = FindCellQuery, TError = unknown>(
  client: GraphQLClient,
  variables: FindCellQueryVariables,
  options?: UseQueryOptions<FindCellQuery, TError, TData>,
  headers?: RequestInit['headers']
) =>
  useQuery<FindCellQuery, TError, TData>(
    ['findCell', variables],
    fetcher<FindCellQuery, FindCellQueryVariables>(
      client,
      FindCellDocument,
      variables,
      headers
    ),
    options
  )

useFindCellQuery.getKey = (variables: FindCellQueryVariables) => [
  'findCell',
  variables,
]
export const FindMyCellMemberDocument = `
    query findMyCellMember($id: ID!) {
  user(id: $id) {
    id
    name
    phone
    isActive
    birthday
    gender
    address
    description
    roles
    cell {
      id
      name
    }
  }
}
    `
export const useFindMyCellMemberQuery = <
  TData = FindMyCellMemberQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables: FindMyCellMemberQueryVariables,
  options?: UseQueryOptions<FindMyCellMemberQuery, TError, TData>,
  headers?: RequestInit['headers']
) =>
  useQuery<FindMyCellMemberQuery, TError, TData>(
    ['findMyCellMember', variables],
    fetcher<FindMyCellMemberQuery, FindMyCellMemberQueryVariables>(
      client,
      FindMyCellMemberDocument,
      variables,
      headers
    ),
    options
  )

useFindMyCellMemberQuery.getKey = (
  variables: FindMyCellMemberQueryVariables
) => ['findMyCellMember', variables]
export const FindMyCellMembersDocument = `
    query findMyCellMembers {
  myCellMembers {
    id
    name
    phone
    isActive
    birthday
    gender
    address
    description
    roles
    cell {
      id
      name
    }
  }
}
    `
export const useFindMyCellMembersQuery = <
  TData = FindMyCellMembersQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables?: FindMyCellMembersQueryVariables,
  options?: UseQueryOptions<FindMyCellMembersQuery, TError, TData>,
  headers?: RequestInit['headers']
) =>
  useQuery<FindMyCellMembersQuery, TError, TData>(
    variables === undefined
      ? ['findMyCellMembers']
      : ['findMyCellMembers', variables],
    fetcher<FindMyCellMembersQuery, FindMyCellMembersQueryVariables>(
      client,
      FindMyCellMembersDocument,
      variables,
      headers
    ),
    options
  )

useFindMyCellMembersQuery.getKey = (
  variables?: FindMyCellMembersQueryVariables
) =>
  variables === undefined
    ? ['findMyCellMembers']
    : ['findMyCellMembers', variables]
export const FindUserCellTransferRegisterDocument = `
    query findUserCellTransferRegister($limit: Int, $id: Float!, $transferOutStatus: [UserCellTransferStatus!], $transferOutDateFilter: DateFilter) {
  findCells(limit: $limit) {
    nodes {
      id
      name
    }
  }
  findCell(id: $id) {
    members {
      id
      name
      isActive
      roles
    }
    transfersOut(status: $transferOutStatus, orderDate: $transferOutDateFilter) {
      id
      status
      user {
        id
        name
        gender
      }
      fromCell {
        id
        name
      }
      toCell {
        id
        name
      }
    }
  }
}
    `
export const useFindUserCellTransferRegisterQuery = <
  TData = FindUserCellTransferRegisterQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables: FindUserCellTransferRegisterQueryVariables,
  options?: UseQueryOptions<FindUserCellTransferRegisterQuery, TError, TData>,
  headers?: RequestInit['headers']
) =>
  useQuery<FindUserCellTransferRegisterQuery, TError, TData>(
    ['findUserCellTransferRegister', variables],
    fetcher<
      FindUserCellTransferRegisterQuery,
      FindUserCellTransferRegisterQueryVariables
    >(client, FindUserCellTransferRegisterDocument, variables, headers),
    options
  )

useFindUserCellTransferRegisterQuery.getKey = (
  variables: FindUserCellTransferRegisterQueryVariables
) => ['findUserCellTransferRegister', variables]
export const FindUserCellTransferRequestDocument = `
    query findUserCellTransferRequest($id: Float!, $transferInStatus: [UserCellTransferStatus!], $transferInDateFilter: DateFilter) {
  findCell(id: $id) {
    transfersIn(status: $transferInStatus, orderDate: $transferInDateFilter) {
      id
      status
      orderDate
      completeDate
      user {
        id
        name
        gender
      }
      fromCell {
        id
        name
      }
      toCell {
        id
        name
      }
    }
  }
}
    `
export const useFindUserCellTransferRequestQuery = <
  TData = FindUserCellTransferRequestQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables: FindUserCellTransferRequestQueryVariables,
  options?: UseQueryOptions<FindUserCellTransferRequestQuery, TError, TData>,
  headers?: RequestInit['headers']
) =>
  useQuery<FindUserCellTransferRequestQuery, TError, TData>(
    ['findUserCellTransferRequest', variables],
    fetcher<
      FindUserCellTransferRequestQuery,
      FindUserCellTransferRequestQueryVariables
    >(client, FindUserCellTransferRequestDocument, variables, headers),
    options
  )

useFindUserCellTransferRequestQuery.getKey = (
  variables: FindUserCellTransferRequestQueryVariables
) => ['findUserCellTransferRequest', variables]
export const FindUserCellTransferResultDocument = `
    query findUserCellTransferResult($id: Float!, $transferInStatus: [UserCellTransferStatus!], $transferOutStatus: [UserCellTransferStatus!], $transferInDateFilter: DateFilter, $transferOutDateFilter: DateFilter) {
  findCell(id: $id) {
    transfersIn(status: $transferInStatus, orderDate: $transferInDateFilter) {
      id
      status
      orderDate
      completeDate
      user {
        id
        name
        gender
      }
      fromCell {
        id
        name
      }
      toCell {
        id
        name
      }
    }
    transfersOut(status: $transferOutStatus, orderDate: $transferOutDateFilter) {
      id
      status
      orderDate
      completeDate
      user {
        id
        name
        gender
      }
      fromCell {
        id
        name
      }
      toCell {
        id
        name
      }
    }
  }
}
    `
export const useFindUserCellTransferResultQuery = <
  TData = FindUserCellTransferResultQuery,
  TError = unknown
>(
  client: GraphQLClient,
  variables: FindUserCellTransferResultQueryVariables,
  options?: UseQueryOptions<FindUserCellTransferResultQuery, TError, TData>,
  headers?: RequestInit['headers']
) =>
  useQuery<FindUserCellTransferResultQuery, TError, TData>(
    ['findUserCellTransferResult', variables],
    fetcher<
      FindUserCellTransferResultQuery,
      FindUserCellTransferResultQueryVariables
    >(client, FindUserCellTransferResultDocument, variables, headers),
    options
  )

useFindUserCellTransferResultQuery.getKey = (
  variables: FindUserCellTransferResultQueryVariables
) => ['findUserCellTransferResult', variables]
export const FindUsersDocument = `
    query findUsers($name: String, $limit: Int, $offset: Int) {
  findUsers(name: $name, limit: $limit, offset: $offset) {
    totalCount
    nodes {
      id
      name
      phone
      isActive
      birthday
      gender
      address
      description
      roles
      cell {
        id
        name
      }
    }
  }
}
    `
export const useFindUsersQuery = <TData = FindUsersQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: FindUsersQueryVariables,
  options?: UseQueryOptions<FindUsersQuery, TError, TData>,
  headers?: RequestInit['headers']
) =>
  useQuery<FindUsersQuery, TError, TData>(
    variables === undefined ? ['findUsers'] : ['findUsers', variables],
    fetcher<FindUsersQuery, FindUsersQueryVariables>(
      client,
      FindUsersDocument,
      variables,
      headers
    ),
    options
  )

useFindUsersQuery.getKey = (variables?: FindUsersQueryVariables) =>
  variables === undefined ? ['findUsers'] : ['findUsers', variables]
export const UpdateUserDocument = `
    mutation updateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    user {
      id
      name
      phone
      isActive
      birthday
      gender
      address
      cell {
        id
        name
      }
      roles
      description
    }
  }
}
    `
export const useUpdateUserMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    UpdateUserMutation,
    TError,
    UpdateUserMutationVariables,
    TContext
  >,
  headers?: RequestInit['headers']
) =>
  useMutation<
    UpdateUserMutation,
    TError,
    UpdateUserMutationVariables,
    TContext
  >(
    ['updateUser'],
    (variables?: UpdateUserMutationVariables) =>
      fetcher<UpdateUserMutation, UpdateUserMutationVariables>(
        client,
        UpdateUserDocument,
        variables,
        headers
      )(),
    options
  )
useUpdateUserMutation.getKey = () => ['updateUser']

export const UpdateUserCellTransferDocument = `
    mutation updateUserCellTransfer($input: UpdateUserCellTransferInput!) {
  updateUserCellTransfer(input: $input) {
    userCellTransfer {
      id
      user {
        id
        name
      }
      status
      fromCell {
        id
        name
      }
      toCell {
        id
        name
      }
      orderDate
      completeDate
    }
  }
}
    `
export const useUpdateUserCellTransferMutation = <
  TError = unknown,
  TContext = unknown
>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    UpdateUserCellTransferMutation,
    TError,
    UpdateUserCellTransferMutationVariables,
    TContext
  >,
  headers?: RequestInit['headers']
) =>
  useMutation<
    UpdateUserCellTransferMutation,
    TError,
    UpdateUserCellTransferMutationVariables,
    TContext
  >(
    ['updateUserCellTransfer'],
    (variables?: UpdateUserCellTransferMutationVariables) =>
      fetcher<
        UpdateUserCellTransferMutation,
        UpdateUserCellTransferMutationVariables
      >(client, UpdateUserCellTransferDocument, variables, headers)(),
    options
  )
useUpdateUserCellTransferMutation.getKey = () => ['updateUserCellTransfer']
