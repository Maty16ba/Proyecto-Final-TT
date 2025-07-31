
document.addEventListener("DOMContentLoaded", () => {
  const productos = [
    {
      id: 1,
      nombre: "Manzanas",
      precio: 1200,
      imagen: "img/manzana.jpg"
    },
    {
      id: 2,
      nombre: "Verduras surtidas",
      precio: 1800,
      imagen: "img/verdura.jpeg"
    },
    {
      id: 3,
      nombre: "Condimentos",
      precio: 950,
      imagen: "img/images.jpeg"
    }
  ];

  const contenedorProductos = document.querySelector(".cards");
  const header = document.querySelector("header");
  const contadorCarrito = document.createElement("div");
  contadorCarrito.id = "contador-carrito";
  header.appendChild(contadorCarrito);

  const seccionCarrito = document.createElement("section");
  seccionCarrito.id = "carrito";
  seccionCarrito.innerHTML = "<h2>Carrito</h2><div id='items-carrito'></div><p id='total'></p>";
  document.querySelector("main").appendChild(seccionCarrito);

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function actualizarContador() {
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarrito.textContent = `🛒 ${total}`;
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function renderCarrito() {
    const itemsCarrito = document.getElementById("items-carrito");
    const totalElem = document.getElementById("total");
    itemsCarrito.innerHTML = "";

    carrito.forEach(item => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p>${item.nombre} - $${item.precio} x ${item.cantidad}</p>
        <button data-id="${item.id}" class="btn-mas">+</button>
        <button data-id="${item.id}" class="btn-menos">-</button>
        <button data-id="${item.id}" class="btn-eliminar">Eliminar</button>
      `;
      itemsCarrito.appendChild(div);
    });

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    totalElem.textContent = `Total: $${total}`;

    document.querySelectorAll(".btn-mas").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const item = carrito.find(p => p.id === id);
        item.cantidad++;
        actualizarContador();
        renderCarrito();
      });
    });

    document.querySelectorAll(".btn-menos").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const item = carrito.find(p => p.id === id);
        if (item.cantidad > 1) {
          item.cantidad--;
        } else {
          carrito.splice(carrito.indexOf(item), 1);
        }
        actualizarContador();
        renderCarrito();
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const index = carrito.findIndex(p => p.id === id);
        carrito.splice(index, 1);
        actualizarContador();
        renderCarrito();
      });
    });
  }

  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const existe = carrito.find(item => item.id === id);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarContador();
    renderCarrito();
  }

  function renderProductos() {
    contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}">
        <p>${producto.nombre}</p>
        <p>$${producto.precio}</p>
        <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
      `;
      contenedorProductos.appendChild(card);
    });

    document.querySelectorAll(".btn-agregar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        agregarAlCarrito(id);
      });
    });
  }

  function validarFormulario() {
    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
      const nombre = form.nombre.value.trim();
      const email = form.email.value.trim();
      const mensaje = form.mensaje.value.trim();
      if (!nombre || !email || !mensaje) {
        e.preventDefault();
        alert("Por favor, completá todos los campos.");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        e.preventDefault();
        alert("Por favor, ingresá un correo válido.");
      }
    });
  }

  renderProductos();
  actualizarContador();
  renderCarrito();
  validarFormulario();
});
