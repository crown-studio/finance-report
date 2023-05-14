import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card } from "react-bootstrap";
import { countValueOfByGroup } from "../../utils/dataUtils";

const LineChart = ({ title, chartData, xaxisTitle, yaxisTitle }) => {
  const options = {
    chart: {
      id: "basic-line",
      type: "line",
    },
    xaxis: {
      categories: Object.keys(chartData),
      title: {
        text: xaxisTitle || "Eixo X",
      },
    },
    yaxis: {
      title: {
        text: yaxisTitle || "Eixo Y",
      },
    },
  };

  const series = [
    {
      name: title || "Título",
      data: countValueOfByGroup(Object.values(chartData)),
    },
  ];

  return (
    <Card>
      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title>Evolução das despesas</Card.Title>
        {/* <Card.Text>Essa é a descrição do gráfico a seguir...</Card.Text> */}
        <ReactApexChart options={options} series={series} type={options.chart.type} />
      </Card.Body>
    </Card>
  );
};

export default LineChart;
