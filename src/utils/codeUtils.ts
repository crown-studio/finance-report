import DOMPurify from 'dompurify';

export const sanitize = (htmlString: string): string | TrustedHTML => {
	return DOMPurify.sanitize(htmlString);
};

export const isElementOrDescendantFocused = (element: HTMLElement): boolean => {
	return element.contains(document.activeElement);
};
