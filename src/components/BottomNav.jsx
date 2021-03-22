import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { ListAlt, ShoppingBasket } from '@material-ui/icons';
import { BarcodeScan } from 'mdi-material-ui';
import { Link, useLocation } from 'react-router-dom';

function BottomNav() {
	return (
		<BottomNavigation value={useLocation().pathname} showLabels>
			<BottomNavigationAction
				component={Link}
				to="/products"
				label="Producten"
				value="/products"
				icon={<ListAlt />}
			/>
			<BottomNavigationAction
				component={Link}
				to="/scan"
				label="Scan"
				value="/scan"
				icon={<BarcodeScan />}
			/>
			<BottomNavigationAction
				component={Link}
				to="/basket"
				label="Winkelmandje"
				value="/basket"
				icon={<ShoppingBasket />}
			/>
		</BottomNavigation>
	);
}

export default BottomNav;
