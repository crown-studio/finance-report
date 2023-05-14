import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";
import { countValueOf, countValueOfByGroup } from "../../utils/dataUtils";

function PieChart({ chartData }) {
  const options = {
    chart: {
      type: "donut",
    },

    labels: Object.keys(chartData),
    series: countValueOfByGroup(Object.values(chartData)),
  };

  return (
    <Card>
      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title>Despesas por categoria</Card.Title>
        <Chart options={options} series={options.series} type={options.chart.type} />
      </Card.Body>
    </Card>
  );
}

export default PieChart;
