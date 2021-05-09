import React from 'react';
import {
	BottomNavigation,
	BottomNavigationAction,
	Collapse,
} from '@material-ui/core';
import { ListAlt, ShoppingBasket } from '@material-ui/icons';
import { BarcodeScan } from 'mdi-material-ui';
import { Link, useLocation } from 'react-router-dom';
import useQuery from '../hooks/useQuery';

function BottomNav() {
	const location = useLocation();
	const { redirect_status } = useQuery();

	return (
		<Collapse
			in={location.pathname !== '/scan' && !redirect_status}
			timeout={500}
		>
			<BottomNavigation
				value={location.pathname.split('/')[1]}
				showLabels
				component="nav"
			>
				<BottomNavigationAction
					component={Link}
					to="/products"
					label="Producten"
					value="products"
					icon={<ListAlt />}
				/>
				<BottomNavigationAction
					component={Link}
					to="/scan"
					label="Scan"
					value="scan"
					icon={<BarcodeScan />}
				/>
				<BottomNavigationAction
					component={Link}
					to="/basket"
					label="Winkelmandje"
					value="basket"
					icon={<ShoppingBasket />}
				/>
			</BottomNavigation>
		</Collapse>
	);
}

export default BottomNav;
