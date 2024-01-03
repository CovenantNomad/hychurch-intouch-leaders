import graphlqlRequestClient from '@/client/graphqlRequestClient'
import Container from '@/components/Atoms/Container/Container'
import Skeleton from '@/components/Atoms/Skeleton'
import DescriptionTextArea from '@/components/Blocks/EvaluationForm/DescriptionTextArea'
import MeetingRadioGroup from '@/components/Blocks/EvaluationForm/MeetingRadioGroup'
import WorshipRadioGroup from '@/components/Blocks/EvaluationForm/WorshipRadioGroup'
import {
  createIndividaulEvaluation,
  getIndividaulEvaluationSubmission,
} from '@/firebase/evaluation/evaluation'
import {
  FindMyCellMemberQuery,
  FindMyCellMemberQueryVariables,
  UserGrade,
  useFindMyCellMemberQuery,
  useUpdateUserMutation,
} from '@/graphql/generated'
import {
  EvaluationFormInputType,
  MEETING_GRADE,
  WORSHIP_TYPE,
} from '@/types/evalutation'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GraphQLError } from 'graphql'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type CellEvaluationDetailScreenProps = {}

const CellEvaluationDetailScreen = ({}: CellEvaluationDetailScreenProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { seasonName, id, userName, cellId, cellName } = router.query

  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['getIndividaulEvaluationSubmission', seasonName, id],
    queryFn: () =>
      getIndividaulEvaluationSubmission({
        seasonName: String(seasonName),
        userId: String(id),
      }),
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    enabled: !!seasonName && !!id,
  })

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EvaluationFormInputType>({
    defaultValues: {
      worship: WORSHIP_TYPE.INTOUCH_OFFLINE,
      meeting: MEETING_GRADE.FIRST,
      description: '',
    },
  })
  const [newGrade, setNewGrade] = useState(UserGrade.A)

  const { data: memberInfo } = useFindMyCellMemberQuery<
    FindMyCellMemberQuery,
    FindMyCellMemberQueryVariables
  >(
    graphlqlRequestClient,
    {
      id: String(id),
    },
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
      cacheTime: 15 * 60 * 1000,
    }
  )

  const { mutate } = useUpdateUserMutation(graphlqlRequestClient, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['findMyCellMember', { id: id }],
      })
    },
    onError: (errors: GraphQLError) => {
      console.error(errors)
    },
  })

  const mutation = useMutation({
    mutationFn: createIndividaulEvaluation,
    onSuccess: () => {
      toast.success('셀원정보가 저장되었습니다')
      queryClient.invalidateQueries({
        queryKey: ['getIndividaulEvaluationSubmission', seasonName, id],
      })
      queryClient.invalidateQueries({
        queryKey: ['getIndividaulSubmissionStatus', seasonName, id],
      })
      router.back()
    },
    onError: () => {
      toast.error('에러! 오류가 발생하였습니다')
    },
  })

  const onCalcNewGrade = () => {
    const worship = watch('worship')

    switch (worship) {
      case WORSHIP_TYPE.ABSENT:
        setNewGrade(UserGrade.D)
        break

      case WORSHIP_TYPE.OTHERS_SERVICES:
        setNewGrade(UserGrade.C)
        break

      case WORSHIP_TYPE.INTOUCH_OFFLINE:
        if (watch('meeting') === MEETING_GRADE.THIRD) {
          setNewGrade(UserGrade.B)
        } else {
          setNewGrade(UserGrade.A)
        }
        break

      case WORSHIP_TYPE.INTOUCH_ONLINE:
        if (watch('meeting') === MEETING_GRADE.THIRD) {
          setNewGrade(UserGrade.B)
        } else {
          setNewGrade(UserGrade.A)
        }
        break

      default:
        break
    }
  }

  const onSubmitHandler = (data: EvaluationFormInputType) => {
    if (memberInfo) {
      mutate({
        input: {
          id: memberInfo.user.id,
          name: memberInfo.user.name,
          gender: memberInfo.user.gender!,
          grade: newGrade,
          isActive: memberInfo.user.isActive,
          phone: memberInfo.user.phone,
          birthday: memberInfo.user.birthday!,
          address: memberInfo.user.address,
          description: memberInfo.user.description,
          registrationDate: memberInfo.user.registrationDate,
        },
      })

      mutation.mutateAsync({
        userId: id ? String(id) : memberInfo.user.id,
        userName: userName ? String(userName) : memberInfo.user.name,
        previousCellId: cellId ? String(cellId) : memberInfo.user.cell!.id,
        previousCellName: cellName
          ? String(cellName)
          : memberInfo.user.cell!.name,
        worship: data.worship,
        meeting: data.meeting,
        description: data.description,
      })
    }
  }

  useEffect(() => {
    onCalcNewGrade()
  }, [watch('worship'), watch('meeting')])

  useEffect(() => {
    if (data) {
      setValue('worship', data.worship)
      setValue('meeting', data.meeting)
      setValue('description', data.description)
    }
  }, [data, setValue])

  return (
    <div className="lg:pt-8">
      <Container>
        <div className="relative flex justify-center items-center">
          <div className="absolute left-0 p-2 -ml-4">
            <ChevronLeftIcon
              onClick={router.back}
              className="h-6 w-6 cursor-pointer"
            />
          </div>
          <p className="text-lg font-sans">셀원정보 입력</p>
        </div>
      </Container>

      <Container>
        <div className="border-b mt-8 pb-2">
          <span>이름: {memberInfo ? memberInfo.user.name : userName}</span>
        </div>
        {isLoading || isFetching ? (
          <div>
            <div className="mt-4">
              <div className="flex items-center justify-between lg:justify-start lg:gap-x-12">
                <h2 className="text-sm font-medium leading-6 text-gray-900">
                  예배참석
                </h2>
                <span className="text-sm font-medium leading-6 text-blue-600 hover:text-blue-500">
                  주로 참석하는 예배를 선택해주세요
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 mt-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-full h-16 bg-gray-200 rounded-md"
                  />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between lg:justify-start lg:gap-x-12">
                <h2 className="text-sm font-medium leading-6 text-gray-900">
                  셀모임참석
                </h2>
                <span className="text-sm font-medium leading-6 text-blue-600 hover:text-blue-500">
                  셀모임 참석 정도를 선택해주세요
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 mt-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-full h-16 bg-gray-200 rounded-md"
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-medium leading-6 text-gray-900">
                셀원소개
              </h2>
              <div className="mt-1 w-full h-[276px] border border-gray-300 rounded-md">
                <Skeleton className="w-24 h-2 bg-gray-200 rounded-md mt-3 ml-1.5" />
              </div>
            </div>
          </div>
        ) : (
          <form className="relative" onSubmit={handleSubmit(onSubmitHandler)}>
            {/* 예배참석 */}
            <WorshipRadioGroup control={control} errors={errors} />
            {/* 셀모임참석 */}
            <MeetingRadioGroup control={control} errors={errors} />
            {/* 셀원소개 */}
            <DescriptionTextArea
              data={memberInfo}
              errors={errors}
              watch={watch}
              register={register}
            />
          </form>
        )}
      </Container>
    </div>
  )
}

export default CellEvaluationDetailScreen
