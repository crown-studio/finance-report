import { groupBy } from './objectUtils';

export const countValueOf = (dataArr: { valor: string; encargos?: string | number }[], decimals?: number): number => {
	return Number(
		dataArr.reduce((total, { valor, encargos }) => total + (Number(valor) + Number(encargos || 0)), 0).toFixed(decimals || 2),
	);
};

export const countValueOfByGroup = (dataArr: { valor: string; encargos?: string }[][], decimals?: number): number[] => {
	return dataArr.map(entries => countValueOf(entries, decimals));
};

export const mergeByProps = <T>(data: T[], props: (keyof T)[]): T[] => {
	const dataGrouped = groupBy(data, 'descricao' as keyof T);

	const dataMerged = Object.values(dataGrouped).map(items => {
		if (items.length > 1)
			return items.reduce((acc, crr, index) => {
				if (index === 0) return crr;
				const result = {} as T;
				Object.entries(acc as ArrayLike<T>).forEach(([key, value]) => {
					// Object.entries(acc as ArrayLike<T>).forEach(([key, value]: [keyof T, T]) => {
					if (typeof crr[key as keyof T] === 'string')
						result[key as keyof T] = (
							crr[key as keyof T] === value ? value : `${acc[key as keyof T]} | ${value}`
						) as T[keyof T];
					if (typeof crr[key as keyof T] === 'number')
						result[key as keyof T] = (+acc[key as keyof T] + +value) as T[keyof T];
					if (typeof crr[key as keyof T] === 'boolean')
						result[key as keyof T] = (acc[key as keyof T] && value) as T[keyof T];
				});
				return result;
			}, {} as T);
		return items[0];
	});

	return dataMerged;
};
