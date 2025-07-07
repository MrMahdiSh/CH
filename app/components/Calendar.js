"use client";

import { useState, useEffect } from "react";
import { fetchData } from "@/utils/api";

export default function Calendar({ openPopUp, highlightedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(1); // Ensure the first day of the month is always shown
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = async (date) => {
    const correctedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ); // Ensure the correct date is selected
    setSelectedDate(correctedDate);
    try {
      const response = await fetchData(
        "days/selectByDate",
        "POST",
        {
          date: correctedDate.toISOString().split("T")[0],
        }
      );
      setTasks(response.data.tasks || []);
      openPopUp("task", response.data);
    } catch (error) {
      console.error("Error fetching day details:", error);
    }
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);

    const dayElements = [];

    for (let day = 1; day <= days; day++) {
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      const isHighlighted =
        highlightedDate &&
        new Date(highlightedDate.start).getDate() <= day &&
        new Date(highlightedDate.end).getDate() >= day &&
        new Date(highlightedDate.start).getMonth() === month &&
        new Date(highlightedDate.end).getMonth() === month &&
        new Date(highlightedDate.start).getFullYear() === year &&
        new Date(highlightedDate.end).getFullYear() === year;

      dayElements.push(
        <div
          key={day}
          className={`day border-2 border-[#948979] rounded-lg p-2 text-center text-[#DFD0B8] cursor-pointer hover:bg-[#3A3A4F] ${
            isToday
              ? "bg-green-700"
              : isHighlighted
              ? "bg-red-700"
              : "bg-[#222831]/90"
          }`}
          onClick={() => handleDateClick(new Date(year, month, day + 1))}
        >
          {day}
        </div>
      );
    }

    return dayElements;
  };

  return (
    <div className="p-6 bg-[#2A2A3F]/90 rounded-lg shadow-lg border border-[#3A3A4F] relative">
      <h2 className="text-2xl font-bold text-[#E0E0E0] mb-4 text-center">
        {currentDate.toLocaleString("default", { month: "long" })}{" "}
        {currentDate.getFullYear()}
      </h2>
      <div className="flex justify-between mb-4">
        <button
          className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F] hover:cursor-grab"
          onClick={() => handleMonthChange(-1)}
        >
          &lt;
        </button>
        <button
          className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F] hover:cursor-grab"
          onClick={() => handleMonthChange(1)}
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
    </div>
  );
}
