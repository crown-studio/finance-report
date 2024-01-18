export const currencyParseFloat = (value: string): number => {
	return parseFloat(value.replace(/[\.\s]/g, '').replace(',', '.'));
};

export const formatCurrency = (value: string | number, options?: Intl.NumberFormatOptions) => {
	const defaultOptions = {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	};

	return value.toLocaleString('pt-BR', options || defaultOptions);
};
