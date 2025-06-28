"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Sessions({ openPopUp }) {
  const [sessions, setSessions] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/sessions"
        );
        setSessions(response.data.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const addSession = async (newSession) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/sessions",
        newSession
      );
      setSessions([...sessions, response.data]);
    } catch (error) {
      console.error("Error adding session:", error);
    }
  };

  return (
    <div className="p-6 bg-[#2A2A3F]/90 rounded-lg shadow-lg border border-[#3A3A4F]">
      <h2
        className="text-2xl font-bold text-[#E0E0E0] mb-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        Sessions
      </h2>
      {expanded ? (
        <div>
          <button
            className="text-[#E0E0E0] bg-[#3A3A4F] p-2 rounded-lg hover:bg-[#4A4A5F] mb-4"
            onClick={() => openPopUp("newSession")}
          >
            Add New Session
          </button>
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 mb-2 bg-[#3A3A4F] rounded-lg text-[#E0E0E0] cursor-pointer hover:bg-[#4A4A5F]"
              onClick={() => openPopUp("session", session)}
            >
              <p>
                <strong>ID:</strong> {session.id}
              </p>
              <p>
                <strong>Title:</strong> {session.title}
              </p>
              <p>
                <strong>Content:</strong> {session.content}
              </p>
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
