import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './style/DonutChart.css'; // Import the external CSS file

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({profile}) => {
  const wins = profile.wins;
  const loss = profile.loss;
  const total = wins + loss;
  let winRate = ((wins / total) * 100).toFixed(2);
  let lossRate = ((loss / total) * 100).toFixed(2);
  if (wins == 0 && loss ==  0)
	{
		winRate = 50;
		lossRate = 50; 
	}
  const data = {
    labels: ['Loss Rate', 'Win Rate'],
    datasets: [
      {
        label: 'Win/Loss Ratio',
        data: [winRate, lossRate], // 80% win, 20% loss
        backgroundColor: ['#300863', '#DDD6E7'], // Colors for win and loss
        hoverBackgroundColor: ['#d1b3ff', '#d1b3ff'], // Hover colors for win and loss
        borderWidth: 0, // No border
      },
    ],
  };

  const options = {
    cutout: '50%', // Cutout for the donut shape
    responsive: true,
    plugins: {
      legend: {
        display: false, // Disable default legend
      },
      tooltip: {
        enabled: false, // Disable tooltips for better control
      },
    },
    layout: {
      padding: {
        top: 0,
        bottom: 0,
      },
    },
  };

  // Custom HTML for displaying text inside the chart
  const renderCenterText = () => (
    <div className="center-text">
      <p className="percentage-text">{parseInt(winRate)}%</p>
    </div>
  );

  return (
    <div className="donut-chart-container">

      <div className="chart-container">
        {renderCenterText()}
        <div className="cercle"><Doughnut data={data} options={options} /></div>
      </div>

      <div className="legend-container">

        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: '#300863' }} />
          <span className="legend-text">Win Rate</span>
          <span className="legend-value">{winRate}%</span>
        </div>

        <div className="legend-item ">
          <div className="color-box" style={{ backgroundColor: '#b19cd9' }} />
          <span className="legend-text">Loss Rate</span>
          <span className="legend-value">{lossRate}%</span>
        </div>

      </div>
    </div>
  );
};

export default DonutChart;
