"use client";

import { useState, useEffect } from "react";
import { fetchData } from "@/utils/api";

export default function Goals({ openPopUp }) {
  const [expanded, setExpanded] = useState(false);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetchData("goals");
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const goal = goals.find((goal) => goal.id === id);
      const updatedGoal = {
        ...goal,
        status: goal.status === "done" ? "planned" : "done",
      };
      await fetchData(`goals/${id}`, "PUT", updatedGoal);
      setGoals(goals.map((goal) => (goal.id === id ? updatedGoal : goal)));
    } catch (error) {
      console.error("Error updating goal status:", error);
    }
  };

  return (
    <div className="p-6 bg-[#2A2A3F]/90 rounded-lg shadow-lg border border-[#3A3A4F]">
      <h2
        className="text-2xl font-bold text-[#E0E0E0] mb-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        Goals
      </h2>
      {expanded ? (
        <div>
          <button
            className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F] mb-4"
            onClick={() => openPopUp("goal")}
          >
            Add New Goal
          </button>

          {goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 mb-2 rounded-lg text-[#E0E0E0] ${
                goal.status == "done" ? "bg-green-600" : "bg-[#3A3A4F]"
              }`}
            >
              <p>
                <strong>Name:</strong> {goal.title}
              </p>
              <p>
                <strong>Deadline:</strong> {goal.deadline}
              </p>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={goal.status === "done"}
                  onChange={() => toggleStatus(goal.id)}
                  className="mr-2"
                />
                <span>{goal.status == "done" ? "Done" : "Pending"}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-[#C0C0C0]">Click to expand</p>
        </div>
      )}
    </div>
  );
}
