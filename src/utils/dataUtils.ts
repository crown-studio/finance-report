export const countValueOf = (dataArr: { valor: string }[], decimals?: number): number => {
	return Number(dataArr.reduce((total, { valor }) => total + Number(valor), 0).toFixed(decimals || 2));
};

export const countValueOfByGroup = (dataArr: { valor: string }[][], decimals?: number): number[] => {
	return dataArr.map(entries => countValueOf(entries, decimals));
};
