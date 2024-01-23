import { cn } from '@/lib/utils'
import { AttendanceGlobalState } from '@/types/attendance'
import { Member } from '@/types/member'
import { Switch } from '@headlessui/react'
import React from 'react'

type AttendnaceItemProps = {
  service: {
    id: string
    name: string
    startAt: string
    isActive: boolean
    description?: string | null | undefined
  }
  member: Member
  attendance: AttendanceGlobalState
  onCheckHandler: ({
    checked,
    churchServiceId,
    userId,
    userName,
  }: {
    checked: boolean
    churchServiceId: string
    userId: string
    userName: string
    isOnline: boolean
  }) => void
  onToggleHander: ({
    userId,
    churchServiceId,
  }: {
    churchServiceId: string
    userId: string
  }) => void
}

const AttendnaceItem = ({
  service,
  member,
  attendance,
  onCheckHandler,
  onToggleHander,
}: AttendnaceItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          id={`${service.id}-${member.id}`}
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
                item.churchServiceId === service.id && item.userId === member.id
            )
              ? true
              : false
          }
          value={member.id}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor={`${service.id}-${member.id}`}
          className="ml-3 min-w-0 flex-1 text-gray-500"
        >
          {member.name}
        </label>
      </div>
      {attendance.tempAttendanceList !== null &&
        attendance.tempAttendanceList.find(
          (item) =>
            item.churchServiceId === service.id && item.userId === member.id
        ) && (
          <Switch.Group as="div" className="flex items-center">
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
              className={cn(
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
                className={cn(
                  attendance.tempAttendanceList !== null &&
                    attendance.tempAttendanceList.find(
                      (item) =>
                        item.churchServiceId === service.id &&
                        item.userId === member.id
                    )?.isOnline
                    ? 'translate-x-5'
                    : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
            <Switch.Label as="span" className="ml-3 text-sm">
              <span className="text-gray-500">온라인예배</span>
            </Switch.Label>
          </Switch.Group>
        )}
    </div>
  )
}

export default AttendnaceItem
