export const countValueOf = (dataArr: { valor: string; encargos?: string | number }[], decimals?: number): number => {
	return Number(
		dataArr.reduce((total, { valor, encargos }) => total + (Number(valor) + Number(encargos || 0)), 0).toFixed(decimals || 2),
	);
};

export const countValueOfByGroup = (dataArr: { valor: string; encargos?: string }[][], decimals?: number): number[] => {
	return dataArr.map(entries => countValueOf(entries, decimals));
};
