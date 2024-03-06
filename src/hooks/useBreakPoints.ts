import { useMediaQuery } from '@chakra-ui/react';

export const APPROACH = {
	MAX: 'max', // return true if screen is smaller than the breakpoint
	MIN: 'min', // return true if screen is larger than the breakpoint
} as const;

const useBreakPoints = (approach: typeof APPROACH.MAX | typeof APPROACH.MIN = APPROACH.MIN) => {
	const breakpoints = [
		`(${approach}-width: 0px)`, // base 0px // em is a relative unit and is dependant on the font-size.
		`(${approach}-width: 30em)`, // small (sm) ~480px
		`(${approach}-width: 48em)`, // medium (md) ~768px
		`(${approach}-width: 62em)`, // large (lg) ~992px
		`(${approach}-width: 80em)`, // extra large (xl) ~1280px
		`(${approach}-width: 96em)`, // 2 extra large (2xl) ~1536px
	];

	const matches = useMediaQuery(breakpoints);

	const [isBase, isSmall, isMedium, isLarge, isExtraLarge, isTwoExtraLarge] = matches;

	return { isBase, isSmall, isMedium, isLarge, isExtraLarge, isTwoExtraLarge };
};

export default useBreakPoints;
