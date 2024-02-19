import React, { useCallback, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import EntriesListItem from '../entriesListItem/EntriesListItem';
import { IDespesa } from '../../../../types/IDespesa';
import { IReceita } from '../../../../types/IReceita';
import { formatCurrency } from '../../../../utils/currencyUtils';
import { COLORS } from '../../../../theme/colors';
import { mergeDuplicatesByProps } from '../../../../utils/dataUtils';
import { removeDuplicatesByProps } from '../../../../utils/arrayUtils';
import './EntriesListContainer.scss';

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
}

const EntriesListContainer = ({
	children,
	title,
	data,
	hideValues = false,
	hideTags = false,
	mergeByProps,
	hideByProps,
}: IEntriesListContainerProps) => {
	const showEmptyMessage = useMemo(() => !data?.length && !children, []);

	const parseData = useCallback(() => {
		if (mergeByProps) return mergeDuplicatesByProps(data || [], mergeByProps as keyof typeof data);
		if (hideByProps) return removeDuplicatesByProps(data || [], hideByProps as keyof typeof data);
		return data;
	}, []);

	const removeDistinctByProps = (
		arr: (IDespesa | IReceita | SimpleList)[],
		props: (keyof IDespesa | IReceita | SimpleList)[],
	) => {
		// return arr.filter((item, index) => arr.findIndex(obj => props.every(prop => obj[prop] === item[prop])) === index);
	};

	const parsedData = parseData();

	return (
		<Container className="EntriesListContainer">
			<h4 className="EntriesListContainer__title">{title}</h4>
			{showEmptyMessage && <h5>Nenhum dado foi encontrado</h5>}
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
