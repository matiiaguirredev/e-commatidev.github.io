let productosArray = []; 

fetch("JS/productos.json")
    .then(response => response.json())
    .then(data => {
        productosArray = data;


    cargarProductos(productosArray);     

    });



const contenedorProductos = document.querySelector("#contenedor-productos");
const btnCat = document.querySelectorAll(".btn-cat");
const titPrincipal = document.querySelector("#title-ofi");
let btnAgregar = document.querySelectorAll(".prod-add");
const numerito = document.querySelector("#numerito");


btnCat.forEach(btn => btn.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))



function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";
    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
        <img class="prod-img" src="${producto.imagen}" alt="${producto.titulo}">
        <div class="prod-details">
            <h3 class="prod-title">${producto.titulo}</h3>
            <p class="prod-price">€ ${producto.precio}</p>
            <button class="prod-add" id="${producto.id}">Agregar</button>
        </div>`;
        contenedorProductos.append(div);
    });
    actBtnAgregar();
}


btnCat.forEach(boton => {
    boton.addEventListener("click", (e) => {
        btnCat.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id !== "todos") {
            const prodCategoria = productosArray.find(producto => producto.categorias.id === e.currentTarget.id);
            titPrincipal.innerText = prodCategoria.categorias.nombre;
            const producBtn = productosArray.filter(producto => producto.categorias.id === e.currentTarget.id);
            cargarProductos(producBtn);
        } else {
            titPrincipal.innerText = "Todos los productos";
            cargarProductos(productosArray);
        }
    });
});

function actBtnAgregar() {
    btnAgregar = document.querySelectorAll(".prod-add");
    btnAgregar.forEach(btn => {
        btn.addEventListener("click", addToCart);
    });
}

let prodInCart;

let prucEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (prucEnCarritoLS) {
    prodInCart = JSON.parse(prucEnCarritoLS);
    //el if es una linea nueva, el codigo se habia clavado completamente 240-242 
    if (!Array.isArray(prodInCart)) {
        prodInCart = [];
    }
    actnumerito();
} else {
    prodInCart = [];
}

function addToCart(e) {

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
        background: "linear-gradient(to right, #bfb6a9, #8a7c6c)",
        borderRadius : "2rem",
        textTransform: "uppercase", // tengo dudas de esto, n me gusta tanto.
        fontSize: ".75rem"
        },
        offset: {
            x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: "1.5rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function(){} // Callback after click
    }).showToast();


    const idBtn = e.currentTarget.id;
    const prodAgregado = productosArray.find(producto => producto.id === idBtn);

    if (prodInCart.some(producto => producto.id === idBtn)) {
        const index = prodInCart.findIndex(producto => producto.id === idBtn);
        prodInCart[index].cantidad++;
    } else {
        prodAgregado.cantidad = 1;
        prodInCart.push(prodAgregado);
    }

    actnumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(prodInCart));
}

function actnumerito() {
    let nuevonumerito = prodInCart.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevonumerito;
}
