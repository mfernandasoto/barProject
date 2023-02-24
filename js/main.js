/* ----------------------------------------------------------
    Proyecto Final - Curso JS - Comisión: 44120
    Desarrollado por: Ing. María Fernanda Soto - DNI 35699418
    mfernandasoto92@gmail.com
-----------------------------------------------------------*/

// ------------------------ Inicio --------------------------
const Cart = []
let CartLS = []
let Menu = []

getDataDB().then(val => {
    Menu = val
    displayMenuPage(Menu)
    // Cada input de cantidad para ordenar:
    for (const input of inputsQuant) {
        input.oninput = () => {addToCart(input, Cart)}
    }
})

// ---------------------------------------------------------
// ------------------ Eventos HTML -------------------------

// Botón ayuda:
btnHelp.onclick = () =>{
    swal("Please enter your table number:", {
        buttons: {
            cancel: true,
            confirm: true,
        },
        content: "input",
        })
      .then((value) => {
        value ? swal("We'll be in your table ASAP") : swal("Please enter your table #")     
      })
    }

//  Mostrar pedido: 
btnNext.onclick = () => {
    displayCartPage(Cart)
}

//  Volver a la página del Menú de comidas: 
btnBack.onclick = () => {
    cartSection.hidden = true
    menuSection.hidden = false
    btnNext.hidden = false
    btnConfirm.hidden = true
}

//  Confirmar pedido: 
btnConfirm.onclick = () => {
    if(table.value){
        displayCheckOutPage()
        jsonCart(Cart)
        checkOutList.innerHTML = ``     //Por las dudas limpio la lista
        
        let total = 0                   // acum para el total a pagar
        let data = sessionStorage.getItem("cart")
        if (data) {
            CartLS = JSON.parse(data)
            for (const element of CartLS) {
                let totParcial = parseFloat((element.product.price) * (element.quant))
                let plantilla = `
                    ${element.quant} x ${element.product.name}
                    $ ${element.product.price} - Total $ ${totParcial}
                `
                total += totParcial
                let row = document.createElement("li")
                row.innerHTML = plantilla
                row.className = "cartItem"
                checkOutList.append(row)
            }
            totalPrice.innerHTML = `Total a pagar: $ ${total}`    
        }else{
        swal("ERROR: Please contact the staff of the bar")
        }
    }else{
        swal("Please enter your table number")
    }     
}

// Número de mesa:
table.onchange = () =>{
    localStorage.setItem("table", parseInt(table.value))
}

// ----------------------------------------------------------
// --------------------- Funciones --------------------------

// Obtener el Menu (comida y bebida) desde la DB
async function getDataDB(){
    const resp = await fetch("json/db.json")
    const menu = await resp.json()
    return menu
}

// Mostrar la página con el menú de comidas
function displayMenuPage(Menu){
    cartSection.hidden = true
    menuSection.hidden = false
    btnNext.hidden = false
    btnConfirm.hidden = true

    let menuTable = document.getElementById("menu-table")
    let i = 0 

    menuTable.innerHTML = ``

    for (const element of Menu) {
        let plantilla = `
            <td class='product'> ${element.name} </td>
            <td class='price'> $ ${element.price} </td>
            <td class='quant'><input type='number' id='${element.id}' class='inputQuant' min='0'></td>
        `
        let row = document.createElement("tr")
        row.innerHTML = plantilla
        row.className = "productRow"
        row.id = "p" + i
        i++
        menuTable.append(row)
    }
}

// Añadir al carrito:
function addToCart(input, Cart) {
    let id = input.id
    let iNewProduct = Cart.findIndex((el) => el.product.id == id)
    if(iNewProduct != -1){
        parseInt(input.value) == 0 ? Cart.splice(iNewProduct, 1) : Cart[iNewProduct].quant = parseInt(input.value)   
    }else{ 
        if(!parseInt(input.value) == 0){
            const producto = Menu.find((el) => el.id == id)
            const newProductToCart = {product: producto, quant: parseInt(input.value)}
            Cart.push(newProductToCart)
        }
    }
}

// Mostrar la página con el carrito:
function displayCartPage(Cart){
    menuSection.hidden = true
    btnNext.hidden = true
    btnConfirm.hidden = false
    cartSection.hidden = false
    cartList.innerHTML = ``
    for (const element of Cart) {
        let plantilla = `
             ${element.quant} x ${element.product.name}
        `
        let row = document.createElement("li")
        row.innerHTML = plantilla
        row.className = "cartItem"
        cartList.append(row)
    }
    if(localStorage.getItem("table")){
        table.value = parseInt(localStorage.getItem("table"))
    }
}

// Mostrar la página con la confirmación del pedido:
function displayCheckOutPage(){
    cartSection.hidden = true
    menuSection.hidden = true
    btnNext.hidden = true
    btnConfirm.hidden = true
    checkOutSection.hidden = false
}

// Guardar carrito en sessionStorage:
function jsonCart(Cart) {
    temp = JSON.stringify(Cart)
    sessionStorage.setItem("cart",temp)
}