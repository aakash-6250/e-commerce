'use strict';

function mobileSearchBarAnimation() {
    const mobileSearchIcon = document.querySelector('.mobile-search-icon');
    const mobileSearchBarContainer = document.querySelector('.mobile-search-bar-container');
    const mobileSearchBar = document.querySelector('.mobile-search-bar');
    const searchBarInput = document.querySelector('.mobile-search-bar input');

    if (mobileSearchIcon && mobileSearchBarContainer && mobileSearchBar && searchBarInput) {
        mobileSearchBarContainer.addEventListener('click', (e) => {
            if (e.target === mobileSearchBarContainer) {
                mobileSearchBarContainer.style.display = 'none';
                searchBarInput.value = '';
            }
        });

        mobileSearchIcon.addEventListener('click', () => {
            mobileSearchBarContainer.style.display = 'block';
            gsap.from(mobileSearchBar, {
                y: '-100%',
                opacity: 1,
                duration: 0.5
            });
        });
    }
}

function mobileMenuAnimation() {
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileMenuIconClose = document.querySelector('.mobile-menu-list-close');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const mobileMenuList = document.querySelector('.mobile-menu-list');
    const mobileMenuItem = document.querySelectorAll('.mobile-menu-item');
    const mobileMenuItemSubcategories = document.querySelectorAll('.mobile-menu-item-subcategory');

    if (mobileMenuIcon && mobileMenuIconClose && mobileMenuContainer && mobileMenuList) {
        mobileMenuIcon.addEventListener('click', () => {
            mobileMenuContainer.style.display = 'block';
            gsap.from(mobileMenuList, {
                x: '-100%',
                opacity: 1,
                duration: 0.5
            });
        });

        mobileMenuContainer.addEventListener('click', (e) => {
            if (e.target === mobileMenuContainer) {
                mobileMenuContainer.style.display = 'none';
                mobileMenuItemSubcategories.forEach(subcat => {
                    subcat.classList.add('hidden');
                    subcat.classList.remove('flex');
                });
            }
        });

        mobileMenuIconClose.addEventListener('click', () => {
            mobileMenuContainer.style.display = 'none';
            mobileMenuItemSubcategories.forEach(subcat => {
                subcat.classList.add('hidden');
                subcat.classList.remove('flex');
            });
        });

        mobileMenuItem.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenuItemSubcategories.forEach(subcat => {
                    subcat.classList.add('hidden');
                    subcat.classList.remove('flex');
                });
                const subcategories = item.querySelector('.mobile-menu-item-subcategory');
                if (subcategories) {
                    subcategories.classList.remove('hidden');
                    subcategories.classList.add('flex');
                }
            });
        });
    }
}

function desktopMenuAnimation() {
    const menuItems = document.querySelectorAll('.desktop-menu-item');
    const subcategories = document.querySelectorAll('.desktop-menu-subcategory');

    if (menuItems.length > 0 && subcategories.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('mouseover', () => {
                const arrow = item.querySelector('.ri-arrow-right-s-line');
                gsap.to(arrow, {
                    rotate: 90,
                    duration: 0.3,
                    ease: 'power2.inOut'
                });
                subcategories.forEach(subcat => {
                    subcat.classList.add('hidden');
                    subcat.classList.remove('flex');
                });
                const subcategory = item.querySelector('.desktop-menu-subcategory');
                if (subcategory) {
                    subcategory.classList.remove('hidden');
                    subcategory.classList.add('flex');
                }
            });

            item.addEventListener('mouseleave', () => {
                const arrow = item.querySelector('.ri-arrow-right-s-line');
                gsap.to(arrow, {
                    rotate: 0,
                    duration: 0.3,
                    ease: 'power2.inOut'
                });
                subcategories.forEach(subcat => {
                    subcat.classList.add('hidden');
                    subcat.classList.remove('flex');
                });
            });
        });
    }
}

