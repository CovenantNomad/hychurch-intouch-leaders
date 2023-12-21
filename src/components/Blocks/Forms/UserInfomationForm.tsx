import graphlqlRequestClient from '@/client/graphqlRequestClient'
import { Gender, UserGrade, useUpdateUserMutation } from '@/graphql/generated'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { GraphQLError } from 'graphql'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import Spinner from '@/components/Atoms/Spinner'

export interface UpdateUserInfomationProps {
  id: string
  name: string
  grade: UserGrade
  isActive: boolean
  birthday?: string | null | undefined
  gender?: Gender | null | undefined
  address?: string | null | undefined
  phone: string
  description: string | null | undefined
  registrationYear?: string
  registrationMonth?: string
  registrationDay?: string
  editModeHandler: Dispatch<SetStateAction<boolean>>
}

export interface EditForm {
  name: string
  gender: Gender
  grade: UserGrade
  isActive: string
  year?: string
  month?: string
  day?: string
  phone: string
  address?: string
  description?: string
  newRegistrationYear?: string
  newRegistrationMonth?: string
  newRegistrationDay?: string
  editModeHandler: Dispatch<SetStateAction<boolean>>
}

const UserInfomationForm = ({
  id,
  name,
  gender,
  grade,
  isActive,
  birthday,
  phone,
  address,
  description,
  registrationYear,
  registrationMonth,
  registrationDay,
  editModeHandler,
}: UpdateUserInfomationProps) => {
  const today = dayjs()
  const queryClient = useQueryClient()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EditForm>()
  const { mutate, isLoading } = useUpdateUserMutation(graphlqlRequestClient, {
    onSuccess: (data) => {
      toast.success('정보가 수정되었습니다')
      queryClient.invalidateQueries({
        queryKey: ['findMyCellMember', { id: id }],
      })
    },
    onError: (errors: GraphQLError) => {
      toast.error(`해당 청년 정보를 수정 중 오류가 발생하였습니다.`)
    },
  })

  const onSubmitHandler = ({
    name,
    gender,
    year,
    month,
    day,
    phone,
    address,
    description,
    grade,
    isActive,
    newRegistrationYear,
    newRegistrationMonth,
    newRegistrationDay,
  }: EditForm) => {
    const birthday = `${year}-${month}-${day}`
    const registrationDate = `${newRegistrationYear}-${newRegistrationMonth}-${newRegistrationDay}`
    const isActiveStatus = isActive === '포함' ? true : false
    mutate({
      input: {
        id,
        name,
        gender,
        grade,
        isActive: isActiveStatus,
        phone,
        birthday,
        address,
        description,
        registrationDate,
      },
    })
  }

  return (
    <div className="mt-3 mb-8 bg-white">
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="py-5 bg-white sm:py-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                이름*
              </label>
              <input
                type="text"
                defaultValue={name}
                placeholder="이름을 입력해주세요"
                {...register('name', {
                  minLength: {
                    value: 2,
                    message:
                      '이름을 제대로 입력하였는지 확인해 주세요 (최소길이오류)',
                  },
                  maxLength: {
                    value: 5,
                    message:
                      '이름을 제대로 입력하였는지 확인해 주세요 (최대길이오류)',
                  },
                  pattern: {
                    value: /^[가-힣a-zA-Z]+$/g,
                    message: '글자만 입력해주세요',
                  },
                  setValueAs: (v) => v.replace(/\s/g, ''),
                })}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm outline-none appearance-none focus:border-navy-blue sm:text-sm"
              />
              {errors.name && (
                <p className="mt-1 px-3 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                성별*
              </label>
              <select
                id="gender"
                defaultValue={gender === 'MAN' ? 'MAN' : 'WOMAN'}
                {...register('gender')}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-navy-blue sm:text-sm"
              >
                <option value={'MAN'}>남자</option>
                <option value={'WOMAN'}>여자</option>
              </select>
              {errors.gender && (
                <p className="mt-1 px-3 text-sm text-red-600">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="grade"
                className="block text-sm font-medium text-gray-700"
              >
                활동등급*
              </label>
              <select
                id="grade"
                defaultValue={grade}
                {...register('grade')}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-navy-blue sm:text-sm"
              >
                <option value={'A'}>A</option>
                <option value={'B'}>B</option>
                <option value={'C'}>C</option>
              </select>
              {errors.grade && (
                <p className="mt-1 px-3 text-sm text-red-600">
                  {errors.grade.message}
                </p>
              )}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="isActive"
                className="block text-sm font-medium text-gray-700"
              >
                셀보고서 포함여부*
              </label>
              <select
                id="isActive"
                defaultValue={isActive ? '포함' : '미포함'}
                {...register('isActive')}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-navy-blue sm:text-sm"
              >
                <option value={'포함'}>포함</option>
                <option value={'미포함'}>미포함</option>
              </select>
              {errors.gender && (
                <p className="mt-1 px-3 text-sm text-red-600">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="col-span-6 -mb-6">
              <span className="block text-sm font-medium text-gray-700">
                생년월일
              </span>
            </div>

            <div className="col-span-2">
              <div className="relative flex items-center w-full">
                <label htmlFor="year" className="sr-only">
                  년
                </label>
                <input
                  id="year"
                  type="text"
                  defaultValue={birthday ? birthday.split('-')[0] : '1900'}
                  {...register('year', {
                    minLength: {
                      value: 4,
                      message: '4자리로 입력해주세요 (YYYY)',
                    },
                    maxLength: {
                      value: 4,
                      message: '4자리로 입력해주세요 (YYYY)',
                    },
                  })}
                  className="mt-1 block w-[80%] py-2 px-3 border border-gray-300 rounded-md shadow-sm outline-none appearance-none text-right focus:border-navy-blue sm:w-[90%] sm:text-sm"
                />
                <span className="absolute top-1/2 right-0 lg:right-6 -mt-2 text-gray-500 text-sm">
                  년
                </span>
              </div>
              {errors.year && (
                <p className="mt-1 px-3 text-sm text-red-600">
                  {errors.year.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <div className="relative flex items-center w-full">
                <label htmlFor="month" className="sr-only">
                  월
                </label>
                <input
                  id="month"
                  type="text"
                  defaultValue={birthday ? birthday.split('-')[1] : '01'}
                  {...register('month', {
                    setValueAs: (v: string) => v.padStart(2, '0'),
                    minLength: {
                      value: 2,
                      message: '2자리로 입력해주세요 (MM)',
                    },
                    maxLength: {
                      value: 2,
                      message: '4자리로 입력해주세요 (MM)',
                    },
                  })}
                  className="mt-1 block w-[80%] py-2 px-3 border border-gray-300 rounded-md shadow-sm outline-none appearance-none text-right focus:border-navy-blue sm:w-[90%] sm:text-sm"
                />
                <span className="absolute top-1/2 right-0 lg:right-6 -mt-2 text-gray-500 text-sm">
                  월
                </span>
              </div>
              {errors.month && (
                <p className="mt-1 px-3 text-sm text-red-600">
                  {errors.month.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <div className="relative flex items-center w-full">
                <label htmlFor="day" className="sr-only">
                  일
                </label>
                <input
                  id="day"
                  type="text"
                  defaultValue={birthday ? birthday.split('-')[2] : '01'}
                  {...register('day', {
                    setValueAs: (v: string) => v.padStart(2, '0'),
                    minLength: {
                      value: 2,
                      message: '2자리로 입력해주세요 (MM)',
                    },
                    maxLength: {
                      value: 2,
                      message: '4자리로 입력해주세요 (MM)',
                    },
                  })}
                  className="mt-1 block w-[80%] py-2 px-3 border border-gray-300 rounded-md shadow-sm outline-none appearance-none text-right focus:border-navy-blue sm:w-[90%] sm:text-sm"
                />
                <span className="absolute top-1/2 right-0 lg:right-6 -mt-2 text-gray-500 text-sm">
                  일
                </span>
              </div>
              {errors.day && (
                <p className="mt-1 px-3 text-sm text-red-600">
                  {errors.day.message}
                </p>
              )}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                전화번호
              </label>
              <input
                id="phone"
                type="text"
                defaultValue={phone}
                {...register('phone', {
                  setValueAs: (v) => v.replace(/[-.,_+]|\s/g, ''),
                  minLength: {
                    value: 9,
                    message: '최소 9자리 이상 입력해주세요',
                  },
                  maxLength: {
                    value: 11,
                    message: '핸드폰번호는 최대 11자리입니다',
                  },
                })}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm outline-none appearance-none focus:border-navy-blue sm:text-sm"
              />
              {errors.phone && (
                <p className="mt-1 px-3 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="col-span-6">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                주소
              </label>
              <input
                id="address"
                type="text"
                defaultValue={address!}
                placeholder="주소"
                {...register('address')}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm outline-none appearance-none focus:border-navy-blue sm:text-sm"
              />
            </div>

            <div className="col-span-6 -mb-6">
              <span className="block text-sm font-medium text-gray-700">
                등록일*
              </span>
            </div>

            <div className="col-span-2">
              <div className="relative flex items-center w-full">
                <label htmlFor="year" className="sr-only">
                  년
                </label>
                <input
                  id="year"
                  type="text"
                  placeholder="YYYY"
                  defaultValue={registrationYear ? registrationYear : '2022'}
                  {...register('newRegistrationYear', {
                    minLength: {
                      value: 4,
                      message: '4자리로 입력해주세요 (YYYY)',
                    },
                    maxLength: {
                      value: 4,
                      message: '4자리로 입력해주세요 (YYYY)',
                    },
                    max: {
                      value: today.get('year'),
                      message: `${today.get('year')}년을 넘을 수 없습니다`,
                    },
                  })}
                  className="mt-1 block w-[80%] py-2 px-3 border border-gray-300 rounded-md shadow-sm outline-none appearance-none text-right focus:border-navy-blue sm:w-[90%] sm:text-sm"
                />
                <span className="absolute top-1/2 right-0 -mt-2 text-gray-500 text-sm">
                  년
                </span>
              </div>
              {errors.newRegistrationYear && (
                <p className="mt-1 px-3 text-sm text-red-600">
                  {errors.newRegistrationYear.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <div className="relative flex items-center w-full">
                <label htmlFor="month" className="sr-only">
                  월
                </label>
                <input
                  id="month"
                  type="text"
                  placeholder="MM"
                  defaultValue={registrationMonth ? registrationMonth : '12'}
                  {...register('newRegistrationMonth', {
                    setValueAs: (v: string) => v.padStart(2, '0'),
                    minLength: {
                      value: 2,
                      message: '2자리로 입력해주세요 (MM)',
                    },
                    maxLength: {
                      value: 2,
                      message: '4자리로 입력해주세요 (MM)',
                    },
                    min: {
                      value: 1,
                      message: '1월보다 작을 수 없습니다',
                    },
                    max: {
                      value: 12,
                      message: '12월을 넘을 수 없습니다',
                    },
                  })}
                  className="mt-1 block w-[80%] py-2 px-3 border border-gray-300 rounded-md shadow-sm outline-none appearance-none text-right focus:border-navy-blue sm:w-[90%] sm:text-sm"
                />
                <span className="absolute top-1/2 right-0 -mt-2 text-gray-500 text-sm">
                  월
                </span>
              </div>
              {errors.newRegistrationMonth && (
                <p className="mt-1 px-3 text-sm text-red-600">
                  {errors.newRegistrationMonth.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <div className="relative flex items-center w-full">
                <label htmlFor="day" className="sr-only">
                  일
                </label>
                <input
                  id="day"
                  type="text"
                  placeholder="DD"
                  defaultValue={registrationDay ? registrationDay : '31'}
                  {...register('newRegistrationDay', {
                    setValueAs: (v: string) => v.padStart(2, '0'),
                    minLength: {
                      value: 2,
                      message: '2자리로 입력해주세요 (DD)',
                    },
                    maxLength: {
                      value: 2,
                      message: '4자리로 입력해주세요 (DD)',
                    },
                    min: {
                      value: 1,
                      message: '1일보다 작을 수 없습니다',
                    },
                    max: {
                      value: 31,
                      message: '31일을 넘을 수 없습니다',
                    },
                  })}
                  className="mt-1 block w-[80%] py-2 px-3 border border-gray-300 rounded-md shadow-sm outline-none appearance-none text-right focus:border-navy-blue sm:w-[90%] sm:text-sm"
                />
                <span className="absolute top-1/2 right-0 -mt-2 text-gray-500 text-sm">
                  일
                </span>
              </div>
              {errors.newRegistrationDay && (
                <p className="mt-1 px-3 text-sm text-red-600">
                  {errors.newRegistrationDay.message}
                </p>
              )}
            </div>

            <div className="col-span-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                비고
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows={3}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm outline-none appearance-none focus:border-navy-blue sm:text-sm"
                  placeholder="인도자, 방문계기 등 추가적으로 입력할 사항을 기입해주세요"
                  defaultValue={description!}
                  {...register('description')}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="py-3 space-x-4 bg-white text-right">
          <button
            type="button"
            onClick={() => editModeHandler(false)}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            {isLoading ? <Spinner text="제출중..." /> : '수정하기'}
          </button>
        </div>
      </form>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: 'green',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: 'red',
              color: '#222',
            },
          },
        }}
      />
    </div>
  )
}

export default UserInfomationForm
