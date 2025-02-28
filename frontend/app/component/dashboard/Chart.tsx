// /components/UserGrowthChart.tsx
import React from "react";
import { Line } from "react-chartjs-2";

const UserGrowthChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "User Growth",
        data: [10, 30, 50, 80, 120],
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
};

export default UserGrowthChart;
