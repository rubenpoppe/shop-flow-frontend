import { useLocation } from 'react-router';

export default function useQuery() {
	return Object.fromEntries(new URLSearchParams(useLocation().search));
}
