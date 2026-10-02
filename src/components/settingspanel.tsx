/**
 * biome-ignore-all lint/correctness/useHookAtTopLevel: False positive in
 * EssentialControls
 */

import {
	Field,
	type FieldProps,
	TextField,
	Toggle,
	usePluginConfig,
} from "millennium";
import { type ChangeEventHandler, type ReactNode, useMemo } from "react";

import { pEssentialController } from "@/essentials/controller";
import { Localize } from "@/modules/localization";
import {
	DEFAULT_SETTINGS,
	type EssentialName_t,
	type Settings_t,
} from "@/settings";

import { LocalizedPanelSection } from "./localized";

type EssentialControlsType_t = "boolean" | "number" | "string";

const EssentialPanelSectionContent: Record<EssentialName_t, () => ReactNode> = {
	aerothemesteam: () => {
		const pEssential = pEssentialController.Get("aerothemesteam");

		return (
			<EssentialField
				fieldProps={{ bottomSeparator: "thick" }}
				strName="aerothemesteam"
				strField="bEnabled"
				onChange={(value) => {
					if (value) {
						pEssential.OnMount();
					} else {
						pEssential.OnDismount();
					}
				}}
			/>
		);
	},
	legacysteam: () => {
		const pEssential = pEssentialController.Get("legacysteam");

		return (
			<EssentialField
				fieldProps={{ bottomSeparator: "thick" }}
				strName="legacysteam"
				strField="bEnabled"
				onChange={(value) => {
					if (value) {
						pEssential.OnMount();
					} else {
						pEssential.OnDismount();
					}
				}}
			/>
		);
	},
};

interface EssentialControlProps<
	T extends EssentialName_t,
	F extends Exclude<keyof Settings_t[T], symbol>,
> {
	onChange: (value: Settings_t[T][F]) => void;
	strField: F;
	strName: T;
}

// The worst type checking known to man
const EssentialControls: Record<
	EssentialControlsType_t,
	<T extends EssentialName_t, F extends Exclude<keyof Settings_t[T], symbol>>(
		props: EssentialControlProps<T, F>,
	) => ReactNode
> = {
	boolean<
		T extends EssentialName_t,
		F extends Exclude<keyof Settings_t[T], symbol>,
	>(props: EssentialControlProps<T, F>) {
		const { strField, strName } = props;
		const [value, setValue] = usePluginConfig<boolean>(
			`${strName}-${strField}`,
		);
		const onChange = (value: boolean) => {
			props.onChange(value as Settings_t[T][F]);
			setValue(value);
		};

		return <Toggle value={value} onChange={onChange} />;
	},
	number<
		T extends EssentialName_t,
		F extends Exclude<keyof Settings_t[T], symbol>,
	>(props: EssentialControlProps<T, F>) {
		const { strField, strName } = props;
		const [value, setValue] = usePluginConfig<number>(`${strName}-${strField}`);
		const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
			const value = Number(ev.target.value);
			if (!Number.isFinite(value)) {
				return;
			}

			props.onChange(value as Settings_t[T][F]);
			setValue(value);
		};

		return (
			<TextField mustBeNumeric value={value.toString()} onChange={onChange} />
		);
	},
	string<
		T extends EssentialName_t,
		F extends Exclude<keyof Settings_t[T], symbol>,
	>(props: EssentialControlProps<T, F>) {
		const { strField, strName } = props;
		const [value, setValue] = usePluginConfig<string>(`${strName}-${strField}`);
		const onChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
			const value = ev.target.value;
			props.onChange(value as Settings_t[T][F]);
			setValue(value);
		};

		return <TextField value={value} onChange={onChange} />;
	},
};

interface EssentialFieldProps<
	T extends EssentialName_t,
	F extends Exclude<keyof Settings_t[T], symbol>,
> extends EssentialControlProps<T, F> {
	fieldProps?: FieldProps;
}

function EssentialField<
	T extends EssentialName_t,
	F extends Exclude<keyof Settings_t[T], symbol>,
>(props: EssentialFieldProps<T, F>) {
	const { fieldProps, onChange, strField, strName } = props;
	const label = Localize(`#EssentialSettings_${strName}_${strField}`);

	const eType = typeof DEFAULT_SETTINGS[strName][
		strField
	] as EssentialControlsType_t;
	const Component = EssentialControls[eType];

	return (
		<Field {...fieldProps} focusable label={label}>
			<Component onChange={onChange} strField={strField} strName={strName} />
		</Field>
	);
}

interface EssentialPanelSectionProps {
	strName: EssentialName_t;
}

function EssentialPanelSection(props: EssentialPanelSectionProps) {
	const { strName } = props;
	const Content = EssentialPanelSectionContent[strName];

	return (
		<LocalizedPanelSection strToken={`#EssentialSettings_${strName}`}>
			<Content />
		</LocalizedPanelSection>
	);
}

export function SettingsPanel() {
	const vecEssentials = useMemo(
		() => Object.keys(DEFAULT_SETTINGS),
		[],
	) as EssentialName_t[];

	return vecEssentials.map((e) => (
		<EssentialPanelSection key={e} strName={e} />
	));
}
