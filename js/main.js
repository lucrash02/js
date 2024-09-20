let cart = [];
let total = 0;

document.addEventListener("DOMContentLoaded", () => {
  loadCart();

  const buttons = document.querySelectorAll(".agregar-carro");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button.getAttribute("data-name");
      const productPrice = parseFloat(button.getAttribute("data-price"));
      addToCart(productName, productPrice);
    });
  });
});
function addToCart(productName, productPrice) {
  cart.push({ name: productName, price: productPrice });
  saveCart();
  updateCart();
}
function updateCart() {
  const cartItemsList = document.getElementById("items-carro");
  const totalElement = document.getElementById("total");
  cartItemsList.innerHTML = "";
  total = 0;
  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartItemsList.appendChild(listItem);
    total += item.price;
  });
  totalElement.textContent = total.toFixed(2);
}
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function loadCart() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
    updateCart();
  }
}
function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}
clearCart();
