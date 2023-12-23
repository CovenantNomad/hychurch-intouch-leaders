import React from 'react'
import SummaryHeader from '@/components/Atoms/Summary/SummaryHeader'
import SummaryRow from '@/components/Atoms/Summary/SummaryRow'
import SummaryButton from '@/components/Atoms/Summary/SummaryButton'

type CompoundComposition = {
  Row: React.FC<{ title: string; definition: string }>
}

const Summary: React.FC<{
  header: string
  children: React.ReactNode
  primaryLabel: string
  isSecondaryButton?: boolean
  secondaryLabel?: string
  disabled?: boolean
  onPrimaryClick: () => void
  onSecondaryClick?: () => void
}> &
  CompoundComposition = (props) => {
  return (
    <section className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
      <SummaryHeader header={props.header} />
      <dl className="mt-6 space-y-4">{props.children}</dl>
      <div
        className={`${
          props.isSecondaryButton && 'grid grid-cols-3 gap-x-6'
        } mt-8`}
      >
        {props.isSecondaryButton &&
          props.secondaryLabel &&
          props.onSecondaryClick && (
            <div className="col-span-1">
              <SummaryButton
                label={props.secondaryLabel}
                onClick={props.onSecondaryClick}
                isSecondaryButton
              />
            </div>
          )}
        <div className={`${props.isSecondaryButton && 'col-span-2'}`}>
          <SummaryButton
            label={props.primaryLabel}
            disabled={props.disabled}
            onClick={props.onPrimaryClick}
          />
        </div>
      </div>
    </section>
  )
}

export default Summary

Summary.Row = SummaryRow
