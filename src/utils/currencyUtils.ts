export const currencyParseFloat = (value: string): number => {
	return parseFloat(value.replace(/[\.\s]/g, '').replace(',', '.'));
};
