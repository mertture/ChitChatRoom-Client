export default class Model {
  static create<T extends Model>(this: new () => T, obj: T): T {
    const instance = new this()
    Object.keys(obj).forEach(key => {
      ;(instance as any)[key] = (obj as any)[key]
    })
    return instance
  }
}
