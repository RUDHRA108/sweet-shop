class Product {
  constructor(name, price, totalQuantity) {
    this.id = (++productCounter).toString().padStart(3, "0");
    this.name = name;
    this.price = price;
    this.totalQuantity = totalQuantity;
    this.remainingQuantity = totalQuantity;
  }
}

module.exports = Product;