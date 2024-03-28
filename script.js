function displayProducts(categoryTitle,categoryAPI) {
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


                 proBodyOrderBtn.addEventListener("click", function() {
                     sendData(product);

                 });

                 productContainer.appendChild(prodBody);
                 productList.appendChild(productContainer);

             });
         });
 }


 let selectedProductList = [];

 function sendData(product) {
    console.log(product);
    selectedProductList.push(product);
    localStorage.setItem("selectedProductList", JSON.stringify(selectedProductList));

}


function displayProductInfo() {
    const product = JSON.parse(localStorage.getItem("selectedProductList"));
    console.log(product);

    const productInfo = document.getElementById("productList");
    product.forEach(element => {
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
    amountBtnDiv.innerHTML = `<span class="minus">-</span>
    <span class="num">01</span>
    <span class="plus">+</span>
    `;
    amountBtnDiv.classList.add('col-md-1');
    amountBtnDiv.style.cursor = 'pointer';


    div.innerHTML += `
    <div class="col-md-8">${element.title}</div>
    <div class="col-md-1">$${element.price}</div>
    `;

    div.appendChild(amountBtnDiv);

    productInfo.appendChild(div);

    const minus = document.querySelector('.minus');
const plus = document.querySelector('.plus');
const num = document.querySelector('.num');

let amountNum = 1;
plus.addEventListener('click',() => {
    amountNum++;
    num.innerHTML = amountNum < 10? '0'+amountNum : amountNum;
})

minus.addEventListener('click',() => {
    amountNum--;
    if (amountNum < 1){
        num.innerHTML = 0;
    } else if (amountNum >0 && amountNum < 10){
        num.innerHTML = '0'+amountNum;
    } else {
        num.innerHTML = amountNum;
    }
})

    });
}

            

