import './Product.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CardMedia, IconButton, Typography } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router';

export default function Product() {
	const [product, setProduct] = useState(null);

	const { id } = useParams();
	const history = useHistory();

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
				<IconButton
					id="back"
					aria-label="ga terug"
					onClick={() =>
						history.length === 1 ? history.push('/') : history.goBack()
					}
					style={{ color: 'rgba(0, 0, 0, 0.54)' }}
				>
					<ArrowBack />
				</IconButton>
				<CardMedia
					title={product.name}
					alt=""
					image={`${process.env.REACT_APP_CDN_URL}/img/${product.id}.jpg`}
					component="img"
					height="200"
					style={{ width: '100vw', objectFit: 'contain', background: '#fff' }}
				/>
				<div>
					<Typography
						gutterBottom
						variant="h5"
						component="h1"
						color="textPrimary"
					>
						{product.name}
					</Typography>
					<Typography
						variant="overline"
						color="textSecondary"
					>{`€${product.sellingPrice}`}</Typography>
				</div>
				<Typography gutterBottom variant="button" color="primary">
					{product.category}
				</Typography>
				<section>
					<Typography variant="h6" component="h2" color="textPrimary">
						Merk
					</Typography>
					<Typography color="textSecondary">{product.brand}</Typography>
				</section>

				<section>
					<Typography variant="h6" component="h2" color="textPrimary">
						Beschrijving
					</Typography>
					<Typography color="textSecondary">{product.description}</Typography>
				</section>
			</>
		)
	);
}
