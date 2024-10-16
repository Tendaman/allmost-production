//src\components\chart-data\agency-chart-activity.tsx

'use client'

import { AreaChart } from '@tremor/react'
import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardHeader, Card, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AgencyChartActivityProps {
  data: any[]
}

export default function AgencyChartActivity({ data }: AgencyChartActivityProps) {

  const [timeRange, setTimeRange] = useState('daily')
  const [currentPage, setCurrentPage] = useState(0)

  const formatNumber = (value: number) => {
    const absNum = Math.abs(value)
    if (absNum >= 1e12) return (value / 1e12).toFixed(3).replace(/\.?0+$/, '') + 't'
    if (absNum >= 1e9) return (value / 1e9).toFixed(3).replace(/\.?0+$/, '') + 'b'
    if (absNum >= 1e6) return (value / 1e6).toFixed(3).replace(/\.?0+$/, '') + 'm'
    if (absNum >= 1e3) return (value / 1e3).toFixed(3).replace(/\.?0+$/, '') + 'k'
    return value.toFixed(2).replace(/\.?0+$/, '')
  }

  const formatYAxis = (value: number) => {
    return formatNumber(value)
  }

  const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  }

  const filterAndPrepareData = useMemo(() => {
    const now = new Date()
    const getStartDate = () => {
      switch (timeRange) {
        case 'daily':
          return new Date(now.getFullYear(), now.getMonth(), now.getDate() - currentPage)
        case 'weekly':
          return new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() + currentPage * 7))
        case 'monthly':
          return new Date(now.getFullYear(), now.getMonth() - currentPage, 1)
        case 'yearly':
          return new Date(now.getFullYear() - currentPage, 0, 1)
        default:
          return now
      }
    }

    const startDate = getStartDate()
    const endDate = new Date(startDate)

    switch (timeRange) {
      case 'daily':
        endDate.setDate(startDate.getDate() + 1)
        break
      case 'weekly':
        endDate.setDate(startDate.getDate() + 7)
        break
      case 'monthly':
        endDate.setMonth(startDate.getMonth() + 1)
        break
      case 'yearly':
        endDate.setFullYear(startDate.getFullYear() + 1)
        break
    }

    const getDateKey = (date: Date) => {
      switch (timeRange) {
        case 'daily':
          return `${date.getHours().toString().padStart(2, '0')}:00`
        case 'weekly':
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
        case 'monthly':
          return date.getDate().toString()
        case 'yearly':
          return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
        default:
          return ''
      }
    }

    const createEmptyDataset = () => {
      switch (timeRange) {
        case 'daily':
          return Array.from({ length: 24 }, (_, i) => ({ created: `${i.toString().padStart(2, '0')}:00`, amount_total: 0 }))
        case 'weekly':
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({ created: day, amount_total: 0 }))
        case 'monthly':
          const daysInMonthCount = daysInMonth(now.getFullYear(), now.getMonth() - currentPage)
          return Array.from({ length: daysInMonthCount }, (_, i) => ({ created: (i + 1).toString(), amount_total: 0 }))
        case 'yearly':
          return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => ({ created: month, amount_total: 0 }))
        default:
          return []
      }
    }

    const filteredData = data.filter(item => {
      const itemDate = new Date(item.created)
      return itemDate >= startDate && itemDate < endDate
    })

    const aggregatedData = filteredData.reduce((acc, item) => {
      const itemDate = new Date(item.created)
      const key = getDateKey(itemDate)
      if (!acc[key]) acc[key] = 0
      acc[key] += item.amount_total
      return acc
    }, {} as Record<string, number>)

    const preparedData = createEmptyDataset().map(item => ({
      ...item,
      amount_total: aggregatedData[item.created] || 0
    }))

    return preparedData
  }, [data, timeRange, currentPage])

  const getTimeRangeLabel = () => {
    const now = new Date()
    switch (timeRange) {
      case 'daily':
        const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - currentPage)
        return day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      case 'weekly':
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() + currentPage * 7))
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      case 'monthly':
        const month = new Date(now.getFullYear(), now.getMonth() - currentPage, 1)
        return month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      case 'yearly':
        const year = now.getFullYear() - currentPage
        return year.toString()
      default:
        return 'the selected time range'
    }
  }

  const handlePrevious = () => {
    setCurrentPage(prev => prev + 1)
  }

  const handleNext = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  return (
    <Card className="p-4 flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Checkout Activity</CardTitle>
        <Select value={timeRange} onValueChange={(value) => { setTimeRange(value); setCurrentPage(0); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <AreaChart
        className="text-sm stroke-primary h-72"
        data={filterAndPrepareData}
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
              <div className="bg-white p-2 border rounded shadow dark:bg-gray-900 dark:border-primary">
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
      <CardFooter className="flex justify-between items-center mt-4">
        <Button variant="outline" size="sm" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm font-medium">{getTimeRangeLabel()}</span>
        <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPage === 0}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}