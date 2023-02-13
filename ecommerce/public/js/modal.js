const cartArr = [];

const cart = document.querySelector(".side-cart");
const closeCart = document.querySelector(".close-cart");
const body = document.querySelector("body");
const modal = document.querySelector(".modal-backdrop");
const cartNav = document.querySelector(".navitem3");
const addToCart = document.querySelector(".btn-buy");

closeCart.addEventListener("click", (e) => {
  if (cart.classList.contains("cart-open")) {
    cart.classList.toggle("cart-open");
    cart.classList.toggle("cart-closed");
  }
  modal.classList.toggle("hide");
});

modal.addEventListener("click", (e) => {
  cart.classList.toggle("cart-closed");
  cart.classList.toggle("cart-open");
  modal.classList.toggle("hide");
});

addToCart.addEventListener("click", (e) => {
    if (cart.classList.contains("hide")) {
        cart.classList.remove("hide");
        cart.classList.toggle("cart-open");
    } else if (cart.classList.contains("cart-closed")) {
        cart.classList.toggle("cart-closed");
        cart.classList.toggle("cart-open");
      }
    modal.classList.toggle("hide");
});



const sideCart = document.querySelector('.side-cart')
