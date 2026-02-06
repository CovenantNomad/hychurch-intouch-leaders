import ComboBoxImage from '@/components/Blocks/Combobox/ComboBoxImage'
import Summary from '@/components/Blocks/Summary/Summary'
import { SelectType } from '@/types/common'
import { Dispatch, SetStateAction } from 'react'
import { InActiveUserGradeList, TAB } from './CellTransfer.constants'

type Props = {
  tabIdx: number
  onChangeTab: (tabIdx: number) => void

  memberList: SelectType[]
  cellList: SelectType[]

  selectedPerson: SelectType
  setSelectedPerson: Dispatch<SetStateAction<SelectType>>

  selectedCell: SelectType
  setSelectedCell: Dispatch<SetStateAction<SelectType>>

  selectedGrade: SelectType
  setSelectedGrade: Dispatch<SetStateAction<SelectType>>

  summaryHeader: string
  submitDisabled: boolean
  onCancel: () => void
  onSubmit: () => void
}

const CellTransferForm = ({
  tabIdx,
  onChangeTab,
  memberList,
  cellList,
  selectedPerson,
  setSelectedPerson,
  selectedCell,
  setSelectedCell,
  selectedGrade,
  setSelectedGrade,
  summaryHeader,
  submitDisabled,
  onCancel,
  onSubmit,
}: Props) => {
  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-x-6">
        <button
          className={`relative pb-3 text-sm font-medium ${
            tabIdx === TAB.OTHER_CELL
              ? 'text-gray-900 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gray-900'
              : 'text-gray-400'
          }`}
          onClick={() => onChangeTab(TAB.OTHER_CELL)}
        >
          다른셀로 이동
        </button>

        <button
          className={`relative pb-3 text-sm font-medium ${
            tabIdx === TAB.RENEW_CELL
              ? 'text-gray-900 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gray-900'
              : 'text-gray-400'
          }`}
          onClick={() => onChangeTab(TAB.RENEW_CELL)}
        >
          새싹셀로 이동
        </button>
      </div>

      {/* Content */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white py-6 px-4 lg:p-8">
        {tabIdx === 0 ? (
          <>
            <div className="flex flex-col gap-y-6 lg:gap-y-8">
              <ComboBoxImage
                label="셀원선택"
                selected={selectedPerson}
                setSelected={setSelectedPerson}
                selectList={memberList}
              />
              <ComboBoxImage
                label="셀선택"
                selected={selectedCell}
                setSelected={setSelectedCell}
                selectList={cellList}
              />
            </div>
            <div className="mt-6">
              <Summary
                header="셀원이동 신청내용"
                isSecondaryButton
                primaryLabel="이동신청"
                secondaryLabel="취소"
                disabled={selectedPerson.id === '' || selectedCell.id === ''}
                onSecondaryClick={onCancel}
                onPrimaryClick={onSubmit}
              >
                <Summary.Row
                  title="선택한 셀원"
                  definition={selectedPerson.name}
                />
                <Summary.Row title="선택한 셀" definition={selectedCell.name} />
              </Summary>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-y-6 lg:gap-y-8">
              <ComboBoxImage
                label="셀원선택"
                selected={selectedPerson}
                setSelected={setSelectedPerson}
                selectList={memberList}
              />
              <ComboBoxImage
                label="새싹셀 이동 이유"
                selected={selectedGrade}
                setSelected={setSelectedGrade}
                selectList={InActiveUserGradeList}
              />
            </div>
            <div className="mt-6">
              <Summary
                header={summaryHeader}
                isSecondaryButton
                primaryLabel="이동신청"
                secondaryLabel="취소"
                disabled={submitDisabled}
                onSecondaryClick={onCancel}
                onPrimaryClick={onSubmit}
              >
                <Summary.Row
                  title="선택한 셀원"
                  definition={selectedPerson.name}
                />
                <Summary.Row
                  title="새싹셀 이동 이유"
                  definition={selectedGrade.name}
                />
                <Summary.Row title="선택한 셀" definition={selectedCell.name} />
              </Summary>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CellTransferForm
