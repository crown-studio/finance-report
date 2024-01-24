import { sanitize as sanitizeHtml } from '../../../utils/codeUtils';

interface IHTMLInject extends React.ComponentProps<'div'> {
	children: string;
	sanitize?: boolean;
}

const HTMLInject = ({ children, sanitize = true, ...props }: IHTMLInject) => {
	return (
		<div
			{...props}
			className="HTMLInject"
			dangerouslySetInnerHTML={{ __html: sanitize ? sanitizeHtml(children) : children }}
		></div>
	);
};

export default HTMLInject;
