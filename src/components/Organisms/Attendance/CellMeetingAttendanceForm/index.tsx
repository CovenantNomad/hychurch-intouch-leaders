import React from 'react'
import { FindMyCellMembersQuery, RoleType } from '@/graphql/generated'
import { CellMeetingGlobalState } from '@/types/cellMeeting'
import CellMeetingAttendanceItem from '@/components/Blocks/CellMeetingAttendanceItem'

type CellMeetingAttendanceFormProps = {
  cellMember: FindMyCellMembersQuery
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

const CellMeetingAttendanceForm = ({
  cellMember,
  cellMeetingAttendance,
  onCheckHandler,
}: CellMeetingAttendanceFormProps) => {
  return (
    <div>
      {cellMember && cellMember.myCellMembers ? (
        <div className="divide-y border rounded-lg">
          {cellMember.myCellMembers
            .filter((member) => member.roles.includes(RoleType.CellLeader))
            .map((member) => (
              <CellMeetingAttendanceItem
                key={member.id}
                member={member}
                cellMeetingAttendance={cellMeetingAttendance}
                onCheckHandler={onCheckHandler}
              />
            ))}
          {cellMember.myCellMembers
            .filter((member) => !member.roles.includes(RoleType.CellLeader))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((member) => (
              <CellMeetingAttendanceItem
                key={member.id}
                member={member}
                cellMeetingAttendance={cellMeetingAttendance}
                onCheckHandler={onCheckHandler}
              />
            ))}
        </div>
      ) : (
        <div>셀원데이터를 조회하지 못했습니다</div>
      )}
    </div>
  )
}

export default CellMeetingAttendanceForm
