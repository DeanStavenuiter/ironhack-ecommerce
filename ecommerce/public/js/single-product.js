//show correct pictures
const bigImage = document.querySelector(".big-img");
const smallImages = document.getElementsByClassName("single-img");

//click on small pictures to show as the big one
for (let i = 0; i < smallImages.length; i++) {
  smallImages[i].addEventListener("click", (e) => {

    bigImage.src = e.target.src;
    bigImage.alt = e.target.name;
    
  });
}

//add event listeners to divs
const details = document.querySelector(".details");
const sizeAndFit = document.querySelector(".size-and-fit");
const shippingReturning = document.querySelector(".shipping-returning");
const selectSize = document.querySelector(".product-size");
const sizes = document.querySelector(".choose-size ul");

details.addEventListener("click", (e) => {
  document.querySelector(".details-text").classList.toggle("hide");
});
sizeAndFit.addEventListener("click", (e) => {
  document.querySelector(".size-and-fit-text").classList.toggle("hide");
});
shippingReturning.addEventListener("click", (e) => {
  document.querySelector(".shipping-returning-text").classList.toggle("hide");
});
selectSize.addEventListener("click", (e) => {
  document.querySelector(".choose-size").classList.toggle("hide");
});
