import React, { useCallback, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import EntriesListItem from '../entriesListItem/EntriesListItem';
import { IDespesa } from '../../../../types/IDespesa';
import { IReceita } from '../../../../types/IReceita';
import { formatCurrency } from '../../../../utils/currencyUtils';
import { COLORS } from '../../../../theme/colors';
import { groupExpensesByCategory, groupExpensesBySubcategory, mergeDuplicatesByProps } from '../../../../utils/dataUtils';
import { removeDuplicatesByProps } from '../../../../utils/arrayUtils';
import PieChart from '../../../../components/pieChart/PieChart';
import { Button, Flex, Text } from '@chakra-ui/react';
import './EntriesListContainer.scss';
import { groupBy } from '../../../../utils/objectUtils';

const EXPENSES_GROUP_LEVELS = {
	CATEGORY: 2,
	SUBCATEGORY: 1,
	ENTRIES: 0,
};

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
	showGraphs?: boolean;
}

const EntriesListContainer = ({
	children,
	title,
	data,
	hideValues = false,
	hideTags = false,
	mergeByProps,
	hideByProps,
	groupByCategory = !!EXPENSES_GROUP_LEVELS.ENTRIES,
	showGraphs = false,
}: IEntriesListContainerProps) => {
	const showEmptyMessage = useMemo(() => !data?.length && React.Children.count(children) <= 1, [data, children]);

	const [groupLevel, setGroupLevel] = useState(EXPENSES_GROUP_LEVELS.CATEGORY);
	const [hideValuesToggle, setHideValuesToggle] = useState(hideValues);
	const [showGraphsToggle, setShowGraphsToggle] = useState(showGraphs);

	const isCategory = useMemo(() => groupLevel === EXPENSES_GROUP_LEVELS.CATEGORY, [groupLevel]);
	const isSubcategory = useMemo(() => groupLevel === EXPENSES_GROUP_LEVELS.SUBCATEGORY, [groupLevel]);
	const isEntries = useMemo(() => groupLevel === EXPENSES_GROUP_LEVELS.ENTRIES, [groupLevel]);

	const parseData = useCallback(() => {
		if (mergeByProps) return mergeDuplicatesByProps(data || [], mergeByProps as keyof typeof data);
		if (hideByProps) return removeDuplicatesByProps(data || [], hideByProps as keyof typeof data);
		if (!groupByCategory) return data;
		if (groupLevel === EXPENSES_GROUP_LEVELS.CATEGORY) return groupExpensesByCategory((data || []) as IDespesa[]);
		if (groupLevel === EXPENSES_GROUP_LEVELS.SUBCATEGORY) return groupExpensesBySubcategory((data || []) as IDespesa[]);
		return data;
	}, [data, mergeByProps, hideByProps, groupLevel]);

	const parsedData = useMemo(() => parseData(), [parseData]);

	const _renderListOfEntries = (listData: Array<IDespesa | IReceita | SimpleList>) => (
		<ul className="EntriesListContainer__list list-unstyled">
			{listData?.map(({ id, descricao, valor, observacoes, categoria, subcategoria }, index) => (
				<EntriesListItem
					key={id}
					title={descricao}
					value={formatCurrency(valor)}
					subtitle={observacoes}
					tags={!hideTags && categoria && subcategoria ? [categoria, subcategoria] : undefined}
					hideValue={hideValuesToggle}
					color={index % 2 === 0 ? COLORS.CLEAR_SHADES_GRAY : 'initial'}
				/>
			))}
		</ul>
	);

	return (
		<Container className="EntriesListContainer">
			<Flex className="EntriesListContainer__header" height={24} px={8} py={4} align={'center'} justify={'space-between'}>
				<Flex>
					<Text as={'h4'} mb={0}>
						{title}
					</Text>
				</Flex>
				<Flex gap={2}>
					{showGraphs && isCategory && (
						<Button onClick={() => setShowGraphsToggle(prev => !prev)}>
							{showGraphsToggle ? 'LISTA' : 'GRÁFICO'}
						</Button>
					)}
					{groupByCategory && (
						<Button onClick={() => setGroupLevel(prev => (prev < 2 ? prev + 1 : 0))}>
							{isCategory && 'DETALHAR'}
							{isSubcategory && 'AGRUPAR'}
							{isEntries && 'RESUMIR'}
						</Button>
					)}
					{hideValues && (
						<Button onClick={() => setHideValuesToggle(prev => !prev)}>
							{hideValuesToggle ? 'EXIBIR' : 'OCULTAR'}
						</Button>
					)}
				</Flex>
			</Flex>
			{showEmptyMessage && <h5 className="EntriesListContainer__emptyMessage">Nenhum dado foi encontrado</h5>}
			{(!showGraphsToggle || !isCategory) && _renderListOfEntries(parsedData || [])}
			{showGraphsToggle && isCategory && <PieChart chartData={groupBy(data || [], 'categoria')} />}
			{children}
		</Container>
	);
};

export default EntriesListContainer;
