import React from 'react';
import HTMLInject from '../../../../components/support/HTMLInject/HTMLInject';
import Badge from '../../../../components/commons/badge/Badge';
import { normalize } from '../../../../utils/stringUtils';
import { COLORS } from '../../../../theme/colors';
import classNames from 'classnames';
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
	const parsedSubtitle = (
		!showSensitiveData ? subtitle?.replace(/\*\*(.*?)\*\*/g, '').replace(/#reembolso/g, '') : subtitle
	)?.replace(/#\S+/g, '<span class="custom-tags">$&</span>');

	return (
		<li className={classNames('EntriesListItem', className)} style={{ backgroundColor: color }}>
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
					{tags.map(tag => {
						const colorKey = `${normalize(tags[0]).toUpperCase().replace(/\s/g, '_')}_COLOR`;
						return <Badge key={tag} label={tag} color={COLORS[colorKey as keyof typeof COLORS]} />;
					})}
				</div>
			)}
		</li>
	);
};

export default EntriesListItem;
