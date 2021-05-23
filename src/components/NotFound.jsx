import styles from './Status.module.css';
import { Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet';

export default function NotFound() {
	return (
		<>
			<Helmet>
				<title>Niet gevonden | Shop flow</title>
			</Helmet>
			<div className={styles.wrapper}>
				<img
					src="/images/shop-closed.svg"
					alt="winkel gesloten bordje"
					style={{ height: '14rem' }}
				/>
				<Typography variant="h5" component="h1" className={styles.textWrapper}>
					We kunnen deze pagina niet terugvinden.
				</Typography>
			</div>
		</>
	);
}
