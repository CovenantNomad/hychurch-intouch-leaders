import React from 'react'
import { Member } from '@/types/member'
import { CellMeetingGlobalState } from '@/types/cellMeeting'

type CellMeetingAttendanceItemProps = {
  member: Member
  cellMeetingAttendance: CellMeetingGlobalState
  onCheckHandler: ({
    checked,
    userId,
    userName,
    cellId,
    cellName,
  }: {
    checked: boolean
    userId: string
    userName: string
    cellName: string
    cellId: string
  }) => void
}

const CellMeetingAttendanceItem = ({
  member,
  cellMeetingAttendance,
  onCheckHandler,
}: CellMeetingAttendanceItemProps) => {
  return (
    <div className="flex justify-between px-3 py-4">
      <div className="flex items-center">
        <input
          id={`${member.id}`}
          type="checkbox"
          onChange={(e) =>
            onCheckHandler({
              checked: e.target.checked,
              userId: member.id,
              userName: member.name,
              cellId: member.cell!.id,
              cellName: member.cell!.name,
            })
          }
          checked={
            cellMeetingAttendance.tempAttendanceList !== null &&
            cellMeetingAttendance.tempAttendanceList.find(
              (item) => item.userId === member.id
            )
              ? true
              : false
          }
          value={member.id}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor={`${member.id}`} className="ml-3 text-gray-900">
          {member.name}
        </label>
      </div>
      <div>
        {cellMeetingAttendance.tempAttendanceList !== null &&
        cellMeetingAttendance.tempAttendanceList.find(
          (item) => item.userId === member.id
        ) ? (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            출석
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            미참석
          </span>
        )}
      </div>
    </div>
  )
}

export default CellMeetingAttendanceItem
