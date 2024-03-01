import React from 'react';
import HTMLInject from '../../../../components/support/HTMLInject/HTMLInject';
import Badge from '../../../../components/commons/badge/Badge';
import classNames from 'classnames';
import { getColorsByCategory } from '../../../../utils/colorUtils';
import { highlightHashtags, removeSensitiveData } from '../../../../utils/dataUtils';
import { Flex, Text } from '@chakra-ui/react';
import { COLORS } from '../../../../theme/colors';
import If from '../../../../components/support/conditional/Conditional';
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
	minor?: string;
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
	minor,
}: IEntriesListItemProps) => {
	// const listItemRef = useRef<HTMLLIElement>(null);

	const parsedSubtitle = !showSensitiveData ? removeSensitiveData(subtitle || '', ['reembolso']) : subtitle;

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
				{!hideValue && (
					<Flex direction={'column'} align={'flex-end'}>
						<Text as="b" className="EntriesListItem__value">
							{value}
						</Text>
						<If check={!!minor}>
							<Text fontSize={'md'} color={COLORS.MEDIUM_SHADES_GRAY} mb={0}>
								{minor}
							</Text>
						</If>
					</Flex>
				)}
			</div>

			{parsedSubtitle && (
				<span className="EntriesListItem__subtitle">
					<HTMLInject sanitize={false}>{highlightHashtags(parsedSubtitle) as string}</HTMLInject>
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
