// eslint-disable unicorn/import-index
import { ZodObject } from "zod";
import type Conf from './index.js';

export type Options<T extends Record<string, any>> = {
	defaults?: Readonly<T>;
	schema: ZodObject;
	configName?: string;
	projectName?: string;
	projectVersion?: string;
	migrations?: Migrations<T>;
	beforeEachMigration?: BeforeEachMigrationCallback<T>;
	cwd?: string;
	encryptionKey?: string | Uint8Array | NodeJS.TypedArray | DataView;
	fileExtension?: string;
	clearInvalidConfig?: boolean;
	readonly serialize?: Serialize<T>;
	readonly deserialize?: Deserialize<T>;
	readonly projectSuffix?: string;
	readonly accessPropertiesByDotNotation?: boolean;

	/**
	Watch for any changes in the config file and call the callback for `onDidChange` or `onDidAnyChange` if set. This is useful if there are multiple processes changing the same config file.

	@default false
	*/
	readonly watch?: boolean;

	/**
	The [mode](https://en.wikipedia.org/wiki/File-system_permissions#Numeric_notation) that will be used for the config file.

	You would usually not need this, but it could be useful if you want to restrict the permissions of the config file. Setting a permission such as `0o600` would result in a config file that can only be accessed by the user running the program.

	Note that setting restrictive permissions can cause problems if different users need to read the file. A common problem is a user running your tool with and without `sudo` and then not being able to access the config the second time.

	@default 0o666
	*/
	readonly configFileMode?: number;
};

export type Migrations<T extends Record<string, any>> = Record<string, (store: Conf<T>) => void>;

export type BeforeEachMigrationContext = {
	fromVersion: string;
	toVersion: string;
	finalVersion: string;
	versions: string[];
};
export type BeforeEachMigrationCallback<T extends Record<string, any>> = (store: Conf<T>, context: BeforeEachMigrationContext) => void;


export type Serialize<T> = (value: T) => string;
export type Deserialize<T> = (text: string) => T;

export type OnDidChangeCallback<T> = (newValue?: T, oldValue?: T) => void;
export type OnDidAnyChangeCallback<T> = (newValue?: Readonly<T>, oldValue?: Readonly<T>) => void;

export type Unsubscribe = () => void;

export type DotNotationKeyOf<T extends Record<string, any>> = {
	[K in keyof Required<T>]: K extends string
	? Required<T>[K] extends Record<string, any>
	? K | `${K}.${DotNotationKeyOf<Required<T>[K]>}`
	: K
	: never
}[keyof T];

export type DotNotationValueOf<T extends Record<string, any>, K extends DotNotationKeyOf<T>> =
	K extends `${infer Head}.${infer Tail}`
	? Head extends keyof T
	? T[Head] extends Record<string, any>
	? Tail extends DotNotationKeyOf<T[Head]>
	// Type of objects for required properties
	? DotNotationValueOf<T[Head], Tail>
	: never
	: Required<T>[Head] extends Record<string, any>
	? Tail extends DotNotationKeyOf<Required<T>[Head]>
	// Type of objects for optional properties
	? DotNotationValueOf<Required<T>[Head], Tail> | undefined
	: never
	: never
	: never
	: K extends keyof T
	? T[K]
	: never;

export type PartialObjectDeep<T> = { [K in keyof T]?: PartialObjectDeep<T[K]> };


