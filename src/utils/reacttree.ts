import { findInReactTree, getReactRoot } from "millennium";

export interface ReactFiber {
	child: ReactFiber;
	// biome-ignore lint/suspicious/noExplicitAny: kys
	pendingProps: Record<string, any>;
	return: ReactFiber;
}

const pReactTree = getReactRoot(document.getElementById("root"));

/**
 * A typed {@link findInReactTree}.
 */
export function FindInReactTree(filter: (node: ReactFiber) => boolean) {
	return findInReactTree(pReactTree, filter);
}
