// Inicializar el carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Cargar productos desde el archivo JSON
fetch('./datos.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al cargar los productos');
    }
    return response.json();
  })
  .then(data => {
    inicializarProductos(data);
    actualizarCarrito(); // Mostrar el carrito al cargar los productos
  })
  .catch(error => console.error('Error:', error));

// Función para inicializar productos en el DOM
function inicializarProductos(productos) {
  const productosContainer = document.getElementById('productos').querySelector('ul');
  productosContainer.innerHTML = '';

  productos.forEach(producto => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${producto.nombre} - $${producto.precio}</span>
      <button class="agregar-carro" data-name="${producto.nombre}" data-price="${producto.precio}">
        Agregar
      </button>
    `;
    productosContainer.appendChild(li);
  });

  document.querySelectorAll(".agregar-carro").forEach(boton => {
    boton.addEventListener("click", (event) => {
      const nombre = event.target.getAttribute("data-name");
      const precio = parseFloat(event.target.getAttribute("data-price"));

      const productoEnCarrito = carrito.find(item => item.nombre === nombre);
      
      if (productoEnCarrito) {
        productoEnCarrito.unidades++;
      } else {
        carrito.push({ nombre, precio, unidades: 1 });
      }
      
      actualizarCarrito();
    });
  });
}

// Función para actualizar el carrito en el DOM
function actualizarCarrito() {
  const itemsCarro = document.getElementById("items-carro");
  itemsCarro.innerHTML = "";

  let total = 0;

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio} x ${item.unidades}`;
    
    const btnSumar = document.createElement("button");
    btnSumar.textContent = "+";
    btnSumar.onclick = () => {
      item.unidades++;
      actualizarCarrito();
    };

    const btnRestar = document.createElement("button");
    btnRestar.textContent = "-";
    btnRestar.onclick = () => {
      item.unidades--;
      if (item.unidades <= 0) {
        carrito = carrito.filter(i => i.nombre !== item.nombre);
      }
      actualizarCarrito();
    };

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = () => {
      carrito = carrito.filter(i => i.nombre !== item.nombre);
      actualizarCarrito();
    };

    li.appendChild(btnSumar);
    li.appendChild(btnRestar);
    li.appendChild(btnEliminar);
    itemsCarro.appendChild(li);

    total += item.precio * item.unidades;
  });

  document.getElementById("total").textContent = total.toFixed(2);
  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Agregar evento al botón de compra
  document.getElementById("boton-comprar").onclick = () => {
    const mensajeCompra = document.getElementById("mensaje-compra");
    if (carrito.length === 0) {
      mensajeCompra.textContent = "Tu carrito está vacío.";
      mensajeCompra.style.color = "red"; // Rojo para advertencia
    } else {
      mensajeCompra.textContent = `Compra realizada con éxito! Total: $${total.toFixed(2)}`;
      mensajeCompra.style.color = "green"; // Verde para éxito
      carrito = []; // Limpiar el carrito después de la compra
      actualizarCarrito(); // Actualizar la vista del carrito
    }
    
    mensajeCompra.style.display = "block"; // Mostrar el mensaje
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      mensajeCompra.style.display = "none";
    }, 3000);
  };
}
