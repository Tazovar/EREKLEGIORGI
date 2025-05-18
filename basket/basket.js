let basket_container = document.querySelector('.basket_container');
let basketArray = [];
let baseUrl = `https://restaurant.stepprojects.ge/api`



getAllProductsFromBasket();
function getAllProductsFromBasket(){
        fetch(`${baseUrl}/Baskets/GetAll`,{
        method:'GET'
    }).then((response) => {
   return response.json();
    } ).then((data) => {
        basketArray = data
        generateBasketVisual(basketArray)
        
    }).catch((err) => {
        console.error(err)
    })
}




function generateBasketVisual(basketArrayParam){
    console.log(basketArrayParam);
    
    let empty = ``;
    for(let i = 0 ; i < basketArrayParam.length;i++){
        
        
        empty += 
        `
    <div class="product-card">
  <img src="${basketArrayParam[i].product.image}" alt="${basketArrayParam[i].product.name}">
  <h1>${basketArrayParam[i].product.name}</h1>
  <p>${basketArrayParam[i].product.vegeterian == true ? 'ვეგეტარიანულია'  : 'არ არის ვეგეტარიანული'}</p>
  <p>${basketArrayParam[i].product.nuts == true ? 'თხილიანია'  : 'არ არის თხილიანი'}</p>
  <p>სიმწარის დონე: ${basketArrayParam[i].product.spiciness > 0 ? basketArrayParam[i].product.spiciness : 'არ არის საერთოდ მწარე'}</p>
  
  <div class="quantity-controls">
    <button onclick="onUpdateBtnClick('minus',${basketArrayParam[i].product.id})">-</button>
    <p>${basketArrayParam[i].quantity}</p>
    <button onclick="onUpdateBtnClick('plus',${basketArrayParam[i].product.id})">+</button>
  </div>
  <p class="price">${basketArrayParam[i].price}₾</p>
  <button onclick="onDeleteBtnClick(${basketArrayParam[i].product.id})">delete</button>
</div>

        `
    }

    basket_container.innerHTML = empty;
}


function onUpdateBtnClick(event,id){

    if(id){
        let findPorduct = basketArray.find((element) => {
            return element.product.id == id})
            if(findPorduct){
                if(event == 'plus'){
                    findPorduct.quantity++
                }else if(event == 'minus'){
                    if(findPorduct.quantity == 1){
                        return
                    }
            findPorduct.quantity--


                }

                let reqBody = {
                    quantity:findPorduct.quantity,
                    price:findPorduct.quantity * findPorduct.product.price,
                    productId:findPorduct.product.id
                }

                fetch(`${baseUrl}/Baskets/UpdateBasket`,{
                    method:'PUT',
                    body:JSON.stringify(reqBody),
                    headers:{
                        'Content-Type':'application/json'
                    }
                }).then(() => {
                    getAllProductsFromBasket();
                }).catch((err) => {
                    console.error(err)
                })
                
            }else{
                console.error(`product to this id:${id} not found`);
                
            }
    }else{
        console.error('id is not defined')
    }
}


function onDeleteBtnClick(id){
    if(id){
        fetch(`${baseUrl}/Baskets/DeleteProduct/${id}`,{
            method:'DELETE'
        }).then(() => {
            getAllProductsFromBasket();
        }).catch((err) => {
            console.error(err)
        })
    }else{
                console.error('id is not defined')
    }
}