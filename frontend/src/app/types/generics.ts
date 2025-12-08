type ConcatKeys<K extends string, V> = V extends { controls: infer C }
  ? K | `${K & string}.${FormControlName<V>}`
  : K & string

export type FormControlName<T> = T extends { controls: infer C }
  ? {
      [K in keyof C]: K extends string ? ConcatKeys<K, C[K]> : never
    }[keyof C] &
      string
  : never
