/** `Exclude` accepts any second argument, so a misspelled member would exclude nothing. */
// biome-ignore lint/style/noRestrictedTypes: this is the wrapper the rule sends every Exclude to.
export type StrictExclude<T, U extends T> = Exclude<T, U>;
