import React, { useCallback, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import EntriesListItem from '../entriesListItem/EntriesListItem';
import { IDespesa } from '../../../../types/IDespesa';
import { IReceita } from '../../../../types/IReceita';
import { formatCurrency } from '../../../../utils/currencyUtils';
import { COLORS } from '../../../../theme/colors';
import { groupExpensesByCategory, mergeDuplicatesByProps, removeDistinctByProps } from '../../../../utils/dataUtils';
import { removeDuplicatesByProps } from '../../../../utils/arrayUtils';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
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

	const parsedData = useMemo(() => parseData(), [parseData]);

	// console.log(removeDistinctByProps(data || [], ['id']));

	return (
		<Container className="EntriesListContainer">
			<Flex className="EntriesListContainer__header" height={24} px={8} py={4} align={'center'} justify={'space-between'}>
				<Flex>
					<Text as={'h4'} mb={0}>
						{title}
					</Text>
					{/* <Heading as={'h4'}>{title}</Heading> */}
				</Flex>
				<Flex>
					{groupByCategory && (
						<Button onClick={() => setIsGrouped(prev => !prev)}>{isGrouped ? 'DESAGRUPAR' : 'AGRUPAR'}</Button>
					)}
				</Flex>
			</Flex>
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
