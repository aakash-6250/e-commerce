'use strict';

function navbarAnimation() {
    const darkModeBtn = document.querySelector('.dark-mode-btn');
    const fullModeBtn = document.querySelector('.full-mode-btn');
    const sideBarOpenBtn = document.querySelector('.side-bar-open-btn');
    const sideBarCloseBtn = document.querySelector('.side-bar-close-btn');
    const sideBar = document.querySelector('.sidebar');

    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        darkModeBtn.classList.toggle('ri-moon-line');
        darkModeBtn.classList.toggle('ri-sun-fill');
        localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'true' : 'false');
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth < 1024) {
            sideBarOpenBtn.classList.remove('hidden');
            sideBarCloseBtn.classList.add('hidden');
            gsap.to(sideBar, {
                width: '0px',
                duration: 0.5
            });
            localStorage.setItem('sideBarOpen', 'close');
        }
    });

    fullModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('full-mode');
        fullModeBtn.classList.toggle('ri-fullscreen-fill');
        fullModeBtn.classList.toggle('ri-fullscreen-exit-fill');
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    sideBarOpenBtn.addEventListener('click', () => {
        sideBarOpenBtn.classList.add('hidden');
        sideBarCloseBtn.classList.remove('hidden');
        localStorage.setItem('sideBarOpen', 'open');

        gsap.to(sideBar, {
            width: '400px',
            duration: 0.5
        });
    });

    sideBarCloseBtn.addEventListener('click', () => {
        sideBarOpenBtn.classList.remove('hidden');
        sideBarCloseBtn.classList.add('hidden');
        localStorage.setItem('sideBarOpen', 'close');

        gsap.to(sideBar, {
            width: '0px',
            duration: 0.5
        });
    });

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
        darkModeBtn.classList.add('ri-sun-fill');
        darkModeBtn.classList.remove('ri-moon-line');
    }
}

function storeSidebarState(event, itemKey) {
    event.preventDefault();
    localStorage.setItem('activeSidebarItem', itemKey);
    window.location.href = event.target.href;
}

function sidebarAnimation() {
    const sideBarItems = document.querySelectorAll('.sidebar-menu-item');
    const activeItem = localStorage.getItem('activeSidebarItem');
    const sideBarOpen = localStorage.getItem('sideBarOpen');

    sideBarItems.forEach((item, index) => {
        const itemOptions = item.querySelector('.options');
        const itemHeaderContainer = item.querySelector('.header');
        const itemHeader = item.querySelector('.header div');
        const itemKey = itemHeader.querySelector('p').textContent.toLowerCase().replace(' ', '-');
        const sideBarOpenBtn = document.querySelector('.side-bar-open-btn');

        if (itemKey === activeItem) {
            itemOptions.classList.remove('h-0');
            itemOptions.classList.add('h-full');
            gsap.set(itemOptions, { height: 'auto' });
            itemHeader.querySelector('.arrow').classList.remove('ri-arrow-down-s-line');
            itemHeader.querySelector('.arrow').classList.add('ri-arrow-up-s-line');
            itemHeader.classList.add('text-[#2275FC]');
            itemHeaderContainer.classList.add('border-[#2275FC]');
        }

        if (sideBarOpen === 'open') {
            sideBarOpenBtn.click();
        }

        itemHeader.addEventListener('click', () => {
            sideBarItems.forEach((otherItem, otherIndex) => {
                if (otherIndex !== index) {
                    const otherItemOptions = otherItem.querySelector('.options');
                    const otherItemHeaderContainer = otherItem.querySelector('.header');
                    const otherItemHeader = otherItem.querySelector('.header div');
                    const otherItemHeaderArrow = otherItemHeader.querySelector('.arrow');
                    otherItemHeaderArrow.classList.add('ri-arrow-down-s-line');
                    otherItemHeaderArrow.classList.remove('ri-arrow-up-s-line');

                    gsap.to(otherItemOptions, {
                        height: 0,
                        duration: 0.3,
                        onComplete: () => {
                            otherItemOptions.classList.add('h-0');
                            otherItemOptions.classList.remove('h-full');
                            otherItemHeader.classList.remove('text-[#2275FC]');
                            otherItemHeaderContainer.classList.remove('border-[#2275FC]');
                        }
                    });
                }
            });

            if (itemOptions.clientHeight === 0) {
                const itemHeaderArrow = itemHeader.querySelector('.arrow');
                itemHeaderArrow.classList.remove('ri-arrow-down-s-line');
                itemHeaderArrow.classList.add('ri-arrow-up-s-line');
                gsap.to(itemOptions, {
                    height: 'auto',
                    duration: 0.3,
                    onComplete: () => {
                        itemOptions.classList.remove('h-0');
                        itemOptions.classList.add('h-full');
                        itemHeader.classList.add('text-[#2275FC]');
                        itemHeaderContainer.classList.add('border-[#2275FC]');
                    }
                });
            } else {
                const itemHeaderArrow = itemHeader.querySelector('.arrow');
                itemHeaderArrow.classList.add('ri-arrow-down-s-line');
                itemHeaderArrow.classList.remove('ri-arrow-up-s-line');
                gsap.to(itemOptions, {
                    height: 0,
                    duration: 0.3,
                    onComplete: () => {
                        itemOptions.classList.add('h-0');
                        itemOptions.classList.remove('h-full');
                        itemHeader.classList.remove('text-[#2275FC]');
                        itemHeaderContainer.classList.remove('border-[#2275FC]');
                    }
                });
            }
        });
    });
}

