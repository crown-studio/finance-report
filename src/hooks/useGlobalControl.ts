import { useContext } from 'react';
import { GlobalControlContext, IGlobalControlContext } from '../contexts/globalControl/GlobalControl';

export const useGlobalControl = (): IGlobalControlContext => {
	const globalControl = useContext(GlobalControlContext);
	if (!globalControl) throw new Error('useGlobalControl must be used within a GlobalControlProvider');
	return globalControl;
};
