let selectedProductList = [];
let totalSum = JSON.parse(localStorage.getItem('totalSum'));


function displayProducts(categoryTitle, categoryAPI) {
    fetch(categoryAPI)
        .then(res => res.json())
        .then(products => {
            let productList = document.getElementById('product-list');
            products.forEach(product => {
                document.getElementById('categoryTitle').innerHTML = categoryTitle;


                const productContainer = document.createElement('div');
                productContainer.classList.add('card');
                productContainer.classList.add('m-2');
                productContainer.style.width = '15rem';

                const prodImgDiv = document.createElement('div');
                prodImgDiv.classList.add('text-center');

                const prodImg = document.createElement('img');
                prodImg.src = product.image;
                prodImg.alt = product.title;
                prodImg.classList.add('card-img-top');
                prodImg.classList.add('bg-secondary');
                prodImg.style.height = '10em';
                prodImg.style.maxWidth = 'fit-content';
                prodImgDiv.appendChild(prodImg);

                productContainer.appendChild(prodImgDiv);

                const prodBody = document.createElement('div');
                prodBody.classList.add('card-body');
                prodBody.classList.add('bg-white');

                const prodCatetory = document.createElement('a');
                prodCatetory.href = '#';
                prodCatetory.textContent = `${product.category}`;
                prodBody.appendChild(prodCatetory);

                const prodBodyTitle = document.createElement('h5');
                prodBodyTitle.classList.add('card-title');
                prodBodyTitle.textContent = `${product.title}`;
                prodBody.appendChild(prodBodyTitle);

                const prodPrice = document.createElement('p');
                prodPrice.classList.add('card-text');
                prodPrice.textContent = `${product.price} kr`;
                prodBody.appendChild(prodPrice);

                const proBodyOrderBtn = document.createElement('input');
                proBodyOrderBtn.type = 'submit';
                proBodyOrderBtn.classList.add('btn');
                proBodyOrderBtn.classList.add('btn-primary');
                proBodyOrderBtn.classList.add('align-bottom-left');
                proBodyOrderBtn.value = 'Beställ';
                prodBody.appendChild(proBodyOrderBtn);


                proBodyOrderBtn.addEventListener("click", function () {
                    sendData(product);
                });

                productContainer.appendChild(prodBody);
                productList.appendChild(productContainer);

            });
        });
}

function sendData(product) {
    console.log('product id:' + product.id);
    //cart is empty
    if (selectedProductList.length == 0) {
        selectedProductList.push(product);
        product.orderSum = 1;
        console.log('product sum: ' + product.orderSum);
    } else {
        //cart is not empty
        productExist = false;
        for (let i = 0; i < selectedProductList.length; i++) {
            //if newly added product already exists in the cart
            //order sum increases by 1
            if (selectedProductList.at(i).id == product.id) {
                selectedProductList.at(i).orderSum++;
                product.orderSum = selectedProductList.at(i).orderSum;
                selectedProductList.at(i).subTotal = selectedProductList.at(i).orderSum * selectedProductList.at(i).price;
                productExist = true;
                break;
            }
        }
        //if newly added product hasnt existed in the cart
        //add to the cart/arraylist
        if (productExist == false) {
            selectedProductList.push(product);
            product.orderSum = 1;
        }
    }

    //update the product sum, total sum and local storage
    product.subTotal = product.orderSum * Number(product.price);
    console.log('order sum: ' + product.orderSum);
    console.log('subtotal: ' + product.subTotal);
    localStorage.setItem("selectedProductList", JSON.stringify(selectedProductList));

    updateTotalSum();
}

function updateTotalSum() {
    let temp = 0;
    let totalProdSum = document.getElementById('totalSum');
    selectedProductList.forEach(element => {
        temp += element.subTotal;
        console.log(element.subTotal + ' ' + temp);
    })
    totalSum = temp;
    localStorage.setItem('totalSum', totalSum);
    totalProdSum.innerText = `Total Sum: $${totalSum.toFixed(2)}`;



}

