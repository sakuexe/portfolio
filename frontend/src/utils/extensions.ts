export { };

declare global {
  interface Array<T> {
    random(): T
  }
  interface Date {
    getDateless: () => string
  }
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

Date.prototype.getDateless = function () {
  return `${this.getMonth()}.${this.getFullYear()}`;
}
