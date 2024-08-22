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


    const apiUrl = `/api/product-admin?${params.toString()}`;

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

            productElement.className = 'product px-3 h-[70px] rounded-xl flex items-center min-w-[1200px] hover:bg-[#EDF1F5] hover:dark:bg-[#3E4757] odd:bg-[#F2F7FB] odd:dark:bg-[#202D3F] ';

            productElement.innerHTML = `
                <div class="product-img-name w-[400px] h-full flex items-center justify-between ">

                    <div class="product-img w-[60px] h-[60px] overflow-hidden rounded-[5px] flex items-center justify-center bg-gray-300 dark:bg-gray-600 ">

                        ${product.images.length > 0 ?
                    `<img src="/images/product/${product.images[0]}" alt="${product.name}" class="h-full w-full">` :
                    `<i class="ri-image-line text-4xl text-gray-500 dark:text-gray-400 w-full"></i>`
                }

                    </div>

                    <p class="product-name w-[80%] overflow-hidden truncate">${product.name}</p>

                </div>
                <div class="original-price w-[130px]">
                    <p>₹ ${product.price}</p>
                </div>
                <div class="discount-price w-[130px]">
                    <p>₹ ${product.discountedPrice}</p>
                </div>
                <div class="quantity w-[130px]">
                    <p>${product.stock}</p>
                </div>
                <div class="stock w-[130px] ">
                    ${product.stock > 0 ?
                    `<p class="available bg-green-50 dark:bg-green-100 text-green-700 px-1 rounded-[5px]">${productStock}</p>` :
                    `<p class="bg-[#FFF2ED] dark:bg-[#432F25] text-[#FF6117] w-[80%] px-1 rounded-[5px]">${productStock}</p>`
                }
                </div>
                <div class="featured w-[130px]">
                    <p>${product.featured}</p>
                </div>
                <div class="published w-[130px]">
                    <p>${product.published}</p>
                </div>
                <div class="revenue w-[130px]">
                    <p>₹ ${product.order * product.price}</p>
                </div>
                <div class="actions min-w-[130px] flex justify-around items-center">
                    <a class="edit-product-btn px-2 py-1 rounded-full hover:bg-blue-600 hover:text-white border-[1px] border-zinc-200 " href="/admin/product/${product._id}/edit">
                        <i class="ri-pencil-line text-2xl"></i>
                    </a>
                    <button class="delete-product-btn px-2 py-1 rounded-full hover:bg-red-600 hover:text-white border-[1px] border-zinc-200 " data-id="${product._id}">
                        <i class="ri-delete-bin-line text-2xl"></i>
                    </button>
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

function showImagesForForm(input) {
    const files = this.files;
    const imagesPreviewContainer = $('#images-preview-container');

    imagesPreviewContainer.empty();

    if (files.length > 5) {
        alert('You can only upload a maximum of 5 images.');
        this.value = '';
        return;
    }

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = function (e) {

            const img = $('<img>', {
                src: e.target.result,
                class: 'max-w-full h-auto rounded-[10px] border-gray-300 border-[1px] dark:border-gray-600',
                alt: `Image Preview ${index + 1}`,
                width: '263px',
                height: '412px'
            });

            imagesPreviewContainer.append(img);
        }

        reader.readAsDataURL(file);
    });
}

function initializeCategoryForm() {
    // Function to add a subcategory tag
    function addSubcategoryTag() {
        const subcategoryName = $('#subcategory-input').val().trim();

        // Check if the input is not empty
        if (subcategoryName) {
            // Create a new tag element
            const tagElement = $('<span>')
                .addClass('subcategory-tag px-3 py-1 bg-[#E8F5E9] text-[#455A64] rounded-[5px] flex items-center gap-[5px]')
                .text(subcategoryName);

            // Add a remove button to each tag
            const removeButton = $('<button>')
                .addClass('text-white bg-[#C8E6C9] hover:bg-[#ef9a9a] rounded-full w-[20px] h-[20px] flex  items-center justify-center ri-close-line text-xl')
                .text('')
                .on('click', function () {
                    $(this).parent().remove();  // Remove the tag when the 'x' button is clicked
                });

            // Append the remove button to the tag
            tagElement.append(removeButton);

            // Append the tag to the subcategory tags container
            $('#add-subcategory-tags').append(tagElement);

            // Clear the input field
            $('#subcategory-input').val('');
        }
    }

    // Event listener for the "Add" button click
    $('#add-subcategory-btn').on('click', function () {
        addSubcategoryTag();
    });

    // Event listener for the "Enter" keypress on the subcategory input
    $('#subcategory-input').on('keypress', function (e) {
        if (e.which === 13) { // 13 is the keycode for Enter key
            e.preventDefault(); // Prevent form submission
            addSubcategoryTag(); // Call function to add tag
        }
    });
}

function showCustomConfirm(message, callback) {
    // Get the container where the confirm box will be appended
    const container = document.querySelector('body');

    // Create the overlay
    const overlay = document.createElement('div');
    overlay.classList.add(
        'fixed',
        'inset-0',
        'bg-black',
        'bg-opacity-50',
        'flex',
        'justify-center',
        'items-center',
        'z-50',
        'w-full',
        'h-full'
    );

    // Create the confirm box
    const confirmBox = document.createElement('div');
    confirmBox.classList.add(
        'bg-white',
        'dark:bg-gray-800',
        'p-6',
        'rounded-lg',
        'shadow-lg',
        'max-w-sm',
        'w-full',
        'text-center'
    );

    // Create the message paragraph
    const messagePara = document.createElement('p');
    messagePara.textContent = message;
    messagePara.classList.add('text-lg', 'mb-4');

    // Create the buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('flex', 'justify-center', 'space-x-4', 'mt-4');

    // Create the Yes button
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.classList.add(
        'bg-green-500',
        'text-white',
        'px-4',
        'py-2',
        'rounded',
        'hover:bg-green-600'
    );
    yesButton.addEventListener('click', () => {
        container.removeChild(overlay);
        callback(true);
    });

    // Create the No button
    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.classList.add(
        'bg-red-500',
        'text-white',
        'px-4',
        'py-2',
        'rounded',
        'hover:bg-red-600'
    );
    noButton.addEventListener('click', () => {
        container.removeChild(overlay);
        callback(false);
    });

    // Append everything to the confirm box
    buttonsContainer.appendChild(yesButton);
    buttonsContainer.appendChild(noButton);
    confirmBox.appendChild(messagePara);
    confirmBox.appendChild(buttonsContainer);

    // Append the confirm box to the overlay
    overlay.appendChild(confirmBox);

    // Append the overlay to the container
    container.appendChild(overlay);
}



$(document).ready(function () {
    navbarAnimation();
    sidebarAnimation();
    handleBulkAddProductForm();
    initializeCategoryForm();

    $('#show-product').on('change', function () {
        if (this.value) {
            fetchProducts(1, this.value);
        }
    });

    $('#add-product-form').on('submit', function (e) {
        e.preventDefault();

        const name = e.target.querySelector('#name').value;
        const description = e.target.querySelector('#description').value;
        const price = e.target.querySelector('#price').value;
        const discountedPrice = e.target.querySelector('#discounted-price').value;
        const category = e.target.querySelector('#category').value;
        const subcategory = e.target.querySelector('#subcategory').value;
        const subcategoryInput = e.target.querySelector('#subcategory');
        const stock = e.target.querySelector('#stock').value;
        const brand = e.target.querySelector('#brand').value;
        const images = e.target.querySelector('#images').files;
        const featured = e.target.querySelector('#featured').checked;
        const published = e.target.querySelector('#published').checked;
        const trending = e.target.querySelector('#trending').checked;


        // Create a FormData object
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', parseFloat(price));
        formData.append('discountedPrice', parseFloat(discountedPrice));
        formData.append('category', category);
        formData.append('subcategory', subcategory);
        formData.append('stock', parseInt(stock));
        formData.append('brand', brand);
        formData.append('featured', featured);
        formData.append('published', published);
        formData.append('trending', trending);


        // Append each image file to the FormData
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        // Use Axios to submit the data
        axios.post('/api/product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                const data = response.data;

                showToast(data.message, data.type);

            })
            .catch(error => {
                const data = error.response.data;
                showToast(data.message, data.type);
            });

        // e.target.reset();
        // $('#images-preview-container').empty();
        // subcategoryInput.innerHTML = '';
        // const option = document.createElement('option');
        // option.value = '';
        // option.textContent = 'Select a category first';
        // option.selected = true;
        // option.disabled = true;
        // subcategoryInput.appendChild(option);
    });

    $('#add-product-form #images').on('change', function (e) {
        showImagesForForm.call(this);
    });

    $('#add-product-form #category').on('change', function (e) {
        const category = e.target.value;
        axios.get(`/api/category/${category}`)
            .then(response => {
                const data = response.data.data;
                const subcategorySelect = document.querySelector('#subcategory');
                subcategorySelect.innerHTML = '';

                if (data.category.subcategories.length === 0) {
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'No subcategories found first add subcategories to this category';
                    subcategorySelect.appendChild(option);
                } else {
                    data.category.subcategories.forEach(subcategory => {
                        const option = document.createElement('option');
                        option.value = subcategory._id;
                        option.textContent = subcategory.name;
                        subcategorySelect.appendChild(option);
                    });
                }
            })
            .catch(error => {
                const data = error.response.data;
                showToast(data.message, data.type);
            });

    });

    $('#edit-product-form #images').on('change', function (e) {
        showImagesForForm.call(this);
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

    $('#edit-product-form').on('submit', function (e) {
        e.preventDefault();

        const submitBtn = e.target.querySelector('#submitBtn');
        submitBtn.disabled = true;
        submitBtn.classList.add('cursor-not-allowed');

        const name = e.target.querySelector('#name').value;
        const description = e.target.querySelector('#description').value;
        const price = e.target.querySelector('#price').value;
        const discountedPrice = e.target.querySelector('#discounted-price').value;
        const category = e.target.querySelector('#category').value;
        const subcategory = e.target.querySelector('#subcategory').value;
        const stock = e.target.querySelector('#stock').value;
        const brand = e.target.querySelector('#brand').value;
        const featured = e.target.querySelector('#featured').checked;
        const images = e.target.querySelector('#images').files;
        const trending = e.target.querySelector('#trending').checked;
        const published = e.target.querySelector('#published').checked;
        const productId = e.target.querySelector('#productId').value;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', parseFloat(price));
        formData.append('discountedPrice', parseFloat(discountedPrice));
        formData.append('category', category);
        formData.append('subcategory', subcategory);
        formData.append('stock', parseInt(stock));
        formData.append('brand', brand);
        formData.append('trending', trending);
        formData.append('featured', featured);
        formData.append('published', published);
        formData.append('productId', productId);
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }


        axios.patch(`/api/product/${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                const data = response.data;
                showToast(data.message, data.type);

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

        submitBtn.classList.add('cursor-not-allowed');


    });

    $('#add-product-excel-form').on('submit', function (e) {
        e.preventDefault();

        const fileInput = document.getElementById('productFile');
        const submitBtn = document.querySelector('.submit-btn');
        const label = document.querySelector('label[for="productFile"] .file-label');


        const formData = new FormData();
        formData.append('excelFile', fileInput.files[0]);

        axios.post('/api/product/bulk', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                const data = response.data;
                showToast(data.message, data.type);

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

    $('#add-category-form').on('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission behavior

        // Collect category name and subcategories
        const categoryName = $('#category').val().trim();
        const subcategories = [];

        // Get all subcategory tags
        $('#add-subcategory-tags .subcategory-tag').each(function () {
            subcategories.push($(this).text().replace(/x$/, '').trim());
        });

        // Prepare data to be sent to the server
        const data = {
            category: categoryName,
            subcategories: subcategories
        };

        axios.post('/api/category', data)
            .then(response => {
                const data = response.data;

                showToast(data.message, data.type);

                e.target.reset();
                $('#subcategory-tags').empty();

                if (data.data.redirect) {
                    setTimeout(() => {
                        window.location.href = data.data.redirect;
                    }, 2000);
                }

            })
            .catch(error => {
                console.log(error)
                const data = error.response.data;
                showToast(data.message, data.type);
            });
    });

    let imagesToDelete = [];
    $('#edit-product-form').on('click', '.delete-image-btn', function (e) {
        const image = $(this).data('image');
        imagesToDelete.push(image);
        $(this).parent().remove();
    });

    $('#edit-category-form').on('click', '.remove-subcategory-btn', function () {
        // Get the parent subcategory item
        const subcategoryItem = $(this).closest('.subcategory-item');
        const deleteInput = subcategoryItem.find('input[id="delete"]');

        // Toggle the deletion state
        const isMarkedForDeletion = deleteInput.val() === 'true';
        deleteInput.val(isMarkedForDeletion ? 'false' : 'true');

        // Toggle the appearance of the subcategory item
        subcategoryItem.toggleClass('marked-for-deletion', !isMarkedForDeletion);

        // Update the button colors using Tailwind CSS classes
        if (isMarkedForDeletion) {
            $(this).removeClass('bg-red-400 text-white hover:text-white hover:bg-red-500').addClass('bg-white hover:bg-red-400 hover:text-white');
        } else {
            $(this).removeClass('bg-white hover:bg-red-400 hover:text-white').addClass('bg-red-400 text-white hover:bg-red-500');
        }
    });

    $('#edit-category-form').on('submit', function (e) {
        e.preventDefault();

        // Get category ID and name
        const categoryId = $('#categoryId').val();
        const categoryName = $('#category').val().trim();
        const subcategories = [];

        // Collect subcategories from the form
        $('#current-subcategory-tags .subcategory-item').each(function () {
            const subcategoryName = $(this).find('input[type="text"]').val().trim();
            const subcategoryId = $(this).find('input[type="hidden"]').eq(0).val().trim();
            const isMarkedForDeletion = $(this).find('input[type="hidden"]').eq(1).val().trim() === 'true';

            if (subcategoryName) {
                subcategories.push({
                    id: subcategoryId,
                    name: subcategoryName,
                    delete: isMarkedForDeletion
                });
            }
        });

        const newSubcategories = [];

        // Collect new subcategories from the form
        $('#add-subcategory-tags .subcategory-tag').each(function () {
            newSubcategories.push($(this).text().replace(/x$/, '').trim());
        });

        // Prepare data to send to the server
        const data = {
            newSubcategories: newSubcategories,
            categoryName: categoryName,
            subcategories: subcategories
        };


        // Make an Axios PATCH request to update the category
        axios.patch(`/api/category/${categoryId}`, data)
            .then(response => {
                const data = response.data;

                // Display a success message
                showToast(data.message, data.type);

                // Redirect if a redirect URL is provided
                if (data.data && data.data.redirect) {
                    setTimeout(() => {
                        window.location.href = data.data.redirect;
                    }, 2000);
                }

            })
            .catch(error => {
                // Handle errors and display an error message
                if (error.response && error.response.data) {
                    const data = error.response.data;
                    showToast(data.message, data.type);
                } else {
                    showToast('An unexpected error occurred', 'error');
                }
            });
    });

    $(document).on('click', '.delete-category-btn', function (e) {
        e.preventDefault(); // Prevents the default action if it's inside a form

        const categoryId = $(this).data('id');

        // Show custom confirm dialog
        showCustomConfirm('Are you sure you want to delete this category?', (confirmed) => {
            if (confirmed) {
                axios.delete(`/api/category/${categoryId}`)
                    .then(response => {
                        const data = response.data;
                        showToast(data.message, data.type);

                        if (data.data && data.data.redirect) {
                            setTimeout(() => {
                                window.location.href = data.data.redirect;
                            }, 2000);
                        }
                    })
                    .catch(error => {
                        // Check if error response exists
                        if (error.response && error.response.data) {
                            const data = error.response.data;
                            showToast(data.message, data.type);
                        } else {
                            showToast("An error occurred", "error");
                        }
                    });
            }
        });
    });


    $(document).on('click', '.delete-product-btn', function (e) {
        e.preventDefault(); // Prevent the default action of the button or link

        const productId = $(this).data('id');

        showCustomConfirm('Are you sure you want to delete this product?', (confirmed) => {
            if (confirmed) {
                axios.delete(`/api/product/${productId}`)
                    .then(response => {
                        const data = response.data;

                        // Display success toast notification
                        showToast(data.message, data.type);

                        // Redirect if a redirect URL is provided
                        if (data.data && data.data.redirect) {
                            setTimeout(() => {
                                window.location.href = data.data.redirect;
                            }, 2000);
                        }
                    })
                    .catch(error => {
                        if (error.response) {
                            const data = error.response.data;

                            // Display error toast notification
                            showToast(data.message, data.type);
                        } else {
                            // Fallback error message for unexpected issues
                            showToast('An error occurred while trying to delete the product.', 'error');
                        }
                    });
            }
        });
    });




});
