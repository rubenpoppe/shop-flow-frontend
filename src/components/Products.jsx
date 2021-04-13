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
				<Fragment key={product.Id}>
					<ListItem component={Link} to={`/products/${product.Id}`}>
						<ListItemAvatar>
							<Avatar />
						</ListItemAvatar>
						<ListItemText
							primary={product.Name}
							primaryTypographyProps={{ color: 'textPrimary' }}
							secondary={product.Description}
						/>
					</ListItem>
					{products.length - 1 > i && <Divider />}
				</Fragment>
			))}
		</List>
	);
}
