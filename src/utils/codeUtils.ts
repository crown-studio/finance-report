import DOMPurify from 'dompurify';

export const sanitize = (htmlString: string): string | TrustedHTML => {
	return DOMPurify.sanitize(htmlString);
};
