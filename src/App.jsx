import React from 'react';
import './App.css';
import { ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import theme from './muiTheme';
import BottomNav from './components/BottomNav';
import Scanner from './components/Scanner';

function App() {
	return (
		<Router>
			<ThemeProvider theme={theme}>
				<Switch>
					<Route path="/products" exact></Route>
					<Route path="/products/:id"></Route>
					<Route path="/scan"></Route>
					<Route path="/basket"></Route>
				</Switch>

				<BottomNav />
			</ThemeProvider>
		</Router>
	);
}

export default App;
