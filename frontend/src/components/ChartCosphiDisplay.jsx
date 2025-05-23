import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartCosphiDisplay() {
  const [dataPoints, setDataPoints]           = useState([]);
  const [initialLoading, setInitialLoading]   = useState(true);
  const [waitingTimeout, setWaitingTimeout]   = useState(false);
  const timerRef                              = useRef(null);

  const fetchAndSet = async () => {
    setWaitingTimeout(false);

    try {
      const res = await api.get('/data', { timeout: 30000 });
      const parsed = res.data.map(d => ({
        time:   d.time,
        cosphi: parseFloat(d.cosphi.toString().replace(',', '.')) || 0
      }));
      setDataPoints(parsed);

      if (initialLoading) {
        setInitialLoading(false);
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setWaitingTimeout(true);
        console.warn('Request timeout, menunggu data berikutnya…');
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchAndSet();
    timerRef.current = setInterval(fetchAndSet, 25000);
    return () => clearInterval(timerRef.current);
  }, []);

  const latestCosphi = dataPoints.length ? dataPoints[dataPoints.length - 1].cosphi : null;
  
  const chartData = {
    labels: dataPoints.map(d =>
      new Date(d.time).toLocaleTimeString('en-GB', {
        hour:   '2-digit',
        minute: '2-digit'
      })
    ),
    datasets: [{
      label: 'Power Factor (cosphi)',
      data: dataPoints.map(d => d.cosphi),
      fill: true,
      borderColor: 'rgba(245, 158, 11,1)',
      borderWidth: 3.5,
      backgroundColor: 'rgba(245, 158, 11,0.1)',
      pointStyle: 'circle',
      pointRadius: 2.5,
      pointHoverRadius: 4.5,
      pointBackgroundColor: 'rgba(245, 158, 11,1)',
    }],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    animation: false,
    interaction: {
      mode: 'index',
      intersect: false,
      axis: 'x',
    },
    plugins: {
      title: {
        display: true,
        text: 'Power Factor (cosphi)',
      },
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(31,41,55,0.8)',
        titleColor: 'rgba(249, 250, 251, 1)',
        bodyColor: 'rgba(249, 250, 251, 1)',
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Time' },
        grid: {
          color: 'rgba(229, 231, 235, 0.3)',
          lineWidth: 2,
          display: false,
        },
        ticks: {
          color: 'rgba(75, 85, 99)',
          font: {
            size: 10,
            weight: 'bold',
          },
          autoskip: true,
          maxTicksLimit: 10,
        }
      },
      y: {
        title: { display: true, text: 'cosphi' },
        grid: {
          color: 'rgba(229, 231, 235, 0.3)',
          lineWidth: 2,
        },
        ticks: {
          color: 'rgba(75, 85, 99)',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      }
    }
  };

  return (
    <div className="w-full h-64 p-4 bg-white relative">
      {latestCosphi != null && (
        <div className="absolute top-3 right-4 flex items-baseline space-x-2">
          <span className="p-1 rounded-xl text-xl font-semibold bg-amber-100 text-amber-600">
            {latestCosphi.toFixed(2)}
          </span>
        </div>
      )}
      {(initialLoading || waitingTimeout) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <span className="text-gray-600">
            {initialLoading ? 'Memuat data…' : 'Timeout, menunggu…'}
          </span>
        </div>
      )}
      <div className="w-full h-full mt-2">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
