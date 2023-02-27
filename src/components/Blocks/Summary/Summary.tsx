import React from 'react'
import SummaryHeader from '@/components/Atoms/Summary/SummaryHeader'
import SummaryRow from '@/components/Atoms/Summary/SummaryRow'
import SummaryButton from '@/components/Atoms/Summary/SummaryButton'

type CompoundComposition = {
  Row: React.FC<{ title: string; definition: string }>
}

const Summary: React.FC<{
  children: React.ReactNode
  label: string
  header: string
  onClick: () => void
}> &
  CompoundComposition = (props) => {
  return (
    <section className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
      <SummaryHeader header={props.header} />
      <dl className="mt-6 space-y-4">{props.children}</dl>
      <div className="mt-8">
        <SummaryButton label={props.label} onClick={props.onClick} />
      </div>
    </section>
  )
}

export default Summary

Summary.Row = SummaryRow
