import { useMediaQuery } from '@chakra-ui/react';

const useBreakPoints = () => {
	const isBase = useMediaQuery('(min-width: 0px)');
	const isSmall = useMediaQuery('(min-width: 30em)');
	const isMedium = useMediaQuery('(min-width: 48em)');
	const isLarge = useMediaQuery('(min-width: 62em)');
	const isExtraLarge = useMediaQuery('(min-width: 80em)');
	const isTwoExtraLarge = useMediaQuery('(min-width: 96em)');

	return { isBase, isSmall, isMedium, isLarge, isExtraLarge, isTwoExtraLarge };
};

export default useBreakPoints;
