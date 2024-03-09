import { subMonths } from 'date-fns';
import React, { ReactNode, createContext, useMemo, useState } from 'react';

export interface IGlobalControlContext {
	selectedYear: string;
	selectedMonth: string;
	updateSelectedYear: (year: string) => void;
	updateSelectedMonth: (month: string) => void;
}

const selectedDate = subMonths(new Date(), 1);

const initialValue = {
	selectedYear: selectedDate.getFullYear().toString(),
	selectedMonth: (selectedDate.getMonth() + 1).toString(),
};

export const GlobalControlContext = createContext<IGlobalControlContext>({
	selectedYear: '',
	selectedMonth: '',
	updateSelectedYear: () => {},
	updateSelectedMonth: () => {},
});

export const GlobalControlProvider = ({ children }: { children: ReactNode }) => {
	const [selectedYear, setSelectedYear] = useState(initialValue.selectedYear);
	const [selectedMonth, setSelectedMonth] = useState(initialValue.selectedMonth);

	const updateSelectedYear = (year: string) => {
		setSelectedYear(year);
	};

	const updateSelectedMonth = (month: string) => {
		setSelectedMonth(month);
	};

	const value: IGlobalControlContext = useMemo(
		() => ({
			selectedYear,
			selectedMonth,
			updateSelectedYear,
			updateSelectedMonth,
		}),
		[selectedYear, selectedMonth],
	);

	return <GlobalControlContext.Provider value={value}>{children}</GlobalControlContext.Provider>;
};