function createEmptyCartBtn() {
    let emptyCart = document.getElementById('emptyCart');
    emptyCart.innerHTML = `<input type="button" class="btn btn-success" id="emptyCartBtn" value="Empty Cart">`;

    let emptyCartBtn = document.getElementById('emptyCartBtn');
    emptyCartBtn.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    })
}


function displayProductInfo() {
    let product = JSON.parse(localStorage.getItem("selectedProductList"));
    console.log(product);

    const productInfo = document.getElementById("productList");
    product.forEach(element => {
        const index = element.id;

        const div = document.createElement('div');
        div.classList.add('row');
        div.classList.add('border-bottom');
        div.classList.add('border-success');
        div.classList.add('p-2');
        div.classList.add('d-flex');
        div.classList.add('align-items-center');

        const prodImg = document.createElement('img');
        prodImg.src = element.image;
        prodImg.alt = element.title;
        prodImg.style.maxHeight = '10em';
        prodImg.style.maxWidth = '10em';
        prodImg.classList.add('col-md-2');

        div.appendChild(prodImg);

        let amountBtnDiv = document.createElement('div');

        const minusBtn = document.createElement('span');
        minusBtn.innerHTML = '-';
        minusBtn.classList.add(`minus${index}`);
        amountBtnDiv.appendChild(minusBtn);

        const numBtn = document.createElement('span');
        numBtn.innerHTML = element.orderSum == null ? '01' : '0' + element.orderSum;
        numBtn.classList.add(`num${index}`);
        amountBtnDiv.appendChild(numBtn);

        const plusBtn = document.createElement('span');
        plusBtn.innerHTML = '+';
        plusBtn.classList.add(`plus${index}`);
        amountBtnDiv.appendChild(plusBtn);

        amountBtnDiv.classList.add('col-md-1');
        amountBtnDiv.style.cursor = 'pointer';


        div.innerHTML += `
    <div class="col-md-6">${element.title}</div>
    <div class="col-md-1">$${element.price}/pc</div>
    `;

        div.appendChild(amountBtnDiv);

        const productSum = document.createElement('span');
        productSum.innerHTML = `$${element.subTotal}`;
        productSum.classList.add(`productSum${index}`);
        productSum.classList.add('subSum');
        productSum.classList.add('col-md-1');
        div.appendChild(productSum);

        //create delete button
        const deleteBtnDiv = document.createElement('div');
        deleteBtnDiv.classList.add('col-md-1');

        const deleteBtn = document.createElement('input');
        deleteBtn.type = 'button';
        deleteBtn.value = 'Delete';
        deleteBtn.classList.add('btn');
        deleteBtn.classList.add('btn-light');
        deleteBtnDiv.appendChild(deleteBtn);

        div.appendChild(deleteBtnDiv);

        createEmptyCartBtn();

        productInfo.appendChild(div);

        const totalSumValue = document.getElementById('totalSum');
        totalSumValue.innerHTML = totalSum;

        // create buttons for minus (-), OrderSum, plus (+)
        const minus = document.querySelector(`.minus${index}`);
        const plus = document.querySelector(`.plus${index}`);
        const num = document.querySelector(`.num${index}`);

        let amountNum = element.orderSum;

        // updateTotalSum();
        let totalProdSum = document.getElementById('totalSum');
        totalProdSum.innerText = `Total Sum: $${totalSum.toFixed(2)}`;

        //action for + button
        plus.addEventListener('click', () => {
            amountNum++;
            num.innerHTML = amountNum < 10 ? '0' + amountNum : amountNum;
            element.orderSum = amountNum;
            element.subTotal = Number(element.price) * amountNum;
            productSum.innerHTML = element.subTotal;
            localStorage.setItem('selectedProductList', JSON.stringify(product));
            updateOrderDetail(element);
        })

        //action for - button
        minus.addEventListener('click', () => {
            amountNum--;
            if (amountNum < 1) {
                amountNum = 0;
                num.innerHTML = amountNum;
            } else if (amountNum > 0 && amountNum < 10) {
                num.innerHTML = '0' + amountNum;
            } else {
                num.innerHTML = '0' + amountNum;
            }
            element.subTotal = Number(element.price) * amountNum;
            productSum.innerHTML = element.subTotal;
            localStorage.setItem('selectedProductList', JSON.stringify(product));
            updateOrderDetail(element);
        })

        //action for delete button
        deleteBtn.addEventListener('click', () => {
            removeSingleProduct(element);
            loadContent('orderform');
        })
    });

} //displayProductInfo() ends


