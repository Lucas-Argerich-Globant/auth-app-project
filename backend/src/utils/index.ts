type SnakeToCamelCase<S extends string> = S extends `${infer FirstPart}_${infer FirstLetter}${infer LastPart}`
  ? `${FirstPart}${Uppercase<FirstLetter>}${SnakeToCamelCase<LastPart>}`
  : S

type ConvertObjectKeysToCamelCase<T> = {
  [K in keyof T as SnakeToCamelCase<K & string>]: T[K] extends (infer Item)[]
    ? ConvertObjectKeysToCamelCase<Item>[]
    : T[K] extends object
      ? ConvertObjectKeysToCamelCase<T[K]>
      : T[K]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyedObject = Record<string, any>
type Convertible = KeyedObject | KeyedObject[] | string | number | boolean | null | undefined

export function objectSnakeToCamelCase<T extends Convertible>(obj: T): ConvertObjectKeysToCamelCase<T> {
  if (typeof obj !== 'object' || obj === null) {
    return obj as ConvertObjectKeysToCamelCase<T>
  }

  if (Array.isArray(obj)) {
    const newArray = obj.map((item) => objectSnakeToCamelCase(item))
    return newArray as ConvertObjectKeysToCamelCase<T>
  }

  const newObj: KeyedObject = {}
  const sourceObj = obj as KeyedObject

  for (const key in sourceObj) {
    if (Object.prototype.hasOwnProperty.call(sourceObj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase())

      const value = sourceObj[key]

      if (typeof value === 'object' && value !== null) {
        newObj[camelKey] = objectSnakeToCamelCase(value)
      } else {
        newObj[camelKey] = value
      }
    }
  }

  return newObj as ConvertObjectKeysToCamelCase<T>
}
