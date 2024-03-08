import { useCallback, useMemo, useState } from 'react';
import database from '../data/database.json';
import { getParsedDate } from '../utils/dateUtils';
import { countValueOf, searchCompare } from '../utils/dataUtils';
import { isBefore, isSameMonth } from 'date-fns';

export const useData = (selectedMonth: string, selectedYear: string) => {
	const INITIAL_VALUE = 42250.89;
	const currentDate = useMemo(() => getParsedDate(`01/${selectedMonth}/${selectedYear}`), [selectedMonth, selectedYear]);

	const previousAmount = useMemo(
		() => database.filter(({ pagamento }) => isBefore(getParsedDate(pagamento), currentDate)),
		[database, currentDate],
	);

	const previousBalance = useMemo(() => INITIAL_VALUE + countValueOf(previousAmount), [INITIAL_VALUE, previousAmount]);

	const initData = useMemo(
		() => database.filter(({ pagamento }) => isSameMonth(getParsedDate(pagamento), currentDate)),
		[database, currentDate],
	);

	const [filteredData, setFilteredData] = useState<typeof database | null>(null);

	const currentData = useMemo(() => filteredData || initData, [filteredData, initData]);

	const expenses = useMemo(
		() =>
			currentData
				.filter(({ valor }) => valor <= 0)
				.map(({ valor, encargos, ...rest }) => ({ ...rest, valor: valor * -1, encargos: encargos * -1 })),
		[currentData],
	);

	const revenues = useMemo(() => currentData.filter(({ valor }) => valor > 0), [currentData]);

	const tithes = useMemo(() => revenues.filter(({ categoria }) => categoria === 'Dízimo'), [revenues]);

	const personalOffering = useMemo(
		() => revenues.filter(({ categoria, subcategoria }) => categoria === 'Oferta' && subcategoria === 'Pessoal'),
		[revenues],
	);

	const missionOffering = useMemo(
		() => revenues.filter(({ categoria, subcategoria }) => categoria === 'Oferta' && subcategoria === 'Missões'),
		[revenues],
	);

	const EBDOffering = useMemo(
		() => revenues.filter(({ categoria, subcategoria }) => categoria === 'Oferta' && subcategoria === 'EBD'),
		[revenues],
	);

	const interest = useMemo(
		() => revenues.filter(({ categoria, subcategoria }) => categoria === 'Juros' && subcategoria === 'Outros'),
		[revenues],
	);

	const results = useMemo(
		() => ({
			value: countValueOf(revenues) - countValueOf(expenses),
			percent: ((countValueOf(revenues) - countValueOf(expenses)) / countValueOf(revenues)) * 100,
		}),
		[revenues, expenses],
	);

	const balance = useMemo(
		() => previousBalance + countValueOf(revenues) - countValueOf(expenses),
		[expenses, revenues, previousBalance],
	);

	const lastFixedExpenses = useMemo(
		() => countValueOf(expenses.filter(({ recorrencia }) => recorrencia?.toLowerCase() === 'fixa mensal')),
		[expenses],
	);

	const isFiltered = useMemo(() => filteredData !== null, [filteredData]);

	const [isAdvanced, setIsAdvanced] = useState(false);
	const [isDeep, setIsDeep] = useState(false);
	const [activeQuery, setActiveQuery] = useState('');
	const [isEmpty, setIsEmpty] = useState(false);

	const checkAdvanced = useCallback(
		(query: string) => {
			const advanced = query.includes('${') && query.includes('}');
			setIsAdvanced(advanced);
			return advanced;
		},
		[setIsAdvanced],
	);

	const checkDeep = useCallback(
		(query: string) => {
			const deep = query.includes('**');
			setIsDeep(deep);
			return deep;
		},
		[setIsDeep],
	);

	const advancedSearch = useCallback(
		(search: string, { categoria, subcategoria, observacoes, descricao }: (typeof database)[0], isDeep: boolean) => {
			try {
				const queryRegex = /\${(.*?)}/g;
				const chunksRegex = /(!)|(&&)|(\|\|)|#([\w]+)|\(([\*|\w]+?)\)|\(([\*|\w]+?:[\*|\w]+?)\)|"(.+?)"/g;
				const hashtagsRegex = /#([\w]+)/gu;
				const categoryRegex = /\(([\*|\w]+?)\)/g;
				const categoryOrSubRegex = /\(([\*|\w|:]+?)\)/g;
				const subcategoryRegex = /\(([\*|\w]+?:[\*|\w]+?)\)/g;
				const textRegex = /"(.+?)"/g;

				const query = search.replace(queryRegex, '$1');
				if (!query) return false;
				const hashtags = observacoes.match(hashtagsRegex) || [];
				const matches = query.match(chunksRegex);

				const isHashtag = (term: string) => term.includes('#');
				const isOperator = (term: string) => term === '&&' || term === '||' || term === '!';
				// const isCategory = (term: string) => term.match(categoryRegex);
				const isSubcategory = (term: string) => term.match(subcategoryRegex);
				const isCategoryOrSub = (term: string) => term.match(categoryOrSubRegex);
				const isText = (term: string) => term.match(textRegex);

				const getExpressions = (a: boolean, operator: string, b: boolean) => `${a} ${operator} ${b}`;

				const avaliateCategories = (chunk: string, options: { partial: boolean; deep: boolean }) => {
					const regexReplace = isSubcategory(chunk) ? subcategoryRegex : categoryRegex;
					const [category, subcategory] = chunk.replace(regexReplace, '$1').split(':');
					const cat = category === '*' ? true : searchCompare(categoria, category, options);
					const sub = subcategory === '*' || !subcategory ? true : searchCompare(subcategoria, subcategory, options);
					return cat && sub;
				};

				const avaliateChunck = (chunk: string) => {
					const options = { partial: false, deep: isDeep };
					if (isHashtag(chunk)) return hashtags?.some((hashtag: string) => searchCompare(hashtag, chunk, options));
					if (isCategoryOrSub(chunk)) return avaliateCategories(chunk, options);
					if (isText(chunk)) return searchCompare(descricao, chunk, { ...options, partial: true });
					if (isText(chunk)) return searchCompare(observacoes, chunk, { ...options, partial: true });
					return false;
				};

				return matches?.reduce((value, chunk, index, arr) => {
					if (isOperator(chunk)) return value;
					if (index === 0) return avaliateChunck(chunk);
					const currentOperator = arr[index - 1];
					return eval(getExpressions(value, currentOperator, avaliateChunck(chunk)));
				}, true);
			} catch (error) {
				console.info('Invalid query format! ', error);
			}
		},
		[],
	);

	const searchData = useCallback(
		(query: string) => {
			setActiveQuery(query);
			const isValidQuery = typeof query === 'string';
			const isDeep = isValidQuery && checkDeep(query);
			const isAdvanced = isValidQuery && checkAdvanced(query);
			if (!query) return resetFilter();
			const result = initData.filter(({ descricao, valor, observacoes, ...others }) =>
				!isAdvanced
					? searchCompare(descricao, query, { deep: isDeep }) ||
					  searchCompare(valor.toString(), query, { deep: isDeep }) ||
					  searchCompare(observacoes, query, { deep: isDeep })
					: advancedSearch(query, { descricao, valor, observacoes, ...others }, isDeep),
			);
			setFilteredData(result);
			setIsEmpty(result.length === 0);
		},
		[initData, setFilteredData],
	);

	const resetFilter = useCallback(() => {
		setFilteredData(null);
	}, [setFilteredData]);

	return {
		expenses,
		revenues,
		tithes,
		interest,
		personalOffering,
		missionOffering,
		EBDOffering,
		previousBalance,
		lastFixedExpenses,
		balance,
		results,
		activeQuery,
		searchData,
		resetFilter,
		isFiltered,
		isAdvanced,
		isDeep,
		isEmpty,
	};
};
