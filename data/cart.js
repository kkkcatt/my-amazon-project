export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
	cart = [{
		productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
		quantity:2,
		deliveryOptionId: '1'
	},{
		productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
		quantity:1,
		deliveryOptionId: '2'
	}];
}

function saveToStorage() {
	localStorage.setItem('cart', JSON.stringify(cart))
}

export function addToCart (productId) {
	let matchingItem
	const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`)
	const quantity = Number(quantitySelector.value)
	cart.forEach((cartItem) => {
		if(productId === cartItem.productId){
			matchingItem = cartItem
		} 
	});
	if(matchingItem){
		matchingItem.quantity += quantity;
	} else {
		cart.push({
			productId,
			quantity,
			deliveryOptionId : '1'
		})
	}
	saveToStorage();
  //第二种合计购物车数量写法
	// const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
	// document.querySelector(`.js-cart-quantity`).innerHTML = cartQuantity;
}
export function removeFromCart(productId) {
  const newCart = []
  cart.forEach((cartItem) => {
    if(productId !== cartItem.productId){
      newCart.push(cartItem)
    }
  })
  cart = newCart
	saveToStorage()
}

export function calculateCartQuantity() {
	let cartQuantity = 0;
	cart.forEach((cartItem) => {
		if(cartItem){
		cartQuantity += cartItem.quantity
	}
	})
	return cartQuantity;
 }

 export function  updateQuantity(productId, newQuantity) {
	let matchingItem;
	cart.forEach((cartItem) => {
		if(productId === cartItem.productId) {
			matchingItem = cartItem
		}
	})
	matchingItem.quantity = newQuantity;
	saveToStorage()
 }