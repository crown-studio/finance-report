import React, { useCallback, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import EntriesListItem from '../entriesListItem/EntriesListItem';
import { IDespesa } from '../../../../types/IDespesa';
import { IReceita } from '../../../../types/IReceita';
import { formatCurrency } from '../../../../utils/currencyUtils';
import { COLORS } from '../../../../theme/colors';
import { groupExpensesByCategory, mergeDuplicatesByProps } from '../../../../utils/dataUtils';
import { removeDuplicatesByProps } from '../../../../utils/arrayUtils';
import './EntriesListContainer.scss';
import { Button } from '@chakra-ui/react';

type SimpleList = Pick<IDespesa | IReceita, 'id' | 'descricao' | 'valor' | 'observacoes'> & {
	categoria?: string;
	subcategoria?: string;
};

interface IEntriesListContainerProps {
	title: string;
	children?: React.ReactNode;
	data?: Array<IDespesa | IReceita | SimpleList>;
	hideValues?: boolean;
	hideTags?: boolean;
	mergeByProps?: string[];
	hideByProps?: string[];
	groupByCategory?: boolean;
}

const EntriesListContainer = ({
	children,
	title,
	data,
	hideValues = false,
	hideTags = false,
	mergeByProps,
	hideByProps,
	groupByCategory = false,
}: IEntriesListContainerProps) => {
	const showEmptyMessage = useMemo(() => !data?.length && React.Children.count(children) <= 1, [data, children]);

	const [isGrouped, setIsGrouped] = useState(groupByCategory);

	const parseData = useCallback(() => {
		if (mergeByProps) return mergeDuplicatesByProps(data || [], mergeByProps as keyof typeof data);
		if (hideByProps) return removeDuplicatesByProps(data || [], hideByProps as keyof typeof data);
		if (isGrouped) return groupExpensesByCategory((data || []) as IDespesa[]);
		return data;
	}, [data, mergeByProps, hideByProps, isGrouped]);

	const removeDistinctByProps = (
		arr: (IDespesa | IReceita | SimpleList)[],
		props: (keyof IDespesa | IReceita | SimpleList)[],
	) => {
		// return arr.filter((item, index) => arr.findIndex(obj => props.every(prop => obj[prop] === item[prop])) === index);
	};

	const parsedData = useMemo(() => parseData(), [parseData]);

	return (
		<Container className="EntriesListContainer">
			<header className="EntriesListContainer__header">
				<section className="EntriesListContainer__header__start"></section>
				<section>
					<h4 className="EntriesListContainer__header__center__title">{title}</h4>
				</section>
				<section className="EntriesListContainer__header__end">
					{groupByCategory && (
						<Button onClick={() => setIsGrouped(prev => !prev)}>{isGrouped ? 'UNGROUP' : 'GROUP'}</Button>
					)}
				</section>
			</header>
			{showEmptyMessage && <h5 className="EntriesListContainer__emptyMessage">Nenhum dado foi encontrado</h5>}
			<ul className="EntriesListContainer__list list-unstyled">
				{parsedData?.map(({ id, descricao, valor, observacoes, categoria, subcategoria }, index) => (
					<EntriesListItem
						key={id}
						title={descricao}
						value={formatCurrency(valor)}
						subtitle={observacoes}
						tags={!hideTags && categoria && subcategoria ? [categoria, subcategoria] : undefined}
						hideValue={hideValues}
						color={index % 2 === 0 ? COLORS.CLEAR_SHADES_GRAY : 'initial'}
					/>
				))}
			</ul>
			{children}
		</Container>
	);
};

export default EntriesListContainer;
