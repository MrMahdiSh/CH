"use client";
import { useEffect, useState } from "react";
import Goals from "./components/Goals";
import Calendar from "./components/Calendar";
import Sessions from "./components/Sessions";
import { fetchData } from "@/utils/api";

// pages/index.js
export default function Home() {
  const [popUpType, setPopUpType] = useState(null);
  const [popUpData, setPopUpData] = useState(null);
  const [importantTasks, setImportantTasks] = useState(null);
  const [highlightedDate, setHighlightedDate] = useState(null);
  const [timeLines, setTimeLines] = useState([]);

  const openPopUp = (type, data = null) => {
    console.log(data);
    setPopUpType(type);
    setPopUpData(data);
  };

  const closePopUp = () => {
    setPopUpType(null);
    setPopUpData(null);
  };

  const toggleStatus = async (id) => {
    try {
      const isRoutineTask = popUpData.routine_tasks.some(
        (routine) => routine.id === id
      );
      const item = isRoutineTask
        ? popUpData.routine_tasks.find((routine) => routine.id === id)
        : popUpData.tasks.find((task) => task.id === id);

      const updatedItem = {
        ...item,
        status: item.status === "done" ? "planned" : "done",
      };

      const url = isRoutineTask
        ? `routineTasks/${id}`
        : `tasks/${id}`;

      await fetchData(url, "PUT", updatedItem);
      if (isRoutineTask) {
        setPopUpData({
          ...popUpData,
          routine_tasks: popUpData.routine_tasks.map((routine) =>
            routine.id === id ? updatedItem : routine
          ),
        });
      } else {
        setPopUpData({
          ...popUpData,
          tasks: popUpData.tasks.map((task) =>
            task.id === id ? updatedItem : task
          ),
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const toggleTimeLineStatus = async (id) => {
    try {
      const item = timeLines.find((timeline) => timeline.id === id);
      const updatedItem = {
        ...item,
        status: item.status === "done" ? "planned" : "done",
      };
      await fetchData(`time-lines/${id}`, "PUT", updatedItem);
      setTimeLines(
        timeLines.map((timeline) =>
          timeline.id === id ? updatedItem : timeline
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    async function fetchImportantTasks() {
      try {
        const response = await fetchData("theTasks/important");
        setImportantTasks(response.tasks);
      } catch (error) {
        console.error("Error fetching important tasks:", error);
      }
    }
    fetchImportantTasks();
  }, []);

  useEffect(() => {
    async function fetchTimeLines() {
      try {
        const response = await fetchData("time-lines");
        setTimeLines(response.timeLine);
      } catch (error) {
        console.error("Error fetching timelines:", error);
      }
    }
    fetchTimeLines();
  }, []);

  return (
    <div
      className="min-h-screen text-[#E0E0E0] flex flex-col md:flex-row justify-center items-center p-4 md:p-8 bg-cover bg-center font-sans"
    >
      <img src="/images/background.jpg" alt="background" className="absolute top-0 left-0 w-full h-full object-cover -z-10" />
      <div className="w-full flex flex-col max-h-[85vh] md:flex-row gap-4 md:gap-8">
        {/* Left Column for Timeline */}
        <div className="flex flex-col gap-4 md:gap-8 bg-[#1E1E2F]/90 p-4 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-[#3A3A4F] w-full md:w-1/3 overflow-y-scroll max-h-[95vh]">
          <h2 className="text-lg md:text-xl font-bold text-[#E0E0E0]">
            Timeline
          </h2>
          {timeLines && timeLines.length > 0 ? (
            timeLines.map((timeline, index) => (
              <div
                key={index}
                className="p-2 md:p-4 mb-2 rounded-lg text-[#E0E0E0] bg-[#3A3A4F] shadow-md border border-[#4A4A5F]"
                onMouseEnter={() =>
                  setHighlightedDate({
                    start: timeline.start_date,
                    end: timeline.end_date,
                  })
                }
                onMouseLeave={() => setHighlightedDate(null)}
              >
                <p>
                  <strong>Goal:</strong> {timeline.goal}
                </p>
                <p>
                  <strong>Start Date:</strong> {timeline.start_date}
                </p>
                <p>
                  <strong>End Date:</strong> {timeline.end_date}
                </p>
                <div className="flex gap-1">
                  {timeline.status === "done" ? (
                    <div>Done</div>
                  ) : (
                    <div>Planned</div>
                  )}
                  <input
                    type="checkbox"
                    checked={timeline.status === "done"}
                    onChange={() => toggleTimeLineStatus(timeline.id)}
                    className="mr-2"
                  />
                </div>
              </div>
            ))
          ) : (
            <h1>There is nothing to show!</h1>
          )}
        </div>

        {/* Main Column */}
        <div className="flex flex-col gap-4 md:gap-8 bg-[#1E1E2F]/90 p-4 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-[#3A3A4F] w-full md:w-1/3 overflow-y-scroll">
          <Goals openPopUp={openPopUp} />
          <Calendar openPopUp={openPopUp} highlightedDate={highlightedDate} />
          <Sessions openPopUp={openPopUp} />
        </div>

        {/* Right Column for Important Tasks */}
        <div className="flex flex-col gap-4 md:gap-8 bg-[#1E1E2F]/90 p-4 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-[#3A3A4F] w-full md:w-1/3 overflow-y-scroll max-h-[95vh]">
          <h2 className="text-lg md:text-xl font-bold text-[#E0E0E0]">
            Important Tasks
          </h2>
          {importantTasks && importantTasks.length > 0 ? (
            importantTasks
              .slice()
              .reverse()
              .map((task, index) => (
                <div
                  key={index}
                  className="p-2 md:p-4 mb-2 rounded-lg text-[#E0E0E0] bg-[#3A3A4F] shadow-md border border-[#4A4A5F]"
                  onMouseEnter={() =>
                    setHighlightedDate({
                      start: task.day.date,
                      end: task.day.date,
                    })
                  }
                  onMouseLeave={() => setHighlightedDate(null)}
                >
                  <h1 className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0]">
                    {task.title}
                  </h1>
                  <h1 className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0]">
                    {task.day.date}
                  </h1>
                </div>
              ))
          ) : (
            <h1>There is nothing to show!</h1>
          )}
        </div>
      </div>

      {popUpType && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center"
          onClick={closePopUp}
        >
          <div
            className="p-6 bg-[#2A2A3F] rounded-lg shadow-lg w-full max-w-[85%] max-h-[80vh] overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()} // Prevent click propagation
          >
            <h3 className="text-xl font-bold text-[#E0E0E0] mb-4">
              {popUpType === "goal" && "Add New Goal"}
              {popUpType === "task" && popUpData.date}
              {popUpType === "session" &&
                (popUpData ? "Session Details" : "Sessions for Selected Day")}
              {popUpType === "newSession" && "New session"}
              {popUpType === "newRoutines" && "Manage Routines"}
            </h3>
            {popUpType === "task" && (
              <div>
                <div className="flex gap-3 mb-3">
                  <button
                    className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                    onClick={() => {
                      openPopUp("newRoutines");
                      const fetch = async () => {
                        try {
                          const response = await fetchData(
                            "routines"
                          );
                          setPopUpData(response.data);
                        } catch (error) {
                          console.error("Error fetching routines:", error);
                        }
                      };
                      fetch();
                    }}
                  >
                    Edit Routines
                  </button>
                  <button
                    className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                    onClick={() => {
                      setPopUpType("newTask");
                    }}
                  >
                    New Task
                  </button>
                </div>
                <h1 className="text-2xl mb-3">Routines</h1>
                {popUpData.routine_tasks.length > 0 ? (
                  popUpData.routine_tasks.map((routine, index) => (
                    <div
                      key={index}
                      className="p-4 mb-2 rounded-lg text-[#E0E0E0] bg-[#3A3A4F] shadow-md border border-[#4A4A5F]"
                    >
                      <p>
                        <strong>Task {index + 1}:</strong>{" "}
                        {routine.routine.title || "Unnamed Routine"}
                      </p>
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={routine.status == "done"}
                          onChange={() => toggleStatus(routine.id)}
                          className="mr-2"
                        />
                        <span>
                          {routine.status == "done" ? "Done" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#C0C0C0]">No Routines.</p>
                )}

                <h1 className="text-2xl mb-3">Tasks</h1>

                {popUpData.tasks.length > 0 ? (
                  popUpData.tasks.map((task, index) => (
                    <div
                      key={index}
                      className="p-4 mb-2 rounded-lg text-[#E0E0E0] bg-[#3A3A4F] shadow-md border border-[#4A4A5F]"
                    >
                      <p>
                        <strong>Task {index + 1}:</strong>{" "}
                        {task.title || "Unnamed Task"}
                      </p>
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={task.status == "done"}
                          onChange={() => toggleStatus(task.id)}
                          className="mr-2"
                        />
                        <span>
                          {task.status == "done" ? "Done" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#C0C0C0]">
                    No tasks available for this day.
                  </p>
                )}

                <h1 className="text-2xl mb-3">Session</h1>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const sessionData = {
                      type: "daily",
                      title: formData.get("title"),
                      content: formData.get("content"),
                      date: popUpData.date,
                    };
                    try {
                      await fetchData(
                        "sessions",
                        "POST",
                        sessionData
                      );
                      closePopUp();
                      window.location.reload();
                    } catch (error) {
                      console.error("Error creating goal:", error);
                      debugger;
                    }
                  }}
                >
                  <input
                    className="w-full border-2 border-slate-700 mt-3 mb-3"
                    placeholder="write..."
                    name="title"
                    defaultValue={
                      popUpData.sessions[0] && popUpData.sessions[0].title
                    }
                  ></input>
                  <textarea
                    name="content"
                    className="w-full border-2 border-slate-700 min-h-20"
                    placeholder="write..."
                    defaultValue={
                      popUpData.sessions[0] && popUpData.sessions[0].content
                    }
                  ></textarea>
                  <button
                    type="submit"
                    className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
            {popUpType === "session" && (
              <div>
                <p>
                  <strong>ID:</strong> {popUpData.id}
                </p>
                <p>
                  <strong>Title:</strong>{" "}
                  {popUpData.title || "Untitled Session"}
                </p>
                <p>
                  <strong>Content:</strong>{" "}
                  {popUpData.content || "No content available."}
                </p>
              </div>
            )}
            {popUpType === "goal" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const priority = 3; // Fixed priority to always be 3
                  const goalData = {
                    title: formData.get("title"),
                    deadline: formData.get("date"),
                    priority: priority,
                    status: "planned",
                  };
                  try {
                    await fetchData(
                      "goals",
                      "POST",
                      goalData
                    );
                    closePopUp();
                  } catch (error) {
                    console.error("Error creating goal:", error);
                    debugger;
                  }
                }}
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Enter name/title"
                  className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                  required
                />
                <input
                  type="date"
                  name="date"
                  className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                  required
                />
                <select
                  name="priority"
                  className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  type="submit"
                  className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                >
                  Submit
                </button>
              </form>
            )}
            {popUpType === "newSession" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const sessionData = {
                    title: formData.get("title"),
                    content: formData.get("content"),
                    type: formData.get("type"),
                  };
                  try {
                    await fetchData(
                      "sessions",
                      "POST",
                      sessionData
                    );
                    window.location.reload();
                    closePopUp();
                  } catch (error) {
                    console.error("Error creating session:", error);
                    debugger;
                  }
                }}
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Enter session title"
                  className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                  required
                />
                <textarea
                  name="content"
                  placeholder="Enter session content"
                  className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                  required
                ></textarea>
                <select
                  name="type"
                  className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
                <button
                  type="submit"
                  className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                >
                  Submit
                </button>
              </form>
            )}
            {popUpType === "newTask" && (
              <div>
                <h1 className="mb-3">{popUpData.date}</h1>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const priority =
                      formData.get("priority") == "low"
                        ? 1
                        : formData.get("priority") == "medium"
                        ? 2
                        : 3;
                    const taskData = {
                      title: formData.get("title"),
                      description: "Task details",
                      date: popUpData.date,
                      priority: priority,
                      status: "pending", // Fixed status
                    };
                    try {
                      await fetchData(
                        "tasks",
                        "POST",
                        taskData
                      );
                      openPopUp("task", {
                        ...popUpData,
                        tasks: [...popUpData.tasks, taskData],
                      });
                    } catch (error) {
                      console.error("Error creating task:", error);
                      debugger;
                    }
                  }}
                >
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter task title"
                    className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                    required
                  />
                  <select
                    name="priority"
                    className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  <button
                    type="submit"
                    className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
            {popUpType === "newRoutines" && (
              <div>
                <div>
                  {popUpData &&
                    popUpData.map((routine, index) => (
                      <div
                        key={index}
                        className="p-4 mb-2 rounded-lg text-[#E0E0E0] bg-[#3A3A4F] shadow-md border border-[#4A4A5F]"
                      >
                        <input
                          type="text"
                          defaultValue={routine.title}
                          className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                          onChange={(e) => {
                            const updatedRoutine = {
                              ...routine,
                              title: e.target.value,
                            };
                            setPopUpData((prevData) =>
                              prevData.map((r) =>
                                r.id === routine.id ? updatedRoutine : r
                              )
                            );
                          }}
                        />
                        <button
                          className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                          onClick={async () => {
                            try {
                              await fetchData(
                                `routines/${routine.id}`,
                                "PUT",
                                routine
                              );
                            } catch (error) {
                              console.error("Error updating routine:", error);
                            }
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                          onClick={async () => {
                            try {
                              await fetchData(
                                `routines/${routine.id}`,
                                "DELETE"
                              );
                              setPopUpData((prevData) =>
                                prevData.filter((r) => r.id !== routine.id)
                              );
                            } catch (error) {
                              console.error("Error deleting routine:", error);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  <button
                    className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                    onClick={() => {
                      const newId =
                        popUpData.length > 0
                          ? Math.max(...popUpData.map((r) => r.id)) + 1
                          : 1;
                      const newRoutine = { id: newId, title: "New Routine" };
                      setPopUpData((prevData) => [...prevData, newRoutine]);
                    }}
                  >
                    Add Routine
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
