import styles from './Scanner.module.css';
import { BrowserMultiFormatOneDReader } from '@zxing/browser';
import React, { useEffect, useRef, useState } from 'react';
import {
	Fab,
	Snackbar,
	Button,
	IconButton,
	ThemeProvider,
	createMuiTheme,
	useMediaQuery,
} from '@material-ui/core';
import { ArrowBack, FlashOff, FlashOn } from '@material-ui/icons';
import { useHistory } from 'react-router';
import Incrementer from './Incrementer';
import { openDB } from 'idb';

function Scanner() {
	const [capabilities, setCapabilities] = useState({});
	const [flash, setFlash] = useState(false);
	const [code, setCode] = useState('');
	const [product, setProduct] = useState();
	const [open, setOpen] = useState(false);
	const [count, setCount] = useState(1);

	const streamRef = useRef(null);
	const barcodeReader = useRef();
	const dbRef = useRef(null);

	const history = useHistory();

	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const incrementerTheme = createMuiTheme({
		palette: {
			type: prefersDarkMode ? 'light' : 'dark',
		},
	});

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({
				video: {
					facingMode: 'environment',
					aspectRatio: window.innerHeight / window.innerWidth,
				},
			})
			.then((stream) => {
				setCapabilities(
					Object.fromEntries(
						Object.entries(
							navigator.mediaDevices.getSupportedConstraints()
						).map(([k, v]) => [
							k,
							!!(stream.getVideoTracks()[0].getCapabilities()[k] && v),
						])
					)
				);
				streamRef.current = stream;

				if (capabilities.focusMode) {
					stream.getVideoTracks()[0].applyConstraints({
						advanced: [{ focusMode: 'continuous' }],
					});
				}

				new BrowserMultiFormatOneDReader().decodeFromStream(
					stream,
					'video',
					(res, err, controls) => {
						barcodeReader.current = controls;
						if (res) setCode(res.text);
					}
				);
			})
			.catch(); // catch possible errors

		async function createDB() {
			const db = await openDB('basket', 1, {
				upgrade(db) {
					db.createObjectStore('basket');
				},
			});
			dbRef.current = db;
		}
		createDB();

		return () => {
			barcodeReader.current.stop();
			streamRef.current.getVideoTracks()[0].stop();
		};
	}, []);

	useEffect(() => {
		if (code !== '') {
			async function getCount(code) {
				setCount((await dbRef.current.get('basket', code)) || 1);
			}
			getCount(code);

			fetch(`${process.env.REACT_APP_API_URL}/api/products/${code}`)
				.then((res) => res.json())
				.then((json) => {
					setProduct(json);
					setOpen(true);
				})
				.catch((_) => {
					setProduct(null);
					setOpen(true);
				});
		}
	}, [code]);

	const handleFlash = () => {
		streamRef.current
			.getVideoTracks()[0]
			.applyConstraints({ advanced: [{ torch: !flash }] });
		setFlash(!flash);
	};

	const resetProduct = () => {
		setProduct();
		setCount(1);
		setCode('');
	};

	const handleClose = async () => {
		setOpen(false);
		if (product !== null) await dbRef.current.put('basket', count, product.id);
		resetProduct();
	};

	const removeItem = () => {
		setOpen(false);
		resetProduct();
	};

	return (
		<>
			<IconButton
				id="back"
				aria-label="ga terug"
				onClick={() =>
					history.length === 1 ? history.push('/') : history.goBack()
				}
				style={{ color: '#fff' }}
			>
				<ArrowBack />
			</IconButton>
			<div className={styles.wrapper}>
				<video id="video" className={styles.feed}></video>
				<div className={styles.box}></div>

				{capabilities.torch && (
					<Fab
						className={styles.flash}
						aria-label={flash ? 'flash uit' : 'flash aan'}
						onClick={handleFlash}
					>
						{flash ? <FlashOff /> : <FlashOn />}
					</Fab>
				)}
				<Snackbar
					autoHideDuration={5000}
					resumeHideDuration={5000}
					onClose={handleClose}
					message={
						product === null ? (
							<p>Product niet gevonden</p>
						) : (
							<>
								<p>{product?.name}</p>
								<ThemeProvider theme={incrementerTheme}>
									<Incrementer count={count} onChange={setCount} />
								</ThemeProvider>
							</>
						)
					}
					action={
						<Button color="primary" onClick={removeItem}>
							Verwijder
						</Button>
					}
					open={open}
				/>
			</div>
		</>
	);
}

export default Scanner;
