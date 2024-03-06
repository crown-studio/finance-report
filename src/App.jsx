import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './containers/dashboard/Dashboard';
import Transactions from './containers/transactions/Transactions';
import { ChakraProvider } from '@chakra-ui/react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
	return (
		<div className="App">
			<ChakraProvider>
				<Router>
					<Routes>
						<Route path="finance-report/" element={<Dashboard />} />
						<Route path="finance-report/dashboard" element={<Dashboard />} />
						<Route path="finance-report/transactions" element={<Transactions />} />
						<Route path="*" element={<Dashboard />} />
					</Routes>
				</Router>
			</ChakraProvider>
		</div>
	);
}

export default App;