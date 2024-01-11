import { parse, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export const getMonthName = (dateString: string, formatString?: string): string => {
	const date = getParsedDate(dateString);
	return format(date, formatString || 'LLLL', { locale: ptBR });
};

export const getDateByMonthNumber = (monthNumber: number): Date => {
	return new Date(2000, monthNumber - 1);
};

export const getParsedDate = (dateString: string): Date => {
	return parse(dateString, 'dd/MM/yyyy', new Date());
};
