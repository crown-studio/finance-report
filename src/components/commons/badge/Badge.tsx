import React from 'react';
import { colorContrast } from '../../../utils/colorUtils';
import useBreakPoints, { APPROACH } from '../../../hooks/useBreakPoints';
import './Badge.scss';

interface IBadgeProps {
	label: string;
	color?: string;
	onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

const Badge = ({ label, color, onClick }: IBadgeProps) => {
	const { isLarge } = useBreakPoints(APPROACH.MAX);
	return (
		<span
			tabIndex={onClick ? 0 : undefined}
			className="Badge"
			onClick={onClick}
			style={{
				backgroundColor: color,
				color: color && colorContrast(color, isLarge ? 0.8 : undefined),
				cursor: onClick ? 'pointer' : 'default',
			}}
		>
			{label}
		</span>
	);
};

export default Badge;
