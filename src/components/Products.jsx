import styles from './Products.module.css';
import {
	AppBar,
	Avatar,
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
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { FilterList, Search } from '@material-ui/icons';
import { isMobile } from 'react-device-detect';
import queryParamJoiner from '../utils/queryParamJoiner';
import useQuery from '../hooks/useQuery';

export default function Products() {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState(useQuery().category);
	const [drawerOpen, setDrawerOpen] = useState(false);

	let params = [];

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/products`)
			.then((res) => res.json())
			.then((json) => setProducts(json));
		fetch(`${process.env.REACT_APP_API_URL}/categories`)
			.then((res) => res.json())
			.then((json) => setCategories(json));
	}, []);

	useEffect(() => {
		params = [];
		if (!!search) params.push({ key: 'search', value: search });
		if (!!category && category !== 'all')
			params.push({ key: 'category', value: category });
	}, [search, category]);

	useEffect(
		() =>
			fetch(
				`${process.env.REACT_APP_API_URL}/products${queryParamJoiner(params)}`
			)
				.then((res) => res.json())
				.then((json) => setProducts(json)),
		[category]
	);

	const handleSearch = (e) => {
		e.preventDefault();
		fetch(
			`${process.env.REACT_APP_API_URL}/products${queryParamJoiner(params)}`
		)
			.then((res) => res.json())
			.then((json) => setProducts(json));
	};

	return (
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

			<List component="nav" style={{ marginTop: isMobile ? '2.5rem' : '3rem' }}>
				{products.map((product, i) => (
					<Fragment key={product.id}>
						<ListItem component={Link} to={`/products/${product.id}`}>
							<ListItemAvatar>
								<Avatar />
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
					value={category}
					onChange={(e) => setCategory(e.target.value)}
				>
					{[{ value: 'all', name: 'Alle' }, ...categories].map((c) =>
						isMobile ? (
							<option value={c?.value || c.name.toLowerCase()} key={c.name}>
								{c.name}
							</option>
						) : (
							<MenuItem value={c?.value || c.name.toLowerCase()} key={c.name}>
								{c.name}
							</MenuItem>
						)
					)}
				</Select>
			</Drawer>
		</>
	);
}
