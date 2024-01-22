// eslint-disable-next-line @typescript-eslint/naming-convention
export type IsAny<T> = unknown extends T
  ? [keyof T] extends [never]
    ? false
    : true
  : false;

// eslint-disable-next-line @typescript-eslint/naming-convention
type ExcludeArrayKeys<T> =
  T extends ArrayLike<any> ? Exclude<keyof T, keyof Array<any>> : keyof T;

// eslint-disable-next-line @typescript-eslint/naming-convention
type PathImpl<T, Key extends keyof T> = Key extends string
  ? IsAny<T[Key]> extends true
    ? never
    : T[Key] extends Record<string, any>
      ?
          | `${Key}.${ExcludeArrayKeys<T[Key]> & string}`
          | `${Key}.${PathImpl<T[Key], ExcludeArrayKeys<T[Key]>> & string}`
      : never
  : never;

// eslint-disable-next-line @typescript-eslint/naming-convention
type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type Path<T> = keyof T extends string
  ? PathImpl2<T> extends infer P
    ? P extends string | keyof T
      ? P
      : keyof T
    : keyof T
  : never;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type Choose<
  T extends Record<number | string, any>,
  K extends Path<T>,
> = K extends `${infer U}.${infer Rest}`
  ? Rest extends Path<T[U]>
    ? Choose<T[U], Rest>
    : never
  : T[K];

// eslint-disable-next-line @typescript-eslint/naming-convention
export type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type DotNestedKeys<T> = T extends Array<any> | Date
  ? ''
  : (
        T extends object
          ? {
              [K in Exclude<
                keyof T,
                symbol
              >]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
            }[Exclude<keyof T, symbol>]
          : ''
      ) extends infer D
    ? Extract<D, string>
    : never;
