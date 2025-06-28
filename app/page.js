"use client";
import { useEffect, useState } from "react";
import Goals from "./components/Goals";
import Calendar from "./components/Calendar";
import Sessions from "./components/Sessions";
import axios from "axios";

// pages/index.js
export default function Home() {
  const [popUpType, setPopUpType] = useState(null);
  const [popUpData, setPopUpData] = useState(null);
  const [importantTasks, setImportantTasks] = useState(null);
  const [highlightedDate, setHighlightedDate] = useState(null);

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
      const item =
        popUpData.routine_tasks.find((routine) => routine.id === id) ||
        popUpData.tasks.find((task) => task.id === id);
      const updatedItem = {
        ...item,
        status: item.status === "done" ? "planned" : "done",
      };
      await axios.put(
        `http://127.0.0.1:8000/api/v1/${item.type}s/${id}`,
        updatedItem
      );
      if (item.type === "routine") {
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

  useEffect(() => {
    async function fetchImportantTasks() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/theTasks/important"
        );
        setImportantTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching important tasks:", error);
      }
    }
    fetchImportantTasks();
  }, []);
  return (
    <div
      className="min-h-screen text-[#E0E0E0] flex justify-center items-center p-8 bg-cover bg-center font-sans"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="w-full max-w-4xl flex flex-row gap-8">
        {/* Main Column */}
        <div className="flex flex-col gap-8 bg-[#1E1E2F]/90 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-[#3A3A4F]">
          <Goals openPopUp={openPopUp} />
          <Calendar openPopUp={openPopUp} highlightedDate={highlightedDate} />
          <Sessions openPopUp={openPopUp} />
        </div>

        {/* Right Column for Important Tasks */}
        <div className="flex flex-col gap-8 bg-[#1E1E2F]/90 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-[#3A3A4F]">
          <h2 className="text-xl font-bold text-[#E0E0E0]">Important Tasks</h2>
          {importantTasks && importantTasks.length > 0 ? (
            importantTasks.map((task, index) => (
              <div
                key={index}
                className="p-4 mb-2 rounded-lg text-[#E0E0E0] bg-[#3A3A4F] shadow-md border border-[#4A4A5F]"
                onMouseEnter={() => setHighlightedDate(task.day.date)}
                onMouseLeave={() => setHighlightedDate(null)}
              >
                <input
                  type="text"
                  defaultValue={task.title}
                  className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                  onChange={(e) => {
                    const updatedTask = {
                      ...task,
                      title: e.target.value,
                    };
                    setPopUpData((prevData) =>
                      prevData.map((t) => (t.id === task.id ? updatedTask : t))
                    );
                  }}
                />
                <button
                  className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                  onClick={async () => {
                    try {
                      await axios.put(
                        `http://127.0.0.1:8000/api/v1/tasks/${task.id}`,
                        task
                      );
                    } catch (error) {
                      console.error("Error updating task:", error);
                    }
                  }}
                >
                  Save
                </button>
                <button
                  className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                  onClick={async () => {
                    try {
                      await axios.delete(
                        `http://127.0.0.1:8000/api/v1/tasks/${task.id}`
                      );
                      setPopUpData((prevData) =>
                        prevData.filter((t) => t.id !== task.id)
                      );
                    } catch (error) {
                      console.error("Error deleting task:", error);
                    }
                  }}
                >
                  Delete
                </button>
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
                          const response = await axios.get(
                            "http://127.0.0.1:8000/api/v1/routines"
                          );
                          setPopUpData(response.data.data);
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
                      await axios.post(
                        "http://127.0.0.1:8000/api/v1/sessions",
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
                    await axios.post(
                      "http://127.0.0.1:8000/api/v1/goals",
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
                    await axios.post(
                      "http://127.0.0.1:8000/api/v1/sessions",
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
                      await axios.post(
                        "http://127.0.0.1:8000/api/v1/tasks",
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
                              await axios.put(
                                `http://127.0.0.1:8000/api/v1/routines/${routine.id}`,
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
                              await axios.delete(
                                `http://127.0.0.1:8000/api/v1/routines/${routine.id}`
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
