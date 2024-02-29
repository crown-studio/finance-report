import React, { useRef } from 'react';
import HTMLInject from '../../../../components/support/HTMLInject/HTMLInject';
import Badge from '../../../../components/commons/badge/Badge';
import classNames from 'classnames';
import { getColorsByCategory } from '../../../../utils/colorUtils';
import './EntriesListItem.scss';

interface IEntriesListItemProps {
	title: string;
	value: number | string;
	subtitle?: string;
	tags?: string[];
	showSensitiveData?: boolean;
	hideValue?: boolean;
	color?: string;
	className?: string;
}

const EntriesListItem = ({
	title,
	value,
	subtitle,
	tags,
	showSensitiveData = false,
	hideValue = false,
	color = 'unset',
	className,
}: IEntriesListItemProps) => {
	// const listItemRef = useRef<HTMLLIElement>(null);

	const parsedSubtitle = (
		!showSensitiveData ? subtitle?.replace(/\*\*(.*?)\*\*/g, '').replace(/#reembolso/g, '') : subtitle
	)?.replace(/#\S+/g, '<span class="custom-tags">$&</span>');

	// const handleIntemClick = event => {
	// 	const { current: listItemElem } = listItemRef;
	// 	if (!listItemElem) return;
	// 	console.log('listItemElem', listItemElem);
	// 	listItemElem.focus();
	// };

	return (
		<li
			// ref={listItemRef}
			className={classNames('EntriesListItem', className)}
			style={{ backgroundColor: color }}
			// onClick={handleIntemClick}
			tabIndex={0}
		>
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
					{tags.map((tag, index) => {
						return <Badge key={index} label={tag} color={getColorsByCategory(tags)[0]} />;
					})}
				</div>
			)}
		</li>
	);
};

export default EntriesListItem;
