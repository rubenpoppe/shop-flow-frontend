import styles from './Home.module.css';
import { Button, Typography } from '@material-ui/core';
import React from 'react';

export default function Home() {
	let deferredPrompt;

	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		deferredPrompt = e;
	});

	const handleInstall = async () => {
		deferredPrompt.prompt();
		deferredPrompt = null;
	};

	return (
		<>
			<div className={styles.wrapper}>
				<Typography variant="h2" component="h1">
					Welkom!
				</Typography>
				<div className={styles.textWrapper}>
					<Typography className={styles.text}>
						Even de beschikbare producten bekijken? Of snel iets nodig en geen
						tijd om te wachten aan de kassa?
					</Typography>
					<Typography className={styles.text}>
						Geen nood, deze app zorgt er voor. Met de scan-functie, scan je je
						producten en betaal je vanop je smartphone.
					</Typography>
					<Typography className={styles.text}>
						Installeer de app zodat je hem altijd snel bij de hand hebt.
					</Typography>
				</div>
				{!window.matchMedia('(display-mode: standalone)').matches && (
					<Button
						onClick={handleInstall}
						variant="contained"
						color="primary"
						size="large"
						fullWidth={true}
						style={{ color: '#fff' }}
					>
						Installeer
					</Button>
				)}
			</div>
		</>
	);
}
