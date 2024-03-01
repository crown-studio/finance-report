import { useMemo, useState } from 'react';
import database from '../data/database.json';
import { getParsedDate } from '../utils/dateUtils';
import { countValueOf } from '../utils/dataUtils';
import { isBefore, isSameMonth } from 'date-fns';

export const useData = (selectedMonth: string, selectedYear: string) => {
	const INITIAL_VALUE = 42250.89;
	const currentDate = useMemo(() => getParsedDate(`01/${selectedMonth}/${selectedYear}`), [selectedMonth, selectedYear]);

	const previousAmount = useMemo(
		() => database.filter(({ pagamento }) => isBefore(getParsedDate(pagamento), currentDate)),
		[database, currentDate],
	);

	const previousBalance = useMemo(() => INITIAL_VALUE + countValueOf(previousAmount), [INITIAL_VALUE, previousAmount]);

	const filteredData = useMemo(
		() => database.filter(({ pagamento }) => isSameMonth(getParsedDate(pagamento), currentDate)),
		[database, currentDate],
	);

	const expenses = useMemo(
		() =>
			filteredData
				.filter(({ valor }) => valor <= 0)
				.map(({ valor, encargos, ...rest }) => ({ ...rest, valor: valor * -1, encargos: encargos * -1 })),
		[filteredData],
	);

	const revenues = useMemo(() => filteredData.filter(({ valor }) => valor > 0), [filteredData]);

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

	const balance = useMemo(
		() => previousBalance + countValueOf(revenues) - countValueOf(expenses),
		[expenses, revenues, previousBalance],
	);

	return {
		expenses,
		revenues,
		tithes,
		interest,
		personalOffering,
		missionOffering,
		EBDOffering,
		previousBalance,
		balance,
	};
};
