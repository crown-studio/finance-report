// export const removeDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) === index);

export const removeDuplicates = <T>(arr: T[]): T[] => {
	return arr.filter((item, index) => arr.indexOf(item) === index);
};
