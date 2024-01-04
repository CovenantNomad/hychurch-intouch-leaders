import { FindMyCellMemberQuery } from '@/graphql/generated'
import { EvaluationFormInputType } from '@/types/evalutation'
import React from 'react'
import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form'

type DescriptionTextAreaProps = {
  data: FindMyCellMemberQuery | undefined
  errors: FieldErrors<EvaluationFormInputType>
  watch: UseFormWatch<EvaluationFormInputType>
  register: UseFormRegister<EvaluationFormInputType>
}

const DescriptionTextArea = ({
  data,
  errors,
  register,
  watch,
}: DescriptionTextAreaProps) => {
  const inputText = watch('description', '')

  return (
    <div className="mt-6">
      <h2 className="text-sm font-medium leading-6 text-gray-900">셀원소개</h2>
      <div className="min-w-0 flex-1 mt-1">
        <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300">
          <label htmlFor="comment" className="sr-only">
            Add your comment
          </label>
          <textarea
            rows={11}
            {...register('description', {
              required: {
                value: true,
                message: '반드시 입력하셔야 합니다',
              },
              minLength: {
                value: 1,
                message: '1자이상 입력해주세요',
              },
              maxLength: {
                value: 500,
                message: '최대 500자까지 입니다',
              },
            })}
            className="block w-full resize-none border-0 bg-transparent py-1.5 px-1.5 text-gray-900 placeholder:text-gray-400 text-sm leading-6 outline-none"
            placeholder="우리 셀원은..."
          />

          {/* Spacer element to match the height of the toolbar */}
          <div className="py-2" aria-hidden="true">
            {/* Matches height of button in toolbar (1px border + 36px content height) */}
            <div className="py-px">
              <div className="h-9" />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 py-2 pl-3 pr-2">
          {errors.description && (
            <div className="flex justify-end mb-1">
              <span className="text-sm text-red-500">
                {errors.description.message}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-400">
                글자수: {inputText.length} / 500
              </span>
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                disabled={data === undefined}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-600"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DescriptionTextArea
