import { useState, useEffect, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, addDays, isSameMonth, isSameDay, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Efek untuk memperbarui jam setiap detik
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = useMemo(() => {
    const dayArray = [];
    let day = startDate;
    while (day <= endDate) {
      dayArray.push(day);
      day = addDays(day, 1);
    }
    return dayArray;
  }, [startDate, endDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-2 sm:p-6 bg-slate-900 text-white min-h-screen">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
        {/* Header Kalender */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-md hover:bg-slate-700 transition-colors duration-200"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-md hover:bg-slate-700 transition-colors duration-200"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-200"
            >
              Today
            </button>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-3xl font-mono text-teal-400">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className="text-sm text-slate-400">
              {format(currentTime, 'eeee, d MMMM yyyy')}
            </div>
          </div>
        </div>

        {/* Grid Kalender */}
        <div className="grid grid-cols-7">
          {/* Nama Hari */}
          {dayNames.map(dayName => (
            <div key={dayName} className="text-center py-3 text-xs font-bold uppercase text-slate-400 border-b border-r border-slate-700">
              {dayName}
            </div>
          ))}

          {/* Tanggal */}
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const isWeekend = getDay(day) === 0 || getDay(day) === 6;

            // Menentukan kelas CSS berdasarkan kondisi
            const dayClasses = [
              "relative p-2 h-24 sm:h-32 border-b border-r border-slate-700 transition-colors duration-200",
              isCurrentMonth ? "bg-slate-800/30" : "bg-slate-900/50 text-slate-500",
              !isCurrentMonth && "pointer-events-none",
              isCurrentMonth && !isToday && "hover:bg-slate-700/50",
              isWeekend && isCurrentMonth && "bg-slate-800/60",
            ].filter(Boolean).join(" ");

            const dateNumberClasses = [
              "absolute top-2 right-2 flex items-center justify-center text-sm w-7 h-7 rounded-full",
              isToday && "bg-teal-500 text-white font-bold shadow-lg",
              !isToday && isCurrentMonth && "text-slate-300",
              !isToday && !isCurrentMonth && "text-slate-600",
            ].filter(Boolean).join(" ");

            return (
              <div
                key={day.toString()}
                className={dayClasses}
                style={{
                  // Menghilangkan border kanan untuk kolom terakhir
                  borderRightWidth: (index + 1) % 7 === 0 ? 0 : '1px',
                }}
              >
                <div className={dateNumberClasses}>
                  {format(day, 'd')}
                </div>
                {/* Area ini bisa diisi dengan event kalender */}
                <div className="mt-8 text-xs">
                  {/* Contoh event */}
                  {isToday && (
                    <div className="flex items-center gap-1.5 bg-teal-500/20 text-teal-300 p-1 rounded-md">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                      <span className="font-semibold">Today</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;