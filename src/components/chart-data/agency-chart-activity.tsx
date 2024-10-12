//src\components\chart-data\agency-chart-activity.tsx

'use client'

import { AreaChart } from '@tremor/react'

interface AgencyChartActivityProps {
  data: any[]
}

export default function AgencyChartActivity({ data }: AgencyChartActivityProps) {
  const formatYAxis = (value: number) => {
    const absNum = Math.abs(value)
    if (absNum >= 1e12) {
      return (value / 1e12).toFixed(0) + 't'
    } else if (absNum >= 1e9) {
      return (value / 1e9).toFixed(0) + 'b'
    } else if (absNum >= 1e6) {
      return (value / 1e6).toFixed(0) + 'm'
    } else if (absNum >= 1e3) {
      return (value / 1e3).toFixed(0) + 'k'
    } else if (absNum >= 100) {
      return value.toFixed(0)
    } else if (absNum >= 10) {
      return value.toFixed(0)
    } else {
      return value.toFixed(0)
    }
  }


  return (
    <AreaChart
      className="text-sm stroke-primary h-72"
      data={data}
      index="created"
      categories={['amount_total']}
      colors={['primary']}
      yAxisWidth={80}
      showAnimation={true}
      valueFormatter={formatYAxis}  // Apply the formatting function here
      minValue={0}
      customTooltip={({ payload }) => {
        if (payload && payload.length) {
          return (
            <div className="bg-white p-2 border rounded shadow">
              <p className="text-sm">{payload[0].payload.created}</p>
              <p className="text-sm font-bold">
                {formatYAxis(payload[0].value as number)}
              </p>
            </div>
          )
        }
        return null
      }}
      showYAxis={true}
      showGridLines={true}
      autoMinValue={false}
      tickGap={5}
    />
  )
}
