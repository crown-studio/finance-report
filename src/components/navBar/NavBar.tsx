import React, { useMemo, useState, useEffect, useRef } from 'react';

import { Navbar, Container, Dropdown, Form } from 'react-bootstrap';
import chartData from '../../data/database.json';
import { getMonthName } from '../../utils/dateUtils';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import { groupBy } from '../../utils/objectUtils';
import { removeDuplicates } from '../../utils/arrayUtils';
import { Link } from 'react-router-dom';
import { SelectCallback } from '@restart/ui/esm/types';
import { useScrollDirection } from 'react-use-scroll-direction';
import classNames from 'classnames';
import { isElementOrDescendantFocused } from '../../utils/codeUtils';
import './NavBar.scss';

interface INavBarProps {
	handleYearChange: SelectCallback;
	handleMonthChange: SelectCallback;
	year: string;
	month: string;
	searchData?: (queryString: string) => void;
	activeQuery?: string;
	isFiltered?: boolean;
}

const NavBar = ({
	handleYearChange,
	handleMonthChange,
	year,
	month,
	searchData,
	activeQuery = '',
	isFiltered = false,
}: INavBarProps) => {
	const navBarRef = useRef(null);
	const [isCollapsedNavbar, setIsCollapsedNavbar] = useState(false);
	const [preventCollapse, setPreventCollapse] = useState(false);
	const scrollDirection = useScrollDirection();

	const availableYears = useMemo(
		() => removeDuplicates(Object.keys(groupBy(chartData, 'pagamento')).map(date => date.split('/')[2])),
		[],
	);

	const availableMonths = useMemo(
		() => removeDuplicates(Object.keys(groupBy(chartData, 'pagamento')).map(date => date.split('/')[1])),
		[],
	);

	const [lastYear] = useMemo(() => availableYears.sort(), [availableYears]);
	const [lastMonth] = useMemo(() => availableMonths.sort(), [availableMonths]);

	const hasFocusWithin = useMemo(() => {
		const { current: navBarElem } = navBarRef;
		if (!navBarElem) return false;
		return isElementOrDescendantFocused(navBarElem);
	}, []);

	useEffect(() => {
		if (hasFocusWithin || isFiltered || preventCollapse || !scrollDirection.isScrollingY) return;
		setIsCollapsedNavbar(scrollDirection.isScrollingDown);
		setPreventCollapse(true);

		setTimeout(() => {
			setPreventCollapse(false);
		}, 500);
	}, [hasFocusWithin, isFiltered, preventCollapse, scrollDirection]);

	return (
		<section ref={navBarRef} className="WrapperNavBar">
			<Navbar
				className={classNames('CollapseNavbar', { show: !isCollapsedNavbar || activeQuery })}
				sticky="top"
				bg="dark"
				data-bs-theme="dark"
				expand="lg"
			>
				<Container>
					<Navbar.Brand>Relatório Financeiro</Navbar.Brand>

					<Navbar.Toggle aria-controls="navbar-nav" />

					<Navbar.Collapse id="navbar-nav">
						{/* <ul className="navbar-nav me-auto">
							<li className="nav-item">
								<Link to="/finance-report/dashboard" className="nav-link">
									Dashboard
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/finance-report/transactions" className="nav-link">
									Transctions
								</Link>
							</li>
						</ul> */}
						<div className="d-flex align-items-center justify-content-end w-100">
							<Form className="d-flex me-3">
								<Form.Control
									type="search"
									placeholder="Buscar entradas"
									aria-label="Search"
									onChange={searchData && (e => searchData(e.target.value))}
									value={activeQuery}
								/>
							</Form>

							<Dropdown onSelect={handleYearChange} className="me-3">
								<Dropdown.Toggle variant="outline-secondary" id="dropdown-year">
									{year || lastYear || 'Ano'}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{availableYears.map(item => (
										<Dropdown.Item key={item} eventKey={item}>
											{item}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>

							<Dropdown onSelect={handleMonthChange} className="me-3">
								<Dropdown.Toggle variant="outline-secondary" id="dropdown-month">
									{month || lastMonth
										? capitalizeFirstLetter(
												getMonthName(
													`01/${month || lastMonth}/${year || new Date().getFullYear().toString()}`,
												),
										  )
										: 'Mês'}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{availableMonths.map(item => (
										<Dropdown.Item key={item} eventKey={item}>
											{capitalizeFirstLetter(
												getMonthName(`01/${item}/${year || new Date().getFullYear().toString()}`),
											)}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</section>
	);
};

export default NavBar;
