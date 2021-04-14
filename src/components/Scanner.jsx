import './Scanner.css';
import javascriptBarcodeReader from 'javascript-barcode-reader';
import React, { useEffect, useRef, useState } from 'react';
import { Fab, Snackbar, Button, IconButton } from '@material-ui/core';
import { ArrowBack, FlashOff, FlashOn } from '@material-ui/icons';
import { useHistory } from 'react-router';
import Incrementer from './Incrementer';
import { openDB } from 'idb';

function Scanner() {
	const [capabilities, setCapabilities] = useState({});
	const [flash, setFlash] = useState(false);
	const [code, setCode] = useState('');
	const [product, setProduct] = useState(null);
	const [open, setOpen] = useState(false);
	const [count, setCount] = useState(1);

	const streamRef = useRef(null);
	const scanRef = useRef(null);
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const dbRef = useRef(null);

	const history = useHistory();

	let previousCode = ''; // state?

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
				videoRef.current.srcObject = stream;
				if (capabilities.focusMode) {
					stream.getVideoTracks()[0].applyConstraints({
						advanced: [{ focusMode: 'continuous' }],
					});
				}

				videoRef.current.play();
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
			clearInterval(scanRef.current);
			streamRef.current.getVideoTracks()[0].stop();
		};
	}, []);

	useEffect(() => {
		if (code !== '') {
			fetch(`${process.env.REACT_APP_API_URL}/products/${code}`)
				.then((res) => res.json())
				.then((json) => {
					setOpen(true);
					setProduct(json);
				});
		}
	}, [code]);

	const handleVideo = () => {
		canvasRef.current.setAttribute(
			'width',
			Math.round(videoRef.current.videoWidth * 0.7)
		);
		canvasRef.current.setAttribute(
			'height',
			Math.round(videoRef.current.videoHeight * 0.25)
		);
		const ctx = canvasRef.current.getContext('2d');

		scanRef.current = setInterval(() => {
			ctx.drawImage(
				videoRef.current,
				videoRef.current.videoWidth * 0.15,
				videoRef.current.videoHeight * 0.375,
				videoRef.current.videoWidth * 0.7,
				videoRef.current.videoHeight * 0.25,
				0,
				0,
				videoRef.current.videoWidth * 0.7,
				videoRef.current.videoHeight * 0.25
			);

			javascriptBarcodeReader({
				image: canvasRef.current,
				barcode: 'ean-13',
				options: {
					useAdaptiveThreshold: true,
				},
			})
				.then((code) => {
					if (!isNaN(code) && code.length === 12 && code === previousCode) {
						// navigator.vibrate(200); // vibrates only after user input
						setCode(code);
						setTimeout(() => {}, 500);
					}
					previousCode = code;
				})
				.catch((err) => {
					// handle error appropriately
				});
		}, 100);
	};

	const handleFlash = () => {
		streamRef.current
			.getVideoTracks()[0]
			.applyConstraints({ advanced: [{ torch: !flash }] });
		setFlash(!flash);
	};

	const resetProduct = () => {
		setProduct(null);
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
			<video autoPlay ref={videoRef} onCanPlay={handleVideo}></video>
			<div id="box"></div>
			<canvas ref={canvasRef}></canvas>
			<IconButton
				id="back"
				aria-label="ga terug"
				onClick={() =>
					history.length === 1 ? history.push('/') : history.goBack()
				}
			>
				<ArrowBack />
			</IconButton>
			{capabilities.torch && (
				<Fab
					className="flash"
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
					<>
						<p>{product?.name}</p>
						<Incrementer count={count} onChange={setCount} />
					</>
				}
				action={
					<Button color="primary" onClick={removeItem}>
						Verwijder
					</Button>
				}
				open={open}
			/>
		</>
	);
}

export default Scanner;
