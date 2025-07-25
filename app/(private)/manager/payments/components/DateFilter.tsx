'use client';
import React from 'react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-4 items-end bg-white rounded-xl shadow p-4 border border-blue-100">
      <div className="flex flex-col">
        <label htmlFor="startDate" className="block text-xs font-semibold text-blue-700 mb-1">
          Data inicial
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="rounded-lg border border-blue-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>
      <span className="hidden sm:inline-block text-blue-400 font-bold mb-2">—</span>
      <div className="flex flex-col">
        <label htmlFor="endDate" className="block text-xs font-semibold text-blue-700 mb-1">
          Data final
        </label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="rounded-lg border border-blue-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>
    </div>
  );
};