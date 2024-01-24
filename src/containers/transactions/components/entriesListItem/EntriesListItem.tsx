import React from 'react';
import './EntriesListItem.scss';
import HTMLInject from '../../../../components/support/HTMLInject/HTMLInject';

interface IEntriesListItemProps {
	title: string;
	value: number | string;
	subtitle?: string;
	tags?: string[];
	showSensitiveData?: boolean;
	hideValue?: boolean;
	color?: string;
}

const EntriesListItem = ({
	title,
	value,
	subtitle,
	tags,
	showSensitiveData = false,
	hideValue = false,
	color = 'unset',
}: IEntriesListItemProps) => {
	const parsedSubtitle = (
		!showSensitiveData ? subtitle?.replace(/\*\*(.*?)\*\*/g, '').replace(/#reembolso/g, '') : subtitle
	)?.replace(/#\S+/g, '<span class="tags">$&</span>');

	return (
		<li className="EntriesListItem" style={{ backgroundColor: color }}>
			<div className="EntriesListItem__header">
				<span className="EntriesListItem__title">{title}</span>
				{!hideValue && <strong className="EntriesListItem__value">{value}</strong>}
			</div>

			{parsedSubtitle && (
				<span className="EntriesListItem__subtitle">
					<HTMLInject sanitize={false}>{parsedSubtitle}</HTMLInject>
				</span>
			)}
			{!!tags?.length && (
				<div className="EntriesListItem__tags">
					{tags.map(tag => (
						<span key={tag} className="EntriesListItem__tag">
							{tag}
						</span>
					))}
				</div>
			)}
		</li>
	);
};

export default EntriesListItem;
