import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './style/BarChart.css'; // Add CSS file for custom styles

// Register necessary chart components and plugins
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const BarChart = ({profile}) => {
  let win = profile.wins;
  let los = profile.loss;
  const data = {
    labels: ['Win', 'Loss'], // Categories for each bar
    datasets: [
      {
        label: 'Win/Loss Streak',
        data: [win, los], // Win and Loss values
        backgroundColor: ['#300863', '#000000'], // Customize bar colors
        borderRadius: 5, // Rounded corners for bars
        barThickness: 60, // Adjust bar thickness
        
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Horizontal bars
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false, // Disable x-axis grid lines
        },
      },
      y: {
        grid: {
          display: false, // Disable y-axis grid lines
        },
        ticks: {
          padding: 10, // Add some padding for y-axis labels
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend (since it's custom in this design)
      },
      tooltip: {
        enabled: true, // Enable tooltips for interactivity
      },
      datalabels: {
        anchor: 'center',
        align: 'center',
        color: 'white', // Color of the labels
        font: {
          size: 14, // Font size for labels
          weight: 'bold',
        },
        formatter: (value) => value, // Display the value inside the bar
      },
    },
  };

  return (
    <div className="bar-chart-container">
      <h2 className="chart-title">Win/Loss Streak</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
