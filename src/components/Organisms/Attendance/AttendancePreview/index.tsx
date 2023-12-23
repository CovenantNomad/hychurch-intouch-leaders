import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  Fragment,
} from 'react'
import { useRecoilValue } from 'recoil'
import { stateUserInfo } from '@/stores/stateUserInfo'
import { getServiceName, groupByChurchService } from '@/utils/utils'
import SimpleModal from '@/components/Atoms/Modals/SimpleModal'
import {
  AttendanceGlobalState,
  TempSavedAttendanceHistory,
} from '@/types/attendance'
import { toast } from 'react-hot-toast'
import { SubmitAttendanceMutation } from '@/graphql/generated'
import FullWidthButton from '@/components/Atoms/Buttons/FullWidthButton'

interface AttendancePreviewProps {
  attendance: AttendanceGlobalState
  onRemoveHandler: (userId: string, churchServiceId: string) => void
  onTemporarySaveHandler: () => Promise<{ result: SubmitAttendanceMutation }>
  onSubmitHandler: () => Promise<{ result: SubmitAttendanceMutation }>
  setStepIdx: Dispatch<SetStateAction<number>>
}

enum ModalType {
  TEMPORARY_SAVE = 'TEMPORARY_SAVE',
  COMPLETE = 'COMPLETE',
}

const AttendancePreview = ({
  attendance,
  onRemoveHandler,
  onTemporarySaveHandler,
  onSubmitHandler,
  setStepIdx,
}: AttendancePreviewProps) => {
  const userInfo = useRecoilValue(stateUserInfo)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType | null>(null)
  const [filterAttendanceList, setFilterAttendanceList] = useState<
    { serviceId: string; tempAttendanceList: TempSavedAttendanceHistory[] }[]
  >([])

  const onTempModalHandler = () => {
    setModalType(ModalType.TEMPORARY_SAVE)
    setModalOpen(true)
  }

  const onSubmitModalHandler = () => {
    setModalType(ModalType.COMPLETE)
    setModalOpen(true)
  }

  const onTempModalActionHandler = async () => {
    try {
      const response = onTemporarySaveHandler()
      if ((await response).result) {
        toast.success(`임시저장 되었습니다.\n이후에 꼭 최종제출 해주세요.`, {
          duration: 2000,
        })
      }
    } catch {
      toast.error(`임시저장 중 오류가 발생했습니다.\n간사님에게 알려주세요.`, {
        duration: 2000,
      })
    } finally {
      setModalOpen(false)
    }
  }

  const onSubmitModalActionHandler = async () => {
    try {
      const response = onSubmitHandler()
      if ((await response).result) {
        toast.success('이번주 출석체크를 성공적으로 제출하였습니다', {
          duration: 1500,
        })
        setTimeout(() => {
          setStepIdx(2)
        }, 1500)
      }
    } catch {
      toast.error(`최종제출 중 오류가 발생했습니다.\n간사님에게 알려주세요.`, {
        duration: 2000,
      })
    } finally {
      setModalOpen(false)
    }
  }

  useEffect(() => {
    if (attendance.tempAttendanceList !== null) {
      setFilterAttendanceList(
        groupByChurchService(attendance.tempAttendanceList)
      )
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
            <p className="mt-2 text-sm text-gray-700 whitespace-pre-line leading-6">
              {`${attendance.submitDate} 예배출석을 아래와 같이 제출합니다.\n임시저장 또는 최종제출을 눌러 저장해주세요.`}
            </p>
          </div>
        </div>
        {attendance.tempAttendanceList ? (
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
                    {service.tempAttendanceList.length !== 0 && (
                      <tr>
                        <th
                          colSpan={3}
                          scope="col"
                          className="bg-gray-50 py-3 text-left text-sm font-semibold text-gray-900"
                        >
                          {getServiceName(service.serviceId)} (참석자:{' '}
                          {service.tempAttendanceList.length}명)
                        </th>
                      </tr>
                    )}
                    {service.tempAttendanceList
                      .sort(
                        (a, b) =>
                          Number(a.isOnline) - Number(b.isOnline) ||
                          (typeof a.userName === 'string' &&
                          typeof b.userName === 'string'
                            ? a.userName.localeCompare(b.userName)
                            : Number(a.userId) - Number(b.userId))
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
                      attendance.tempAttendanceList.filter(
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
                      attendance.tempAttendanceList.filter(
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
                    {attendance.tempAttendanceList.length}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div>데이터가 없습니다</div>
        )}
        <div className="grid grid-cols-12 mt-12 gap-x-4">
          <div className="col-span-3">
            <FullWidthButton onClick={() => setStepIdx(0)} outline={true}>
              이전
            </FullWidthButton>
          </div>
          <div className="col-span-4 col-end-9">
            <FullWidthButton onClick={onTempModalHandler} outline={true}>
              임시저장
            </FullWidthButton>
          </div>
          <div className="col-span-4 col-end-13">
            <FullWidthButton onClick={onSubmitModalHandler} outline={false}>
              최종제출
            </FullWidthButton>
          </div>
        </div>
      </div>
      <SimpleModal
        title={'출석체크'}
        description={`${
          modalType === ModalType.TEMPORARY_SAVE
            ? '현재까지 데이터를 임시로 저장하시겠습니까?'
            : '확실히 체크하셨나요?\n이번주 예배출석을 제출하겠습니다'
        }`}
        actionLabel={`${
          modalType === ModalType.TEMPORARY_SAVE ? '임시저장' : '최종제출'
        }`}
        open={modalOpen}
        setOpen={setModalOpen}
        actionHandler={
          modalType === ModalType.TEMPORARY_SAVE
            ? onTempModalActionHandler
            : onSubmitModalActionHandler
        }
      />
    </div>
  )
}

export default AttendancePreview
