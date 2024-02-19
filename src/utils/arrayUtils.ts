// export const removeDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) === index);

export const removeDuplicates = <T>(arr: T[]): T[] => {
	return arr.filter((item, index) => arr.indexOf(item) === index);
};

export const removeDuplicatesByProps = <T>(arr: T[], props: (keyof T)[]): T[] => {
	return arr.filter((item, index) => arr.findIndex(obj => props.every(prop => obj[prop] === item[prop])) === index);
};
