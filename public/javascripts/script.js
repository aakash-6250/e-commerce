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

function desktopCartAnimation() {
    const main = document.querySelector('main')
    const cartBtn = document.querySelector('.desktop-nav .cart-btn');
    const cart = document.querySelector('.cart');
    const cartCloseBtn = document.querySelector('.cart .header .ri-close-large-line');

    cartBtn.addEventListener('click', () => {
        cart.classList.remove("hidden");
        gsap.to(cart, {
            x: '-450px',
            duration: 0.5,
            ease: 'power2.out'
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

    main.addEventListener('click', (e) => {
        if (!cart.contains(e.target) && e.target !== cartBtn) {
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

function mobileCartAnimation() {
    const main = document.querySelector('main')
    const cartBtn = document.querySelector('.mobile-bottom-section .cart-btn');
    const cart = document.querySelector('.cart');
    const cartCloseBtn = document.querySelector('.cart .header .ri-close-large-line');

    cartBtn.addEventListener('click', () => {
        cart.classList.remove("hidden");
        gsap.to(cart, {
            x: '-450px',
            duration: 0.5,
            ease: 'power2.out'
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

    main.addEventListener('click', (e) => {
        if (!cart.contains(e.target) && e.target !== cartBtn) {
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
    const accountBtn = document.querySelector(' .account-btn');
    const loginRegister = document.querySelector('.login-register');
    const loginRegisterCloseBtn = document.querySelector('.login-register .header .ri-close-large-line');

    accountBtn.addEventListener('click', () => {
        loginRegister.classList.remove("hidden");
        gsap.to(loginRegister, {
            x: '-450px',
            duration: 0.5,
            ease: 'power2.out'
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

    main.addEventListener('click', (e) => {
        if (!loginRegister.contains(e.target) && e.target !== accountBtn) {
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

function showToast(message, type = 'info') {
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
        backgroundColor: bgColor,
        stopOnFocus: true,
    }).showToast();
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

$(document).ready(function () {
    mobileSearchBarAnimation();
    mobileMenuAnimation();
    desktopMenuAnimation();
    grandCarouselSlider();
    trendingProductsSlider();
    factsScroller();
    customerReviewSlider();
    desktopCartAnimation();
    mobileCartAnimation();
    shopPageCheckboxAnimation();
    loginRegisterAnimation();

    $('#loginForm').on('submit', function (e) {

        e.preventDefault();
        const email = e.target.querySelector('#email').value;
        const password = e.target.querySelector('#password').value;

        axios.post('/user/login', { email, password })
            .then(response => {
                const data = response.data;
                // Display toast message
                showToast(data.message, data.type);

                // Redirect if login is successful
                if (data.redirect) {
                    setTimeout(() => {
                        window.location.href = data.redirect;
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
        }else if(!emailRegex.test(email)){
            emailInput.classList.add('border-red-500'); // Add a red border on error
            emailError.classList.remove('hidden'); // Show the error message
        } else {
            phoneInput.classList.remove('border-red-500'); // Remove the red border if valid
            phoneError.classList.add('hidden'); // Hide the error message

            axios.post('/user/register', { email, password, firstName, lastName, phone })
                .then(response => {
                    const data = response.data;
                    // Display toast message
                    showToast(data.message, data.type);

                    // Redirect if login is successful
                    if (data.redirect) {
                        setTimeout(() => {
                            window.location.href = data.redirect;
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