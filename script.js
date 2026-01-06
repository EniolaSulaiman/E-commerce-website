// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-link');
const body = document.body;

// Toggle menu function
function toggleMenu() {
    const isActive = mainNav.classList.contains('active');

    if (isActive) {
        closeMenu();
    } else {
        openMenu();
    }
}

// Open menu function
function openMenu() {
    mainNav.classList.add('active');
    mobileMenuToggle.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    // Prevent body scroll when menu is open
    body.style.overflow = 'hidden';
}

// Close menu function
function closeMenu() {
    mainNav.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    // Re-enable body scroll
    body.style.overflow = '';
}

// Toggle menu on button click
mobileMenuToggle.addEventListener('click', toggleMenu);

// Close menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Only close on mobile
        if (window.innerWidth < 768) {
            closeMenu();
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInsideNav = mainNav.contains(e.target);
    const isClickOnToggle = mobileMenuToggle.contains(e.target);

    if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('active')) {
        closeMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        closeMenu();
        mobileMenuToggle.focus(); // Return focus to toggle button
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close menu and reset body overflow if resizing to desktop
    if (window.innerWidth >= 768 && mainNav.classList.contains('active')) {
        closeMenu();
    }
});


// Newsletter form submission (demo)
const newsletterForm = document.querySelector('.newsletter-form');
const newsletterInput = document.querySelector('.newsletter-input');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterInput.value;

    if (email) {
        const submitButton = newsletterForm.querySelector('.btn-primary');
        const originalText = submitButton.textContent;
        submitButton.textContent = '✅ Subscribed!';
        submitButton.style.backgroundColor = 'var(--secondary-color)';
        newsletterInput.value = '';

        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '';
        }, 3000);
    }
});

// Search form (demo)
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value;

    if (query) {
        alert(`Searching for: ${query}`);
        // In a real app, this would redirect or filter products
    }
});


let cart = [];

// Initialize cart from sessionStorage
function initCart() {
    const savedCart = sessionStorage.getItem('shophubCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to sessionStorage
function saveCart() {
    sessionStorage.setItem('shophubCart', JSON.stringify(cart));
}

// Get total items in cart
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Get cart subtotal
function getCartSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showCartNotification('Item added to cart!');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showCartNotification('Item removed from cart');
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSubtotal = document.querySelector('.cart-subtotal');
    const cartTax = document.querySelector('.cart-tax');
    const cartTotal = document.querySelector('.cart-total');

    // Update cart count badge
    const itemCount = getCartItemCount();
    cartCount.textContent = itemCount;
    cartCount.style.display = itemCount > 0 ? 'flex' : 'none';

    // Clear cart items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;

        // Hide footer when cart is empty
        document.querySelector('.cart-modal-footer').style.display = 'none';
        return;
    }

    // Show footer when cart has items
    document.querySelector('.cart-modal-footer').style.display = 'block';

    // Render cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-description">${item.description}</p>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease" aria-label="Decrease quantity">
                        <svg viewBox="0 0 24 24">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase" aria-label="Increase quantity">
                        <svg viewBox="0 0 24 24">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">
                    <svg viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Remove
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Update cart summary
    const subtotal = getCartSubtotal();
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartTax.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const productId = this.dataset.id;
            const action = this.dataset.action;
            updateQuantity(productId, action === 'increase' ? 1 : -1);
        });
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function () {
            const productId = this.dataset.id;
            removeFromCart(productId);
        });
    });
}

// Show cart notification
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Initialize "Add to Cart" buttons
function initAddToCartButtons() {
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Get product info from the product card
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent.trim();
            const productDescription = productCard.querySelector('.product-description').textContent;
            const priceText = productCard.querySelector('.price-current').textContent;
            const price = parseFloat(priceText.replace('$', ''));
            const image = productCard.querySelector('.product-image img').src;

            // Generate unique ID from product name
            const productId = productName.toLowerCase().replace(/\s+/g, '-');

            const product = {
                id: productId,
                name: productName,
                description: productDescription,
                price: price,
                image: image
            };

            addToCart(product);

            // Add visual feedback
            const originalText = button.textContent;
            button.textContent = 'Added!';
            button.style.backgroundColor = 'var(--secondary-color)';

            // Reset button after delay
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 1500);

            // Animate cart icon
            const cartLink = document.querySelector('.cart-link');
            cartLink.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartLink.style.transform = '';
            }, 300);
        });
    });
}
initAddToCartButtons()

// Cart Modal Functionality
const cartModal = document.getElementById('cartModal');
const cartLink = document.querySelector('.cart-link');
const cartCloseBtn = document.querySelector('.cart-close-btn');
const cartOverlay = document.querySelector('.cart-modal-overlay');
const continueShopping = document.querySelector('.btn-secondary');
const checkoutBtn = document.querySelector('.btn-checkout');

// Open cart modal
function openCart() {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close cart modal
function closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    closeCart();
    // Scroll to checkout section
    document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
    // Populate checkout summary
    updateCheckoutSummary();
}

// Event listeners
cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
});

cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
continueShopping.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', goToCheckout);

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartModal.classList.contains('active')) {
        closeCart();
    }
});

// Prevent modal content clicks from closing modal
document.querySelector('.cart-modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
});

document.addEventListener(`DOMContentLoaded`, () => {
    initCart()
})