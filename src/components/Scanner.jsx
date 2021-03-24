import './Scanner.css';
import javascriptBarcodeReader from 'javascript-barcode-reader';
import React, { useEffect, useRef, useState } from 'react';
import { Fab } from '@material-ui/core';
import { ArrowBack, FlashOff, FlashOn } from '@material-ui/icons';
import { useHistory } from 'react-router';

function Scanner() {
	const [capabilities, setCapabilities] = useState({});
	const [flash, setFlash] = useState(false);

	const streamRef = useRef(null);
	const scanRef = useRef(null);
	const videoRef = useRef(null);
	const canvasRef = useRef(null);

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

		return () => {
			clearInterval(scanRef.current);
			streamRef.current.getVideoTracks()[0].stop();
		};
	}, []);

	const handleVideo = () => {
		canvasRef.current.setAttribute('width', videoRef.current.videoWidth * 0.7);
		canvasRef.current.setAttribute(
			'height',
			videoRef.current.videoHeight * 0.25
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
						alert('barcode: ' + code);
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

	return (
		<>
			<video autoPlay ref={videoRef} onCanPlay={handleVideo}></video>
			<div id="box"></div>
			<canvas ref={canvasRef}></canvas>
			<button id="back" aria-label="ga terug" onClick={() => history.goBack()}>
				<ArrowBack />
			</button>
			{capabilities.torch && (
				<Fab
					className="flash"
					aria-label={flash ? 'flash uit' : 'flash aan'}
					onClick={handleFlash}
				>
					{flash ? <FlashOff /> : <FlashOn />}
				</Fab>
			)}
		</>
	);
}

export default Scanner;
