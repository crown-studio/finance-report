// import PieChart from '../../components/pieChart/PieChart';
// import { groupBy } from '../../utils/objectUtils';
// import LineChart from '../../components/lineChart/LineChart';
// import BarChart from '../../components/barChart/BarChart';
// import { isSameMonth } from 'date-fns';
import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import NavBar from '../../components/navBar/NavBar';
import { countValueOf } from '../../utils/dataUtils';
import { useData } from '../../hooks/useData';
import EntriesListItem from './components/entriesListItem/EntriesListItem';
import { formatCurrency } from '../../utils/currencyUtils';
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
		<div className="Dashboard">
			<NavBar
				handleToggleMenu={handleToggleMenu}
				handleYearChange={handleYearChange}
				handleMonthChange={handleMonthChange}
				year={selectedYear}
				month={selectedMonth}
			/>

			{/* <Row> */}
			{/* {showMenu && (
          <Col lg={2}>
            <div className={`bg-light p-3 vh-100 ${showMenu ? "show" : "d-none d-lg-block"}`}>
              <h5>Menu</h5>
              <Nav className="flex-column">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#extrato">Extrato</Nav.Link>
              </Nav>
            </div>
          </Col>
        )} */}
			{/* <Col lg={10}> */}
			<Container className="p-4">
				<h4 className="text-center mb-5">RELAÇÃO DE DIZIMISTAS</h4>

				{tithes.map(({ id, descricao }) => (
					<Row md={12} key={id} tabIndex={1} className="align-items-center mb-3" style={{ height: 60 }}>
						<Row md={12}>
							<Col md={10}>
								<p className="mb-0 fs-5">{descricao}</p>
							</Col>
						</Row>
						{/* <Col md={10}>
              <span className="mb-0 fst-italic fs-6" style={{ color: "#666666" }}> */}
						{
							// observacoes.replaceAll("#reembolso", "").replace(/\*\*(.*?)\*\*/g, "")
						}
						{/* </span>
            </Col> */}
					</Row>
				))}

				{!expenses?.length && (
					<h5
						className="text-center h-200 p-6 d-flex align-items-center justify-content-center"
						style={{ height: '75vh' }}
					>
						Nenhum dado foi encontrado
					</h5>
				)}

				<h6 tabIndex={1} className="mb-0 text-end fs-5" md={2}>
					Total: R$ {countValueOf(tithes)}
				</h6>
			</Container>

			<Container className="p-4">
				<h4 className="text-center mb-5">RELAÇÃO DOS OFERTANTES</h4>

				{personalOffering.map(({ id, descricao, observacoes }) => (
					<Row key={id} md={12} tabIndex={1} className="align-items-center mb-3" style={{ height: 60 }}>
						<Row md={12}>
							<Col md={10}>
								<p className="mb-0 fs-5">{descricao}</p>
							</Col>
						</Row>
						<Col md={10}>
							<span className="mb-0 fst-italic fs-6" style={{ color: '#666666' }}>
								{observacoes.replaceAll('#reembolso', '').replace(/\*\*(.*?)\*\*/g, '')}
							</span>
						</Col>
					</Row>
				))}

				{!expenses?.length && (
					<h5
						className="text-center h-200 p-6 d-flex align-items-center justify-content-center"
						style={{ height: '75vh' }}
					>
						Nenhum dado foi encontrado
					</h5>
				)}

				<h6 tabIndex={1} className="mb-0 text-end fs-5" md={2}>
					Total: R$ {countValueOf(personalOffering)}
				</h6>
			</Container>

			<Container className="p-4">
				<h4 className="text-center mb-5">DESCRIÇÃO DAS ENTRADAS</h4>

				<Row tabIndex={1} md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Ofertas Pessoais</p>
					</Col>
					<Col md={2}>
						<h6 className="mb-0 text-end fs-5">R$ {countValueOf(personalOffering).toFixed(2)}</h6>
					</Col>
				</Row>

				<Row tabIndex={1} md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Ofertas Missionárias</p>
					</Col>
					<Col md={2}>
						<h6 className="mb-0 text-end fs-5">R$ {countValueOf(missionOffering).toFixed(2)}</h6>
					</Col>
				</Row>

				<Row tabIndex={1} md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Ofertas EBD</p>
					</Col>
					<Col md={2}>
						<h6 className="mb-0 text-end fs-5">R$ {countValueOf(EBDOffering).toFixed(2)}</h6>
					</Col>
				</Row>

				<Row tabIndex={1} md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Dízimos</p>
					</Col>
					<Col md={2}>
						<h6 className="mb-0 text-end fs-5">R$ {countValueOf(tithes).toFixed(2)}</h6>
					</Col>
				</Row>

				<Row tabIndex={1} md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Juros</p>
					</Col>
					<Col md={2}>
						<h6 className="mb-0 text-end fs-5">R$ {countValueOf(interest).toFixed(2)}</h6>
					</Col>
				</Row>

				<h6 tabIndex={1} className="mb-0 text-end fs-5" md={2}>
					Total: R$ {countValueOf(revenues)}
				</h6>
			</Container>
			<Container className="p-4">
				<h4 className="text-center mb-5">RELAÇÃO DE DESPESAS</h4>

				{[
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
				].map(({ id, descricao, valor, observacoes, categoria, subcategoria }) => (
					<Row key={id} md={12} tabIndex={1} className="align-items-center mb-3" style={{ height: 60 }}>
						<Row md={12}>
							<Col md={10}>
								<p className="mb-0 fs-5">{descricao}</p>
							</Col>
							<Col md={2}>
								<h6 className="mb-0 text-end fs-5">R$ {valor.toFixed(2)}</h6>
							</Col>
						</Row>
						<Col md={10}>
							<span className="mb-0 fst-italic fs-6" style={{ color: '#666666' }}>
								{observacoes.replaceAll('#reembolso', '').replace(/\*\*(.*?)\*\*/g, '')}
							</span>
							<span
								className="mb-0 fst-italic fs-6"
								style={{
									color: '#666',
									// fontSize: "8px !important",
									// display: "inline-flex",
									// justifyContent: "center",
									// alignItems: "center",
									// backgroundColor: "#666",
									// padding: "4px 8px",
									// borderRadius: "16px",
								}}
							>
								- {categoria.toUpperCase()}: {subcategoria.toUpperCase()}
							</span>
						</Col>
					</Row>
				))}

				{!expenses?.length && (
					<h5
						className="text-center h-200 p-6 d-flex align-items-center justify-content-center"
						style={{ height: '75vh' }}
					>
						Nenhum dado foi encontrado
					</h5>
				)}

				<h6 tabIndex={1} className="mb-0 text-end fs-5" md={2}>
					Total: R$ {countValueOf(expenses)}
				</h6>
			</Container>

			<Container className="p-4">
				<h4 tabIndex={1} className="text-center mb-5">
					RESUMO GERAL
				</h4>

				<EntriesListItem label="Saldo Anterior" value={formatCurrency(previousBalance)} />
				<EntriesListItem label="Entradas do Mês" value={formatCurrency(countValueOf(revenues))} />
				<EntriesListItem label="Saídas do Mês" value={formatCurrency(countValueOf(expenses))} />
				<EntriesListItem label="Saldo Atual" value={formatCurrency(balance)} />
			</Container>
		</div>
	);
};

export default Transactions;
