let selectedProductList = [];


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
    product.orderSum = 1;
    product.subTotal = product.orderSum * Number(product.price);
    selectedProductList.push(product);

    localStorage.setItem("selectedProductList", JSON.stringify(selectedProductList));
}

function updateTotalSum() {
    // const existTotalSum = JSON.parse(localStorage.getItem('totalSum'));
    // if (existTotalSum != null){
    //     totalProdSum.innerText = `Total Sum: $${totalSum}`;
    // }

    let totalSum = 0;
    let totalProdSum = document.getElementById('totalSum');
    selectedProductList.forEach(element => {
        totalSum += element.subTotal;
        console.log(element.subTotal + ' ' + totalSum);
    })
    totalProdSum.innerText = `Total Sum: $${totalSum}`;
    localStorage.setItem('totalSum', totalSum);
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
        // prodImg.classList.add('card-img-top');
        // prodImg.classList.add('bg-secondary');
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
    <div class="col-md-7">${element.title}</div>
    <div class="col-md-1">$${element.price}</div>
    `;

        div.appendChild(amountBtnDiv);

        const productSum = document.createElement('span');
        productSum.innerHTML = `$${element.price}`;
        productSum.classList.add(`productSum${index}`);
        productSum.classList.add('subSum');
        productSum.classList.add('col-md-1');
        div.appendChild(productSum);

        productInfo.appendChild(div);

        const minus = document.querySelector(`.minus${index}`);
        const plus = document.querySelector(`.plus${index}`);
        const num = document.querySelector(`.num${index}`);
        let prodSum = document.querySelector(`.productSum${index}`);

        let amountNum = element.orderSum;

        updateTotalSum();

        plus.addEventListener('click', () => {
            amountNum++;
            num.innerHTML = amountNum < 10 ? '0' + amountNum : amountNum;
            element.orderSum = amountNum;
            element.subTotal = Number(element.price) * amountNum;
            prodSum.innerHTML = '$' + element.subTotal;
            localStorage.setItem('selectedProductList', JSON.stringify(product));
            updateOrderDetail(element);
        })

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
            prodSum.innerHTML = '$' + element.subTotal;
            localStorage.setItem('selectedProductList', JSON.stringify(product));
            updateOrderDetail(element);
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

let confirmOrderCounter = 0;
let confirmOrderList = [];

function confirmOrder() {
    let order = {
        id: confirmOrderCounter++,
        name: document.getElementById('name'),
        phone: document.getElementById('tel'),
        email: document.getElementById('email'),
        address: document.getElementById('address'),
        selectedProductList: selectedProductList,
        totalSum: totalSum
    }
    confirmOrderList.push(order);
    localStorage.setItem('confirmOrderList', JSON.stringify(order));
}
