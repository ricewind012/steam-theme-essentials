import { Children, isValidElement, type PropsWithChildren } from "react";

/**
 * React props that may cause false positives for finding text.
 */
const REACT_PROP_BLACKLIST = new Set(["className", "style", "key", "ref"]);

/**
 * Finds the first string value within the React component's children.
 *
 * @param props The props of the React component.
 * @returns the first string value found, or an empty string if none is found.
 */
function FindStringInChildren(props: PropsWithChildren): string {
	for (const child of Children.toArray(props.children)) {
		if (!child) {
			continue;
		}

		if (typeof child === "string") {
			return child;
		}

		if (isValidElement(child)) {
			const nested = FindStringInChildren(child.props);
			if (nested) {
				return nested;
			}
		}
	}

	return "";
}

/**
 * Finds the first string value within an object.
 *
 * @param obj The object to search.
 * @returns the first string value found, or an empty string if none is found.
 */
export function FindStringInObject(obj: Record<string, unknown>): string {
	// Prioritize another way for React children, as it may catch other props
	// instead of "children", where the needed string usually belongs.
	if ("children" in obj) {
		return FindStringInChildren(obj);
	}

	for (const [k, v] of Object.entries(obj)) {
		if (!v) {
			continue;
		}

		// There is no reliable way to determine whether it's React props.
		if (REACT_PROP_BLACKLIST.has(k)) {
			continue;
		}

		// Something like "strDropDownItemClassName" may slip through.
		if (k.toLowerCase().includes("classname")) {
			continue;
		}

		if (typeof v === "string") {
			return v;
		}

		if (typeof v === "object") {
			const nested = FindStringInObject(v as Record<string, unknown>);
			if (nested) {
				return nested;
			}
		}
	}

	return "";
}
