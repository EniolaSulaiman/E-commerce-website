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

        // Add to cart functionality (demo)
        const addToCartButtons = document.querySelectorAll('.btn-add-cart');
        const cartCount = document.querySelector('.cart-count');
        let currentCount = parseInt(cartCount.textContent);

        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Increment cart count
                currentCount++;
                cartCount.textContent = currentCount;
                
                // Add visual feedback
                button.textContent = 'Added!';
                button.style.backgroundColor = 'var(--secondary-color)';
                
                // Reset button after delay
                setTimeout(() => {
                    button.textContent = 'Add to Cart';
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

        // Newsletter form submission (demo)
        const newsletterForm = document.querySelector('.newsletter-form');
        const newsletterInput = document.querySelector('.newsletter-input');

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterInput.value;
            
            if (email) {
                const submitButton = newsletterForm.querySelector('.btn-primary');
                submitButton.textContent = 'Subscribed!';
                submitButton.style.backgroundColor = 'var(--secondary-color)';
                newsletterInput.value = '';
                
                setTimeout(() => {
                    submitButton.textContent = 'Subscribe';
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
