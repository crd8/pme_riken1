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

export default function ChartDisplay() {
  const [dataPoints, setDataPoints] = useState([]);
  const lastTimeRef = useRef(0);

  useEffect(() => {
  const timer = setInterval(async () => {
    try {
      const res = await api.get('');
      if (res.data.length) {
        setDataPoints(res.data);
        lastTimeRef.current = new Date(res.data.slice(-1)[0].time).getTime();
      }
    } catch (err) {
      console.error(err);
    }
  }, 2000);
  return () => clearInterval(timer);
}, []);


  const chartData = {
    labels: dataPoints.map(d => new Date(d.time).toLocaleTimeString()),
    datasets: [{
      label: 'Current LL (A)',
      data: dataPoints.map(d => d.currentLL),
      fill: true,
      tension: 0.1,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      pointStyle: 'circle',
      pointRadius: 4,
      pointHoverRadius: 8,
    }],
  };

  const options = {
    type: 'line',
    responsive: true,
    animation: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Realtime Current LL Monitoring' },
      tooltip: {
        backgroundColor: 'rgba(53, 229, 235, 0.8)',
      }
    },
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: {
        title: { display: true, text: 'Current (A)' },
        beginAtZero: true
      }
    }
  };

  return <Line data={chartData} options={options} />;
}
