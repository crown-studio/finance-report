import React, { useCallback, useEffect, useState } from 'react';
import { countValueOf } from '../../utils/dataUtils';
import { useData } from '../../hooks/useData';
import { formatCurrency, formatPercentage } from '../../utils/currencyUtils';
import NavBar from '../../components/navBar/NavBar';
import EntriesListItem from './components/entriesListItem/EntriesListItem';
import EntriesListContainer from './components/entriesListContainer/EntriesListContainer';
import SideNav from '../../components/sideNav/SideNav';
import { SelectCallback } from '@restart/ui/esm/types';
import If from '../../components/support/conditional/Conditional';
import { Fade, Flex, Text } from '@chakra-ui/react';
import useBreakPoints from '../../hooks/useBreakPoints';
import { useGlobalControl } from '../../hooks/useGlobalControl';
import './Transactions.scss';

const Transactions = () => {
	const { selectedMonth, selectedYear, updateSelectedMonth, updateSelectedYear } = useGlobalControl();
	const { isExtraLarge } = useBreakPoints();
	const [showSideNav, setShowSideNav] = useState(false);

	const {
		revenues,
		expenses,
		balance,
		results,
		personalOffering,
		missionOffering,
		EBDOffering,
		tithes,
		interest,
		previousBalance,
		lastFixedExpenses,
		searchData,
		resetFilter,
		isFiltered,
		isDeep,
		activeQuery,
		isEmpty,
	} = useData(selectedMonth, selectedYear);

	// const saldoAnterior = 42250.89; // JANEIRO
	// const saldoAnterior = 44053.19; // FEVEREIRO
	// const saldoAnterior = 40545.26; // MARÇO
	// const saldoAnterior = 36401.08; // ABRIL
	// const saldoAnterior = 31014.56; // MAIO
	// const saldoAnterior = 26574.45; // JUNHO
	// const saldoAnterior = 31834.21; // JULHO
	// const saldoAnterior = 15494.47; // AGOSTO
	// const saldoAnterior = 17380.56; // SETEMBRO
	// const saldoAnterior = 11867.45; // OUTUBRO
	// const saldoAnterior = 13402.23; // NOVEMBRO
	// const saldoAnterior = 13950.46; // DEZEMBRO

	const handleYearChange: SelectCallback = useCallback(
		(eventKey: string | null) => {
			if (!eventKey) return;
			updateSelectedYear(eventKey);
		},
		[updateSelectedYear],
	);

	const handleMonthChange: SelectCallback = useCallback(
		(eventKey: string | null) => {
			if (!eventKey) return;
			updateSelectedMonth(eventKey);
		},
		[updateSelectedMonth],
	);

	const handleToggleSideNav = () => {
		setShowSideNav(!showSideNav);
	};

	return (
		<div className="Transactions">
			<NavBar
				handleYearChange={handleYearChange}
				handleMonthChange={handleMonthChange}
				year={selectedYear}
				month={selectedMonth}
				searchData={searchData}
				isFiltered={isFiltered}
				activeQuery={activeQuery}
			/>

			<Fade in={isExtraLarge || showSideNav} onMouseEnter={handleToggleSideNav} onMouseLeave={handleToggleSideNav}>
				<SideNav
					data={[
						{ id: 0, name: 'Dízimos', src: '#tithes', icon: 'money' },
						{ id: 1, name: 'Ofertas', src: '#offers', icon: 'paid' },
						{ id: 2, name: 'Receitas', src: '#revenues', icon: 'savings' },
						{ id: 3, name: 'Despesas', src: '#expenses', icon: 'receipt_long' },
						{ id: 4, name: 'Balanço', src: '#balance', icon: 'monitoring' },
					]}
					colorScheme="blue"
					maxW={isExtraLarge || showSideNav ? 'auto' : 4}
					overflow={'hidden'}
				/>
			</Fade>

			<EntriesListContainer
				id="tithes"
				title="Relação dos Dizimistas"
				data={tithes}
				mergeByProps={['descricao']}
				hideOnEmpty={isFiltered}
				isFiltered={isFiltered}
				showSensitiveData={isDeep}
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
				isFiltered={isFiltered}
				hideOnEmpty={isFiltered}
				showSensitiveData={isDeep}
				hideValues
				hideTags
				showCount
			>
				<EntriesListItem className="total" title="Total" value={formatCurrency(countValueOf(personalOffering))} />
			</EntriesListContainer>

			<If check={!isFiltered}>
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
			</If>

			<EntriesListContainer
				id="expenses"
				title="Relação das Despesas"
				data={expenses}
				hideOnEmpty={isFiltered}
				isFiltered={isFiltered}
				showSensitiveData={isDeep}
				searchData={searchData}
				resetFilter={resetFilter}
				groupByCategory
				showGraphs
				showCount
			>
				<EntriesListItem className="total" title="Total" value={formatCurrency(countValueOf(expenses))} />
			</EntriesListContainer>

			<If check={!isFiltered}>
				<EntriesListContainer
					id="balance"
					title="Resumo Geral"
					data={[
						{ id: '0', descricao: 'Saldo Anterior', valor: formatCurrency(previousBalance) },
						{ id: '1', descricao: 'Entradas do Mês', valor: formatCurrency(countValueOf(revenues)) },
						{ id: '2', descricao: 'Saídas do Mês', valor: formatCurrency(countValueOf(expenses)) },
						{
							id: '3',
							descricao: results.value < 0 ? 'Déficit' : 'Superávit',
							valor: `(${formatPercentage(results.percent)}) ${formatCurrency(results.value)} `,
						},
						{
							id: '4',
							descricao: 'Despesas Fixas',
							valor: formatCurrency(lastFixedExpenses),
						},
					]}
				>
					<EntriesListItem
						className="total"
						title="Saldo Atual"
						value={formatCurrency(balance)}
						minor={`Prévia: ${formatCurrency(balance - lastFixedExpenses)}`}
					/>
				</EntriesListContainer>
			</If>

			<If check={isFiltered && isEmpty}>
				<EntriesListContainer
					id="search"
					title="Resultados da Busca"
					customEmptyMessage={`Sinto muito, a busca não retornou resultados para: "${activeQuery}".`}
				/>
			</If>
			<Flex justifyContent="center" color={'gray.600'} position="relative" bottom={-32}>
				<Text textAlign="center" fontSize="sm">
					Made by <Text as="b">Crown Studio ®</Text>
				</Text>
			</Flex>
		</div>
	);
};

export default Transactions;
