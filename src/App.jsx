import React, { lazy, Suspense } from 'react';
import './App.css';
import { CircularProgress, ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import useMuiTheme from './hooks/useMuiTheme';
import BottomNav from './components/BottomNav';
const Products = lazy(() => import('./components/Products'));
const Product = lazy(() => import('./components/Product'));
const Scanner = lazy(() => import('./components/Scanner'));
const Basket = lazy(() => import('./components/Basket'));

function App() {
	return (
		<Router>
			<ThemeProvider theme={useMuiTheme()}>
				<main>
					<Switch>
						<Suspense
							fallback={<CircularProgress style={{ position: 'fixed' }} />}
						>
							<Route path="/products" exact>
								<Products />
							</Route>
							<Route path="/products/:id">
								<Product />
							</Route>
							<Route path="/scan">
								<Scanner />
							</Route>
							<Route path="/basket">
								<Basket />
							</Route>
						</Suspense>
					</Switch>
				</main>

				<BottomNav />
			</ThemeProvider>
		</Router>
	);
}

export default App;
