'use client'

import React, { useState, useMemo } from 'react'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'
import { Modal } from './Modal'

interface DatePickerProps {
  selected?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  maxDate?: Date
  minDate?: Date
  className?: string
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function DatePicker({
  selected,
  onChange,
  placeholder = "Select date",
  disabled = false,
  maxDate,
  minDate,
  className = ""
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Calculate default max date (15 years ago from today for age validation)
  const defaultMaxDate = useMemo(() => {
    const today = new Date()
    const fifteenYearsAgo = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate())
    return maxDate || fifteenYearsAgo
  }, [maxDate])

  const defaultMinDate = useMemo(() => {
    return minDate || new Date(1900, 0, 1)
  }, [minDate])

  // Initialize calendar view to selected date or max allowed date
  const [viewDate, setViewDate] = useState(() => {
    if (selected) return new Date(selected)
    return new Date(defaultMaxDate)
  })

  const formatDate = (date: Date | null): string => {
    if (!date) return placeholder
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay()
  }

  const isDateDisabled = (date: Date): boolean => {
    if (date > defaultMaxDate) return true
    if (date < defaultMinDate) return true
    return false
  }

  const isSameDay = (date1: Date | null, date2: Date): boolean => {
    if (!date1) return false
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)

    if (isDateDisabled(selectedDate)) return

    onChange?.(selectedDate)
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value)
    setViewDate(prev => new Date(prev.getFullYear(), newMonth, 1))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value)
    setViewDate(prev => new Date(newYear, prev.getMonth(), 1))
  }

  const handleClear = () => {
    onChange?.(null)
    setIsOpen(false)
  }

  const renderCalendar = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days: (number | null)[] = []

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map(day => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const date = new Date(year, month, day)
          const disabled = isDateDisabled(date)
          const isSelected = isSameDay(selected || null, date)
          const isToday = isSameDay(new Date(), date)

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => handleDateSelect(day)}
              disabled={disabled}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm
                transition-all duration-150
                ${disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'hover:bg-blue-50 cursor-pointer text-gray-900'
                }
                ${isSelected
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : ''
                }
                ${isToday && !isSelected
                  ? 'ring-2 ring-blue-500 ring-inset'
                  : ''
                }
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    )
  }

  // Generate year options (1900 to 15 years ago)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const maxYear = currentYear - 15
    const years: number[] = []
    for (let year = maxYear; year >= 1900; year--) {
      years.push(year)
    }
    return years
  }, [])

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
          ${selected ? 'text-gray-900' : 'text-gray-500'}
        `}
      >
        <div className="flex items-center justify-between">
          <span>{formatDate(selected || null)}</span>
          <CalendarIcon className="h-5 w-5 text-gray-400" />
        </div>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Date of Birth
          </h3>

          <div className="mb-4">
            {/* Month and Year Selection */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>

              <div className="flex gap-2">
                <select
                  value={viewDate.getMonth()}
                  onChange={handleMonthChange}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {MONTHS.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={viewDate.getFullYear()}
                  onChange={handleYearChange}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            {renderCalendar()}
          </div>

          {/* Age restriction notice */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              You must be at least 15 years old to register
            </p>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleClear}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsOpen(false)}
              className="px-6"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
