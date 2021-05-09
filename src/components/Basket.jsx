import styles from './Basket.module.css';
import {
	Avatar,
	Button,
	Divider,
	Fab,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Fragment, useEffect, useState, useRef } from 'react';
import { openDB } from 'idb';
import Incrementer from './Incrementer';
import { ShoppingCart } from '@material-ui/icons';

export default function Products() {
	const [products, setProducts] = useState([]);

	const dbRef = useRef(null);

	useEffect(() => {
		async function getProducts() {
			const db = await openDB('basket', 1, {
				upgrade(db) {
					db.createObjectStore('basket');
				},
			});

			dbRef.current = db;

			const ids = await db.getAllKeys('basket');
			Promise.all(
				ids.map(async (id) => {
					const product = await fetch(
						`${process.env.REACT_APP_API_URL}/api/products/${id}`
					).then((res) => res.json());
					product.count = await db.get('basket', id);
					return product;
				})
			).then((res) => setProducts(res));
		}
		getProducts();
	}, []);

	const removeProduct = async (id) => {
		setProducts(products.filter((product) => product.id !== id));
		await dbRef.current.delete('basket', id);
	};

	const updateCount = async (e, id) => {
		setProducts(
			[...products].map((product) =>
				product.id === id ? { ...product, count: e } : product
			)
		);
		await dbRef.current.put('basket', e, id);
	};

	return products.length === 0 ? (
		<Typography color="textSecondary">
			Nog geen producten in het winkelmandje
		</Typography>
	) : (
		<>
			<List style={{ paddingBottom: '3.6rem' }}>
				{products.map((product, i) => (
					<Fragment key={product.id}>
						<ListItem>
							<ListItemText
								primary={
									<>
										<Link
											to={`/products/${product.id}`}
											className={styles.productLink}
										>
											{product.name}
										</Link>
										<Typography variant="overline" color="textSecondary">
											{`€${product.sellingPrice * product.count}`}
										</Typography>
									</>
								}
								primaryTypographyProps={{
									color: 'textPrimary',
									component: 'div',
									style: { display: 'flex' },
									className: styles.productWrapper,
								}}
								secondary={
									<>
										<Button
											color="primary"
											onClick={() => removeProduct(product.id)}
											style={{ padding: 0 }}
										>
											Verwijder
										</Button>
										<Incrementer
											count={product.count}
											onChange={(e) => updateCount(e, product.id)}
										/>
									</>
								}
								secondaryTypographyProps={{
									component: 'div',
									style: { display: 'flex' },
									className: styles.productWrapper,
								}}
							/>
						</ListItem>
						{products.length - 1 > i && <Divider />}
					</Fragment>
				))}
			</List>
			<Fab
				variant="extended"
				color="primary"
				className={styles.checkout}
				style={{ position: 'fixed', color: 'rgba(0, 0, 0, 0.54)' }}
				aria-label="Doorgaan naar afrekenen"
				component={Link}
				to="/checkout"
			>
				<ShoppingCart />
				&nbsp;&nbsp;€
				{products.reduce((sum, p) => sum + p.sellingPrice * p.count, 0)}
			</Fab>
		</>
	);
}
