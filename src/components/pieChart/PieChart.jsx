import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { countValueOf, countValueOfByGroup } from '../../utils/dataUtils';
import { Container, Text } from '@chakra-ui/layout';
import { colorContrast, getColorsByCategory } from '../../utils/colorUtils';
import { formatCurrency } from '../../utils/currencyUtils';
import { COLORS } from '../../theme/colors';

// import { IDespesa } from '../../types/IDespesa';
// import { IReceita } from '../../types/IReceita';

// export interface IPieChartProps {
// 	chartData: Record<string, IDespesa | IReceita>[];
// }

function PieChart({ chartData, title }) {
	const sortedDataEntries = Object.entries(chartData).sort(([, valuesA], [, valuesB]) => {
		const valueA = countValueOf(valuesA);
		const valueB = countValueOf(valuesB);
		return valueB - valueA;
	});

	const sortedChartData = Object.fromEntries(sortedDataEntries);

	const options = {
		chart: {
			type: 'donut',
			fontFamily: 'Poppins',
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: '22px',
							fontWeight: 600,
							offsetY: -10,
						},
						value: {
							show: true,
							fontSize: '16px',
							fontWeight: 600,
							color: COLORS.TEXT_COLOR_DARK,
							offsetY: 16,
							formatter: function (val, w) {
								return formatCurrency(+val);
							},
						},
						total: {
							show: true,
							label: 'Total',
							fontSize: '22px',
							fontWeight: 600,
							color: COLORS.MEDIUM_SHADES_GRAY,
							formatter: function (w) {
								return formatCurrency(
									w.globals.seriesTotals.reduce((a, b) => {
										return a + b;
									}, 0),
								);
							},
						},
					},
				},
			},
		},
		states: {
			// normal: {
			// 	filter: {
			// 		type: 'none',
			// 		value: 0,
			// 	},
			// },
			hover: {
				filter: {
					type: 'lighten',
					value: 0.01,
				},
			},
			active: {
				allowMultipleDataPointsSelection: true,
				filter: {
					type: 'none',
					value: 0,
				},
			},
		},
		// labels: Object.entries(sortedChartData).map(([label, values]) => {
		// 	return `${label} ${formatCurrency(countValueOf(values))}`;
		// }),
		labels: Object.keys(sortedChartData),
		// .map(label => `<span tabindex="0">${label}</span>`),
		legend: {
			fontSize: '16px',
			formatter: function (seriesName, opts) {
				return `<span tabindex="0">${seriesName}: ${formatCurrency(opts.w.globals.series[opts.seriesIndex])}</span>`;
				// return [`${seriesName}:`, `<strong>${formatCurrency(opts.w.globals.series[opts.seriesIndex])}</strong> `];
			},
		},
		series: countValueOfByGroup(Object.values(sortedChartData)),
		colors: [...getColorsByCategory(Object.keys(sortedChartData))],
		stroke: {
			show: false,
			// curve: 'straight',
			// lineCap: 'butt',
			// colors: undefined,
			// width: 2,
			// dashArray: 0,
		},
		tooltip: {
			// custom: function ({ series, seriesIndex }) {
			// 	const value = formatCurrency(series[seriesIndex]);
			// 	return `<div class='custom-tooltip'>${value}</div>`;
			// },
			// followCursor: true,
			style: {
				fontSize: '16px',
			},

			y: {
				formatter: function (value, opts) {
					const color = opts.globals.colors[opts.seriesIndex];
					const contrastColor = colorContrast(color);
					return `<span style='color: ${contrastColor}'>${formatCurrency(value)}</span>`;
				},
				title: {
					formatter: function (seriesName, opts) {
						const color = opts.w.globals.colors[opts.seriesIndex];
						const contrastColor = colorContrast(color);
						return `<span style='color: ${contrastColor}'>${seriesName}:</span>`;
					},
				},
			},
			// theme: {
			// 	mode: 'dark',
			// },
		},
	};

	return (
		<Container flexGrow={1} maxW={{ base: '100%', lg: '75%', xl: '65%', '2xl': '55%' }} py={8}>
			{title && (
				<Text as={'h4'} mb={0}>
					{title}
				</Text>
			)}
			<Chart
				options={options}
				series={options.series}
				type={options.chart.type}
				onFocus={e => e.target.parentElement.click()}
			/>
		</Container>
	);
}

export default PieChart;
