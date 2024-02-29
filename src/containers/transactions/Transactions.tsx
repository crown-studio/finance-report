import React, { useCallback, useState } from 'react';
import { countValueOf } from '../../utils/dataUtils';
import { useData } from '../../hooks/useData';
import { formatCurrency } from '../../utils/currencyUtils';
import NavBar from '../../components/navBar/NavBar';
import EntriesListItem from './components/entriesListItem/EntriesListItem';
import EntriesListContainer from './components/entriesListContainer/EntriesListContainer';
import { subMonths } from 'date-fns';
import SideNav from '../../components/sideNav/SideNav';
import { SelectCallback } from '@restart/ui/esm/types';
import './Transactions.scss';

const Transactions = () => {
	const selectedDate = subMonths(new Date(), 1);
	const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear().toString());
	const [selectedMonth, setSelectedMonth] = useState((selectedDate.getMonth() + 1).toString());
	const { revenues, expenses, balance, personalOffering, missionOffering, EBDOffering, tithes, interest, previousBalance } =
		useData(selectedMonth, selectedYear);

	// const saldoAnterior = 40545.26; // ABRIL
	// const saldoAnterior = 26574.45; // MAIO
	// const saldoAnterior = 31834.21; // JUNHO
	// const saldoAnterior = 15494.47; // AGOSTO
	// const saldoAnterior = 17380.56; // SETEMBRO
	// const saldoAnterior = 11867.45; // OUTUBRO
	// const saldoAnterior = 13402.23; // NOVEMBRO
	// const saldoAnterior = 13950.46; // DEZEMBRO

	const handleYearChange: SelectCallback = useCallback(
		(eventKey: string | null) => {
			if (!eventKey) return;
			setSelectedYear(eventKey);
		},
		[setSelectedYear],
	);

	const handleMonthChange: SelectCallback = useCallback(
		(eventKey: string | null) => {
			if (!eventKey) return;
			setSelectedMonth(eventKey);
		},
		[setSelectedMonth],
	);

	// const [showMenu, setShowMenu] = useState(false);

	const handleToggleMenu = () => {
		// console.log(showMenu);
		// setShowMenu(prevState => !prevState);
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

			<SideNav
				data={[
					{ id: 0, name: 'Dízimos', src: '#tithes', icon: 'money' },
					{ id: 1, name: 'Ofertas', src: '#offers', icon: 'paid' },
					{ id: 2, name: 'Receitas', src: '#revenues', icon: 'savings' },
					{ id: 3, name: 'Despesas', src: '#expenses', icon: 'receipt_long' },
					{ id: 4, name: 'Balanço', src: '#balance', icon: 'monitoring' },
				]}
				colorScheme="blue"
			/>

			<EntriesListContainer
				id="tithes"
				title="Relação dos Dizimistas"
				data={tithes}
				mergeByProps={['descricao']}
				hideValues
				hideTags
				showCount
			>
				<EntriesListItem className="total" title="Total" value={formatCurrency(countValueOf(tithes))} />
			</EntriesListContainer>

			<EntriesListContainer
				id="offers"
				title="Relação dos Ofertantes"
				data={personalOffering}
				mergeByProps={['descricao']}
				hideValues
				hideTags
				showCount
			>
				<EntriesListItem className="total" title="Total" value={formatCurrency(countValueOf(personalOffering))} />
			</EntriesListContainer>

			<EntriesListContainer
				id="revenues"
				title="Resumo das Receitas"
				data={[
					{ id: '0', descricao: 'Ofertas Pessoais', valor: formatCurrency(countValueOf(personalOffering)) },
					{ id: '1', descricao: 'Ofertas Missionárias', valor: formatCurrency(countValueOf(missionOffering)) },
					{ id: '2', descricao: 'Ofertas EBD', valor: formatCurrency(countValueOf(EBDOffering)) },
					{ id: '3', descricao: 'Dízimos', valor: formatCurrency(countValueOf(tithes)) },
					{ id: '4', descricao: 'Juros', valor: formatCurrency(countValueOf(interest)) },
				]}
			>
				<EntriesListItem className="total" title="Total" value={formatCurrency(countValueOf(revenues))} />
			</EntriesListContainer>

			<EntriesListContainer id="expenses" title="Relação das Despesas" data={expenses} groupByCategory showGraphs showCount>
				<EntriesListItem className="total" title="Total" value={formatCurrency(countValueOf(expenses))} />
			</EntriesListContainer>

			<EntriesListContainer
				id="balance"
				title="Resumo Geral"
				data={[
					{ id: '0', descricao: 'Saldo Anterior', valor: formatCurrency(previousBalance) },
					{ id: '1', descricao: 'Entradas do Mês', valor: formatCurrency(countValueOf(revenues)) },
					{ id: '2', descricao: 'Saídas do Mês', valor: formatCurrency(countValueOf(expenses)) },
				]}
			>
				<EntriesListItem className="total" title="Saldo Atual" value={formatCurrency(balance)} />
			</EntriesListContainer>
		</div>
	);
};

export default Transactions;
