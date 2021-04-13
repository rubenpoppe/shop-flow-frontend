import './Product.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CardMedia, Typography } from '@material-ui/core';

export default function Product() {
	const [product, setProduct] = useState(null);

	const { id } = useParams();

	useEffect(
		() =>
			fetch(`${process.env.REACT_APP_API_URL}/products/${id}`)
				.then((res) => res.json())
				.then((json) => setProduct(json)),
		[id]
	);

	return (
		product !== null && (
			<>
				<CardMedia
					title={product.Name}
					alt=""
					image={'https://via.placeholder.com/150'} // TODO image path
					component="img"
					height="200"
					style={{ width: '100vw' }}
				/>
				<div>
					<Typography
						gutterBottom
						variant="h5"
						component="h1"
						color="textPrimary"
					>
						{product.Name}
					</Typography>
					<Typography
						variant="overline"
						color="textSecondary"
					>{`€${product.SellingPrice}`}</Typography>
				</div>
				<Typography gutterBottom variant="button" color="primary">
					{product.Category}
				</Typography>
				<section>
					<Typography variant="h6" component="h2" color="textPrimary">
						Merk
					</Typography>
					<Typography color="textSecondary">{product.Brand}</Typography>
				</section>

				<section>
					<Typography variant="h6" component="h2" color="textPrimary">
						Beschrijving
					</Typography>
					<Typography color="textSecondary">{product.Description}</Typography>
				</section>
			</>
		)
	);
}
