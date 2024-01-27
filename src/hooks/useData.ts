import { useMemo } from 'react';
import database from '../data/database.json';
import { getParsedDate } from '../utils/dateUtils';
import { countValueOf } from '../utils/dataUtils';
import { isBefore, isSameMonth } from 'date-fns';

export const useData = (selectedMonth: string, selectedYear: string) => {
	const INITIAL_VALUE = 42250.89;
	const currentDate = useMemo(() => getParsedDate(`01/${selectedMonth}/${selectedYear}`), [selectedMonth, selectedYear]);

	const expenses = useMemo(
		() =>
			database
				.filter(({ valor }) => valor <= 0)
				.map(({ valor, encargos, ...rest }) => ({ ...rest, valor: valor * -1, encargos: encargos * -1 })),
		[database],
	);

	const revenues = useMemo(() => database.filter(({ valor }) => valor > 0), [database]);

	const previousAmount = useMemo(
		() => database.filter(({ pagamento }) => isBefore(getParsedDate(pagamento), currentDate)),
		[database, currentDate],
	);

	const previousBalance = useMemo(() => INITIAL_VALUE + countValueOf(previousAmount), [INITIAL_VALUE, previousAmount]);

	const filteredExpenses = useMemo(
		() =>
			expenses.filter(({ pagamento }) => {
				return isSameMonth(getParsedDate(pagamento), currentDate);
			}),
		[expenses, currentDate],
	);

	const filteredRevenues = useMemo(
		() =>
			revenues.filter(({ pagamento }) => {
				return isSameMonth(getParsedDate(pagamento), currentDate);
			}),
		[revenues, currentDate],
	);

	const tithes = useMemo(() => filteredRevenues.filter(({ categoria }) => categoria === 'Dízimo'), [filteredRevenues]);

	const personalOffering = useMemo(
		() => filteredRevenues.filter(({ categoria, subcategoria }) => categoria === 'Oferta' && subcategoria === 'Pessoal'),
		[filteredRevenues],
	);

	const missionOffering = useMemo(
		() => filteredRevenues.filter(({ categoria, subcategoria }) => categoria === 'Oferta' && subcategoria === 'Missões'),
		[filteredRevenues],
	);

	const EBDOffering = useMemo(
		() => filteredRevenues.filter(({ categoria, subcategoria }) => categoria === 'Oferta' && subcategoria === 'EBD'),
		[filteredRevenues],
	);

	const interest = useMemo(
		() => filteredRevenues.filter(({ categoria, subcategoria }) => categoria === 'Juros' && subcategoria === 'Outros'),
		[filteredRevenues],
	);

	const balance = useMemo(
		() => previousBalance + countValueOf(filteredRevenues) - countValueOf(filteredExpenses),
		[previousBalance, filteredRevenues, filteredExpenses],
	);

	return {
		tithes,
		interest,
		personalOffering,
		missionOffering,
		EBDOffering,
		expenses: filteredExpenses,
		revenues: filteredRevenues,
		previousBalance,
		balance,
	};
};
