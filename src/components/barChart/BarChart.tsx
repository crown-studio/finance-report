import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card } from 'react-bootstrap';
import { removeDuplicates } from '../../utils/arrayUtils';
import { countValueOf, countValueOfByGroup } from '../../utils/dataUtils';
import { getMonthName } from '../../utils/dateUtils';
import { groupBy } from '../../utils/objectUtils';
import { capitalizeFirstLetter } from '../../utils/stringUtils.js';
import './BarChart.scss';
import { IReceita } from '../../types/IReceita';
import { IDespesa } from '../../types/IDespesa';

interface IBarchartProps {
	chartData: { receitas: IReceita[]; despesas: IDespesa[] };
	title?: string;
	xaxisTitle?: string;
	yaxisTitle?: string;
}

const BarChart = ({ chartData, title, xaxisTitle, yaxisTitle }: IBarchartProps) => {
	const options: ApexCharts.ApexOptions = {
		chart: {
			type: 'bar',
			height: 350,
		},
		xaxis: {
			categories: removeDuplicates(
				Object.keys(groupBy([...chartData.receitas, ...chartData.despesas], 'pagamento')).map(date =>
					getMonthName(date, 'MMM'),
				),
			).map(label => capitalizeFirstLetter(label)),
		},
		yaxis: {
			title: {
				text: '$ (thousands)',
			},
		},
		colors: ['#4E4', '#F55'],
		fill: {
			opacity: 1,
		},
		tooltip: {
			y: {
				formatter: function (val: string | number) {
					return '$ ' + val + ' thousands';
				},
			},
		},
	};

	const series = [
		{
			name: 'Receitas',
			data: countValueOfByGroup(
				Object.values(
					groupBy(chartData.receitas as unknown as { valor: string; pagamento: string }[], 'pagamento', prop =>
						getMonthName(prop as string, 'MMM'),
					),
				),
			),
		},
		{
			name: 'Despesas',
			data: countValueOfByGroup(
				Object.values(
					groupBy(chartData.despesas as unknown as { valor: string; pagamento: string }[], 'pagamento', prop =>
						getMonthName(prop as string, 'MMM'),
					),
				),
			),
		},
	];

	return (
		<Card className="BarChart" style={{ height: '84vh', width: '60%' }}>
			<Card.Body className="d-flex flex-column justify-content-between">
				<Card.Title>Receitas x Despesas</Card.Title>
				<ReactApexChart options={options} series={series} type={options.chart?.type} />
			</Card.Body>
		</Card>
	);
};

export default BarChart;
