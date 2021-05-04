export default function queryParamJoiner(params) {
	return params.reduce((queryString, param, i) => {
		return (
			queryString +
			`${i === 0 ? '?' : ''}${param.key}=${param.value}${
				i !== params.length - 1 ? '&' : ''
			}`
		);
	}, '');
}
