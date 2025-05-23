import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function UsageTable() {
  const today     = new Date().toISOString().slice(0, 10);
  const thisMonth = today.slice(0, 7);

  const [date, setDate]   = useState(today);
  const [month, setMonth] = useState(thisMonth);

  const [hourly, setHourly] = useState([]);
  const [daily, setDaily]   = useState([]);

  useEffect(() => {
    const fetchHourly = async () => {
      try {
        const res = await api.get('/usage/hourly', { params: { date } });
        const filled = Array.from({ length: 24 }, (_, h) => {
          const found = res.data.find(r => r.hour === h);
          return { hour: h, usage: found ? found.usage : 0 };
        });
        setHourly(filled);
      } catch (err) {
        console.error('Error fetching hourly usage', err);
      }
    };
    fetchHourly();
  }, [date]);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const res = await api.get('/usage/daily', { params: { month } });
        const [year, mon] = month.split('-').map(Number);
        const daysInMonth = new Date(year, mon, 0).getDate();
        const filled = Array.from({ length: daysInMonth }, (_, idx) => {
          const day = idx + 1;
          const dateStr = `${month}-${String(day).padStart(2, '0')}`;
          const found = res.data.find(r => r.date === dateStr);
          return { date: dateStr, usage: found ? found.usage : 0 };
        });
        setDaily(filled);
      } catch (err) {
        console.error('Error fetching daily usage', err);
      }
    };
    fetchDaily();
  }, [month]);

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Pemakaian kWh per Jam ({date})
          </h2>
          <input
            type="date"
            className="border rounded p-2"
            value={date}
            max={today}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Jam</th>
                <th className="px-4 py-2 text-right">kWh</th>
              </tr>
            </thead>
            <tbody>
              {hourly.map(({ hour, usage }) => (
                <tr key={hour} className={hour % 2 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2">{hour}:00</td>
                  <td className="px-4 py-2 text-right">{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Pemakaian kWh per Hari ({month})
          </h2>
          <input
            type="month"
            className="border rounded p-2"
            value={month}
            max={thisMonth}
            onChange={e => setMonth(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-right">kWh</th>
              </tr>
            </thead>
            <tbody>
              {daily.map(({ date: d, usage }) => (
                <tr
                  key={d}
                  className={Number(d.slice(-2)) % 2 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="px-4 py-2">{d}</td>
                  <td className="px-4 py-2 text-right">{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