function handleBulkAddProductForm() {
    const productFile = document.getElementById('productFile');
    if (productFile) {
        productFile.addEventListener('change', function (e) {
            const fileInput = e.target;
            const submitBtn = document.querySelector('.submit-btn');
            const label = document.querySelector('label[for="productFile"] .file-label');

            if (fileInput.files.length > 0) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('cursor-not-allowed');
                submitBtn.classList.add('cursor-pointer');
                label.textContent = fileInput.files[0].name;
                label.style.color = '#34D4A3';
            } else {
                submitBtn.disabled = true;
                submitBtn.classList.remove('cursor-pointer');
                submitBtn.classList.add('cursor-not-allowed');
                label.innerHTML = 'Drag and drop your excel file here or <span class="text-blue-600">browse</span>';
                label.style.color = '';
            }
        });
    }
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
        const productContainer = document.querySelector('.product-list .products');
        productContainer.innerHTML = '';

        products.forEach(product => {
            const productStock = product.stock > 0 ? 'Available' : 'Out of stock';
            const productElement = document.createElement('div');

            productElement.className = 'product px-3 h-[70px] rounded-xl flex items-center min-w-[1200px] hover:bg-[#EDF1F5] hover:dark:bg-[#3E4757] odd:bg-[#F2F7FB] odd:dark:bg-[#202D3F]';

            productElement.innerHTML = `
                <div class="product-img-name w-[400px] flex items-center gap-[30px]">
                    <img src="${product.images[0]}" alt="Product Image" class="product-image h-[50px]">
                    <p class="product-name">${product.name}</p>
                </div>
                <div class="price w-[130px]">
                    <p>$ ${product.price}</p>
                </div>
                <div class="quantity w-[130px]">
                    <p>${product.stock}</p>
                </div>
                <div class="sale w-[130px]">
                    <p>${product.sale}%</p>
                </div>
                <div class="stock w-[130px]">
                    ${product.stock > 0 ?
                    `<p class="available bg-green-50 dark:bg-green-100 text-green-700 w-[80%] px-1 rounded-[5px]">${productStock}</p>` :
                    `<p class="bg-[#FFF2ED] dark:bg-[#432F25] text-[#FF6117] w-[80%] px-1 rounded-[5px]">${productStock}</p>`
                }
                </div>
                <div class="revenue w-[130px]">
                    <p>$ ${product.order * product.price}</p>
                </div>
                <div class="actions w-[130px] flex items-center gap-[10px]">
                    <a href="/admin/product/${product._id}/edit" ><i class="edit cursor-pointer ri-edit-2-line text-xl"></i><a>
                    <i class="delete cursor-pointer ri-delete-bin-6-line text-xl"></i>
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
    navbarAnimation();
    sidebarAnimation();
    handleBulkAddProductForm();

    $('#add-product-excel-form').on('submit', function (e) {
        e.preventDefault();

        const fileInput = document.getElementById('productFile');
        const submitBtn = document.querySelector('.submit-btn');
        const label = document.querySelector('label[for="productFile"] .file-label');


        const formData = new FormData();
        formData.append('productFile', fileInput.files[0]);

        axios.post('/api/product/bulk-add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                const data = response.data;
                showToast(data.message, data.type);

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
            })
            .finally(() => {
                // Hide the file input again after submission
                fileInput.classList.add('hidden');

                // Reset form and button state
                e.target.reset();
                submitBtn.disabled = true;
                submitBtn.classList.remove('cursor-pointer');
                submitBtn.classList.add('cursor-not-allowed');
                label.innerHTML = 'Drag and drop your excel file here or <span class="text-blue-600">browse</span>';
                label.style.color = '';
            });
    });

    $('#show-product').on('change', function () {
        if (this.value) {
            fetchProducts(1, this.value);
        }
    });

    $('#categoryOption').on('change', function () {
        if (this.value) {
            const categoryOption = this.value;
            const subCategoryOption = this.querySelector('#subCategoryOption');
            const existingCategoryContainer = document.querySelector('#existingCategoryContainer');
            const existingSubCategoryContainer = document.querySelector('#existingSubCategoryContainer');
            const newCategoryInput = document.querySelector('.newCategory');
            const newSubcategoryInput = document.querySelector('.newSubcategory');

            if (categoryOption === 'existing') {
                existingCategoryContainer.classList.remove('hidden');
                newCategoryInput.required = false;
                newCategoryInput.classList.add('hidden');

                if (subCategoryOption && subCategoryOption.value === 'existing') {

                    existingSubCategoryContainer.classList.remove('hidden');
                    newSubcategoryInput.required = false;
                    newSubcategoryInput.classList.add('hidden');

                }

            } else {
                existingCategoryContainer.classList.add('hidden');
                newCategoryInput.required = true;
                newSubcategoryInput.required = true;
                newCategoryInput.classList.remove('hidden');
                newSubcategoryInput.classList.remove('hidden');
            }
        }
    });

    $('#add-product-form').on('submit', function (e) {
        e.preventDefault();

        const name = e.target.querySelector('#name').value;
        const description = e.target.querySelector('#description').value;
        const priceInput = e.target.querySelector('#price');
        const category = e.target.querySelector('#category').value;
        const subcategory = e.target.querySelector('#subcategory').value;
        const stockInput = e.target.querySelector('#stock');
        const brand = e.target.querySelector('#brand').value;

        const price = priceInput.value.trim();
        const stock = stockInput.value.trim();

        if (!price || isNaN(price) || parseFloat(price) <= 0) {
            priceInput.classList.add('border-red-500');
            showToast('Invalid price. Please enter a positive number.', 'error');
            return;
        } else {
            priceInput.classList.remove('border-red-500');
        }

        if (!stock || isNaN(stock) || parseInt(stock) < 0) {
            stockInput.classList.add('border-red-500');
            showToast('Invalid stock. Please enter a non-negative number.', 'error');
            return;
        } else {
            stockInput.classList.remove('border-red-500');
        }

        const productData = {
            name,
            description,
            price: parseFloat(price),
            category,
            subcategory,
            stock: parseInt(stock),
            brand
        };

        axios.post('/api/product/add', productData)
            .then(response => {
                const data = response.data;

                showToast(data.message, data.type);


            })
            .catch(error => {
                const data = error.response.data;
                showToast(data.message, data.type);
            });

        e.target.reset();

    });

    $('#edit-product-form #category').on('change', function (e) {
        const category = e.target.value;
        axios.get(`/api/category/${category}`)
            .then(response => {
                const data = response.data.data;
                const subcategorySelect = document.querySelector('#subcategory');
                subcategorySelect.innerHTML = '';
                console.log(data)
                data.category.subcategories.forEach(subcategory => {
                    const option = document.createElement('option');
                    option.value = subcategory._id;
                    option.textContent = subcategory.name;
                    subcategorySelect.appendChild(option);
                });
            })
            .catch(error => {
                const data = error.response.data;
                showToast(data.message, data.type);
            });

    })


});
