// import PieChart from '../../components/pieChart/PieChart';
// import { groupBy } from '../../utils/objectUtils';
// import LineChart from '../../components/lineChart/LineChart';
// import BarChart from '../../components/barChart/BarChart';
// import { isSameMonth } from 'date-fns';
// import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import NavBar from '../../components/navBar/NavBar';
import { countValueOf } from '../../utils/dataUtils';
import { useData } from '../../hooks/useData';
import EntriesListItem from './components/entriesListItem/EntriesListItem';
import { formatCurrency } from '../../utils/currencyUtils';
import EntriesListContainer from './components/entriesListContainer/EntriesListContainer';
import './Transactions.scss';

const Transactions = () => {
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
	const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
	const { revenues, expenses, balance, personalOffering, missionOffering, EBDOffering, tithes, interest, previousBalance } =
		useData(selectedMonth);

	// const saldoAnterior = 40545.26; // ABRIL
	// const saldoAnterior = 26574.45; // MAIO
	// const saldoAnterior = 31834.21; // JUNHO
	// const saldoAnterior = 15494.47; // AGOSTO
	// const saldoAnterior = 17380.56; // SETEMBRO
	// const saldoAnterior = 11867.45; // OUTUBRO
	// const saldoAnterior = 13402.23; // NOVEMBRO
	// const saldoAnterior = 13950.46; // DEZEMBRO

	const handleYearChange = (eventKey: string) => {
		setSelectedYear(eventKey);
	};

	const handleMonthChange = (eventKey: string) => {
		setSelectedMonth(eventKey);
	};

	const [showMenu, setShowMenu] = useState(false);

	const handleToggleMenu = () => {
		// console.log(showMenu);
		setShowMenu(prevState => !prevState);
	};

	return (
		<div className="Transactions">
			<NavBar
				handleToggleMenu={handleToggleMenu}
				handleYearChange={handleYearChange}
				handleMonthChange={handleMonthChange}
				year={selectedYear}
				month={selectedMonth}
			/>

			<EntriesListContainer title="RELAÇÃO DE DIZIMISTAS" data={tithes} hideValues hideTags>
				<EntriesListItem title="Total" value={formatCurrency(countValueOf(tithes))} />
			</EntriesListContainer>

			<EntriesListContainer title="RELAÇÃO DOS OFERTANTES" data={personalOffering} hideValues hideTags>
				<EntriesListItem title="Total" value={formatCurrency(countValueOf(personalOffering))} />
			</EntriesListContainer>

			<EntriesListContainer title="DESCRIÇÃO DAS ENTRADAS">
				<EntriesListItem title="Ofertas Pessoais" value={formatCurrency(countValueOf(personalOffering))} />
				<EntriesListItem title="Ofertas Missionárias" value={formatCurrency(countValueOf(missionOffering))} />
				<EntriesListItem title="Ofertas EBD" value={formatCurrency(countValueOf(EBDOffering))} />
				<EntriesListItem title="Dízimos" value={formatCurrency(countValueOf(tithes))} />
				<EntriesListItem title="Juros" value={formatCurrency(countValueOf(interest))} />
				<EntriesListItem title="Total" value={formatCurrency(countValueOf(revenues))} />
			</EntriesListContainer>

			<EntriesListContainer
				title="RELAÇÃO DE DESPESAS"
				data={[
					...expenses.filter(({ categoria }) => categoria !== 'Obras'),
					expenses
						.filter(({ categoria }) => categoria === 'Obras')
						.reduce((tv, cv) => ({ ...tv, valor: tv.valor + cv.valor }), {
							descricao: 'Gasto com obras',
							valor: 0,
							observacoes: 'Despesas agrupadas',
							categoria: 'Obras',
							subcategoria: 'Outros',
						}),
				]}
			>
				<EntriesListItem title="Total" value={formatCurrency(countValueOf(expenses))} />
			</EntriesListContainer>

			<EntriesListContainer title="RESUMO GERAL">
				<EntriesListItem title="Saldo Anterior" value={formatCurrency(previousBalance)} />
				<EntriesListItem title="Entradas do Mês" value={formatCurrency(countValueOf(revenues))} />
				<EntriesListItem title="Saídas do Mês" value={formatCurrency(countValueOf(expenses))} />
				<EntriesListItem title="Saldo Atual" value={formatCurrency(balance)} />
			</EntriesListContainer>
		</div>
	);
};

export default Transactions;
