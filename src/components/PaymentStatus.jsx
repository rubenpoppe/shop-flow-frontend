import styles from './PaymentStatus.module.css';
import { Button, Typography } from '@material-ui/core';
import { HighlightOff, CheckCircleOutline } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import React from 'react';
import { useState, useEffect } from 'react';

export function PaymentSuccess(props) {
	return (
		<>
			<div className={styles.wrapper}>
				<CheckCircleOutline
					htmlColor="#81c784"
					fontSize="large"
					style={{ width: '14rem', height: '14rem' }}
				/>
				<div className={styles.textWrapper}>
					<Typography variant="h2" component="h1">
						Succes!
					</Typography>
					<Typography>
						De betaling met id{' '}
						<Typography className={styles.bold} component="span">
							{props.paymentIntentId}
						</Typography>{' '}
						is gelukt! U kan nu verder winkelen.
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
					Overzicht
				</Button>
			</div>
		</>
	);
}

export function PaymentFail() {
	const [timer, setTimer] = useState();

	useEffect(
		() =>
			setTimer(setTimeout(() => window.location.replace('/checkout'), 5000)),
		[]
	);

	return (
		<>
			<div className={styles.wrapper}>
				<HighlightOff
					color="error"
					fontSize="large"
					style={{ width: '14rem', height: '14rem' }}
				/>
				<div className={styles.textWrapper}>
					<Typography variant="h2" component="h1">
						Mislukt!
					</Typography>
					<Typography>
						De betaling is mislukt! U kan terug keren naar de checkout. Als u
						vragen heeft kan u contact opnemen.
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
					Opnieuw
				</Button>
			</div>
		</>
	);
}
