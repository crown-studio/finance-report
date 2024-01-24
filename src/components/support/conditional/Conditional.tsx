import React from 'react';

interface IConditionalProps {
	check: boolean;
	children: React.ReactNode;
}

const If = ({ check, children }: IConditionalProps) => <React.Fragment>{check && children ? children : null}</React.Fragment>;

export default If;
