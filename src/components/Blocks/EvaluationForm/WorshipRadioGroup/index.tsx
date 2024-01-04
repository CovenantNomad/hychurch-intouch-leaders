import React from 'react'
import { EvaluationFormInputType, WORSHIP_TYPE } from '@/types/evalutation'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { RadioGroup } from '@headlessui/react'
import { classNames } from '@/utils/utils'

type WorshipRadioGroupProps = {
  control: Control<EvaluationFormInputType, any>
  errors: FieldErrors<EvaluationFormInputType>
}

const worshipOptions = [
  { name: '인터치예배\n(성전)', value: WORSHIP_TYPE.INTOUCH_OFFLINE },
  { name: '인터치예배\n(온라인)', value: WORSHIP_TYPE.INTOUCH_ONLINE },
  { name: '1~4부예배\n(오전예배)', value: WORSHIP_TYPE.OTHERS_SERVICES },
  { name: '예배참석률\n낮음', value: WORSHIP_TYPE.ABSENT },
]

const WorshipRadioGroup = ({ control, errors }: WorshipRadioGroupProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between lg:justify-start lg:gap-x-12">
        <h2 className="text-sm font-medium leading-6 text-gray-900">
          예배참석
        </h2>
        <span className="text-sm font-medium leading-6 text-blue-600 hover:text-blue-500">
          주로 참석하는 예배를 선택해주세요
        </span>
      </div>

      <Controller
        name="worship"
        control={control}
        rules={{ required: { value: true, message: '반드시 선택해주세요' } }}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onChange={field.onChange}
            className="mt-2"
          >
            <RadioGroup.Label className="sr-only">예배참석</RadioGroup.Label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {worshipOptions.map((option) => (
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
      {errors.worship && (
        <span className="text-sm text-red-500 mt-1">
          {errors.worship.message}
        </span>
      )}
    </div>
  )
}

export default WorshipRadioGroup
