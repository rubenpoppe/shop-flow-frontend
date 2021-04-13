import React, { lazy, Suspense } from 'react';
import './App.css';
import { CircularProgress, ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useMuiTheme from './hooks/useMuiTheme';
import BottomNav from './components/BottomNav';
const Products = lazy(() => import('./components/Products'));
const Scanner = lazy(() => import('./components/Scanner'));

function App() {
	return (
		<Router>
			<ThemeProvider theme={useMuiTheme()}>
				<main>
					<Switch>
						<Suspense fallback={<CircularProgress />}>
							<Route path="/products" exact>
								<Products />
							</Route>
							<Route path="/products/:id"></Route>
							<Route path="/scan">
								<Scanner />
							</Route>
							<Route path="/basket"></Route>
						</Suspense>
					</Switch>
				</main>

				<BottomNav />
			</ThemeProvider>
		</Router>
	);
}

export default App;
