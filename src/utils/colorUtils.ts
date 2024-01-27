import { COLORS } from '../theme/colors';
import { hasText } from './stringUtils';

export const colorContrast = (color: string, weight = 0.5, light = 'white', dark = 'black') => {
	//Overrides
	switch (color) {
		case COLORS.PRIMARY_BLUE_500:
			return light;
	}

	const r = parseInt(color.substring(1, 3), 16);
	const g = parseInt(color.substring(3, 5), 16);
	const b = parseInt(color.substring(5, 7), 16);

	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 255 * weight ? dark : light;
};

export function hexToRgb(hexString: string, alfa = 0) {
	if (hasText(hexString) && hexString[0] === '#') {
		const hex = hexString.slice(1);
		const bigint = parseInt(hex, 16);
		const r = (bigint >> 16) & 255;
		const g = (bigint >> 8) & 255;
		const b = bigint & 255;
		return `rgb(${r},${g},${b}, ${alfa})`;
	}
	return hexString;
}
