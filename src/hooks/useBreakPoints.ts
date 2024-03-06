import { useMediaQuery } from '@chakra-ui/react';

export const APPROACH = {
	MAX: 'max',
	MIN: 'min',
} as const;

const useBreakPoints = (approach: typeof APPROACH.MAX | typeof APPROACH.MIN = APPROACH.MIN) => {
	const breakpoints = [
		`(${approach}-width: 0px)`,
		`(${approach}-width: 30em)`,
		`(${approach}-width: 48em)`,
		`(${approach}-width: 62em)`,
		`(${approach}-width: 80em)`,
		`(${approach}-width: 96em)`,
	];

	const matches = useMediaQuery(breakpoints);

	const [isBase, isSmall, isMedium, isLarge, isExtraLarge, isTwoExtraLarge] = matches;

	return { isBase, isSmall, isMedium, isLarge, isExtraLarge, isTwoExtraLarge };
};

export default useBreakPoints;
