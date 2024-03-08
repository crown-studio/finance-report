import React, { useState } from 'react';
import { Flex, Button, Link, IconButton, SlideFade, ScaleFade, FlexProps } from '@chakra-ui/react';

interface ISideNavProps extends FlexProps {
	data: Array<{
		id: string | number;
		name: string;
		src?: string;
		icon?: string;
		color?: string;
		bg?: string;
	}>;
	colorScheme?: string;
}

const SideNav = ({ data, colorScheme, ...rest }: ISideNavProps) => {
	const [isCollapsed, setIsCollapsed] = useState<boolean[]>(new Array(data.length).fill(true));

	const handleToggleCollapse = (index: number) => {
		setIsCollapsed(prev => {
			const arr = [...prev];
			arr[index] = !prev[index];
			return arr;
		});
	};

	return (
		<Flex
			pl={4}
			direction={['column']}
			position={'fixed'}
			left={0}
			top={0}
			bottom={0}
			align={'flex-start'}
			justify={'center'}
			height={'100vh'}
			width={'fit-content'}
			gap={4}
			zIndex={1}
			{...rest}
		>
			{data.map(({ id, name, src, icon, color, bg }, index) => {
				return (
					<Flex
						key={id}
						onMouseEnter={() => handleToggleCollapse(index)}
						onMouseLeave={() => handleToggleCollapse(index)}
					>
						<ScaleFade in={isCollapsed[index]}>
							<IconButton
								aria-label={name}
								icon={<i className="material-symbols-outlined">{icon}</i>}
								colorScheme={colorScheme}
								color={color}
								bg={bg}
								href={src}
								as={Link}
								_hover={{ textDecoration: 'none' }}
							/>
						</ScaleFade>
						<SlideFade in={!isCollapsed[index]} offsetX={'-100%'} offsetY={0} unmountOnExit={true}>
							<Button
								position={'relative'}
								left={-10}
								leftIcon={icon ? <i className="material-symbols-outlined">{icon}</i> : undefined}
								colorScheme={colorScheme}
								color={color}
								bg={bg}
								href={src}
								as={Link}
								_hover={{ textDecoration: 'none' }}
							>
								{name}
							</Button>
						</SlideFade>
					</Flex>
				);
			})}
		</Flex>
	);
};

export default SideNav;
