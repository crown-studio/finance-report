import { parse, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export const getMonthName = (dateString, formatString) => {
  const date = getParsedDate(dateString);
  return format(date, formatString || "LLLL", { locale: ptBR });
};

export const getDateByMonthNumber = (monthNumber) => {
  return new Date(2000, monthNumber - 1);
};

export const getParsedDate = (dateString) => {
  return parse(dateString, "dd/MM/yyyy", new Date());
};
