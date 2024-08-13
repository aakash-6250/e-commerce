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
                    <img loading="lazy" src="/images/product/${product.images[0]}" alt="" class="w-full h-full">

                    ${product.sale > 0 ?
                    `<img loading="lazy" class="absolute top-0 left-0" src="/images/products/product-sale-tag.svg" alt="Sale Tag">` :
                    ``}
                    <button class="add-to-cart absolute whitespace-nowrap lg:hidden lg:bottom-1/2 bottom-4 left-1/2 bg-[#967BB6] text-white hover:bg-white hover:text-black rounded-[58px] py-[12px] px-[50px] lg:group-hover:flex  -translate-x-1/2 lg:translate-y-1/2">Add to Cart</button>
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

    $('#loginForm').on('submit', function (e) {

        e.preventDefault();
        const email = e.target.querySelector('#email').value;
        const password = e.target.querySelector('#password').value;

        axios.post('/api/login', { email, password })
            .then(response => {
                const data = response.data;
                
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


    });

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



});