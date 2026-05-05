"use client";

import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarSkillChart = ({ scores }) => {
  // Handle undefined or null scores
  if (!scores) return null;

  const data = {
    labels: [
      "Communication",
      "Leadership",
      "Technical",
      "Domain Knowledge",
      "Problem Solving",
    ],
    datasets: [
      {
        label: "Skill Analysis",
        data: [
          scores.communication || 0,
          scores.leadership || 0,
          scores.technical || 0,
          scores.domain || 0,
          scores.problemSolving || 0,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        pointBackgroundColor: "#3b82f6",
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          backdropColor: "transparent",
        },
        pointLabels: {
          color: "#374151",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="w-full flex justify-center items-center">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarSkillChart;
