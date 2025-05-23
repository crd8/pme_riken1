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
      const res = await api.get('/data');
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
    labels: dataPoints.map(d =>
      new Date(d.time).toLocaleTimeString('en-GB', {
        hour:   '2-digit',
        minute: '2-digit'
      })
    ),
    datasets: [{
      label: 'Voltage LL (V)',
      data: dataPoints.map(d => d.voltLL),
      fill: true,
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 3.5,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      pointStyle: 'circle',
      pointRadius: 2.5,
      pointHoverRadius: 4.5,
      pointBackgroundColor: 'rgba(59, 130, 246)',
    }],
  };

  const options = {
    type: 'line',
    maintainAspectRatio: false,
    responsive: true,
    animation: false,
    interaction: {
      mode: 'index',
      intersect: false,
      axis: 'x',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        titleColor: 'rgba(249, 250, 251, 1)',
        bodyColor: 'rgba(249, 250, 251, 1)',
      },
    },
    scales: {
      x: { 
        title: { 
          display: true,
          text: 'Time',
        },
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
        },
      },
      y: {
        title: { display: true, text: 'Voltage (V)' },
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
    <div className="w-full h-64 bg-white">
      <Line data={chartData} options={options} />
    </div>
  );

}
