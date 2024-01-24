import React, { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import EntriesListItem from '../entriesListItem/EntriesListItem';
import { IDespesa } from '../../../../types/IDespesa';
import { IReceita } from '../../../../types/IReceita';
import { formatCurrency } from '../../../../utils/currencyUtils';
import './EntriesListContainer.scss';

interface IEntriesListContainerProps {
	title: string;
	children?: React.ReactNode;
	data?: Array<IDespesa | IReceita>;
	hideValues?: boolean;
	hideTags?: boolean;
	mergeDuplicates?: boolean;
}

const EntriesListContainer = ({
	children,
	title,
	data,
	hideValues = false,
	hideTags = false,
	mergeDuplicates = true,
}: IEntriesListContainerProps) => {
	const showEmptyMessage = useMemo(() => !data?.length && !children, []);
	// const parsedData = mergeDuplicates ? data.map : data;

	return (
		<Container className="EntriesListContainer">
			<h4 className="EntriesListContainer__title">{title}</h4>
			{showEmptyMessage && <h5>Nenhum dado foi encontrado</h5>}
			<ul className="EntriesListContainer__list list-unstyled">
				{data?.map(({ id, descricao, valor, observacoes, categoria, subcategoria }, index) => (
					<EntriesListItem
						key={id}
						title={descricao}
						value={formatCurrency(valor)}
						subtitle={observacoes}
						tags={!hideTags ? [categoria, subcategoria] : []}
						hideValue={hideValues}
						color={index % 2 === 0 ? '#f5f5f5' : 'initial'}
					/>
				))}
			</ul>
			{children}
		</Container>
	);
};

export default EntriesListContainer;
