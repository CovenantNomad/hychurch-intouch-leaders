import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  Fragment,
} from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { attendanceState } from '@/stores/attendaceState'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { getServiceName, groupByChurchService } from '@/utils/utils'
import SimpleModal from '@/components/Atoms/Modals/SimpleModal'
import { Attendance, AttendanceStatus } from '@/types/attendance'
import {
  SubmitAttendanceMutation,
  SubmitAttendanceMutationVariables,
  useSubmitAttendanceMutation,
} from '@/graphql/generated'
import graphlqlRequestClient from '@/client/graphqlRequestClient'
import { toast } from 'react-hot-toast'

interface AttendancePreviewProps {
  sunday: string
  submitDate: string
  setStepIdx: Dispatch<SetStateAction<number>>
}

const AttendancePreview = ({
  sunday,
  submitDate,
  setStepIdx,
}: AttendancePreviewProps) => {
  const userInfo = useRecoilValue(stateUserInfo)
  const [attendance, setAttendance] = useRecoilState(attendanceState)
  const [modalOpen, setModalOpen] = useState(false)
  const [filterAttendanceList, setFilterAttendanceList] = useState<
    { serviceId: string; attendanceList: Attendance[] }[]
  >([])

  const { mutateAsync } = useSubmitAttendanceMutation<
    SubmitAttendanceMutation,
    SubmitAttendanceMutationVariables
  >(graphlqlRequestClient)

  const onRemoveHandler = (userId: string, churchServiceId: string) => {
    if (attendance.attendanceList !== null) {
      const filteredList = attendance.attendanceList.filter(
        (item) =>
          !(item.userId === userId && item.churchServiceId === churchServiceId)
      )
      setAttendance({
        ...attendance,
        attendanceList: filteredList,
      })
    }
  }

  const onSubmitHandler = async () => {
    if (attendance.attendanceList !== null) {
      try {
        const submitList = attendance.attendanceList.map((item) => {
          return {
            userId: item.userId,
            churchServiceId: item.churchServiceId,
            attendedAt: item.attendedAt,
            isOnline: item.isOnline,
            description: item.description,
          }
        })
        const response = await mutateAsync({
          input: {
            userChurchServiceHistories: submitList,
            baseDate: submitDate,
          },
        })
        console.log('@AttendancePreview: ', response)
        if (response) {
          setStepIdx(2)
        }
      } catch {
        toast.error('출석체크 제출에 실패했습니다.')
      } finally {
        setModalOpen(false)
      }
    }
  }

  useEffect(() => {
    if (attendance.attendanceList !== null) {
      setFilterAttendanceList(groupByChurchService(attendance.attendanceList))
    }
  }, [attendance])

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              {userInfo?.cell?.name} 출석체크
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              {sunday} 예배출석을 아래와 같이 제출합니다
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setStepIdx(0)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              수정
            </button>
          </div>
        </div>
        {attendance.attendanceList ? (
          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full">
              <colgroup>
                <col className="w-3/6 sm:w-3/6" />
                <col className="w-2/6 sm:w-2/6" />
                <col className="w-1/6 sm:w-1/6" />
              </colgroup>
              <thead className="border-b border-gray-300 text-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    이름
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                  >
                    성전/온라인
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0"
                  >
                    <span className="sr-only">제외</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterAttendanceList.map((service, index) => (
                  <Fragment key={index}>
                    {service.attendanceList.length !== 0 && (
                      <tr>
                        <th
                          colSpan={3}
                          scope="col"
                          className="bg-gray-50 py-3 text-left text-sm font-semibold text-gray-900"
                        >
                          {getServiceName(service.serviceId)} (참석자:{' '}
                          {service.attendanceList.length}명)
                        </th>
                      </tr>
                    )}
                    {service.attendanceList
                      .sort(
                        (a, b) =>
                          Number(a.isOnline) - Number(b.isOnline) ||
                          a.userName.localeCompare(b.userName)
                      )
                      .map((person, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="max-w-0 py-5 pl-4 pr-3 text-sm">
                            {person.userName}
                          </td>
                          <td className="px-3 py-5 text-right text-sm text-gray-500">
                            {person.isOnline ? '온라인예배' : '성전예배'}
                          </td>
                          <td className="py-5 pl-3 pr-4 text-right text-sm text-red-500">
                            <button
                              onClick={() =>
                                onRemoveHandler(
                                  person.userId,
                                  person.churchServiceId
                                )
                              }
                            >
                              제외
                            </button>
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th
                    scope="row"
                    colSpan={2}
                    className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                  >
                    성전예배 인원
                  </th>
                  <th
                    scope="row"
                    colSpan={2}
                    className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden"
                  >
                    성전예배 인원
                  </th>
                  <td className="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">
                    {
                      attendance.attendanceList.filter(
                        (participant) => !participant.isOnline
                      ).length
                    }
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={2}
                    className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                  >
                    온라인예배 인원
                  </th>
                  <th
                    scope="row"
                    colSpan={2}
                    className="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden"
                  >
                    온라인예배 인원
                  </th>
                  <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                    {
                      attendance.attendanceList.filter(
                        (participant) => participant.isOnline
                      ).length
                    }
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={2}
                    className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
                  >
                    전체 예배출석 인원
                  </th>
                  <th
                    scope="row"
                    colSpan={2}
                    className="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden"
                  >
                    전체 예배출석 인원
                  </th>
                  <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                    {attendance.attendanceList.length}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div>데이터가 없습니다</div>
        )}
        <div className="mt-8">
          <button
            onClick={() => setModalOpen(true)}
            className="mt-8 w-full bg-blue-500 text-white py-3"
          >
            제출
          </button>
        </div>
      </div>
      <SimpleModal
        title={'출석체크'}
        description={`확실히 체크하셨나요?\n예배출석을 제출하겠습니다`}
        actionLabel={'제출'}
        open={modalOpen}
        setOpen={setModalOpen}
        actionHandler={onSubmitHandler}
      />
    </div>
  )
}

export default AttendancePreview
