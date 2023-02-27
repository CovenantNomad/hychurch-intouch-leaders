import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Member } from '@/types/member'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

interface CellAgeStaticProps {
  data: {
    [index: string]: Member[]
  }
}

const CellAgeStatic = ({ data }: CellAgeStaticProps) => {
  const labels = Object.keys(data)

  const barData = {
    labels,
    datasets: [
      {
        data: labels.map((label) => data[label].length),
        backgroundColor: '#0F336B',
      },
    ],
  }

  return (
    <div className="px-2 py-3 rounded-lg shadow-lg bg-gray-50">
      <Bar
        data={barData}
        height={150}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
        }}
      />
    </div>
  )
}

export default CellAgeStatic