function grandCarouselSlider() {
    const grandCarousel = document.querySelector('.grand-carousel');
    const prevBtn = document.querySelector('.prev-slide i');
    const nextBtn = document.querySelector('.next-slide i');
    const slider = document.querySelector('.grand-carousel .slider');
    const slides = document.querySelectorAll('.grand-carousel .slider .slide');
    let slideIndex = 0;
    let interval;

    function startInterval() {
        interval = setInterval(() => {
            slides[slideIndex].classList.remove('active');
            slideIndex = (slideIndex + 1) % slides.length;
            slides[slideIndex].classList.add('active');
            slider.style.transform = `translateX(-${slideIndex * 100}%)`;
        }, 5000);
    }

    if (grandCarousel && prevBtn && nextBtn && slider && slides.length > 0) {
        slides[slideIndex].classList.add('active');

        grandCarousel.addEventListener('mouseover', () => {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.remove('hidden');
        });

        grandCarousel.addEventListener('mouseleave', () => {
            prevBtn.classList.add('hidden');
            nextBtn.classList.add('hidden');
        });

        prevBtn.addEventListener('click', () => {
            slides[slideIndex].classList.remove('active');
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            slides[slideIndex].classList.add('active');
            slider.style.transform = `translateX(-${slideIndex * 100}%)`;
        });

        nextBtn.addEventListener('click', () => {
            slides[slideIndex].classList.remove('active');
            slideIndex = (slideIndex + 1) % slides.length;
            slides[slideIndex].classList.add('active');
            slider.style.transform = `translateX(-${slideIndex * 100}%)`;
        });

        startInterval();
    }
}

function trendingProductsSlider() {
    const slider = document.querySelector('.trending-products .slider');
    const nextBtn = document.querySelector('.trending-products .header .next-btn');
    const prevBtn = document.querySelector('.trending-products .header .prev-btn');
    const slides = document.querySelectorAll('.trending-products .slider .slide');
    let slideIndex = 0;
    let interval;

    function startInterval() {
        interval = setInterval(() => {
            slides[slideIndex].classList.remove('active');
            slideIndex = slideIndex < slides.length - 3 ? slideIndex + 1 : 0;
            slides[slideIndex].classList.add('active');
            slider.style.transform = `translateY(-${slideIndex * 100}px)`;
        }, 5000);
    }

    if (slider && nextBtn && prevBtn && slides.length > 0) {
        slides[slideIndex].classList.add('active');

        nextBtn.addEventListener('click', () => {
            slides[slideIndex].classList.remove('active');
            slideIndex = slideIndex < slides.length - 3 ? slideIndex + 1 : 0;
            slides[slideIndex].classList.add('active');
            slider.style.transform = `translateY(-${slideIndex * 100}px)`;
        });

        prevBtn.addEventListener('click', () => {
            slides[slideIndex].classList.remove('active');
            slideIndex = slideIndex > 0 ? slideIndex - 1 : slides.length - 3;
            slides[slideIndex].classList.add('active');
            slider.style.transform = `translateY(-${slideIndex * 100}px)`;
        });

        startInterval();
    }
}

function factsScroller() {
    const scroller = document.querySelector('.facts-scroller');
    const items = document.querySelectorAll('.facts-scroller p');
    if (scroller && items.length > 0) {
        const itemWidth = items[0].offsetWidth;
        const totalWidth = itemWidth * items.length - window.innerWidth;

        gsap.to(scroller, {
            x: `-${totalWidth}px`,
            duration: 20,
            ease: 'none',
            repeat: -1,
            onRepeat: () => {
                gsap.set(scroller, { x: 0 });
            }
        });
    }
}

