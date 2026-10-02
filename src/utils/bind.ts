import type { Fn_t } from "@/utils/types";

/**
 * Decorate a class method with this to make sure the method is always invoked
 * in the context of the object instance it's declared in.
 *
 * @example
 * ```ts
 * \@bind onTextInput( event ) { ... }
 *
 * render() {
 *     return <input onInput={ this.onTextInput } />;
 * }
 * ```
 */
export function bind(
	_target: object,
	propertyKey: PropertyKey,
	descriptor: TypedPropertyDescriptor<Fn_t>,
): TypedPropertyDescriptor<Fn_t> {
	return {
		get() {
			const value = descriptor.value.bind(this);
			if (!Object.hasOwn(this, propertyKey)) {
				Object.defineProperty(this, propertyKey, { value });
			}
			return value;
		},
	};
}
