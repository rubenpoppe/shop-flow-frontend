import { createMuiTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { useMemo } from 'react';

export default function useMuiTheme() {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	return useMemo(
		() =>
			createMuiTheme({
				palette: {
					type: prefersDarkMode ? 'dark' : 'light',
					primary: {
						main: '#6dc0d5', // not WCAG AA compliant
					},
					secondary: {
						main: '#ad7a99', // not WCAG AA compliant
					},
				},
			}),
		[prefersDarkMode]
	);
}