let customerReviewInterval;
function customerReviewSlider() {
    const slider = document.querySelector('.customer-review .slider');
    const slides = document.querySelectorAll('.customer-review .slider .slide');
    let slideIndex = 0;
    let slidesToShow;

    function updateSlidesToShow() {
        if (window.innerWidth > 1280) slidesToShow = 3;
        else if (window.innerWidth > 768 && window.innerWidth < 1280) slidesToShow = 2;
        else if (window.innerWidth < 768) slidesToShow = 1;
    }

    function startInterval() {
        customerReviewInterval = setInterval(() => {
            slideIndex = slideIndex < slides.length - slidesToShow ? slideIndex + slidesToShow : 0;
            slider.style.transform = `translateX(-${slideIndex * 380}px)`;
        }, 5000);
    }

    if (slider && slides.length > 0) {
        updateSlidesToShow();
        startInterval();
    }
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

window.addEventListener('resize', debounce(() => {
    clearInterval(customerReviewInterval);
    customerReviewSlider();
}, 200));

function cartAnimation() {
    const main = document.querySelector('main')
    const cartBtns = document.querySelectorAll('.cart-btn');
    const cart = document.querySelector('.cart');
    const cartCloseBtn = document.querySelector('.cart .header .ri-close-large-line');

    cartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cart.classList.remove("hidden");
            gsap.to(cart, {
                x: '-450px',
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        main.addEventListener('click', (e) => {
            if (!cart.contains(e.target) && e.target !== btn) {
                gsap.to(cart, {
                    x: '100%',
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete: () => {
                        cart.classList.add("hidden");
                    }
                });
            }
        });
    });

    cartCloseBtn.addEventListener('click', (e) => {
        if (e.target === cartCloseBtn) {
            gsap.to(cart, {
                x: '100%',
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                    cart.classList.add("hidden");
                }
            });
        }
    });


}

function shopPageCheckboxAnimation() {
    const filterHeaders = document.querySelectorAll('.filter-header');
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');

    filterHeaders.forEach(header => {
        const addIcon = header.querySelector('.toggle-icon-add');
        const subIcon = header.querySelector('.toggle-icon-sub');
        const filterOptions = header.nextElementSibling;

        header.addEventListener('click', () => {
            filterOptions.classList.toggle('hidden');
            addIcon.classList.toggle('hidden');
            subIcon.classList.toggle('hidden');
        });
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateURLParameters();
        });
    });

    function updateURLParameters() {
        const params = new URLSearchParams(window.location.search);

        params.delete('filter');

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                params.append('filter', checkbox.value);
            }
        });

        history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    }


}

function loginRegisterAnimation() {
    const main = document.querySelector('main')
    const accountBtns = document.querySelectorAll('.account-btn');
    const loginRegister = document.querySelector('.login-register');
    const loginRegisterCloseBtn = document.querySelector('.login-register .header .ri-close-large-line');

    accountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginRegister.classList.remove("hidden");
            gsap.to(loginRegister, {
                x: '-450px',
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        main.addEventListener('click', (e) => {
            if (!loginRegister.contains(e.target) && e.target !== btn) {
                gsap.to(loginRegister, {
                    x: '100%',
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete: () => {
                        loginRegister.classList.add("hidden");
                    }
                });
            }
        });
    });

    loginRegisterCloseBtn.addEventListener('click', (e) => {
        if (e.target === loginRegisterCloseBtn) {
            gsap.to(loginRegister, {
                x: '100%',
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                    loginRegister.classList.add("hidden");
                }
            });
        }
    });

}

// function showToast(message, type = 'info') {
//     let bgColor = '#3182CE'; // Default to blue for info

//     switch (type) {
//         case 'success':
//             bgColor = '#48BB78'; // Green
//             break;
//         case 'error':
//             bgColor = '#F56565'; // Red
//             break;
//         case 'warning':
//             bgColor = '#ED8936'; // Orange
//             break;
//     }

//     Toastify({
//         text: message,
//         duration: 3000,
//         close: true,
//         gravity: 'top',
//         position: 'right',
//         backgroundColor: bgColor,
//         stopOnFocus: true,
//     }).showToast();
// }

function showToast(message = "Something went wrong...", type = 'info') {
    let bgColor = '#3182CE'; // Default to blue for info

    switch (type) {
        case 'success':
            bgColor = '#48BB78'; // Green
            break;
        case 'error':
            bgColor = '#F56565'; // Red
            break;
        case 'warning':
            bgColor = '#ED8936'; // Orange
            break;
    }

    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        style: {
            background: bgColor
        },
        stopOnFocus: true,
    }).showToast();
}

function fetchProducts(page = 1, limit = 12) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);


    params.set('page', page);
    params.set('limit', limit);


    const apiUrl = `/api/product?${params.toString()}`;

    axios.get(apiUrl)
        .then(response => {
            const data = response.data;

            displayProducts(data.data.products);
            updatePagination(data.data.pagination);
        })
        .catch(error => {
            const data = error.response.data;
            showToast(data.message, data.type);
        });
}

