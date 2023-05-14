import { Container, Row, Col } from "react-bootstrap";
import PieChart from "../../components/pieChart/PieChart";

import chartData from "../../data/dataFile.json";
import { groupBy } from "../../utils/objectUtils";
import LineChart from "../../components/lineChart/LineChart";
import BarChart from "../../components/barChart/BarChart";
import NavBar from "../../components/navBar/NavBar";
import React, { useState } from "react";
import { getDateByMonthNumber, getParsedDate } from "../../utils/dateUtils";
import "./Dashboard.scss";
import { format } from "date-fns";

const Dashboard = () => {
  const today = new Date();
  const currentYear = format(today, "yyyy");
  const currentMonth = format(today, "MM");

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const despesas = chartData
    .filter(({ valor }) => valor <= 0)
    .map(({ valor, ...rest }) => ({ ...rest, valor: valor * -1 }))
    .filter(({ observacoes }) => !observacoes.includes("#banabuiu"));
  const receitas = chartData.filter(({ valor }) => valor > 0).filter(({ observacoes }) => !observacoes.includes("#banabuiu"));

  const filteredDespesas = despesas.filter(({ pagamento }) => {
    // return isSameMonth(getDateByMonthNumber(selectedMonth), getParsedDate(pagamento));
    return getDateByMonthNumber(selectedMonth).getMonth() === getParsedDate(pagamento).getMonth();
  });

  const filteredReceitas = receitas.filter(({ pagamento }) => {
    // return isSameMonth(getDateByMonthNumber(selectedMonth), getParsedDate(pagamento));
    return getDateByMonthNumber(selectedMonth).getMonth() === getParsedDate(pagamento).getMonth();
  });

  const handleYearChange = (eventKey) => {
    setSelectedYear(eventKey);
  };

  const handleMonthChange = (eventKey) => {
    setSelectedMonth(eventKey);
  };

  // const [showMenu, setShowMenu] = useState(false);

  const handleToggleMenu = () => {
    //   console.log(showMenu);
    //   setShowMenu((prevState) => !prevState);
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

      <Row>
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
        <Container className="p-4 ">
          <Row xs={1} md={2} className="g-3 d-flex justify-content-center">
            {/* <Col md={4} className="g-3">
                <PieChart chartData={groupBy(filteredDespesas, "categoria")} />
              </Col> */}
            {/* <Col md={4} className="g-3">
                <LineChart
                  chartData={groupBy(filteredDespesas, "pagamento")}
                  yaxisTitle="R$ Valores por dia"
                  xaxisTitle="Dias no mês"
                />
              </Col> */}
            {/* <Col md={4} className="g-3"> */}
            <BarChart chartData={{ receitas, despesas }} />
            {/* </Col> */}
          </Row>
        </Container>
        {/* </Col> */}
      </Row>
    </div>
  );
};

export default Dashboard;
