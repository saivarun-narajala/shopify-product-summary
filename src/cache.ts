type Entry<T> = { value: T; expiresAt: number };

export class Cache {
  private map = new Map<string, Entry<unknown>>();
  constructor(private ttlMs: number) {}

  get<T>(key: string): T | undefined {
    const e = this.map.get(key);
    if (!e) return undefined;
    if (Date.now() > e.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    return e.value as T;
  }

  set<T>(key: string, value: T) {
    this.map.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  del(key: string) {
    this.map.delete(key);
  }
}
