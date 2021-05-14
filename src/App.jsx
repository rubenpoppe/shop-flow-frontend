import React, { lazy, Suspense } from 'react';
import './App.css';
import { CircularProgress, ThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import useMuiTheme from './hooks/useMuiTheme';
import BottomNav from './components/BottomNav';
const Products = lazy(() => import('./components/Products'));
const Product = lazy(() => import('./components/Product'));
const Scanner = lazy(() => import('./components/Scanner'));
const Basket = lazy(() => import('./components/Basket'));
const Checkout = lazy(() => import('./components/Checkout'));
const Home = lazy(() => import('./components/Home'));

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function App() {
	return (
		<Router>
			<ThemeProvider theme={useMuiTheme()}>
				<main>
					<Switch>
						<Suspense
							fallback={<CircularProgress style={{ position: 'fixed' }} />}
						>
							<Route path="/" exact>
								<Home />
							</Route>
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
							<Route path="/checkout">
								<Elements stripe={stripePromise}>
									<Checkout />
								</Elements>
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
