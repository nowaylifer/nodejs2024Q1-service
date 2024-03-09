export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export const asInter = <T>(value: T) => value as UnionToIntersection<T>;

export const capitalize = <T extends string>(s: T) =>
  (s[0].toLocaleUpperCase() + s.slice(1)) as Capitalize<T>;
