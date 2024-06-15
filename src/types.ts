export interface Deal {
	id: number;
	name: string;
	price: number;
	responsible_user_id: number;
	status_id: number;
	created_at: number;
	_embedded: {
		companies: { id: number }[];
	};
}

export interface User {
	id: number;
	name: string;
}

export interface Status {
	id: string;
	name: string;
}

export interface Contact {
	id: number;
	name: string;
	custom_fields_values?: CustomFieldValue[];
	_embedded: {
		companies: { id: number }[];
	};
}

export interface CustomFieldValue {
	field_code: string;
	values: { value: string }[];
}

