// export const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const capitalizeFirstLetter = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const hasText = (text: string | undefined | null): text is string => {
	if (!text || !text.length) {
		return false;
	}
	return text.trim().length > 0;
};

export const normalize = (str: string): string =>
	str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
