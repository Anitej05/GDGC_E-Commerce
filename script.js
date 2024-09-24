document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const cartItems = document.getElementById('cart-items');
    const totalMRP = document.getElementById('total-mrp');
    const couponDiscount = document.getElementById('coupon-discount');
    const platformFee = document.getElementById('platform-fee');
    const shippingCharges = document.getElementById('shipping-charges');
    const totalAmount = document.getElementById('total-amount');
    const placeOrderBtn = document.getElementById('place-order');
    const cartToggle = document.getElementById('cart-toggle');
    const cartContent = document.getElementById('cart-content');
    const initialCartMessage = document.getElementById('initial-cart-message');
    const priceDetails = document.getElementById('price-details');
  
    let cart = [];
  
    function get_data() {
      return fetch('https://fakestoreapi.com/products', {
          method: 'GET'
        })
        .then(res => res.json())
        .catch((error) => console.log(error));
    }
  
    function updateCart() {
      cartItems.innerHTML = '';
      let total = 0;
  
      if (cart.length === 0) {
        initialCartMessage.style.display = 'block';
        priceDetails.style.display = 'none';
        placeOrderBtn.style.display = 'none';
      } else {
        initialCartMessage.style.display = 'none';
        priceDetails.style.display = 'block';
        placeOrderBtn.style.display = 'block';
  
        cart.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.classList.add('cart-item');
          itemElement.innerHTML = `
                      <img src="${item.image}" alt="${item.title}">
                      <div class="cart-item-details">
                          <div class="cart-item-title">${item.title}</div>
                          <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                      </div>
                      <div class="cart-item-quantity">
                          <button onclick="changeQuantity(${item.id}, -1)">-</button>
                          <span>${item.quantity}</span>
                          <button onclick="changeQuantity(${item.id}, 1)">+</button>
                      </div>
                      <button class="delete-btn" onclick="deleteFromCart(${item.id})">Delete</button>
                  `;
          cartItems.appendChild(itemElement);
          total += item.price * item.quantity;
        });
  
        totalMRP.textContent = `₹${total.toFixed(2)}`;
        couponDiscount.textContent = `-₹50.00`;
        platformFee.textContent = `₹10.00`;
        shippingCharges.textContent = `₹20.00`;
        totalAmount.textContent = `₹${(total - 50 + 10 + 20).toFixed(2)}`;
      }
    }
  
    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const productCards = document.querySelectorAll('.product-card');
      let visibleCount = 0;
      productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
          card.style.display = 'block';
          card.style.order = visibleCount;
          visibleCount++;
        } else {
          card.style.display = 'none';
          card.style.order = '';
        }
      });
    });
  
    get_data()
      .then(data => {
        data.forEach(product => {
          let productCard = document.createElement('div');
          productCard.classList.add('col-md-3', 'mb-4', 'product-card');
          productCard.innerHTML = `
                      <div class="product-card-inner">
                          <img src="${product.image}" alt="${product.title}" class="product-image">
                          <div class="product-name">${product.title}</div>
                          <div class="product-rating">★ ${product.rating.rate}</div>
                          <div class="product-price">₹${product.price.toFixed(2)}</div> 
                          <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button> 
                      </div>
                  `;
          productGrid.appendChild(productCard);
  
          // Add event listeners for hover effects on product cards (applied to .product-card-inner)
          const productCardInner = productCard.querySelector('.product-card-inner');
          productCardInner.addEventListener('mouseover', () => {
            productCardInner.style.transform = 'scale(1.05)'; // Scale up slightly on hover 
            productCardInner.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'; // Add a more pronounced shadow
          });
  
          productCardInner.addEventListener('mouseout', () => {
            productCardInner.style.transform = 'scale(1)'; // Reset scale on mouseout
            productCardInner.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Reset shadow
          });
  
          // Add event listener for scrolling to trigger card shaking
          window.addEventListener('scroll', () => {
            productCard.classList.add('shake'); // Add the 'shake' class to each card on scroll
            setTimeout(() => {
              productCard.classList.remove('shake'); // Remove the 'shake' class after a short delay
            }, 1200); // Adjusted the delay to match the animation duration
          });
        });
      });
  
    window.addToCart = function(productId) {
      get_data().then(products => {
        const product = products.find(p => p.id === productId);
        if (product) {
          const existingItem = cart.find(item => item.id === product.id);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            cart.push({
              ...product,
              quantity: 1
            });
          }
          updateCart();
        }
      });
    }
  
    window.changeQuantity = function(id, change) {
      const item = cart.find(item => item.id === id);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          cart = cart.filter(cartItem => cartItem.id !== id);
        }
        updateCart();
      }
    }
  
    window.deleteFromCart = function(id) {
      cart = cart.filter(item => item.id !== id);
      updateCart();
    }
  
    placeOrderBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Please add at least one product to your cart before placing an order.');
        return;
      }
      alert('Order placed successfully!');
      cart = [];
      updateCart();
    });
  
    // Cart toggle functionality
    cartToggle.addEventListener('click', () => {
      cartContent.classList.toggle('collapsed');
      cartToggle.classList.toggle('collapsed');
    });
  
    // Initial cart update
    updateCart();
  
    // Collapse and expand cart on scroll (fixed expansion issue)
    let isScrolling;
    window.addEventListener('scroll', () => {
      // ... (card shaking logic is the same) ...
  
      if (!cartContent.classList.contains('collapsed')) {
        cartContent.classList.add('collapsed');
        cartToggle.classList.add('collapsed');
        isScrolling = true;
      }
  
      clearTimeout(window.cartTimeout);
      window.cartTimeout = setTimeout(() => {
        if (isScrolling) {
          cartContent.classList.remove('collapsed');
          cartToggle.classList.remove('collapsed');
          isScrolling = false;
        }
      }, 200);
    });
  });