"use client";
import { useState } from "react";
import Goals from "./components/Goals";
import Calendar from "./components/Calendar";
import Sessions from "./components/Sessions";

// pages/index.js
export default function Home() {
  const [popUpType, setPopUpType] = useState(null);
  const [popUpData, setPopUpData] = useState(null);

  const openPopUp = (type, data = null) => {
    console.log(data);
    setPopUpType(type);
    setPopUpData(data);
  };

  const closePopUp = () => {
    setPopUpType(null);
    setPopUpData(null);
  };

  return (
    <div
      className="min-h-screen text-[#E0E0E0] flex justify-center items-center p-8 bg-cover bg-center font-sans"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <div className="w-full max-w-4xl flex flex-col gap-8 bg-[#1E1E2F]/90 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-[#3A3A4F]">
        <Goals openPopUp={openPopUp} />
        <Calendar openPopUp={openPopUp} />
        <Sessions openPopUp={openPopUp} />
      </div>
      {popUpType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center">
          <div className="p-6 bg-[#2A2A3F] rounded-lg shadow-lg w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
              onClick={closePopUp}
            >
              Close
            </button>
            <h3 className="text-xl font-bold text-[#E0E0E0] mb-4">
              {popUpType === "goal" && "Add New Goal"}
              {popUpType === "task" && popUpData.date}
              {popUpType === "session" &&
                (popUpData ? "Session Details" : "Sessions for Selected Day")}
            </h3>
            {popUpType === "task" && (
              <div>
                <h1 className="text-2xl mb-3">Routines</h1>
                {popUpData.routine_tasks.length > 0 ? (
                  popUpData.routine_tasks.map((task, index) => (
                    <p key={index} className="text-[#E0E0E0] mb-2">
                      <strong>Task {index + 1}:</strong>{" "}
                      {task.routine.title || "Unnamed Routine"}
                    </p>
                  ))
                ) : (
                  <p className="text-[#C0C0C0]">No Routines.</p>
                )}

                <h1 className="text-2xl mb-3">Tasks</h1>

                {popUpData.tasks.length > 0 ? (
                  popUpData.tasks.map((task, index) => (
                    <p key={index} className="text-[#E0E0E0] mb-2">
                      <strong>Task {index + 1}:</strong>{" "}
                      {task.title || "Unnamed Task"}
                    </p>
                  ))
                ) : (
                  <p className="text-[#C0C0C0]">
                    No tasks available for this day.
                  </p>
                )}

                <h1 className="text-2xl mb-3">Session</h1>
                <textarea
                  className="w-full border-2 border-slate-700 min-h-20"
                  placeholder="write..."
                  defaultValue={popUpData.sessions[0].content}
                >
                </textarea>
                <button
                  type="submit"
                  className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                >
                  Submit
                </button>
              </div>
            )}
            {popUpType === "session" && (
              <div>
                {popUpData.sessions.length > 0 ? (
                  popUpData.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 mb-2 bg-[#3A3A4F] rounded-lg text-[#E0E0E0] cursor-pointer hover:bg-[#4A4A5F]"
                    >
                      <p>
                        <strong>ID:</strong> {session.id}
                      </p>
                      <p>
                        <strong>Title:</strong>{" "}
                        {session.title || "Untitled Session"}
                      </p>
                      <p>
                        <strong>Content:</strong>{" "}
                        {session.content || "No content available."}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#C0C0C0]">
                    No sessions available for this day.
                  </p>
                )}
              </div>
            )}
            {popUpType === "goal" && (
              <form>
                <input
                  type="text"
                  placeholder="Enter name/title"
                  className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                />
                <input
                  type="date"
                  className="w-full p-2 rounded-lg bg-[#3A3A4F] text-[#E0E0E0] mb-2"
                />
                <button
                  type="submit"
                  className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F]"
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
