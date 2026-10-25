import { DialogButton, type DialogButtonProps } from "millennium";

interface IconButtonProps {
	name: string;
}

export function IconButton(
	props: IconButtonProps & Exclude<DialogButtonProps, "className">,
) {
	const { name } = props;

	return <DialogButton {...props} className="IconButton" data-name={name} />;
}
