import { IDespesa } from '../types/IDespesa';
import { removeDuplicates } from './arrayUtils';
import { getDeepCopy, groupBy } from './objectUtils';
import { normalize } from './stringUtils';

export const countValueOf = (dataArr: { valor: string; encargos?: string | number }[], decimals?: number): number => {
	return Number(
		dataArr.reduce((total, { valor, encargos }) => total + (Number(valor) + Number(encargos || 0)), 0).toFixed(decimals || 2),
	);
};

export const countValueOfByGroup = (dataArr: { valor: string; encargos?: string }[][], decimals?: number): number[] => {
	return dataArr.map(entries => countValueOf(entries, decimals));
};

export const mergeDuplicatesByProps = <T>(data: T[], props: (keyof T)[]): T[] => {
	const copyData = getDeepCopy(data);
	const mergedData: T[] = [];

	for (const object of copyData) {
		const similar: T | undefined = mergedData.find(mergedObj => props.every(prop => mergedObj[prop] === object[prop]));

		if (similar) {
			for (const [key, prev] of Object.entries(similar)) {
				const curr = object[key as keyof T];
				if (typeof curr === 'string')
					similar[key as keyof T] = (
						(prev as string).includes(curr) ? prev : `${prev} | ${curr}`
					) as NonNullable<T>[keyof T];
				if (typeof curr === 'number') similar[key as keyof T] = ((prev as number) + curr) as NonNullable<T>[keyof T];
				if (typeof curr === 'boolean') similar[key as keyof T] = (prev && curr) as NonNullable<T>[keyof T];
			}
		} else {
			mergedData.push(object);
		}
	}
	return mergedData;
};

export const groupExpensesByCategory = (expenses: IDespesa[], categories?: string[]) => {
	const groups = categories ? categories : removeDuplicates(expenses.map(({ categoria }) => categoria));
	const data = groups.map(category =>
		expenses
			.filter(({ categoria }) => categoria === category)
			.reduce(
				({ id, valor, ...tv }, cv) => ({
					...tv,
					valor: Number(valor) + Number(cv.valor),
					id: id ? `${id} | ${cv.id}` : cv.id,
					// subcategoria: removeDuplicates(
					// 	(subcategoria ? `${subcategoria} | ${cv.subcategoria}` : cv.subcategoria).split(' | '),
					// ).join(' | '),
					// observacoes:
					// 	observacoes && cv.observacoes ? `${observacoes}, ${cv.observacoes}` : cv?.observacoes || observacoes,
				}),
				{
					descricao: `Gastos com ${category}`,
					valor: 0,
					observacoes: 'Despesas agrupadas',
					categoria: category,
					subcategoria: '...',
					id: '',
				},
			),
	);

	return data;
};

export const groupExpensesBySubcategory = (expenses: IDespesa[], subcategories?: string[]) => {
	const groups = subcategories ? subcategories : removeDuplicates(expenses.map(({ subcategoria }) => subcategoria));
	const data = groups.map(subcategory =>
		expenses
			.filter(({ subcategoria }) => subcategoria === subcategory)
			.reduce(
				({ id, valor, categoria, ...tv }, cv) => ({
					...tv,
					valor: Number(valor) + Number(cv.valor),
					id: id ? `${id} | ${cv.id}` : cv.id,
					categoria: categoria || cv.categoria,
					// subcategoria: removeDuplicates(
					// 	(subcategoria ? `${subcategoria} | ${cv.subcategoria}` : cv.subcategoria).split(' | '),
					// ).join(' | '),
					// observacoes:
					// 	observacoes && cv.observacoes ? `${observacoes}, ${cv.observacoes}` : cv?.observacoes || observacoes,
				}),
				{
					descricao: `Gastos com ${subcategory}`,
					valor: 0,
					observacoes: 'Despesas agrupadas',
					categoria: '',
					subcategoria: subcategory,
					id: '',
				},
			),
	);

	return Object.values(groupBy(data, 'categoria'))?.flat();
};

export const removeDistinctByProps = <T>(arr: T[], props: Array<keyof T>): T[] => {
	return arr.filter((item, index) => arr.findIndex(obj => props.every(prop => obj[prop] === item[prop])) !== index);
};

export interface ISearchOptions {
	partial?: boolean;
	deep?: boolean;
}

export const searchCompare = (content: string, query: string, options?: ISearchOptions) => {
	const { partial = true, deep = false } = options || {};
	const isDeepSearch = deep || query.includes('**');
	const A = normalize(isDeepSearch ? content : removeSensitiveData(content));
	const B = normalize(isDeepSearch ? getAdvancedQuery(query) : query);
	if (partial) return A.includes(B); // || B.includes(A);
	return A === B;
};

export const getAdvancedQuery = (query: string) => {
	return query.replace(/\*\*(.*?)\*\*/g, '$1').trim();
};

export const removeSensitiveData = (data: string, hashtags?: string[]) => {
	const clearData = data?.replace(/\*\*(.*?)\*\*/g, '');
	if (!hashtags) return clearData;
	return hashtags.reduce((content, tag) => content.replace(new RegExp(`#${tag}`, 'g'), ''), clearData);
};

export const highlightHashtags = (data: string | undefined) => {
	return data?.replace(/#\S+/g, '<span class="custom-tags">$&</span>');
};
