"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Calendar({ openPopUp }) {
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
    setSelectedDate(date);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/days/selectByDate",
        {
          date: date.toISOString().split("T")[0],
        }
      );
      setTasks(response.data.data.tasks || []);
      openPopUp("task", response.data.data);
    } catch (error) {
      console.error("Error fetching day details:", error);
    }
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();

    const dayElements = [];

    for (let i = 0; i < firstDay; i++) {
      dayElements.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    for (let day = 1; day <= days; day++) {
      dayElements.push(
        <div
          key={day}
          className="day border-2 border-[#948979] rounded-lg p-2 bg-[#222831]/90 text-center text-[#DFD0B8] cursor-pointer hover:bg-[#3A3A4F]"
          onClick={() => handleDateClick(new Date(year, month, day))}
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
          className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
          onClick={() => handleMonthChange(-1)}
        >
          &lt;
        </button>
        <button
          className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
          onClick={() => handleMonthChange(1)}
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
    </div>
  );
}
