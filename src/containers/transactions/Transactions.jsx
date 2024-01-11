import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
// import PieChart from '../../components/pieChart/PieChart';

import React, { useState } from 'react';
import chartData from '../../data/dataFile.json';
// import { groupBy } from '../../utils/objectUtils';
// import LineChart from '../../components/lineChart/LineChart';
// import BarChart from '../../components/barChart/BarChart';
import NavBar from '../../components/navBar/NavBar';
import { getDateByMonthNumber, getParsedDate } from '../../utils/dateUtils';
import { countValueOf } from '../../utils/dataUtils';

// import { isSameMonth } from 'date-fns';
import { useFilteredData } from '../../hooks/useFilteredData';
import './Transactions.scss';

const Transactions = () => {
	const { despesas, receitas } = useFilteredData();
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
	const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());

	// const saldoAnterior = 40545.26; // ABRIL
	// const saldoAnterior = 26574.45; // MAIO
	// const saldoAnterior = 31834.21; // JUNHO
	// const saldoAnterior = 15494.47; // AGOSTO
	// const saldoAnterior = 17380.56; // SETEMBRO
	// const saldoAnterior = 11867.45; // OUTUBRO
	// const saldoAnterior = 13402.23; // NOVEMBRO

	const saldoAnterior =
		42250.89 +
		countValueOf(
			chartData.filter(
				({ pagamento }) => getDateByMonthNumber(selectedMonth).getMonth() !== getParsedDate(pagamento).getMonth(),
			),
		);

	const filteredDespesas = despesas.filter(({ pagamento }) => {
		// return isSameMonth(getDateByMonthNumber(selectedMonth), getParsedDate(pagamento));
		return getDateByMonthNumber(selectedMonth).getMonth() === getParsedDate(pagamento).getMonth();
	});

	const filteredReceitas = receitas.filter(({ pagamento }) => {
		// return isSameMonth(getDateByMonthNumber(selectedMonth), getParsedDate(pagamento));
		return getDateByMonthNumber(selectedMonth).getMonth() === getParsedDate(pagamento).getMonth();
	});

	const filteredDizimistas = filteredReceitas.filter(({ categoria }) => categoria === 'Dízimo');

	const filteredOfertantes = filteredReceitas.filter(
		({ categoria, subcategoria }) => categoria === 'Oferta' && subcategoria === 'Pessoal',
	);

	const filteredOfertaMissões = filteredReceitas.filter(
		({ categoria, subcategoria }) => categoria === 'Oferta' && subcategoria === 'Missões',
	);

	const filteredOfertaEBD = filteredReceitas.filter(
		({ categoria, subcategoria }) => categoria === 'Oferta' && subcategoria === 'EBD',
	);

	const filteredJuros = filteredReceitas.filter(
		({ categoria, subcategoria }) => categoria === 'Juros' && subcategoria === 'Outros',
	);

	// console.log(filteredDizimistas);

	const handleYearChange = eventKey => {
		setSelectedYear(eventKey);
	};

	const handleMonthChange = eventKey => {
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

				{filteredDizimistas.map(({ descricao, observacoes }) => (
					<Row md={12} tabIndex={1} className="align-items-center mb-3" style={{ height: 60 }}>
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

				{!filteredDespesas?.length && (
					<h5
						className="text-center h-200 p-6 d-flex align-items-center justify-content-center"
						style={{ height: '75vh' }}
					>
						Nenhum dado foi encontrado
					</h5>
				)}

				<h6 tabIndex={1} className="mb-0 text-end fs-5" md={2}>
					Total: R$ {countValueOf(filteredDizimistas)}
				</h6>
			</Container>

			<Container className="p-4">
				<h4 className="text-center mb-5">RELAÇÃO DOS OFERTANTES</h4>

				{filteredOfertantes.map(({ descricao, observacoes }) => (
					<Row md={12} tabIndex={1} className="align-items-center mb-3" style={{ height: 60 }}>
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

				{!filteredDespesas?.length && (
					<h5
						className="text-center h-200 p-6 d-flex align-items-center justify-content-center"
						style={{ height: '75vh' }}
					>
						Nenhum dado foi encontrado
					</h5>
				)}

				<h6 tabIndex={1} className="mb-0 text-end fs-5" md={2}>
					Total: R$ {countValueOf(filteredOfertantes)}
				</h6>
			</Container>

			<Container className="p-4">
				<h4 className="text-center mb-5">DESCRIÇÃO DAS ENTRADAS</h4>

				<Row tabIndex={1} md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Ofertas Pessoais</p>
					</Col>
					<Col md={2}>
						<h6 className="mb-0 text-end fs-5">R$ {countValueOf(filteredOfertantes).toFixed(2)}</h6>
					</Col>
				</Row>

				<Row tabIndex={1} md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Ofertas Missionárias</p>
					</Col>
					<Col md={2}>
						<h6 className="mb-0 text-end fs-5">R$ {countValueOf(filteredOfertaMissões).toFixed(2)}</h6>
					</Col>
				</Row>

				<Row tabIndex={1} md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Ofertas EBD</p>
					</Col>
					<Col md={2}>
						<h6 className="mb-0 text-end fs-5">R$ {countValueOf(filteredOfertaEBD).toFixed(2)}</h6>
					</Col>
				</Row>

				<Row tabIndex={1} md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Dízimos</p>
					</Col>
					<Col md={2}>
						<h6 className="mb-0 text-end fs-5">R$ {countValueOf(filteredDizimistas).toFixed(2)}</h6>
					</Col>
				</Row>

				<Row tabIndex={1} md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Juros</p>
					</Col>
					<Col md={2}>
						<h6 className="mb-0 text-end fs-5">R$ {countValueOf(filteredJuros).toFixed(2)}</h6>
					</Col>
				</Row>

				<h6 tabIndex={1} className="mb-0 text-end fs-5" md={2}>
					Total: R$ {countValueOf(filteredReceitas)}
				</h6>
			</Container>
			<Container className="p-4">
				<h4 className="text-center mb-5">RELAÇÃO DE DESPESAS</h4>

				{[
					...filteredDespesas.filter(({ categoria }) => categoria !== 'Obras'),
					filteredDespesas
						.filter(({ categoria }) => categoria === 'Obras')
						.reduce((tv, cv) => ({ ...tv, valor: tv.valor + cv.valor }), {
							descricao: 'Gasto com obras',
							valor: 0,
							observacoes: 'Despesas agrupadas',
							categoria: 'Obras',
							subcategoria: 'Outros',
						}),
				].map(({ descricao, valor, observacoes, categoria, subcategoria }) => (
					<Row md={12} tabIndex={1} className="align-items-center mb-3" style={{ height: 60 }}>
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

				{!filteredDespesas?.length && (
					<h5
						className="text-center h-200 p-6 d-flex align-items-center justify-content-center"
						style={{ height: '75vh' }}
					>
						Nenhum dado foi encontrado
					</h5>
				)}

				<h6 tabIndex={1} className="mb-0 text-end fs-5" md={2}>
					Total: R$ {countValueOf(filteredDespesas)}
				</h6>
			</Container>

			<Container className="p-4">
				<h4 tabIndex={1} className="text-center mb-5">
					RESUMO GERAL
				</h4>

				<Row md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Saldo Anterior</p>
					</Col>
					<Col md={2}>
						<h6 tabIndex={1} className="mb-0 text-end fs-5">
							R$ {saldoAnterior.toFixed(2)}
						</h6>
					</Col>
				</Row>

				<Row md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Entradas do Mês</p>
					</Col>
					<Col md={2}>
						<h6 tabIndex={1} className="mb-0 text-end fs-5">
							R$ {countValueOf(filteredReceitas).toFixed(2)}
						</h6>
					</Col>
				</Row>

				<Row md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Saídas do Mês</p>
					</Col>
					<Col md={2}>
						<h6 tabIndex={1} className="mb-0 text-end fs-5">
							R$ {countValueOf(filteredDespesas).toFixed(2)}
						</h6>
					</Col>
				</Row>

				<Row md={12} style={{ height: 60 }}>
					<Col md={10}>
						<p className="mb-0 fs-5">Saldo Atual</p>
					</Col>
					<Col md={2}>
						<h6 tabIndex={1} className="mb-0 text-end fs-5">
							R$ {(saldoAnterior + countValueOf(filteredReceitas) - countValueOf(filteredDespesas)).toFixed(2)}
						</h6>
					</Col>
				</Row>

				{/* <h6 tabIndex={1} className="mb-0 text-end fs-5" md={2}>
          Saldo Atual: R$ {(saldoAnterior + countValueOf(filteredReceitas) - countValueOf(filteredDespesas)).toFixed(2)}
        </h6> */}
			</Container>
		</div>
	);
};

export default Transactions;
