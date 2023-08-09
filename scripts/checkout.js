import {cart, removeFromCart, updateCartQuantity, updateCartItemQuanty} from '../data/cart.js';
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

let quantity = 0;
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
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input type="number" min="1" class="quantity-input js-quantity-input js-quantity-input-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options js-delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked data-product-id="${matchingProduct.id}"
              class="delivery-option-input js-delivery-option-input-${matchingProduct.id}"
              name="delivery-option-${matchingProduct.id}"
              value="date:${deliveryDate3},cost: 0">
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
            <input type="radio" data-product-id="${matchingProduct.id}"
              class="delivery-option-input js-delivery-option-input-${matchingProduct.id}"
              name="delivery-option-${matchingProduct.id}"
              value="date:${deliveryDate2},cost:4.99">
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
            <input type="radio" data-product-id="${matchingProduct.id}"
              class="delivery-option-input js-delivery-option-input-${matchingProduct.id}"
              name="delivery-option-${matchingProduct.id}"
              value="date:${deliveryDate1},cost:9.99">
            <div>
              <div class="delivery-option-date">
                ${deliveryDate1}
              </div>
              <div class="delivery-option-price js-delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

quantity = updateCartQuantity();
document.querySelector('.js-checkout-header-middle-section').innerHTML = `Checkout (<a class="return-to-home-link"
href="amazon.html">${quantity} items</a>)`;


const paymentSummaryHTML = `
<div class="payment-summary-title">
Order Summary
</div>

<div class="payment-summary-row">
<div class="js-items-quantity">Items (${quantity}):</div>
<div class="payment-summary-money js-cost-before-tax">$${formatCurrency(totalBeforeTax)}</div>
</div>

<div class="payment-summary-row">
<div>Shipping &amp; handling:</div>
<div class="payment-summary-money js-payment-summary-money">$0.00</div>
</div>

<div class="payment-summary-row subtotal-row">
<div>Total before tax:</div>
<div class="payment-summary-money js-payment-summary-cost">$${formatCurrency(totalBeforeTax)}</div>
</div>

<div class="payment-summary-row">
<div>Estimated tax (10%):</div>
<div class="payment-summary-money js-payment-summary-tax">$${formatCurrency(totalBeforeTax * 0.1)}</div>
</div>

<div class="payment-summary-row total-row">
<div>Order total:</div>
<div class="payment-summary-money js-payment-summary-total-cost">$${formatCurrency(totalBeforeTax * 1.1)}</div>
</div>

<button class="place-order-button button-primary">
Place your order
</button>
`;

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

updateDeliveryOptions();

function updateDeliveryOptions() {
  let costlBeforeTax =0;
  let totalShipping = 0;
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct;
    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    costlBeforeTax += (cartItem.quantity * matchingProduct.priceCents);
    let cost = 0;
    let deliveryDate = '';
    document.querySelectorAll(`.js-delivery-option-input-${productId}`).forEach((item) => {
      if(item.checked){
        let string = item.value;
        const deliveryOption = Object.fromEntries(string.split(',').map(i => i.split(':')));
        deliveryDate = deliveryOption.date;
        cost = deliveryOption.cost;
        totalShipping += Number(cost) * 100;
        document.querySelector(`.js-delivery-date-${productId}`).innerHTML = `Delivery date: ${deliveryDate}`;
      }
    });
  });
  let tax = (costlBeforeTax + totalShipping) * 0.1;
  let totalCostBeforeTax = costlBeforeTax + totalShipping;
  let totalCost = totalCostBeforeTax + tax;
  document.querySelector('.js-cost-before-tax').innerHTML = `$${formatCurrency(costlBeforeTax)}`;
  document.querySelector('.js-payment-summary-money').innerHTML = `$${formatCurrency(totalShipping)}`;
  document.querySelector('.js-payment-summary-cost').innerHTML = `$${formatCurrency(totalCostBeforeTax)}`;
  document.querySelector('.js-payment-summary-tax').innerHTML = `$${formatCurrency(tax)}`;
  document.querySelector('.js-payment-summary-total-cost').innerHTML = `$${formatCurrency(totalCost)}`;
}

document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      
      if(confirm('Are you sure to delete this item from the cart?')) {
        removeFromCart(productId);
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
        quantity = updateCartQuantity();
        document.querySelector('.js-checkout-header-middle-section').innerHTML = `Checkout (<a class="return-to-home-link"
        href="amazon.html">${quantity} items</a>)`;

        document.querySelector('.js-items-quantity').innerHTML = `Items (${quantity}):`;
        updateDeliveryOptions();
      }

    });
  });

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
    })
  });

  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      const inputValue = document.querySelector(`.js-quantity-input-${productId}`).value;
      const newQuantity = Number(inputValue);
      updateCartItemQuanty(productId, newQuantity);
      container.classList.remove('is-editing-quantity');
      document.querySelector(`.js-quantity-label-${productId}`).innerHTML = `${newQuantity}`;
      quantity = updateCartQuantity();
      document.querySelector('.js-checkout-header-middle-section').innerHTML = `Checkout (<a class="return-to-home-link"
      href="amazon.html">${quantity} items</a>)`;
      updateDeliveryOptions();
      document.querySelector('.js-items-quantity').innerHTML = `Items (${quantity}):`;
    });
  });

  document.querySelectorAll('.js-quantity-input').forEach((input) => {
    input.addEventListener('keydown', (event) => {
        if(event.key === 'Enter') {
          const productId = input.dataset.productId;
          const container = document.querySelector(`.js-cart-item-container-${productId}`);
          const inputValue = document.querySelector(`.js-quantity-input-${productId}`).value;
          const newQuantity = Number(inputValue);
          updateCartItemQuanty(productId, newQuantity);
          container.classList.remove('is-editing-quantity');
          document.querySelector(`.js-quantity-label-${productId}`).innerHTML = `${newQuantity}`;
          quantity = updateCartQuantity();
          document.querySelector('.js-checkout-header-middle-section').innerHTML = `Checkout (<a class="return-to-home-link"
          href="amazon.html">${quantity} items</a>)`;
          updateDeliveryOptions();
          document.querySelector('.js-items-quantity').innerHTML = `Items (${quantity}):`;
      }
    });
  });

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    document.querySelectorAll(`.js-delivery-option-input-${productId}`).forEach((item) => {
      item.addEventListener('click', () => {
        updateDeliveryOptions();
      });
    });
  });