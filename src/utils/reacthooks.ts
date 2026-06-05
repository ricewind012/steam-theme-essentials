import type { Unregisterable } from "@steambrew/client";
import { useEffect } from "react";

// TODO: useEffectEvent with React 19.2
// biome-ignore lint/suspicious/noConfusingVoidType: See below
function useSteamRegistrar(handle: Unregisterable | void) {
	useEffect(() => {
		// Some functions like User.RegisterForCurrentUserChanges do not return
		// anything... vaaaalve
		return handle ? handle.unregister : undefined;
	}, []);
}

/**
 * Hook that fires when the offline mode state changes.
 */
export function useOfflineMode(callback: (bIsOfflineMode: boolean) => void) {
	useSteamRegistrar(
		SteamClient.User.RegisterForCurrentUserChanges((ev) => {
			callback(ev.bIsOfflineMode);
		}),
	);
}
