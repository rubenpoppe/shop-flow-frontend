import { Typography } from '@material-ui/core';
import styles from './PaymentStatus.module.css';

export default function NotFound() {
	return (
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
	);
}
