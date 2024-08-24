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
                duration: 1,
                ease: 'elastic.out(1,0.75)',
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
                duration: 1,
                ease: 'elastic.out(1,0.75)',
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
                duration: 1,
                ease: 'elastic.out(1,0.75)',
            });
        });

        main.addEventListener('click', (e) => {
            if (!cart.contains(e.target) && e.target !== btn) {
                gsap.to(cart, {
                    x: '100%',
                    duration: 1,
                    ease: 'elastic.out(1,0.75)',
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

// function shopPageCheckboxAnimation() {
//     const filterHeaders = document.querySelectorAll('.filter-header');
//     const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');

//     filterHeaders.forEach(header => {
//         const addIcon = header.querySelector('.toggle-icon-add');
//         const subIcon = header.querySelector('.toggle-icon-sub');
//         const filterOptions = header.nextElementSibling;

//         header.addEventListener('click', () => {
//             filterOptions.classList.toggle('hidden');
//             addIcon.classList.toggle('hidden');
//             subIcon.classList.toggle('hidden');
//         });
//     });

//     checkboxes.forEach(checkbox => {
//         checkbox.addEventListener('change', () => {
//             updateURLParameters();
//         });
//     });

//     function updateURLParameters() {
//         const params = new URLSearchParams(window.location.search);

//         params.delete('filter');

//         checkboxes.forEach(checkbox => {
//             if (checkbox.checked) {
//                 params.append('filter', checkbox.value);
//             }
//         });

//         history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
//     }


// }

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
                duration: 1,
                ease: 'elastic.out(1,0.75)',
            });
        });

        main.addEventListener('click', (e) => {
            if (!loginRegister.contains(e.target) && e.target !== btn) {
                gsap.to(loginRegister, {
                    x: '100%',
                    duration: 1,
                    ease: 'elastic.out(1,0.75)',
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
                duration: 0.3,
                onComplete: () => {
                    loginRegister.classList.add("hidden");
                }
            });
        }
    });

}


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

            productElement.className = 'product min-h-[412px] shadow-md shadow-zinc-200 lg:w-[263px] w-[300px] relative group';

            productElement.innerHTML = `
                <div class="product-image relative min-h-[330px] w-full flex justify-center  items-center">

                    ${product.images.length > 0 ?
                    `<img loading="lazy" src="/images/product/${product.images[0]}" alt="${product.name}" class="h-[330px] w-full object-cover">` :
                    `<img loading="lazy" src="/images/product/default.jpg" alt="Default Image" class="h-[330px] w-full object-cover">`
                }

                    ${product.discountedPrice > 0 ?
                    `<img loading="lazy" class="absolute top-0 left-0" src="/images/product/sale-tag.svg" alt="Sale Tag">` :
                    ``
                }
                        <button class="add-to-cart-btn absolute whitespace-nowrap lg:hidden lg:bottom-1/2 bottom-4 left-1/2 bg-[#967BB6] text-white hover:bg-white hover:text-black rounded-[58px] py-[12px] px-[50px] lg:group-hover:flex  -translate-x-1/2 lg:translate-y-1/2" data-id="${product._id}">Add to Cart</button>

                </div>

                <div class="product-details min-h-[82px] w-full h-[82px] flex items-center text-center">

                    <a href="/product/${product._id} " class="product-name text-[#191717] flex  flex-col  justify-evenly items-center w-full h-max p-[20px]">

                        <p class="capitalie w-full h-[50px] hover:border-b border-zinc-500 overflow-hidden">
                            ${product.name}
                        </p>

                        <div class="product-price flex justify-center items-center gap-[10px]">
                            ${product.discountedPrice > 0 ?
                    `<strike class="product-old-price text-[#ACACAC] font-[merriweather] ">
                                    ₹ ${product.price}
                                </strike>
                                <p class="product-new-price bg-transparent text-[#967BB6] font-[merriweather] ">
                                    ₹ ${product.discountedPrice}
                                </p>`:
                    `<p class="product-new-price bg-transparent text-[#967BB6] font-[merriweather] ">
                                    ₹ ${product.price}
                                </p>`
                }
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
    try {
        const response = await axios.get('/api/loggedin');
        const loggedIn = response.data.data.loggedIn;

        if (loggedIn) {
            let cart = JSON.parse(localStorage.getItem('cart')) || {};
            await axios.post('/api/cart', { cart });
        }

    } catch (error) {
        console.error('Failed to sync cart with database:', error);
    }
}




function setupAddToCartButtons() {
    $(document).on('click', '.add-to-cart-btn', function () {
        const productId = $(this).data('id');
        const qty = $(this).data('qty');
        addToCart(productId, qty);
    });
}

function updateCartData() {
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], totalAmount: 0 };


    const cartElement = document.querySelector('.cart');
    const productsContainer = cartElement.querySelector('.products');
    const subtotalElement = cartElement.querySelector('.subtotal .amount');
    const totalElement = cartElement.querySelector('.total p:last-child');
    const cartCountElements = document.querySelectorAll('.cart-btn p');
    const emptyCartMessage = cartElement.querySelector('.empty-cart-message');


    if (cart.items.length === 0) {

        productsContainer.innerHTML = '';
        subtotalElement.textContent = '₹0.00';
        totalElement.textContent = '₹0.00';
        emptyCartMessage.style.display = 'block';
        cartElement.querySelector('.calculations').style.display = 'none';
        cartElement.querySelector('.checkout').style.display = 'none';
    } else {

        emptyCartMessage.style.display = 'none';
        cartElement.querySelector('.calculations').style.display = 'block';
        cartElement.querySelector('.checkout').style.display = 'block';

        productsContainer.innerHTML = '';

        cart.items.forEach(item => {
            const productElement = document.createElement('div');
            productElement.classList.add('product', 'flex', 'gap-2', 'w-full');

            productElement.innerHTML = `
                <i class="delete ri-close-line cursor-pointer" data-id="${item._id}"></i>
                <div class="product-details h-[75px] w-full flex gap-[5px] justify-between items-start">
                    <img src="/images/product/${item.image}" alt="${item.name}" class="image w-[75px] h-[75px] ">
                    <div class="name h-full flex flex-col pl-[5px] w-full justify-between items-start">
                        <p class="text-[#191717] overflow-hidden">${item.name}</p>
                        <div class="increase-decrease-qty flex gap-[10px] text-[#191717]">
                            <i class="ri-subtract-line cursor-pointer" data-id="${item._id}"></i>
                            <p class="current-qty rounded-full w-max px-2" style="box-shadow: 0px 1px 10px 0px #00000014;">${item.quantity}</p>
                            <i class="ri-add-line cursor-pointer" data-id="${item._id}"></i>
                        </div>
                    </div>
                </div>
                <div class="price font-[merriweather] w-[100px]">₹ ${item.price}</div>
            `;

            productsContainer.appendChild(productElement);
        });

        subtotalElement.textContent = `₹ ${cart.subTotalAmount}`;
        totalElement.textContent = `₹ ${cart.totalAmount}`;

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

async function addToCart(productId, qty = 1) {
    try {
        // Fetch product details
        const response = await axios.get(`/api/product/${productId}`);
        const product = response.data.data.product;

        if (!product || product.stock < 1) {
            throw new Error("Product not found or currently out of stock.");
        }

        // Retrieve or initialize cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || {
            items: [],
            subTotalAmount: 0,
            shippingAmount: 0,
            totalAmount: 0
        };

        // Check if the product is already in the cart
        const productIndex = cart.items.findIndex(item => item._id === productId);

        if (productIndex > -1) {
            // Product is already in the cart, update the quantity
            let productExist = cart.items[productIndex];
            if (productExist.quantity >= 20 || productExist.quantity + qty > 20) {
                showToast("Maximum 20 quantity is allowed", "warning");
            } else {
                productExist.quantity += qty;
                cart.subTotalAmount += parseFloat(productExist.price * qty);
                showToast('Product quantity updated in cart', 'success');
            }
        } else {
            // Product is not in the cart, add it
            const price = product.discountedPrice > 0 ? product.discountedPrice : product.price;
            cart.items.push({
                _id: productId,
                name: product.name,
                price: price,
                image: product.images[0] || 'default.jpg',
                quantity: qty
            });

            cart.subTotalAmount += parseFloat(price * qty);

            showToast('Item added to cart', 'success');
        }

        cart.totalAmount = parseFloat(cart.subTotalAmount + cart.shippingAmount);


        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartData();
        syncCartWithDatabase();

    } catch (error) {
        console.error('Error adding to cart:', error);

        if (error.response && error.response.data) {
            const data = error.response.data;
            showToast(data.message, data.type);
        } else {
            showToast(error.message, "error");
        }
    }
}


function increaseQuantity(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart')) || {
        items: [],
        subTotalAmount: 0,
        shippingAmount: 0,
        totalAmount: 0
    };
    const productIndex = cart.items.findIndex(item => item._id === productId);

    if (productIndex > -1) {
        let productExist = cart.items[productIndex];
        if (productExist.quantity < 20) {
            productExist.quantity++;
            cart.subTotalAmount += parseFloat(productExist.price);
            cart.totalAmount = parseFloat(cart.subTotalAmount + cart.shippingAmount);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartData();
            syncCartWithDatabase();
        } else {
            showToast('You can only add up to 20 of this product.', 'warning');
        }
    }
}

function decreaseQuantity(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart')) || {
        items: [],
        subTotalAmount: 0,
        shippingAmount: 0,
        totalAmount: 0
    };
    const productIndex = cart.items.findIndex(item => item._id === productId);

    if (productIndex > -1) {
        let productExist = cart.items[productIndex];
        if (productExist.quantity > 1) {
            productExist.quantity--;
            cart.subTotalAmount -= parseFloat(productExist.price);
            cart.totalAmount = parseFloat(cart.subTotalAmount + cart.shippingAmount);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartData();
            syncCartWithDatabase();
        } else {
            showToast('You need to have at least one quantity in the cart', 'warning');
        }
    }
}

function deleteProduct(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart')) || {
        items: [],
        subTotalAmount: 0,
        shippingAmount: 0,
        totalAmount: 0
    };
    const productIndex = cart.items.findIndex(item => item._id === productId);

    if (productIndex > -1) {
        // Calculate total amount to deduct
        let productExist = cart.items[productIndex];
        const productTotalPrice = parseFloat(productExist.price * productExist.quantity);
        cart.subTotalAmount -= parseFloat(productTotalPrice);
        cart.totalAmount = parseFloat(cart.subTotalAmount + cart.shippingAmount)
        cart.items.splice(productIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartData();
        syncCartWithDatabase();
        showToast('Product removed from cart', 'success'); // Feedback to user
    } else {
        showToast('Product not found in cart', 'warning'); // Handling product not found
    }
}

function singleProductImageSlider() {
    let currentIndex = 0;
    const $images = $('.slider-image');
    const totalImages = $images.length;

    function showImage(index) {
        $images.removeClass('opacity-100').addClass('opacity-0');
        $images.eq(index).removeClass('opacity-0').addClass('opacity-100');
    }

    $('.slider-next').on('click', function () {
        currentIndex = (currentIndex + 1) % totalImages;
        showImage(currentIndex);
    });

    $('.slider-prev').on('click', function () {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        showImage(currentIndex);
    });
}

function increaseQuantityBeforeCheckout(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart')) || {
        items: [],
        subTotalAmount: 0,
        shippingAmount: 0,
        totalAmount: 0
    };
    const productIndex = cart.items.findIndex(item => item._id === productId);

    if (productIndex > -1) {
        let productExist = cart.items[productIndex];
        if (productExist.quantity < 20) {
            productExist.quantity++;
            cart.subTotalAmount += productExist.price;
            cart.totalAmount = parseFloat(cart.subTotalAmount + cart.shippingAmount);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartData();
            updateCartDataBeforeCheckout();
            syncCartWithDatabase();
        } else {
            showToast('You can only add up to 20 of this product.', 'warning');
        }
    }
}

function decreaseQuantityBeforeCheckout(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart')) || {
        items: [],
        subTotalAmount: 0,
        shippingAmount: 0,
        totalAmount: 0
    };
    const productIndex = cart.items.findIndex(item => item._id === productId);

    if (productIndex > -1) {
        let productExist = cart.items[productIndex];
        if (productExist.quantity > 1) {
            productExist.quantity--;
            cart.subTotalAmount -= parseFloat(productExist.price);
            cart.totalAmount = parseFloat(cart.subTotalAmount + cart.shippingAmount);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartData();
            updateCartDataBeforeCheckout();
            syncCartWithDatabase();
        } else {
            showToast('You need to have at least one quantity in the cart', 'warning');
        }
    }
}

function deleteProductBeforeCheckout(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart')) || {
        items: [],
        subTotalAmount: 0,
        shippingAmount: 0,
        totalAmount: 0
    };
    const productIndex = cart.items.findIndex(item => item._id === productId);

    if (productIndex > -1) {
        // Calculate total amount to deduct
        let productExist = cart.items[productIndex];
        const productTotalPrice = productExist.price * productExist.quantity;
        cart.subTotalAmount -= productTotalPrice;
        cart.totalAmount = parseFloat(cart.subTotalAmount + cart.shippingAmount)
        cart.items.splice(productIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartData();
        updateCartDataBeforeCheckout();
        syncCartWithDatabase();
        showToast('Product removed from cart', 'success'); // Feedback to user
    } else {
        showToast('Product not found in cart', 'warning'); // Handling product not found
    }
}

function updateCartDataBeforeCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], totalAmount: 0 };


    const cartElement = document.querySelector('.cart-before-checkout');

    if (cartElement) {
        const productsContainer = cartElement.querySelector('.products');
        const subtotalElement = cartElement.querySelector('.subtotal .amount');
        const totalElement = cartElement.querySelector('.total p:last-child');
        const cartCountElements = document.querySelectorAll('.cart-btn p');
        const emptyCartMessage = cartElement.querySelector('.empty-cart-message');


        if (cart.items.length === 0) {

            productsContainer.innerHTML = '';
            subtotalElement.textContent = '₹0.00';
            totalElement.textContent = '₹0.00';
            emptyCartMessage.style.display = 'block';
            cartElement.querySelector('.calculations').style.display = 'none';
            cartElement.querySelector('.checkout').style.display = 'none';
        } else {

            emptyCartMessage.style.display = 'none';
            cartElement.querySelector('.calculations').style.display = 'block';

            productsContainer.innerHTML = '';

            cart.items.forEach(item => {
                const productElement = document.createElement('div');
                productElement.classList.add('product', 'flex', 'gap-2', 'w-full', 'p-5');

                productElement.innerHTML = `
                <i class="delete ri-close-line cursor-pointer" data-id="${item._id}"></i>
                <div class="product-details h-[75px] w-full flex gap-[5px] justify-between items-start">
                    <img src="/images/product/${item.image}" alt="${item.name}" class="image w-[75px] h-[75px] ">
                    <div class="name h-full flex flex-col pl-[5px] w-full justify-between items-start">
                        <p class="text-[#191717] overflow-hidden">${item.name}</p>
                        <div class="increase-decrease-qty flex gap-[10px] text-[#191717]">
                            <i class="ri-subtract-line cursor-pointer" data-id="${item._id}"></i>
                            <p class="current-qty rounded-full w-max px-2" style="box-shadow: 0px 1px 10px 0px #00000014;">${item.quantity}</p>
                            <i class="ri-add-line cursor-pointer" data-id="${item._id}"></i>
                        </div>
                    </div>
                </div>
                <div class="price font-[merriweather] w-[100px]">₹ ${item.price}</div>
            `;

                productsContainer.appendChild(productElement);
            });

            subtotalElement.textContent = `₹ ${cart.subTotalAmount}`;
            totalElement.textContent = `₹ ${cart.totalAmount}`;

            // Update the cart count
            const totalItems = cart.items.length;
            cartCountElements.forEach(element => {
                element.textContent = totalItems;
            });

            // Event listeners for increase, decrease, and delete actions
            productsContainer.querySelectorAll('.ri-add-line').forEach(element => {
                element.addEventListener('click', increaseQuantityBeforeCheckout);
            });

            productsContainer.querySelectorAll('.ri-subtract-line').forEach(element => {
                element.addEventListener('click', decreaseQuantityBeforeCheckout);
            });

            productsContainer.querySelectorAll('.delete').forEach(element => {
                element.addEventListener('click', deleteProductBeforeCheckout);
            });
        }
    }
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
    // shopPageCheckboxAnimation();
    loginRegisterAnimation();
    updateCartData();
    setupAddToCartButtons();
    singleProductImageSlider();
    updateCartDataBeforeCheckout();


    $(document).on('click', '#togglePassword', function () {
        const passwordField = document.getElementById('password');
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);

        if (this.classList.contains('ri-eye-close-line')) {
            this.classList.remove('ri-eye-close-line');
            this.classList.add('ri-eye-line');
        } else {
            this.classList.remove('ri-eye-line');
            this.classList.add('ri-eye-close-line');
        }

    });

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

    $('#registerForm #confirmPassword').on('input', function (e) {
        const password = document.getElementById('password').value;
        const confirmPassword = e.target.value;
        const confirmPasswordError = document.getElementById('confirmPasswordError');

        if (password !== confirmPassword) {
            confirmPasswordError.classList.remove('hidden');
        } else {
            confirmPasswordError.classList.add('hidden');
        }
    });

    // Register form submission
    $('#registerForm').on('submit', function (e) {

        e.preventDefault();
        const email = e.target.querySelector('#email').value;
        const emailInput = e.target.querySelector('#email');
        const password = e.target.querySelector('#password').value;
        const confirmPassword = e.target.querySelector('#confirmPassword').value;
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

            axios.post('/api/register', { email, password, confirmPassword, firstName, lastName, phone })
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

    $('.single-product-btn-control .inc-dec-qty').on('click', function () {
        let qtyInput = $(this).closest('.product-quantity').find('#quantity');
        let addToCartBtn = $(this).closest('.single-product-btn-control').find('.add-to-cart-btn');
        let qty = parseInt(qtyInput.val(), 10) || 1;

        let operationValue = $(this).data('value');

        if (operationValue === 1) {
            if (qty < 20) {
                qty += 1;
                qtyInput.val(qty);
                addToCartBtn.data('qty', qty);
            } else {
                showToast('Maximum quantity 20 is allowed', 'error');
            }
        } else if (operationValue === -1) {
            if (qty > 1) {
                qty -= 1;
                qtyInput.val(qty);
                addToCartBtn.data('qty', qty);
            } else {
                showToast('Minimum quantity 1 is required', 'error');
            }
        } else {
            showToast('Something went wrong.', 'error');
        }
    });








});