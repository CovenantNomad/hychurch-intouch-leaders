import React, { Dispatch, SetStateAction, useState } from 'react'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import {
  FindChurchServicesQuery,
  FindChurchServicesQueryVariables,
  FindMyCellMembersQuery,
  FindMyCellMembersQueryVariables,
  RoleType,
  useFindChurchServicesQuery,
  useFindMyCellMembersQuery,
} from '@/graphql/generated'
import { toast } from 'react-hot-toast'
// components
import { Disclosure, Switch } from '@headlessui/react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import Spinner from '@/components/Atoms/Spinner'
import SimpleModal from '@/components/Atoms/Modals/SimpleModal'
import FullWidthButton from '@/components/Atoms/Buttons/FullWidthButton'
// utils
import { classNames } from '@/utils/utils'
import { AttendanceGlobalState } from '@/types/attendance'
import AttendnaceItem from '@/components/Blocks/AttendnaceItem'

interface onCheckHandlerProps {
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
  }: onCheckHandlerProps) => void
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
        <>
          <div className="mt-4 border-x border-b rounded-lg border-gray-200">
            {data?.findChurchServices.map((service) => (
              <Disclosure
                key={service.id}
                as="div"
                className="border-t px-4 py-6 rounded-lg"
              >
                {({ open }) => (
                  <>
                    <h3 className="-mx-2 -my-3 flow-root">
                      <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">
                            {service.name} ({service.startAt.split(':')[0]}:
                            {service.startAt.split(':')[1]})
                          </span>
                          {attendance.tempAttendanceList !== null &&
                            attendance.tempAttendanceList.filter(
                              (item) => item.churchServiceId === service.id
                            ).length !== 0 && (
                              <span className="font-medium text-gray-900 ml-4">
                                (
                                {
                                  attendance.tempAttendanceList.filter(
                                    (item) =>
                                      item.churchServiceId === service.id
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
                        {cellMember?.myCellMembers
                          ?.filter((member) =>
                            member.roles.includes(RoleType.CellLeader)
                          )
                          .map((member) => (
                            <AttendnaceItem
                              key={member.id}
                              service={service}
                              member={member}
                              attendance={attendance}
                              onCheckHandler={onCheckHandler}
                              onToggleHander={onToggleHander}
                            />
                          ))}
                        {cellMember?.myCellMembers
                          ?.filter(
                            (member) =>
                              !member.roles.includes(RoleType.CellLeader)
                          )
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((member) => (
                            <AttendnaceItem
                              key={member.id}
                              service={service}
                              member={member}
                              attendance={attendance}
                              onCheckHandler={onCheckHandler}
                              onToggleHander={onToggleHander}
                            />
                          ))}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
          <div className="mt-8">
            <FullWidthButton onClick={() => setModalOpen(true)}>
              다음
            </FullWidthButton>
          </div>
        </>
      )}
      <SimpleModal
        title={'출석체크'}
        description={'모든 셀원들에 대한 출석을 체크하셨나요?'}
        actionLabel={'다음'}
        open={modalOpen}
        setOpen={setModalOpen}
        actionHandler={onSavingHandler}
      />
    </div>
  )
}

export default AttendanceForm
