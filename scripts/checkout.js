import { cart, removeFromCart, calculateCartQuantity, updateQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import {deliveryOptions} from '../data/deliveryOption.js';

 
let cartSummaryHtml = '';
cart.forEach((cartItem) => {
  const productId = cartItem.productId
  let macthingProduct ;
  products.forEach((product) => {
    if(product.id === productId) {
      macthingProduct = product
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if(option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  })
  const today = dayjs()
  const deliveryDate = today.add(deliveryOption.deliveryDays,'days')
  const dataString = deliveryDate.format('dddd, MMMM D');

  cartSummaryHtml += `
          <div class="cart-item-container js-cart-item-container-${macthingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dataString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${macthingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${macthingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(macthingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${macthingProduct.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" 
                  data-product-id=${macthingProduct.id} >
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${macthingProduct.id}">
                  <span class="save-quantity-link link-primary js-save-link"
                    data-product-id=${macthingProduct.id}>
                    Save
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link"
                  data-product-id="${macthingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(macthingProduct, cartItem)}
              </div>
            </div>
          </div>
`
})
function deliveryOptionsHTML(macthingProduct, cartItem) {
  let html = '';
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs()
    const deliveryDate =today.add(deliveryOption.deliveryDays,'days')
    const dataString = deliveryDate.format('dddd, MMMM D')
    const priceString = deliveryOption.priceCents === 0 
          ? "Free"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    html +=
    `<div class="delivery-option">
        <input type="radio"
        ${isChecked ? 'checked': ''}
        class="delivery-option-input"
        name="delivery-option-${macthingProduct.id}">
        <div> 
          <div class="delivery-option-date"> 
            ${dataString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `
  })
  return html
}
document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;
document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId
      removeFromCart(productId)
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove()                                                                                                                                                                                                                                                                                                                      
    })
  });
   const cartQuantity = calculateCartQuantity();
      document.querySelector(`.js-update-items-quantity`).innerHTML = `${cartQuantity} items`
  document.querySelectorAll('.js-update-link')
   .forEach((link) => {
      link.addEventListener('click',() => {
      const productId = link.dataset.productId
      const container = document.querySelector(`.js-cart-item-container-${productId}`)
      container.classList.add('is-editing-quantity');

    })
  })
  document.querySelectorAll('.js-save-link')
  .forEach((link) => {
    link.addEventListener('click',() => {
      const productId = link.dataset.productId
      // const container = document.querySelector(`.js-cart-item-container-${productId}`);
      // container.classList.remove('is-editing-quantity');
      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`)
      const newQuantity = Number(quantityInput.value)
      if (newQuantity < 0 || newQuantity >= 10) {
        alert('Quantity must be at least 1 and less than 10');
        return;
      }
      updateQuantity(productId, newQuantity)

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove('is-editing-quantity');
      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`)
      quantityLabel.innerHTML = newQuantity;
      const cartQuantity = calculateCartQuantity();
      document.querySelector(`.js-update-items-quantity`).innerHTML = `${cartQuantity} items`
    })
  })
