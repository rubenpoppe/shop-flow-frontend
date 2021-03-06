import styles from './Products.module.css';
import {
	AppBar,
	Avatar,
	CircularProgress,
	Divider,
	Drawer,
	IconButton,
	InputBase,
	InputLabel,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	MenuItem,
	Select,
	Toolbar,
	Typography,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { FilterList, Search, Store } from '@material-ui/icons';
import { isMobile } from 'react-device-detect';
import queryParamJoiner from '../utils/queryParamJoiner';
import useQuery from '../hooks/useQuery';
import loadingAttributePolyfill from 'loading-attribute-polyfill';
import { Helmet } from 'react-helmet';

export default function Products() {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [search, setSearch] = useState(useQuery().search);
	const [category, setCategory] = useState(useQuery().category);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [canSearch, setCanSearch] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const history = useHistory();
	let params = [];

	useEffect(
		() =>
			fetch(`${process.env.REACT_APP_API_URL}/api/categories`)
				.then((res) => res.json())
				.then((json) => setCategories(json))
				.catch((_) => setCategories([])),
		[]
	);

	useEffect(() => {
		params = [];
		if (!!search) params.push({ key: 'search', value: search });
		if (!!category && category !== 'all')
			params.push({ key: 'category', value: category });

		fetch(
			`${process.env.REACT_APP_API_URL}/api/products${queryParamJoiner(params)}`
		)
			.then((res) => res.json())
			.then((json) => {
				setProducts(json);
				setIsLoading(false);
			})
			.catch((_) => setProducts([]));

		history.replace(`/products${queryParamJoiner(params)}`);
	}, [canSearch, category]);

	const handleSearch = (e) => {
		e.preventDefault();
		setCanSearch(search);
	};

	return (
		<>
			<Helmet>
				<title>Overzicht producten | Shop flow</title>
			</Helmet>
			{isLoading ? (
				<CircularProgress style={{ position: 'fixed' }} />
			) : (
				<>
					<AppBar style={{ zIndex: 1400 }}>
						<Toolbar style={{ justifyContent: 'space-between' }}>
							<div></div>
							<form className={styles.search} onSubmit={handleSearch}>
								<Search
									style={{ color: 'rgba(0, 0, 0, 0.54)', paddingRight: '1rem' }}
								/>
								<InputBase
									placeholder="Zoeken"
									type="search"
									name="search"
									inputProps={{
										style: { padding: 0, color: 'rgba(0, 0, 0, 0.87)' },
									}}
									fullWidth={true}
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</form>
							<IconButton
								onClick={() => setDrawerOpen(!drawerOpen)}
								style={{ color: 'rgba(0, 0, 0, 0.54)' }}
							>
								<FilterList />
							</IconButton>
						</Toolbar>
					</AppBar>

					{products.length === 0 ? (
						<Typography
							color="textSecondary"
							style={{ marginTop: isMobile ? '3em' : '3.5rem' }}
						>
							{window.navigator.onLine
								? 'Geen producten gevonden'
								: 'Je moet online om te kunnen zoeken'}
						</Typography>
					) : (
						<List
							component="nav"
							style={{ marginTop: isMobile ? '2.5rem' : '3rem' }}
						>
							{products.map((product, i) => (
								<Fragment key={product.id}>
									<ListItem component={Link} to={`/products/${product.id}`}>
										<ListItemAvatar>
											<Avatar
												src={`${process.env.REACT_APP_CDN_URL}/img/${product.id}.jpg`}
											>
												<Store />
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={product.name}
											primaryTypographyProps={{ color: 'textPrimary' }}
											secondary={product.description}
										/>
									</ListItem>
									{products.length - 1 > i && <Divider />}
								</Fragment>
							))}
						</List>
					)}

					<Drawer
						anchor="right"
						open={drawerOpen}
						onClose={() => setDrawerOpen(false)}
						PaperProps={{
							style: {
								width: 'clamp(10rem, 60%, 24rem)',
								padding: `${isMobile ? '4.5rem' : '5.5rem'} 1rem 0`,
							},
						}}
					>
						<InputLabel>Categorie</InputLabel>
						<Select
							native={isMobile}
							value={category || 'all'}
							onChange={(e) => setCategory(e.target.value)}
						>
							{[{ value: 'all', name: 'Alle' }, ...categories].map((c) =>
								isMobile ? (
									<option value={c?.value || c.name.toLowerCase()} key={c.name}>
										{c.name}
									</option>
								) : (
									<MenuItem
										value={c?.value || c.name.toLowerCase()}
										key={c.name}
									>
										{c.name}
									</MenuItem>
								)
							)}
						</Select>
					</Drawer>
				</>
			)}
		</>
	);
}
