import {cart, addToCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${formatCurrency(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="js-added-to-cart js-added-to-cart-${product.id} added-to-cart"></div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;
updateCartQuantity();

function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

function addedToCartMessage(productId) {
  const element = document.querySelector(`.js-added-to-cart-${productId}`);
  if (timeoutId) {
    resetAddMessage();
  }
  element.innerHTML = `
    <img src="images/icons/checkmark.png">
    Added
  `;

  element.classList.add('added-to-cart1');

  timeoutId = setTimeout(() => {
    element.classList.remove('added-to-cart1');
  }, 2000);
}

function resetSelector(productId) {
  const select = document.querySelector(`.js-quantity-selector-${productId}`);
    select.value = '1';
}

function resetAddMessage() {
  document.querySelectorAll('.js-added-to-cart').forEach((elem) => {
    elem.classList.remove('added-to-cart1');
    clearTimeout(timeoutId);
  });
}

let timeoutId;
document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const { productId } = button.dataset;
      const select = document.querySelector(`.js-quantity-selector-${productId}`);
      const quantity = Number(select.value);

      addToCart(productId, quantity);
      updateCartQuantity();
      resetSelector(productId);
      addedToCartMessage(productId);
    });
  });