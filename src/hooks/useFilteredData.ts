import { useMemo } from 'react';
import chartData from '../data/database.json';

export const useFilteredData = () => {
	const despesas = useMemo(
		() => chartData.filter(({ valor }) => valor <= 0).map(({ valor, ...rest }) => ({ ...rest, valor: valor * -1 })),
		[chartData],
	);

	const receitas = useMemo(() => chartData.filter(({ valor }) => valor > 0), [chartData]);

	return {
		receitas,
		despesas,
	};
};
