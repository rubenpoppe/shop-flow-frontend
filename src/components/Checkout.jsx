import styles from './Checkout.module.css';
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
	Button,
	Card,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Radio,
	RadioGroup,
	Step,
	StepLabel,
	Stepper,
	TextField,
	Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import useQuery from '../hooks/useQuery';
import { PaymentSuccess, PaymentFail } from './PaymentStatus';
import stripeErrorCodes from '../assets/stripe-error-codes';
import { deleteDB, openDB } from 'idb';

export default function Checkout() {
	const [paymentMethod, setPaymentMethod] = useState('bancontact');
	const [activeStep, setActiveStep] = useState(0);
	const [succeeded, setSucceeded] = useState(false);
	const [error, setError] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [clientSecret, setClientSecret] = useState('');
	const [accountHolder, setAccountHolder] = useState('');

	const stripe = useStripe();
	const elements = useElements();
	const history = useHistory();
	const { redirect_status } = useQuery();

	const paymentMethods = [
		{ value: 'bancontact', label: 'Bancontact' },
		{ value: 'card', label: 'Kredietkaart' },
		{ value: 'native', label: 'Native Pay' },
	];

	const steps = ['Betaalwijze', 'Gegevens'];

	useEffect(() => {
		if (!redirect_status) {
			async function createPaymentIntent() {
				const db = await openDB('basket', 1, {
					upgrade(db) {
						db.createObjectStore('basket');
					},
				});

				const ids = await db.getAllKeys('basket');

				Promise.all(
					ids.map(async (id) => ({
						id: id,
						amount: await db.get('basket', id),
					}))
				).then((products) => {
					fetch(`${process.env.REACT_APP_API_URL}/create-payment-intent`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ items: products }),
					})
						.then((res) => res.json())
						.then((data) => setClientSecret(data.clientSecret));
				});
			}

			createPaymentIntent();
		} else if (redirect_status === 'succeeded') {
			async function emptyBasket() {
				await deleteDB('basket');
			}

			emptyBasket();
		}
	}, [redirect_status]);

	useEffect(() => setError(''), [activeStep]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setProcessing(true);

		let payload = null;
		switch (paymentMethod) {
			case 'bancontact':
				payload = await stripe.confirmBancontactPayment(clientSecret, {
					payment_method: {
						billing_details: {
							name: accountHolder,
						},
					},
					return_url: `${window.location.origin}/checkout`,
				});
				break;
			case 'card':
				payload = await stripe.confirmCardPayment(clientSecret, {
					payment_method: {
						card: elements.getElement(CardElement),
						billing_details: {
							name: accountHolder,
						},
					},
				});
				break;
			default:
				payload = { error: { message: 'Kies een geldige betaalwijze' } };
				break;
		}

		if (payload.error) {
			setError(stripeErrorCodes[payload.error.code]);
			setProcessing(false);
		} else {
			setError('');
			setProcessing(false);
			setSucceeded(true);
			history.push(`/checkout?redirect_status=${payload.paymentIntent.status}`);
		}
	};

	return !redirect_status ? (
		<form onSubmit={handleSubmit}>
			<Stepper
				alternativeLabel
				activeStep={activeStep}
				style={{ marginBottom: '2rem' }}
			>
				{steps.map((step) => (
					<Step key={step}>
						<StepLabel>{step}</StepLabel>
					</Step>
				))}
			</Stepper>
			<div>
				<FormLabel component="label">{steps[activeStep]}</FormLabel>
				{activeStep === 0 ? (
					<RadioGroup
						aria-label="betaalwijze"
						value={paymentMethod}
						onChange={(e) => setPaymentMethod(e.target.value)}
					>
						{paymentMethods.map((x) => (
							<Card className={styles.method} key={x.value}>
								<FormControlLabel
									value={x.value}
									control={<Radio />}
									label={x.label}
								/>
							</Card>
						))}
					</RadioGroup>
				) : (
					<FormGroup className={styles.data}>
						<div>
							<TextField
								value={accountHolder}
								variant="outlined"
								label="Naam"
								onChange={(e) => setAccountHolder(e.target.value)}
								style={{ marginBottom: '1rem' }}
							/>
							{paymentMethod === 'card' && <CardElement />}
						</div>
						{error && (
							<Typography color="error" role="alert">
								{error}
							</Typography>
						)}
					</FormGroup>
				)}
			</div>
			<div className={styles.buttonGroup}>
				<Button
					disabled={activeStep === 0}
					onClick={() => setActiveStep(activeStep - 1)}
				>
					Stap terug
				</Button>
				{activeStep !== steps.length - 1 ? (
					<Button
						variant="contained"
						onClick={() => setActiveStep(activeStep + 1)}
						key="next"
					>
						Ga door
					</Button>
				) : (
					<Button
						variant="contained"
						type="submit"
						disabled={processing || succeeded}
						key="pay"
					>
						{processing ? <CircularProgress size="1.75rem" /> : 'Betaal'}
					</Button>
				)}
			</div>
		</form>
	) : redirect_status === 'succeeded' ? (
		<PaymentSuccess />
	) : (
		<PaymentFail />
	);
}
