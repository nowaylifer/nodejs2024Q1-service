export const capitalize = <T extends string>(s: T) =>
  (s[0].toLocaleUpperCase() + s.slice(1)) as Capitalize<T>;
