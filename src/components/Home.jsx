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
						Wij hebben een app ontwikkeld dat het vergemakkelijkt om
						buurtwinkels te beheren.
					</Typography>
					<Typography className={styles.text}>
						De app biedt een overzichtspagina voor al de producten, een detail
						pagina per product, de mogelijkheid om als klant zelf producten te
						scannen.
					</Typography>
					<Typography className={styles.text}>
						Aarzel niet om onze app te instaleren en uit te proberen!
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
						Install
					</Button>
				)}
			</div>
		</>
	);
}
