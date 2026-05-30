// Mock em memória da MMKV para os testes (o módulo nativo não roda no Node).
const stores = {};

class MockMMKV {
  constructor(opts) {
    this.id = (opts && opts.id) || 'default';
    stores[this.id] = stores[this.id] || {};
    this.store = stores[this.id];
  }
  getString(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : undefined;
  }
  set(key, value) {
    this.store[key] = String(value);
  }
  remove(key) {
    delete this.store[key];
  }
  delete(key) {
    delete this.store[key];
  }
  clearAll() {
    for (const k of Object.keys(this.store)) delete this.store[k];
  }
}

module.exports = {
  MMKV: MockMMKV,
  createMMKV: (opts) => new MockMMKV(opts),
};
