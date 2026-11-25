class FavoritesStorage {
  private key = 'bookstore_favorites';

  getAll(): string[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  has(id: string): boolean {
    return this.getAll().includes(id);
  }

  toggle(id: string): boolean {
    const all = this.getAll();
    const isExist = all.includes(id);
    const next = isExist ? all.filter(item => item !== id) : [...all, id];
    localStorage.setItem(this.key, JSON.stringify(next));
    return !isExist;
  }

  count(): number {
    return this.getAll().length;
  }
}

export const favorites = new FavoritesStorage();