"use client";

import { useState } from 'react';

export default function Goals() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="text-center">
      <h1
        className="mb-4 text-3xl font-semibold cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        Goals
      </h1>
      {expanded && (
        <div className="min-h-[100px] border-2 border-[#948979] rounded-lg p-4 bg-[#222831]/90">
          <p>No goals yet</p>
        </div>
      )}
    </section>
  );
}