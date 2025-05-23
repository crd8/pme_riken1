import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function DataTable() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/data-table', { params: { date } });
        setRows(res.data);
      } catch (err) {
        console.error('Fetch data-table error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [date]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Data Realtime</h2>
        <input
          type="date"
          className="border rounded p-2 text-sm"
          value={date}
          max={today}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Memuat data…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {[
                  'Time','voltLL','currentLL','freq',
                  'kwh','kvar','kva','cosphi',
                  'vr','vs','vt','ir','is','it'
                ].map(col => (
                  <th key={col}
                      className="px-3 py-2 text-xs font-medium text-start text-gray-600 uppercase">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan="15" className="py-4 text-center text-gray-500">
                    Tidak ada data untuk {date}.
                  </td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-sm whitespace-nowrap">
                    {new Date(r.time).toLocaleTimeString('en-GB')}
                  </td>
                  <td className="px-3 py-2 text-sm text-blue-600">{r.voltLL}</td>
                  <td className="px-3 py-2 text-sm text-green-600">{r.currentLL}</td>
                  <td className="px-3 py-2 text-sm">{r.freq}</td>
                  <td className="px-3 py-2 text-sm text-green-500">{r.kwh}</td>
                  <td className="px-3 py-2 text-sm">{r.kvar}</td>
                  <td className="px-3 py-2 text-sm">{r.kva}</td>
                  <td className="px-3 py-2 text-sm text-amber-600">{r.cosphi}</td>
                  <td className="px-3 py-2 text-sm">{r.vr}</td>
                  <td className="px-3 py-2 text-sm">{r.vs}</td>
                  <td className="px-3 py-2 text-sm">{r.vt}</td>
                  <td className="px-3 py-2 text-sm">{r.ir}</td>
                  <td className="px-3 py-2 text-sm">{r.is}</td>
                  <td className="px-3 py-2 text-sm">{r.it}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
