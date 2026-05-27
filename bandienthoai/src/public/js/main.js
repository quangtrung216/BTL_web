console.log('client js loaded');

// Add to Cart Function
function addToCart(productId) {
  if (!productId) {
    alert('Invalid product ID');
    return;
  }
  
  // Get quantity from input if available, otherwise default to 1
  const quantityInput = document.querySelector(`[data-product-id="${productId}"] input[type="number"]`);
  const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
  
  // Send request to add product to cart
  fetch('/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId: productId,
      quantity: quantity
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Product added to cart successfully!');
      // Update cart count if available
      updateCartCount();
    } else {
      alert(data.message || 'Failed to add product to cart');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while adding to cart');
  });
}

// View Product Function
function viewProduct(productId) {
  if (!productId) {
    alert('Invalid product ID');
    return;
  }
  
  window.location.href = `/products/${productId}`;
}

// Update Cart Count
function updateCartCount() {
  const cartBadge = document.querySelector('.cart-count');
  if (!cartBadge) return;

  fetch('/cart/count')
    .then(response => response.json())
    .then(data => {
      cartBadge.textContent = data.count || 0;
    })
    .catch(error => console.error('Error updating cart count:', error));
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const toast = document.querySelector('.app-toast');
  if (toast) {
    const closeToast = function() {
      toast.classList.add('is-hiding');
      window.setTimeout(function() {
        toast.remove();
      }, 260);
    };

    const closeButton = toast.querySelector('.app-toast__close');
    if (closeButton) closeButton.addEventListener('click', closeToast);

    window.setTimeout(function() {
      if (document.body.contains(toast)) closeToast();
    }, 5200);
  }

  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  
  if (mobileMenuToggle && navbarMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navbarMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
  }
  
  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navbarMenu) navbarMenu.classList.remove('active');
      if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (navbarMenu && mobileMenuToggle) {
      const isClickInsideMenu = navbarMenu.contains(event.target);
      const isClickOnToggle = mobileMenuToggle.contains(event.target);
      
      if (!isClickInsideMenu && !isClickOnToggle) {
        navbarMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      }
    }
  });
  
  // Initialize cart count on page load
  updateCartCount();
});
