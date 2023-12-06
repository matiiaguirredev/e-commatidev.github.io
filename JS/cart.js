let prucEnCarrito = localStorage.getItem("productos-en-carrito"); //fue necesario utilizar otro nombre en vez del que traiamos de antes "prucEnCarrito" saltaba un error que no dejba continuar nada
prucEnCarrito = JSON.parse(prucEnCarrito);

const contenedorCarritoVacio = document.querySelector("#cart-vacio");
const contenedorCarritoProductos = document.querySelector("#cart-prods");
const contenedorCarritoAcciones = document.querySelector("#cart-actions");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let btnsElimar = document.querySelectorAll(".cart-prod-delete")
const btnVaciarCarrito = document.querySelector("#cart-act-vaciar")
const contTotal = document.querySelector("#total")
const btnComprar = document.querySelector("#cart-act-buy")



function cargarProductosCarrito() {
    if (prucEnCarrito && prucEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = ""; //para que arranque vacio

        prucEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("cart-prod");
            div.innerHTML = `
            <img class="cart-prud-img" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="cart-prod-title">
                    <small>Titulo</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="cart-prod-count">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="cart-prod-price">
                    <small>Precio</small>
                    <p>€ ${producto.precio}</p>
                </div>
                <div class="cart-prod-subprice">
                    <small>Subtotal</small>
                    <p>€ ${producto.precio * producto.cantidad}</p>
                </div>
    
                <button id="${producto.id}" class="cart-prod-delete"><i class="bi bi-trash-fill"></i></button>
                `

            contenedorCarritoProductos.append(div);

        });


    } else {

        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");

    }

    actBtnEliminar();
    actTotal();

};

cargarProductosCarrito();


function actBtnEliminar() {

    btnsElimar = document.querySelectorAll(".cart-prod-delete")

    btnsElimar.forEach(btn => {
        btn.addEventListener("click", DeleteToCart)
    })
};

function DeleteToCart(e) {

    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #bfb6a9, #8a7c6c)",
            borderRadius: "2rem",
            textTransform: "uppercase", // tengo dudas de esto, n me gusta tanto.
            fontSize: ".75rem"
        },
        offset: {
            x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: "1.5rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function () { } // Callback after click
    }).showToast();

    const idBtn = e.currentTarget.id;
    const index = prucEnCarrito.findIndex(producto => producto.id === idBtn);

    if (prucEnCarrito[index].cantidad > 1) {
        // Si hay más de una unidad, simplemente reduce la cantidad en 1
        prucEnCarrito[index].cantidad--;
    } else {
        // Si solo hay una unidad, elimina todo el producto
        prucEnCarrito.splice(index, 1);
    }

    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(prucEnCarrito));
}



btnVaciarCarrito.addEventListener("click", vaciarCarrito)
function vaciarCarrito() {

    Swal.fire({
        title: "Estas seguro?",
        icon: "question",
        html: `Se borraran ${prucEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `Si`,
        cancelButtonText: `No`,
    }).then((result) => {
        if (result.isConfirmed) {

            //este codigo de abajo era mio y estaba por fuera del if, que es una nueva alerta.
            prucEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(prucEnCarrito));
            cargarProductosCarrito();

        } 
    });


}

function actTotal() {
    const totalCalculado = prucEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `€ ${totalCalculado}`;

}

btnComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    prucEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(prucEnCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

}