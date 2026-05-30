import type { HTMLAttributes } from "react";

interface IconButtonProps {
	name: string;
}

export function IconButton(
	props: IconButtonProps & HTMLAttributes<HTMLDivElement>,
) {
	const { name } = props;

	return <div {...props} className="IconButton" data-name={name} />;
}
