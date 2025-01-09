const apiUrl = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889';

const cartTableBody = document.querySelector('.cart-table tbody');
const subtotalSpan = document.querySelector('.cart-totals p span');
const totalSpan = document.querySelector('.cart-totals p + p span');
const checkoutButton = document.querySelector('.checkout-button');

function formatCurrency(amount) {
  return '₹ ' + amount.toLocaleString('en-IN');
}

function updateCartTotals(items) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal; 
  subtotalSpan.textContent = formatCurrency(subtotal);
  totalSpan.textContent = formatCurrency(total);
}

function renderCartItems(cartData) {
  cartTableBody.innerHTML = ''; 
  cartData.items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <img src="${item.image}" alt="${item.title}" class="product-image">
        ${item.title}
      </td>
      <td>${formatCurrency(item.price)}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
      </td>
      <td>${formatCurrency(item.price * item.quantity)}</td>
      <td><button class="remove-item" data-id="${item.id}">🗑️</button></td>
    `;
    cartTableBody.appendChild(row);
  });
  updateCartTotals(cartData.items); 
}

function updateItemQuantity(id, quantity) {
  const cartData = JSON.parse(localStorage.getItem('cartData')) || { items: [] };
  const item = cartData.items.find(item => item.id === id);
  if (item) {
    item.quantity = quantity;
    localStorage.setItem('cartData', JSON.stringify(cartData));
    renderCartItems(cartData); 
  }
}

function removeItem(id) {
  const cartData = JSON.parse(localStorage.getItem('cartData')) || { items: [] };
  cartData.items = cartData.items.filter(item => item.id !== id);
  localStorage.setItem('cartData', JSON.stringify(cartData));
  renderCartItems(cartData); 
}

document.addEventListener('input', (e) => {
  if (e.target.classList.contains('quantity-input')) {
    const quantity = parseInt(e.target.value);
    const id = parseInt(e.target.getAttribute('data-id'));
    updateItemQuantity(id, quantity);
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    const id = parseInt(e.target.getAttribute('data-id'));
    removeItem(id);
  }
});

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('cartData', JSON.stringify(data));
    renderCartItems(data); 
  })
  .catch(error => {
    console.error('Error fetching cart data:', error);
  });

checkoutButton.addEventListener('click', () => {
  const cartData = JSON.parse(localStorage.getItem('cartData'));
  alert('Proceeding to checkout with cart data: ' );
});
