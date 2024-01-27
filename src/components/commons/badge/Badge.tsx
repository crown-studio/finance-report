import React from 'react';
import { colorContrast } from '../../../utils/colorUtils';
import './Badge.scss';

interface IBadgeProps {
	label: string;
	color?: string;
	onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

const Badge = ({ label, color, onClick }: IBadgeProps) => {
	return (
		<span className="Badge" onClick={onClick} style={{ backgroundColor: color, color: color && colorContrast(color) }}>
			{label}
		</span>
	);
};

export default Badge;
