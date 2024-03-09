import { useEffect, useRef } from 'react';

const useEventListener = (
	eventName: string,
	handler: (event: Event) => void,
	element: HTMLElement | Window | Document | null,
	options: { capture?: boolean; once?: boolean; passive?: boolean; signal?: AbortSignal } = {},
) => {
	const savedHandler = useRef<((event: Event) => void) | null>(null);
	const elem = element || window;

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const isSupported = elem && elem.addEventListener;
		if (!isSupported) return undefined;
		const eventListener = (event: Event) => (savedHandler?.current ? savedHandler?.current(event) : undefined);
		elem.addEventListener(eventName, eventListener, options);
		return () => {
			elem.removeEventListener(eventName, eventListener);
		};
	}, [eventName, elem, options]);
};

export default useEventListener;
