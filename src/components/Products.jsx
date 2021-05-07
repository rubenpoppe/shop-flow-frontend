import {
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import loadingAttributePolyfill from 'loading-attribute-polyfill';

export default function Products() {
	const [products, setProducts] = useState([]);

	useEffect(
		() =>
			fetch(`${process.env.REACT_APP_API_URL}/products`)
				.then((res) => res.json())
				.then((json) => setProducts(json)),
		[]
	);

	return (
		<List component="nav">
			{products.map((product, i) => (
				<Fragment key={product.id}>
					<ListItem component={Link} to={`/products/${product.id}`}>
						<ListItemAvatar>
							<Avatar
								src={`${process.env.REACT_APP_CDN_URL}/img/${product.id}.jpg`}
								imgProps={{ loading: 'lazy' }}
							/>
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
	);
}
