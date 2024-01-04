import { EvaluationFormInputType, MEETING_GRADE } from '@/types/evalutation'
import React from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { RadioGroup } from '@headlessui/react'
import { classNames } from '@/utils/utils'

type MeetingRadioGroupProps = {
  control: Control<EvaluationFormInputType, any>
  errors: FieldErrors<EvaluationFormInputType>
}

const meetingOptions = [
  { name: '1등급\n(좋음)', value: MEETING_GRADE.FIRST },
  { name: '2등급\n(보통)', value: MEETING_GRADE.SECOND },
  { name: '3등급\n(나쁨)', value: MEETING_GRADE.THIRD },
]

const MeetingRadioGroup = ({ control, errors }: MeetingRadioGroupProps) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between lg:justify-start lg:gap-x-12">
        <h2 className="text-sm font-medium leading-6 text-gray-900">
          셀모임참석
        </h2>
        <span className="text-sm font-medium leading-6 text-blue-600 hover:text-blue-500">
          셀모임 참석 정도를 선택해주세요
        </span>
      </div>
      <Controller
        name="meeting"
        control={control}
        rules={{ required: { value: true, message: '반드시 선택해주세요' } }}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onChange={field.onChange}
            className="mt-2"
          >
            <RadioGroup.Label className="sr-only">셀모임참석</RadioGroup.Label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {meetingOptions.map((option) => (
                <RadioGroup.Option
                  key={option.name}
                  value={option.value}
                  className={({ checked }) =>
                    classNames(
                      checked
                        ? 'bg-blue-600 text-white hover:bg-blue-500'
                        : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50',
                      'flex items-center justify-center rounded-md py-3 px-3 text-sm font-semibold uppercase text-center whitespace-pre-wrap cursor-pointer sm:flex-1'
                    )
                  }
                >
                  <RadioGroup.Label as="span">{option.name}</RadioGroup.Label>
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        )}
      />
      {errors.meeting && (
        <span className="text-sm text-red-500">{errors.meeting.message}</span>
      )}
    </div>
  )
}

export default MeetingRadioGroup
