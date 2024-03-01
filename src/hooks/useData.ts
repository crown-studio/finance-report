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
		() => countValueOf(expenses.filter(({ recorrencia }) => recorrencia.toLowerCase() === 'fixa mensal')),
		[expenses],
	);

	const isFiltered = useMemo(() => filteredData !== null, [filteredData]);

	const [isAdvanced, setIsAdvanced] = useState(false);
	const [activeQuery, setActiveQuery] = useState('');
	const [isEmpty, setIsEmpty] = useState(false);

	const checkAdvanced = useCallback(
		(query: string) => {
			setIsAdvanced(query.includes('**'));
		},
		[isAdvanced, setIsAdvanced],
	);

	const searchData = useCallback(
		(query: string) => {
			setActiveQuery(query);
			if (typeof query === 'string') checkAdvanced(query);
			if (!query) return resetFilter();
			const result = initData.filter(
				({ descricao, valor, observacoes }) =>
					searchCompare(descricao, query) ||
					searchCompare(valor.toString(), query) ||
					searchCompare(observacoes, query),
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
		isEmpty,
	};
};