function displayProducts(products) {
    try {
        const productContainer = document.querySelector('.shop-products .products');
        productContainer.innerHTML = '';

        products.forEach(product => {
            const productStock = product.stock > 0 ? 'Available' : 'Out of stock';
            const productElement = document.createElement('div');

            productElement.className = 'product h-[412px] shadow-md shadow-zinc-200 w-[263px] relative group';

            productElement.innerHTML = `
                <div class="product-image relative h-[330px] w-full flex justify-center items-center">
                    ${product.images.length > 0 ?
                    `<img loading="lazy" src="/images/product/${product.images[0]}" alt="${product.name}" class="h-[330px] w-full object-cover">` :
                    `<img loading="lazy" src="/images/product/default.jpg" alt="Default Image" class="h-[330px] w-full object-cover">`
                }

                    ${product.sale > 0 ?
                    `<img loading="lazy" class="absolute top-0 left-0" src="/images/product/sale-tag.svg" alt="Sale Tag">` :
                    ``}
                    <button class="add-to-cart-btn absolute whitespace-nowrap lg:hidden lg:bottom-1/2 bottom-4 left-1/2 bg-[#967BB6] text-white hover:bg-white hover:text-black rounded-[58px] py-[12px] px-[50px] lg:group-hover:flex  -translate-x-1/2 lg:translate-y-1/2" data-id="${product._id}">Add to Cart</button>
                </div>

                <div class="product-details h-[82px] flex flex-col justify-evenly items-center w-full text-center">
                    <a href="/product/${product._id}" class="product-name text-[#191717] flex  flex-col justify-evenly items-center w-full h-full">

                    <p class="hover:border-b-[1px] w-max border-[#191717]">${product.name}</p>
                    <div class="product-price flex justify-center items-center gap-[10px]">
                        ${product.sale > 0 ?
                    `<strike class="product-old-price text-[#ACACAC] font-[merriweather]">&#8377 ${product.price}</strike>
                         <p class="product-new-price bg-transparent text-[#967BB6] font-[merriweather]">&#8377 ${(product.price * ((100 - product.sale) / 100)).toFixed(2)}</p>` :
                    `<p class="product-new-price bg-transparent text-[#967BB6] font-[merriweather]">&#8377 ${product.price}</p>`}
                    </div>

                    </a>
                </div>
            `;

            productContainer.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error displaying products:', error);
    }
}

function updatePagination(pagination) {
    try {
        const paginationContainer = document.querySelector('.pagination-container');
        const showingResults = paginationContainer.querySelector('.entries-count');
        const prevButton = paginationContainer.querySelector('.controls .prev-btn');
        const nextButton = paginationContainer.querySelector('.controls .next-btn');
        const pageBtns = paginationContainer.querySelector('.page-btns-container');
        pageBtns.innerHTML = '';

        showingResults.innerText = `Showing page ${pagination.currentPage} of ${pagination.totalPages} pages, ${pagination.totalProducts} entries`;

        prevButton.onclick = pagination.currentPage > 1 ? () => fetchProducts(pagination.currentPage - 1, pagination.pageSize) : null;
        nextButton.onclick = pagination.currentPage < pagination.totalPages ? () => fetchProducts(pagination.currentPage + 1, pagination.pageSize) : null;

        if (pagination.totalPages > 1) {
            let start, end;
            if (pagination.totalPages <= 5) {
                start = 1;
                end = pagination.totalPages;
            } else {
                if (pagination.currentPage <= 3) {
                    start = 1;
                    end = 5;
                } else if (pagination.currentPage > pagination.totalPages - 3) {
                    start = pagination.totalPages - 4;
                    end = pagination.totalPages;
                } else {
                    start = pagination.currentPage - 2;
                    end = pagination.currentPage + 2;
                }
            }

            for (let i = start; i <= end; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = i === pagination.currentPage ?
                    'current-page-btn px-3 py-1 rounded-full bg-blue-600 text-white' :
                    'page-btn px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white';
                pageBtn.innerText = i;
                pageBtn.onclick = () => fetchProducts(i, pagination.pageSize);
                pageBtns.appendChild(pageBtn);
            }
        } else {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'current-page-btn px-3 py-1 rounded-full bg-blue-600 text-white';
            pageBtn.innerText = 1;
            pageBtns.appendChild(pageBtn);
        }
    } catch (error) {
        console.error('Error updating pagination:', error);
    }
}

async function syncCartWithDatabase() {
    // try {
    //     const response = await axios.get('/api/loggedin');

    //     if (response.data.data.loggedIn) {

    //         let cart = JSON.parse(localStorage.getItem('cart')) || [];
    //         if (cart.length > 0) {
    //             await axios.post('/api/cart', { cart });
    //             localStorage.removeItem('cart');
    //         }
    //     }
    // } catch (error) {
    //     console.error('Failed to sync cart with database:', error);
    // }
}

function updateCartData() {
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], totalAmount: 0 };


    // Selectors for cart elements
    const cartElement = document.querySelector('.cart');
    const productsContainer = cartElement.querySelector('.products');
    const subtotalElement = cartElement.querySelector('.subtotal .amount');
    const totalElement = cartElement.querySelector('.total p:last-child');
    const cartCountElements = document.querySelectorAll('.cart-btn p');
    const emptyCartMessage = cartElement.querySelector('.empty-cart-message');

    // Check if cart is empty
    if (cart.items.length === 0) {
        // Hide cart content and show empty cart message
        productsContainer.innerHTML = '';
        subtotalElement.textContent = '₹0.00';
        totalElement.textContent = '₹0.00';
        cartElement.querySelector('.calculations').style.display = 'none';
        emptyCartMessage.style.display = 'block';
        cartElement.querySelector('.checkout').style.display = 'none';
    } else {
        // Show cart content
        cartElement.querySelector('.calculations').style.display = 'block';
        emptyCartMessage.style.display = 'none';
        cartElement.querySelector('.checkout').style.display = 'block';

        // Clear existing products
        productsContainer.innerHTML = '';

        // Loop through cart items and generate HTML for each product
        cart.items.forEach(item => {
            const productElement = document.createElement('div');
            productElement.classList.add('product', 'flex', 'gap-2', 'w-full');
            
            productElement.innerHTML = `
                <i class="delete ri-close-line cursor-pointer" data-id="${item.product._id}"></i>
                <div class="product-details h-[75px] w-full flex gap-[5px] justify-between items-start">
                    <img src="/images/product/${item.product.image}" alt="${item.product.name}" class="image w-[75px] h-[75px] ">
                    <div class="name h-full flex flex-col pl-[5px] w-full justify-between items-start">
                        <p class="text-[#191717] pr-[100px]">${item.product.name}</p>
                        <div class="increase-decrease-qty flex gap-[10px] text-[#191717]">
                            <i class="ri-subtract-line cursor-pointer" data-id="${item.product._id}"></i>
                            <p class="current-qty rounded-full w-max px-2" style="box-shadow: 0px 1px 10px 0px #00000014;">${item.quantity}</p>
                            <i class="ri-add-line cursor-pointer" data-id="${item.product._id}"></i>
                        </div>
                    </div>
                </div>
                <div class="price font-[merriweather] bg-white w-[100px]">₹${item.product.price}</div>
            `;

            // Append the product element to the container
            productsContainer.appendChild(productElement);
        });

        // Update subtotal and total amounts
        subtotalElement.textContent = `₹${cart.totalAmount.toFixed(2)}`;
        totalElement.textContent = `₹${cart.totalAmount.toFixed(2)}`;

        // Update the cart count
        const totalItems = cart.items.length;
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });

        // Event listeners for increase, decrease, and delete actions
        productsContainer.querySelectorAll('.ri-add-line').forEach(element => {
            element.addEventListener('click', increaseQuantity);
        });

        productsContainer.querySelectorAll('.ri-subtract-line').forEach(element => {
            element.addEventListener('click', decreaseQuantity);
        });

        productsContainer.querySelectorAll('.delete').forEach(element => {
            element.addEventListener('click', deleteProduct);
        });
    }
}


function increaseQuantity(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart'));
    const productIndex = cart.items.findIndex(item => item.product._id === productId);

    if (productIndex > -1 && cart.items[productIndex].quantity < 10) {
        cart.items[productIndex].quantity++;
        cart.totalAmount += parseFloat(cart.items[productIndex].product.price);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartData();
    } else {
        showToast('You can only add 10 items at a time', 'warning');
    }
}

function decreaseQuantity(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart'));
    const productIndex = cart.items.findIndex(item => item.product._id === productId);

    if (productIndex > -1 && cart.items[productIndex].quantity > 1) {
        cart.items[productIndex].quantity--;
        cart.totalAmount -= parseFloat(cart.items[productIndex].product.price);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartData();
    } else {
        showToast('You need to add at least one item', 'warning');
    }
}

function deleteProduct(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart'));
    const productIndex = cart.items.findIndex(item => item.product._id === productId);

    if (productIndex > -1) {
        cart.totalAmount -= cart.items[productIndex].product.price * cart.items[productIndex].quantity;
        cart.items.splice(productIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartData();
    }
}

async function addToCart(productId) {
    try {
        // Fetch product details
        const response = await axios.get(`/api/product/${productId}`);
        const product = response.data.data.product;

        // Get cart from local storage
        let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], totalAmount: 0 };
        const productIndex = cart.items.findIndex(item => item.product._id === productId);

        // Handle product stock and quantity
        if (product && product.stock > 0) {
            let quantity = 1; // Default quantity

            if (productIndex > -1) {
                // Product already in cart
                if (cart.items[productIndex].quantity < 10) {
                    cart.items[productIndex].quantity++;
                    cart.totalAmount += parseFloat(product.price);
                    showToast('Item quantity updated in cart', 'success');
                } else {
                    showToast('You can only add 10 items at a time', 'warning');
                }
            } else {
                // New product in cart
                cart.items.push({
                    product: {
                        _id: productId,
                        name: product.name,
                        price: (product.price * (1 - (product.sale / 100))).toFixed(2),
                        image: product.images[0] || 'default.jpg'
                    },
                    quantity: quantity
                });
                cart.totalAmount += parseFloat(cart.items[cart.items.length - 1].product.price);
                showToast('Item added to cart', 'success');
            }

            // Update local storage and UI
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartData();
        } else {
            showToast('Product not available', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('An error occurred', 'error');
    }
}

function setupAddToCartButtons() {
    $(document).on('click', '.add-to-cart-btn', function() {
        const productId = $(this).data('id');
        addToCart(productId);
    });
}







$(document).ready(function () {
    mobileSearchBarAnimation();
    mobileMenuAnimation();
    desktopMenuAnimation();
    grandCarouselSlider();
    trendingProductsSlider();
    factsScroller();
    customerReviewSlider();
    cartAnimation();
    shopPageCheckboxAnimation();
    loginRegisterAnimation();
    syncCartWithDatabase();
    updateCartData();
    setupAddToCartButtons();


    // Login form submission
    $('#loginForm').on('submit', function (e) {

        e.preventDefault();
        const email = e.target.querySelector('#email').value;
        const password = e.target.querySelector('#password').value;

        axios.post('/api/login', { email, password })
            .then(async response => {
                const data = response.data;

                showToast(data.message, data.type);

                await syncCartWithDatabase();


                if (data.data.redirect) {
                    setTimeout(() => {
                        window.location.href = data.data.redirect;
                    }, 2000);
                }
            })
            .catch(error => {
                const data = error.response.data;

                showToast(data.message, data.type);
            });


    });

    // Register form submission
    $('#registerForm').on('submit', function (e) {

        e.preventDefault();
        const email = e.target.querySelector('#email').value;
        const emailInput = e.target.querySelector('#email');
        const password = e.target.querySelector('#password').value;
        const firstName = e.target.querySelector('#firstName').value;
        const lastName = e.target.querySelector('#lastName').value;
        const phoneInput = e.target.querySelector('#phone');
        const phone = e.target.querySelector('#phone').value;
        const phoneError = e.target.querySelector('#phoneError');
        const emailError = e.target.querySelector('#emailError');
        const phoneRegex = /^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/;
        const emailRegex = /^(?![0-9])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!phoneRegex.test(phone)) {
            phoneInput.classList.add('border-red-500'); // Add a red border on error
            phoneError.classList.remove('hidden'); // Show the error message
        } else if (!emailRegex.test(email)) {
            emailInput.classList.add('border-red-500'); // Add a red border on error
            emailError.classList.remove('hidden'); // Show the error message
        } else {
            phoneInput.classList.remove('border-red-500'); // Remove the red border if valid
            phoneError.classList.add('hidden'); // Hide the error message
            emailInput.classList.remove('border-red-500'); // Remove the red border if valid
            emailError.classList.add('hidden'); // Hide the error message

            axios.post('/api/register', { email, password, firstName, lastName, phone })
                .then(response => {
                    const data = response.data;
                    // Display toast message
                    showToast(data.message, data.type);

                    // Redirect if login is successful
                    if (data.data.redirect) {
                        setTimeout(() => {
                            window.location.href = data.data.redirect;
                        }, 2000);
                    }
                })
                .catch(error => {
                    const data = error.response.data;
                    // Display toast message
                    showToast(data.message, data.type);
                });
        }


    });

    // Increase quantity from single product page
    $('.single-product-btn-control .add').on('click', function () {
        let quantityInput = $(this).closest('.product-quantity').find('#quantity');
        let quantity = parseInt(quantityInput.val()) || 1;
        if (quantity < 10) {
            quantity++;
            quantityInput.val(quantity);
        } else {
            showToast('You can only add 10 items at a time', 'warning');
        }
    });

    // Decrease quantity from single product page
    $('.single-product-btn-control .sub').on('click', function () {
        let quantityInput = $(this).closest('.product-quantity').find('#quantity');
        let quantity = parseInt(quantityInput.val()) || 1;
        if (quantity > 1) {
            quantity--;
            quantityInput.val(quantity);
        } else {
            showToast('You need to add at least one item', 'warning');
        }
    });

    // Add to cart from single product page
    $(document).on('click', '#single-add-to-cart-btn', async function () {
        try {
            const productId = $(this).data('id');
            const response = await axios.get(`/api/product/${productId}`);
            const product = response.data.data.product;
            const response2 = await axios.get(`/api/loggedin`);
            const isLoggedin = response2.data.data.loggedIn;

            let quantityInput = $(this).closest('.single-product-btn-control').find('#quantity');
            let quantity = parseInt(quantityInput.val());

            if (product && product.stock > 0) {
                const productName = product.name;
                const productPrice = (product.price * (1 - (product.sale / 100))).toFixed(2);
                const productImage = product.images[0] || 'default.jpg';

                if (!isLoggedin) {
                    let cart = JSON.parse(localStorage.getItem('cart')) || {
                        user: null, // no user when not logged in
                        items: [],
                        totalAmount: 0,
                        isOrderPlaced: false
                    };

                    const existingProductIndex = cart.items.findIndex(item => item.product._id === productId);

                    if (existingProductIndex > -1) {
                        // Update quantity if product already exists
                        if (cart.items[existingProductIndex].quantity + quantity <= 10) {
                            cart.items[existingProductIndex].quantity += quantity;
                            showToast('Item added to cart', 'success');
                        } else {
                            showToast('You can only add 10 items at a time', 'warning');
                        }
                    } else {
                        // Add new product to cart
                        cart.items.push({
                            product: {
                                _id: productId,
                                name: productName,
                                price: productPrice,
                                image: productImage
                            },
                            quantity: quantity
                        });
                        showToast('Item added to cart', 'success');
                    }

                    // Recalculate totalAmount
                    cart.totalAmount = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartData();
                } else {
                    // If logged in, send to server
                    const response3 = await axios.post('/api/cart/add', { productId, quantity });
                    const data = response3.data;
                    showToast(data.message, data.type);
                    updateCartData();
                }
            } else {
                showToast('Product not found', 'error');
            }
        } catch (error) {
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);

                if (error.response.status === 404) {
                    showToast('Product not found', 'error');
                } else {
                    showToast('An error occurred', 'error');
                }
            } else if (error.request) {
                console.error('Request data:', error.request);
                console.error('No response received');
            } else {
                console.error('Error message:', error.message);
            }

            console.error('Error config:', error.config);
        }
    });







});