function updateOrderDetail(element) {
    selectedProductList.forEach(item => {
        if (item.id == element.id) {
            item.orderSum = element.orderSum;
            item.subTotal = element.subTotal;
        }
    })
    updateTotalSum();
    localStorage.setItem('selectedProductList', JSON.stringify(selectedProductList));
}

let confirmOrderCounter = 1;

function confirmOrder() {
    let order = {
        id: confirmOrderCounter,
        name: document.getElementById('name').value,
        phone: document.getElementById('tel').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        selectedProductList: selectedProductList,
        totalSum: localStorage.getItem('totalSum')
    }
    confirmOrderCounter++;
    localStorage.setItem('confirmOrder', JSON.stringify(order));
    localStorage.removeItem('selectedProductList');
    localStorage.removeItem('totalSum');
}

function loadContent(page) {
    $.ajax({
        url: page + '.html',
        dataType: 'html',
        success: function (response) {
            $('#content').html(response);
        },
        error: function (xhr, status, error) {
            console.error('Error loading page: ' + page, status, error);
        }
    });
}

function getConfirmOrder() {
    //create html attribute for customer details
    let orderPage = document.getElementById('confirmOrder');
    const orderDetail = JSON.parse(localStorage.getItem('confirmOrder'));
    orderPage.classList.add('list-unstyled');
    orderPage.innerHTML = `
    <h1>Thank you for your order!</h1>
    <li>Order No.: ${orderDetail.id}</li>
    <li>Name: ${orderDetail.name}</li>
    <li>Phone: ${orderDetail.phone}</li>
    <li>Email: ${orderDetail.email}</li>
    <li>Address: ${orderDetail.address}</li>
    <br>
    <li>Order Details:</li>
    `;

    //create list for displaying products
    let ol = document.createElement('ol');
    let productList = orderDetail.selectedProductList;
    productList.forEach(element => {
        console.log(element.title);
        let li = document.createElement('li');
        li.classList.add('border-bottom');
        li.classList.add('pt-3');
        li.classList.add('pb-3');
        li.classList.add('border-success');

        let img = document.createElement('img');
        img.style.maxHeight = '5em';
        img.style.maxWidth = 'fit-content';
        img.src = element.image;
        img.alt = element.title;
        li.appendChild(img);

        let span = document.createElement('span');
        span.textContent = `${element.title} x ${element.orderSum}/pcs = Subtotal: $${element.subTotal}`;
        li.appendChild(span);
        ol.appendChild(li);
    })
    orderPage.appendChild(ol);

    //create a list item for displaying total sum
    let totalSumLi = document.createElement('li');
    let formatTotalSum = Number(orderDetail.totalSum).toFixed(2);
    totalSumLi.textContent = `Total Amount: $${formatTotalSum}`;

    orderPage.appendChild(totalSumLi);
}

//function to remove single product
//update the total sum and local storage
function removeSingleProduct(product) {
    let newList = JSON.parse(localStorage.getItem('selectedProductList'));

    for (let i = 0; i < newList.length; i++) {
        if (newList.at(i).id == product.id) {
            newList.splice(i, 1);
            console.log(newList);
        }
    }
    selectedProductList = newList;
    updateTotalSum();
    localStorage.setItem('selectedProductList', JSON.stringify(newList));
}