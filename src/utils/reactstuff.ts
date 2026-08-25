import { Children, isValidElement, type PropsWithChildren } from "react";

/**
 * Finds the first string value within the props of a React component.
 *
 * @param props The props of the React component.
 * @returns the first string value found, or an empty string if none is found.
 */
export function FindStringInProps(props: PropsWithChildren): string {
	for (const child of Children.toArray(props.children)) {
		if (typeof child === "string" || typeof child === "number") {
			return child.toString();
		}

		if (isValidElement(child)) {
			const nested = FindStringInProps(child.props);
			if (nested) {
				return nested;
			}
		}
	}

	return "";
}
