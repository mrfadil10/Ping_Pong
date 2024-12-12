import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const ScoreGraph = ({ gameData, labels }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: 'Score-XP',
        data: gameData, // Vos données de score ici
        borderColor: '#360A71',
        backgroundColor: '#370a715c',
        tension: 0.4,
        pointRadius: 14,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#000',
        pointHoverRadius: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#00000025',
        },
        ticks: {
          color: '#000',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#000',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#000',
          font: {
            size: 18,
          },
        },
      },
    },
  };

  return (
    <div style={{ 
      backgroundColor: '#F4F5FA', 
      padding: '20px',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      boxShadow: '1px 3px 5px rgba(0, 0, 0, 0.3)',
      borderRadius: '10px',
    }}>
      <Line data={data} options={options} />
    </div>
  );
};

// Exemple d'utilisation:
const App = ({profile}) => {
  const sampleData = Array.isArray(profile.score_table) ? profile.score_table : [profile.score_table];
  const labels = sampleData.map((_, index) => `${index + 1}`);

  // const sampleData = [0, '90', 70, 130, 100, 150];
  // const labels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun'];

  return (
    <div>
      <ScoreGraph gameData={sampleData} labels={labels} />
    </div>
  );
};

export default App;