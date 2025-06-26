"use client";

export default function Calendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <section className="text-center">
      <h2 className="mb-4 text-2xl font-semibold">Calendar</h2>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day}
            className="border-2 border-[#948979] rounded-lg p-2 bg-[#222831]/90 text-center text-[#DFD0B8]"
          >
            {day}
          </div>
        ))}
      </div>
    </section>
  );
}