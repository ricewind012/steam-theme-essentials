import type { Unsubscribable } from "@/utils/popup";

/**
 * Essentials communicate by receiving/sending data through window events
 * instead of patching all the various modules to do what I want.
 */
export class CEssentialEvent<E, T extends EventTarget = EventTarget> {
	private readonly m_pTarget: T;
	private readonly m_strName: string;

	constructor(pTarget: T, strName: string) {
		this.m_pTarget = pTarget;
		this.m_strName = strName;
	}

	Dispatch(detail: E) {
		const ev = new CustomEvent(this.m_strName, { detail });
		this.m_pTarget.dispatchEvent(ev);
	}

	/**
	 * Subscribe to the event.
	 * @returns a function that unregisters the callback.
	 */
	Register(callback: (data: CustomEventInit<E>) => void): Unsubscribable {
		this.m_pTarget.addEventListener(this.m_strName, callback);
		return {
			Unregister() {
				this.m_pTarget.removeEventListener(this.m_strName, callback);
			},
		};
	}
}
