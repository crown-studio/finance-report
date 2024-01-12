export const groupBy = <T>(arr: T[], property: keyof T, transform: (p: unknown) => unknown = p => p): Record<string, T[]> => {
	return arr.reduce((result: Record<string, T[]>, obj: T) => {
		const key = transform(obj[property]) as keyof typeof result;
		if (!result[key]) result[key] = [];
		result[key].push(obj);
		return result;
	}, {});
};
