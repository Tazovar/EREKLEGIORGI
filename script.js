let main_container = document.querySelector('.main_container')
let vegeterian_select = document.querySelector('.vegeterian_select')
let nuts_select = document.querySelector('.nuts_select')
let spiciness_select = document.querySelector('.spiciness_select')
let category_select = document.querySelector('.category_select')
let productsArray = []
let categoriesArray = []
let baseUrl = `https://restaurant.stepprojects.ge/api`
getAllProducts();
getAllCategoires();


function getAllProducts(){
    fetch(`${baseUrl}/Products/GetAll`,{
        method:'GET'
    }).then((response) => {
   return response.json();
    } ).then((data) => {
        productsArray = data
        generateProductsVisual(productsArray)
    }).catch((err) => {
        console.error(err)
    })
}




function generateProductsVisual(productsArrayParam){
    console.log(productsArray);
    
    let empty = ``;
    for(let i = 0 ; i < productsArrayParam.length;i++){
        
        
        empty += 
        `
        <div>
        <img src="${productsArray[i].image}">
        <h1>${productsArray[i].name}</h1>
        <h1>${productsArray[i].price}</h1>
        <p>${productsArray[i].vegeterian == true ? 'ვეგეტარიანულია'  : 'არ არის ვეგეტარიანული'}</p>
        <p>${productsArray[i].nuts == true ? 'თხილიანია'  : 'არ არის თხილიანი'}</p>
        <p>სიმწარის დონე:${productsArray[i].spiciness > 0 ? productsArray[i].spiciness  : 'არ არის საერთოდ მწარე'}</p>
        <button onclick="onAddToCartBtnClick(${productsArray[i].id})">add to cart</button>
        </div>

        `
    }

    main_container.innerHTML = empty;
}




function onAddToCartBtnClick(id){
    if(id){
        let findElementUsingId = productsArray.find((element) => {
            return element.id == id
        })

        if(findElementUsingId){
            let reqBody = {
                  quantity: 1,
                  price: findElementUsingId.price,
                  productId: findElementUsingId.id
            }

            fetch(`${baseUrl}/Baskets/AddToBasket`,{
                method:'POST',
                body:JSON.stringify(reqBody),
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then((response) => {
                return response.json();
            }).then((data) => {
                alert("დაემატა წარმატებით")
            }).catch((err) => {
                console.error(err)
                alert('პრობელმის გამო ვერ მოხერხდა დამატება')
            })
        }else{
            console.error(`product to this id:${id} not found`)
        }
    }else{
        console.error('id is not defined');
        
    }
}

function generateCategoriesVisual(categoiresArrayParam){
let empty = `<option value="">აირჩიეთ</option>`;


for(let  i = 0 ;  i < categoiresArrayParam.length;i++){
    empty += 
    `
    <option value="${categoiresArrayParam[i].id}">${categoiresArrayParam[i].name}</option>
    `
}

category_select.innerHTML = empty;
}

function getAllCategoires(){
    fetch(`${baseUrl}/Categories/GetAll`,{
        method:'GET'
    }).then((response) => {
        return response.json();
    }).then((data) => {
categoriesArray = data;
generateCategoriesVisual(categoriesArray)
    }).catch((err) => {
        console.error(err)
    })
}


function onFilterBtnClick(){
    let nutsValue = nuts_select.value;
    let vegeterianValue = vegeterian_select.value;
    let spicinessValue =spiciness_select.value;
 let categoryValue = category_select.value

    let queryArray = [];

    if(nutsValue){
        queryArray.push(`nuts=${nutsValue}`)
    }
    if(vegeterianValue){
        queryArray.push(`vegeterian=${vegeterianValue}`)
    }
    if(spicinessValue){
        queryArray.push(`spiciness=${spicinessValue}`)
    }
    
    if(categoryValue){
        queryArray.push(`categoryId=${categoryValue}`)
    }
    

    let queryString = ``
    if(queryArray.length > 0){
        queryString = `?${queryArray.join('&')} `
    }
    
    
    fetch(`${baseUrl}/Products/GetFiltered${queryString}`,{
        method:'GET'
    }).then((response) => {
        return response.json()
    }).then((data) => {
        productsArray = data;
        generateProductsVisual(productsArray)
    }).catch((err) => {
        console.error(err)
    })

}