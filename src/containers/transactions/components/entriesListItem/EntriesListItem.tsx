import React from 'react';
import HTMLInject from '../../../../components/support/HTMLInject/HTMLInject';
import Badge from '../../../../components/commons/badge/Badge';
import classNames from 'classnames';
import './EntriesListItem.scss';
import { getColorsByCategory } from '../../../../utils/colorUtils';

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
	const parsedSubtitle = (
		!showSensitiveData ? subtitle?.replace(/\*\*(.*?)\*\*/g, '').replace(/#reembolso/g, '') : subtitle
	)?.replace(/#\S+/g, '<span class="custom-tags">$&</span>');

	return (
		<li className={classNames('EntriesListItem', className)} style={{ backgroundColor: color }} tabIndex={0}>
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
