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

  const homeCarousel = document.querySelector('[data-home-carousel]');
  if (homeCarousel && homeCarousel.children.length > 1) {
    let carouselTimer = null;
    let isPaused = false;

    const rotateBestSeller = function() {
      if (
        isPaused ||
        homeCarousel.classList.contains('is-preparing') ||
        homeCarousel.classList.contains('is-sliding')
      ) return;

      const lastCard = homeCarousel.lastElementChild;
      if (!lastCard) return;

      homeCarousel.insertBefore(lastCard, homeCarousel.firstElementChild);
      homeCarousel.classList.add('is-preparing');
      homeCarousel.offsetWidth;

      window.requestAnimationFrame(function() {
        homeCarousel.classList.remove('is-preparing');
        homeCarousel.classList.add('is-sliding');
      });

      window.setTimeout(function() {
        homeCarousel.classList.remove('is-sliding');
      }, 940);
    };

    carouselTimer = window.setInterval(rotateBestSeller, 10000);

    homeCarousel.addEventListener('mouseenter', function() {
      isPaused = true;
    });
    homeCarousel.addEventListener('mouseleave', function() {
      isPaused = false;
    });
    homeCarousel.addEventListener('focusin', function() {
      isPaused = true;
    });
    homeCarousel.addEventListener('focusout', function() {
      isPaused = false;
    });

    document.addEventListener('visibilitychange', function() {
      if (document.hidden && carouselTimer) {
        window.clearInterval(carouselTimer);
        carouselTimer = null;
      } else if (!document.hidden && !carouselTimer) {
        carouselTimer = window.setInterval(rotateBestSeller, 10000);
      }
    });
  }
});
