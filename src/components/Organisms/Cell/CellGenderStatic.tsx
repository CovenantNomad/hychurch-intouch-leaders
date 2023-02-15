import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip)

interface CellGenderStaticProps {
  maleMembers: number
  femaleMembers: number
}

const CellGenderStatic = ({
  maleMembers,
  femaleMembers,
}: CellGenderStaticProps) => {
  const labels = ['형제', '자매']
  const backgroundColor = ['#81B1AA', '#E16A62']

  const data = {
    labels,
    datasets: [
      {
        data: [maleMembers, femaleMembers],
        backgroundColor,
        hoverOffset: 4,
      },
    ],
  }

  return (
    <div className="flex gap-x-4 px-2 py-3 rounded-lg shadow-lg bg-gray-50">
      <div className="w-[40%]">
        <Doughnut
          data={data}
          options={{
            maintainAspectRatio: false,
          }}
        />
      </div>
      <div className="w-[60%] flex flex-col gap-y-4 justify-center">
        <div className="flex rounded-lg px-4 py-2 bg-white">
          <p className="text-base flex-1">형제</p>
          <p className="text-lg font-bold">{maleMembers}</p>
        </div>
        <div className="flex rounded-lg px-4 py-2 bg-white">
          <p className="text-base flex-1">자매</p>
          <p className="text-lg font-bold">{femaleMembers}</p>
        </div>
      </div>
    </div>
  )
}

export default CellGenderStatic
