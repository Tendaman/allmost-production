'use client'

import { AreaChart } from '@tremor/react'
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardHeader, Card, CardTitle } from '../ui/card'

interface CheckoutActivityChartProps {
  data: any[]
}

export default function CheckoutActivityChart({ data}: CheckoutActivityChartProps) {

  const [timeRange, setTimeRange] = useState('all')

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
    } else {
      return value.toFixed(0)
    }
  }

  const filterData = (range: string) => {
    const now = new Date()
    switch (range) {
      case 'this_month':
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        return data.filter(item => new Date(item.created) >= thisMonth)
      case 'last_month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        return data.filter(item => {
          const itemDate = new Date(item.created)
          return itemDate >= lastMonth && itemDate < thisMonthStart
        })
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        return data.filter(item => new Date(item.created) >= today)
      case 'yesterday':
        const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        return data.filter(item => {
          const itemDate = new Date(item.created)
          return itemDate >= yesterdayStart && itemDate < yesterdayEnd
        })
      case 'this_year':
        const thisYear = new Date(now.getFullYear(), 0, 1)
        return data.filter(item => new Date(item.created) >= thisYear)
      case 'last_year':
        const lastYearStart = new Date(now.getFullYear() - 1, 0, 1)
        const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31)
        return data.filter(item => {
          const itemDate = new Date(item.created)
          return itemDate >= lastYearStart && itemDate <= lastYearEnd
        })
      default:
        return data
    }
  }

  const filteredData = filterData(timeRange)

  // Reverse the data array to invert it horizontally
  const reversedData = [...filteredData].reverse()

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'this_month': return 'this month'
      case 'last_month': return 'last month'
      case 'today': return 'today'
      case 'yesterday': return 'yesterday'
      case 'this_year': return 'this year'
      case 'last_year': return 'last year'
      default: return 'the selected time range'
    }
  }

  return (
    <Card className="p-4 flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Checkout Activity</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value="all">All Data</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
            <SelectItem value="last_year">Last Year</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      {reversedData.length > 0 ? (
        <AreaChart
          className="text-sm stroke-primary h-72"
          data={reversedData}
          index="created"
          categories={['amount_total']}
          colors={['primary']}
          yAxisWidth={60}
          showAnimation={true}
          valueFormatter={formatYAxis}
          minValue={0}
          customTooltip={({ payload }) => {
            if (payload && payload.length) {
              return (
                <div className="bg-white p-2 border rounded shadow">
                  <p className="text-sm">{payload[0].payload.created}</p>
                  <p className="text-sm font-bold">{formatYAxis(payload[0].value as number)}</p>
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
      ) : (
        <div className="flex items-center justify-center h-72 text-muted-foreground">
          No transactions were recorded for {getTimeRangeLabel()}.
        </div>
      )}
    </Card>  
  )
}