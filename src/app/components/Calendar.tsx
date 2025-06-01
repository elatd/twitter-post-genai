'use client';
import { useState } from 'react';

interface TweetItem {
  content: string;
  date: string;
}

interface CalendarProps {
  tweets: TweetItem[];
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ tweets }: CalendarProps) {
  const [current, setCurrent] = useState(() => new Date());

  const startOfMonth = new Date(current.getFullYear(), current.getMonth(), 1);
  const endOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const firstDayIndex = startOfMonth.getDay();

  const events: Record<number, TweetItem[]> = {};
  tweets.forEach((t) => {
    const d = new Date(t.date);
    if (d.getFullYear() === current.getFullYear() && d.getMonth() === current.getMonth()) {
      const day = d.getDate();
      if (!events[day]) events[day] = [];
      events[day].push(t);
    }
  });

  const cells = [] as JSX.Element[];
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(<div key={'e' + i} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = events[day] || [];
    cells.push(
      <div key={day} className="border border-gray-700 p-1 min-h-[80px] text-xs">
        <div className="text-gray-400 text-right">{day}</div>
        {dayEvents.map((evt, idx) => (
          <div key={idx} className="text-gray-100 break-words">
            {evt.content}
          </div>
        ))}
      </div>
    );
  }

  const prevMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <button onClick={prevMonth} className="px-2 py-1 bg-gray-800 rounded">Prev</button>
        <div className="text-lg font-semibold">
          {current.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={nextMonth} className="px-2 py-1 bg-gray-800 rounded">Next</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1 text-center text-sm text-gray-300">
        {dayNames.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    </div>
  );
}
