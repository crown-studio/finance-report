import React from 'react';
import './EntriesListItem.scss';

interface IEntriesListItemProps {
	label: string;
	value: number | string;
}

const EntriesListItem = ({ label, value }: IEntriesListItemProps) => {
	return (
		<li>
			<span>{label}</span>
			<strong>{value}</strong>
		</li>
	);
};

export default EntriesListItem;
