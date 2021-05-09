const stripeErrorCodes = {
	invalid_owner_name: 'Naam moet ten minste 3 karakters lang zijn.',
	incomplete_number: 'Kaartnummer is onvolledig.',
	incomplete_expiry: 'Vervaldatum is onvolledig.',
	invalid_expiry_year_past: 'Vervaldatum ligt in het verleden.',
	incomplete_cvc: 'Veiligheidscode is onvolledig.',
	parameter_invalid_empty:
		'Eén of meerdere waarden werden niet volledig ingevuld.',
	parameter_invalid_integer:
		'Eén of meer waarden vereisen een getal, maar kregen een ander type.',
	parameter_invalid_string_blank:
		'Eén of meerdere waarden werden niet volledig ingevuld.',
	parameter_invalid_string_empty:
		'Eén of meerdere waarden werden niet volledig ingevuld.',
	parameter_missing: 'Eén of meerdere waarden werden niet volledig ingevuld.',
	expired_card:
		'De kaart is vervallen. Controleer de kaart of probeer een andere kaart.',
	incorrect_address:
		'Het adres van de kaart is onjuist. Controleer de kaart of probeer een andere kaart.',
	incorrect_cvc:
		'Veiligheidscode is onjuist. Controleer de kaart of probeer een andere kaart.',
	incorrect_number:
		'Kaartnummer is onjuist. Controleer de kaart of probeer een andere kaart.',
	invalid_card_type:
		'Het kaarttype is ongeldig. Gebruik een geldig kredietkaart.',
	invalid_cvc:
		'Veiligheidscode is ongeldig. Controleer de kaart of probeer een andere kaart.',
	invalid_expiry_year:
		'Vervaldatum is ongeldig. Controleer de kaart of probeer een andere kaart.',
	invalid_number:
		'Kaartnummer is ongeldig. Controleer de kaart of probeer een andere kaart.',
};

export default stripeErrorCodes;
