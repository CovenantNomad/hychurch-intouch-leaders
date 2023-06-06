import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import {
  FindChurchServicesQuery,
  FindChurchServicesQueryVariables,
  FindMyCellMembersQuery,
  FindMyCellMembersQueryVariables,
  useFindChurchServicesQuery,
  useFindMyCellMembersQuery,
} from '@/graphql/generated'
import { Disclosure, Switch } from '@headlessui/react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { classNames } from '@/utils/utils'
import { useRecoilState } from 'recoil'
import { attendanceState } from '@/stores/attendaceState'
import { AttendanceGlobalState, AttendanceStatus } from '@/types/attendance'
import Spinner from '@/components/Atoms/Spinner'
import SimpleModal from '@/components/Atoms/Modals/SimpleModal'
import FullWidthButton from '@/components/Atoms/Buttons/FullWidthButton'
import useAttendance from '@/hooks/useAttendance'
import { toast } from 'react-hot-toast'

interface onCheckHandlerPrps {
  checked: boolean
  churchServiceId: string
  userId: string
  userName: string
  isOnline: boolean
}

interface onToggleHandlerPrps {
  churchServiceId: string
  userId: string
}

interface AttendanceFormProps {
  setStepIdx: Dispatch<SetStateAction<number>>
  attendance: AttendanceGlobalState
  onCheckHandler: ({
    checked,
    churchServiceId,
    userId,
    userName,
  }: onCheckHandlerPrps) => void
  onToggleHander: ({ userId, churchServiceId }: onToggleHandlerPrps) => void
}

const AttendanceForm = ({
  setStepIdx,
  attendance,
  onCheckHandler,
  onToggleHander,
}: AttendanceFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  // const { attendance, setAttendance, onCheckHandler, onToggleHander } =
  //   useAttendance()

  const { isLoading: serviceLoading, data } = useFindChurchServicesQuery<
    FindChurchServicesQuery,
    FindChurchServicesQueryVariables
  >(
    graphlqlRequestClient,
    {},
    {
      staleTime: 24 * 60 * 60 * 1000,
      cacheTime: 24 * 60 * 60 * 1000,
    }
  )

  const { isLoading: cellMemberLoading, data: cellMember } =
    useFindMyCellMembersQuery<
      FindMyCellMembersQuery,
      FindMyCellMembersQueryVariables
    >(
      graphlqlRequestClient,
      {},
      {
        staleTime: 10 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
      }
    )

  const onSavingHandler = () => {
    if (attendance.tempAttendanceList === null) {
      toast.error('출석명단을 체크하고 저장해주세요')
    } else {
      setStepIdx(1)
    }
    setModalOpen(false)
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center py-20 lg:py-32">
          <Spinner />
        </div>
      ) : (
        <div className="mt-4 border-t border-gray-200">
          {data?.findChurchServices.map((service) => (
            <Disclosure
              key={service.id}
              as="div"
              className="border-t border-gray-200 px-4 py-6"
            >
              {({ open }) => (
                <>
                  <h3 className="-mx-2 -my-3 flow-root">
                    <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {service.name}
                        </span>
                        {attendance.tempAttendanceList !== null &&
                          attendance.tempAttendanceList.filter(
                            (item) => item.churchServiceId === service.id
                          ).length !== 0 && (
                            <span className="font-medium text-gray-900 ml-4">
                              (
                              {
                                attendance.tempAttendanceList.filter(
                                  (item) => item.churchServiceId === service.id
                                ).length
                              }
                              명 출석)
                            </span>
                          )}
                      </div>
                      <span className="ml-6 flex items-center">
                        {open ? (
                          <AiOutlineMinus width={20} height={20} />
                        ) : (
                          <AiOutlinePlus width={20} height={20} />
                        )}
                      </span>
                    </Disclosure.Button>
                  </h3>
                  <Disclosure.Panel className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 lg:gap-x-16">
                      {cellMember?.myCellMembers?.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                onCheckHandler({
                                  checked: e.target.checked,
                                  userId: member.id,
                                  userName: member.name,
                                  churchServiceId: service.id,
                                  isOnline: false,
                                })
                              }
                              checked={
                                attendance.tempAttendanceList !== null &&
                                attendance.tempAttendanceList.find(
                                  (item) =>
                                    item.churchServiceId === service.id &&
                                    item.userId === member.id
                                )
                                  ? true
                                  : false
                              }
                              value={member.id}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label className="ml-3 min-w-0 flex-1 text-gray-500">
                              {member.name}
                            </label>
                          </div>
                          {attendance.tempAttendanceList !== null &&
                            attendance.tempAttendanceList.find(
                              (item) =>
                                item.churchServiceId === service.id &&
                                item.userId === member.id
                            ) && (
                              <Switch.Group
                                as="div"
                                className="flex items-center"
                              >
                                <Switch
                                  checked={
                                    attendance.attendanceList !== null &&
                                    attendance.tempAttendanceList.find(
                                      (item) =>
                                        item.churchServiceId === service.id &&
                                        item.userId === member.id
                                    )?.isOnline
                                  }
                                  onChange={() =>
                                    onToggleHander({
                                      churchServiceId: service.id,
                                      userId: member.id,
                                    })
                                  }
                                  className={classNames(
                                    attendance.tempAttendanceList !== null &&
                                      attendance.tempAttendanceList.find(
                                        (item) =>
                                          item.churchServiceId === service.id &&
                                          item.userId === member.id
                                      )?.isOnline
                                      ? 'bg-blue-500'
                                      : 'bg-gray-200',
                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={classNames(
                                      attendance.tempAttendanceList !== null &&
                                        attendance.tempAttendanceList.find(
                                          (item) =>
                                            item.churchServiceId ===
                                              service.id &&
                                            item.userId === member.id
                                        )?.isOnline
                                        ? 'translate-x-5'
                                        : 'translate-x-0',
                                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                    )}
                                  />
                                </Switch>
                                <Switch.Label
                                  as="span"
                                  className="ml-3 text-sm"
                                >
                                  <span className="text-gray-500">
                                    온라인예배
                                  </span>
                                </Switch.Label>
                              </Switch.Group>
                            )}
                        </div>
                      ))}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
          <div className="mt-8">
            <FullWidthButton onClick={() => setModalOpen(true)}>
              저장
            </FullWidthButton>
          </div>
        </div>
      )}
      <SimpleModal
        title={'출석체크'}
        description={'예배출석을 저장하겠습니까?'}
        actionLabel={'저장'}
        open={modalOpen}
        setOpen={setModalOpen}
        actionHandler={onSavingHandler}
      />
    </div>
  )
}

export default AttendanceForm
