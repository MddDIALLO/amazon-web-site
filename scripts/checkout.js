import {cart, removeFromCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

let cartSummaryHTML = '';

let nowDate = new Date();

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const deliveryDate1 = addDays(nowDate, 1).toDateString();
const deliveryDate2 = addDays(nowDate, 3).toDateString();
const deliveryDate3 = addDays(nowDate, 7).toDateString();


let totalBeforeTax = 0;

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  totalBeforeTax += (cartItem.quantity * matchingProduct.priceCents);

  cartSummaryHTML += `
    <div class="cart-item-container
      js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date js-delivery-date-${matchingProduct.id}">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input js-delivery-option-input-${matchingProduct.id}"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${deliveryDate3}
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input js-delivery-option-input-${matchingProduct.id}"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${deliveryDate2}
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input js-delivery-option-input-${matchingProduct.id}"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${deliveryDate1}
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

/*cart.forEach((elem) => {
  const productId = elem.productId;
  const htmlElement = document.getElementsByName(`delivery-option-${productId}`);
  console.log(htmlElement);
  htmlElement.forEach((item) => {
    if(item.checked) {
      console.log(item.value);
    }
  })
});*/

const paymentSummaryHTML = `
<div class="payment-summary-title">
Order Summary
</div>

<div class="payment-summary-row">
<div>Items (${cart.length}):</div>
<div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
</div>

<div class="payment-summary-row">
<div>Shipping &amp; handling:</div>
<div class="payment-summary-money">$0.00</div>
</div>

<div class="payment-summary-row subtotal-row">
<div>Total before tax:</div>
<div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
</div>

<div class="payment-summary-row">
<div>Estimated tax (10%):</div>
<div class="payment-summary-money">$${formatCurrency(totalBeforeTax * 0.1)}</div>
</div>

<div class="payment-summary-row total-row">
<div>Order total:</div>
<div class="payment-summary-money">$${formatCurrency(totalBeforeTax * 1.1)}</div>
</div>

<button class="place-order-button button-primary">
Place your order
</button>
`;

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      
      if(confirm('Are you sure to delete this item from the cart?')) {
        removeFromCart(productId);
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
      }

    });
  });