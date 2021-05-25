import styles from './Status.module.css';
import { Button, Typography } from '@material-ui/core';
import { HighlightOff, CheckCircleOutline } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import React from 'react';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

export function PaymentSuccess(props) {
	return (
		<>
			<Helmet>
				<title>Betaling geslaagd! | Shop flow</title>
			</Helmet>
			<div className={styles.wrapper}>
				<CheckCircleOutline
					htmlColor="#81c784"
					fontSize="large"
					style={{ width: '14rem', height: '14rem' }}
				/>
				<div className={styles.textWrapper}>
					<Typography variant="h2" component="h1" color="textPrimary">
						Bedankt!
					</Typography>
					<Typography color="textPrimary">
						De betaling met id{' '}
						<Typography className={styles.bold} component="span">
							{props.paymentIntentId}
						</Typography>{' '}
						is geslaagd. We hopen je snel terug te zien.
					</Typography>
				</div>

				<Button
					component={Link}
					to="/products"
					variant="contained"
					color="primary"
					size="large"
					fullWidth={true}
					style={{ color: '#fff' }}
				>
					Naar producten
				</Button>
			</div>
		</>
	);
}

export function PaymentFail() {
	const [timer, setTimer] = useState();

	useEffect(
		() =>
			setTimer(setTimeout(() => window.location.replace('/checkout'), 3000)),
		[]
	);

	return (
		<>
			<Helmet>
				<title>Betaling mislukt | Shop flow</title>
			</Helmet>
			<div className={styles.wrapper}>
				<HighlightOff
					color="error"
					fontSize="large"
					style={{ width: '14rem', height: '14rem' }}
				/>
				<div className={styles.textWrapper}>
					<Typography variant="h2" component="h1" color="textPrimary">
						Mislukt!
					</Typography>
					<Typography color="textPrimary">
						Er ging iets bij de betaling. Contacteer een winkelbediende na
						meerdere mislukte pogingen.
					</Typography>
				</div>

				<Button
					onClick={() => clearTimeout(timer)}
					component={Link}
					to="/checkout"
					variant="contained"
					color="primary"
					size="large"
					fullWidth={true}
					style={{ color: '#fff' }}
				>
					Opnieuw proberen
				</Button>
			</div>
		</>
	);
}
