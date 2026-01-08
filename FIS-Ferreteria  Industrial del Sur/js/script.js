// ==============================================
// FIS - Ferretería Industrial del Sur
// Sistema Completo de E-commerce
// ==============================================

// VARIABLES GLOBALES
let carrito = [];
let usuario = null;
let adminActivo = false;
let metodoPagoSeleccionado = null;

// INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ FIS - Sistema Ferretería Industrial del Sur cargado");
    
    // Inicializar datos
    inicializarDatos();
    
    // Cargar datos
    cargarCarrito();
    cargarUsuario();
    
    // Actualizar interfaz
    actualizarCarrito();
    actualizarUsuario();
    
    // Configurar eventos
    configurarEventos();
    
    // Crear estilos dinámicos
    crearEstilosDinamicos();
});

// ====================
// INICIALIZACIÓN DE DATOS
// ====================

function inicializarDatos() {
    // Crear admin por defecto si no existe
    const usuarios = JSON.parse(localStorage.getItem('fis-usuarios') || '[]');
    const adminExists = usuarios.some(u => u.email === 'admin@ferreteria.com');
    
    if (!adminExists) {
        const admin = {
            id: 1,
            name: 'Administrador',
            email: 'admin@ferreteria.com',
            password: 'admin123',
            fechaRegistro: new Date().toISOString(),
            tipo: 'admin'
        };
        usuarios.push(admin);
        localStorage.setItem('fis-usuarios', JSON.stringify(usuarios));
        console.log('Usuario admin creado');
    }
    
    // Crear algunos productos de ejemplo si no existen
    const productos = JSON.parse(localStorage.getItem('fis-productos') || '[]');
    if (productos.length === 0) {
        const productosEjemplo = [
            {
                id: 1,
                nombre: 'Taladro Percutor Profesional',
                precio: 55990,
                categoria: 'Herramientas Eléctricas',
                descripcion: '1200W con mandril 13mm',
                stock: 15,
                imagen: './imagenes/productos/taladropercutor.png'
            },
            {
                id: 2,
                nombre: 'Set de Llaves Combinadas',
                precio: 18990,
                categoria: 'Herramientas Manuales',
                descripcion: '12 piezas 8-19mm, acero cromo vanadio',
                stock: 25,
                imagen: './imagenes/productos/setdellaves.jpg'
            },
            {
                id: 3,
                nombre: 'Kit de Seguridad',
                precio: 15990,
                categoria: 'Seguridad Industrial',
                descripcion: 'Cascos, guantes y lentes de Seguridad',
                stock: 30,
                imagen: './imagenes/productos/kitdeseguridad.jpg'
            },
            {
                id: 4,
                nombre: 'Cable Eléctrico 2x2.5mm',
                precio: 8990,
                categoria: 'Material Eléctrico',
                descripcion: 'Rollo de 100 metros, calidad industrial',
                stock: 50,
                imagen: './imagenes/productos/rollocable2x2.5mm.jpg'
            },
            {
                id: 5,
                nombre: 'Cemento Weber Super Pinguino x 25kg',
                precio: 58990,
                categoria: 'Materiales de Construcción',
                descripcion: 'Mortero a base de cemento blanco',
                stock: 20,
                imagen: './imagenes/productos/cemento.png'
            },
            {
                id: 6,
                nombre: 'Pintura de Poliuretano Industrial',
                precio: 318990,
                categoria: 'Pinturas',
                descripcion: 'Pintura de Poliuretano Industrial blanca mate. 20 litros',
                stock: 8,
                imagen: './imagenes/productos/pintura.png'
            }
        ];
        
        localStorage.setItem('fis-productos', JSON.stringify(productosEjemplo));
        console.log('Productos de ejemplo creados');
    }
}

// ====================
// SISTEMA DE CARRITO
// ====================

function cargarCarrito() {
    const guardado = localStorage.getItem('fis-carrito');
    carrito = guardado ? JSON.parse(guardado) : [];
    console.log("Carrito cargado:", carrito);
}

function guardarCarrito() {
    localStorage.setItem('fis-carrito', JSON.stringify(carrito));
}

function cargarUsuario() {
    const guardado = localStorage.getItem('fis-usuario');
    usuario = guardado ? JSON.parse(guardado) : null;
    console.log("Usuario cargado:", usuario);
}

function guardarUsuario() {
    if (usuario) {
        localStorage.setItem('fis-usuario', JSON.stringify(usuario));
    } else {
        localStorage.removeItem('fis-usuario');
    }
}

// INTERFAZ DEL CARRITO
function abrirCarrito() {
    const carritoSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (carritoSidebar) carritoSidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    
    document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
    const carritoSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (carritoSidebar) carritoSidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    
    document.body.style.overflow = 'auto';
}

// FUNCIONALIDAD PRINCIPAL DEL CARRITO
function agregarAlCarrito(evento) {
    evento.preventDefault();
    
    const boton = evento.currentTarget;
    const id = parseInt(boton.getAttribute('data-id'));
    const nombre = boton.getAttribute('data-name');
    const precio = parseInt(boton.getAttribute('data-price'));
    
    console.log(`Agregando producto: ${nombre} - $${precio}`);
    
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarCarrito();
    mostrarMensaje(`${nombre} agregado al carrito`, 'success');
    
    // Efecto visual en el botón
    const originalHTML = boton.innerHTML;
    boton.innerHTML = '<i class="fas fa-check"></i> Agregado';
    boton.style.backgroundColor = '#28a745';
    
    setTimeout(() => {
        boton.innerHTML = originalHTML;
        boton.style.backgroundColor = '';
    }, 1000);
    
    // Abrir carrito automáticamente
    setTimeout(abrirCarrito, 500);
}

function actualizarCarrito() {
    const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    
    console.log(`Actualizando carrito: ${totalProductos} productos`);
    
    // Actualizar contadores del icono del carrito
    document.querySelectorAll('.cart__count').forEach(contador => {
        contador.textContent = totalProductos;
    });
    
    const carritoVacio = document.getElementById('cart-empty');
    const itemsCarrito = document.getElementById('cart-items');
    const totalCarrito = document.getElementById('cart-total');
    const contadorCarrito = document.getElementById('cart-count');
    
    // Si el carrito está vacío
    if (carrito.length === 0) {
        if (carritoVacio) carritoVacio.style.display = 'flex';
        if (itemsCarrito) itemsCarrito.innerHTML = '';
        if (totalCarrito) totalCarrito.textContent = '$0';
        if (contadorCarrito) contadorCarrito.textContent = '0';
        return;
    }
    
    if (carritoVacio) carritoVacio.style.display = 'none';
    
    // Calcular total
    const precioTotal = carrito.reduce((total, producto) => 
        total + (producto.precio * producto.cantidad), 0);
    
    if (totalCarrito) {
        totalCarrito.textContent = `$${precioTotal.toLocaleString('es-CL')}`;
    }
    
    if (contadorCarrito) {
        contadorCarrito.textContent = totalProductos;
    }
    
    // Generar HTML de los items del carrito
    if (itemsCarrito) {
        itemsCarrito.innerHTML = carrito.map(producto => {
            const subtotal = producto.precio * producto.cantidad;
            return `
            <div class="cart-item" data-id="${producto.id}">
                <div class="cart-item__info">
                    <h4 class="cart-item__title">${producto.nombre}</h4>
                    <div class="cart-item__price">$${producto.precio.toLocaleString('es-CL')} c/u</div>
                </div>
                <div class="cart-item__controls">
                    <div class="cart-item__quantity">
                        <button class="quantity-btn" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
                        <span class="quantity-value">${producto.cantidad}</span>
                        <button class="quantity-btn" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                    </div>
                    <div class="cart-item__subtotal">$${subtotal.toLocaleString('es-CL')}</div>
                    <button class="cart-item__remove" onclick="eliminarProducto(${producto.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`;
        }).join('');
    }
}

function cambiarCantidad(id, cambio) {
    const productoIndex = carrito.findIndex(item => item.id === id);
    
    if (productoIndex !== -1) {
        carrito[productoIndex].cantidad += cambio;
        
        if (carrito[productoIndex].cantidad <= 0) {
            const nombreProducto = carrito[productoIndex].nombre;
            carrito.splice(productoIndex, 1);
            mostrarMensaje(`${nombreProducto} eliminado`, 'info');
        }
        
        guardarCarrito();
        actualizarCarrito();
    }
}

function eliminarProducto(id) {
    const productoIndex = carrito.findIndex(item => item.id === id);
    
    if (productoIndex !== -1) {
        const nombreProducto = carrito[productoIndex].nombre;
        carrito.splice(productoIndex, 1);
        guardarCarrito();
        actualizarCarrito();
        mostrarMensaje(`${nombreProducto} eliminado del carrito`, 'info');
    }
}

function vaciarCarrito() {
    if (carrito.length === 0) {
        mostrarMensaje('El carrito ya está vacío', 'info');
        return;
    }
    
    if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
        carrito = [];
        guardarCarrito();
        actualizarCarrito();
        mostrarMensaje('Carrito vaciado', 'info');
        cerrarCarrito();
    }
}

// ====================
// SISTEMA DE PAGOS
// ====================

function procesarCompra() {
    console.log("Procesando compra...");
    console.log("Carrito:", carrito);
    console.log("Usuario:", usuario);
    
    if (carrito.length === 0) {
        mostrarMensaje('Tu carrito está vacío', 'info');
        return;
    }
    
    if (!usuario) {
        mostrarMensaje('Por favor, inicia sesión para proceder al pago', 'info');
        abrirLogin();
        return;
    }
    
    // Calcular total
    const total = carrito.reduce((sum, producto) => 
        sum + (producto.precio * producto.cantidad), 0);
    
    // Mostrar opciones de pago
    mostrarOpcionesPago(total);
}

function mostrarOpcionesPago(total) {
    // Crear modal de pago
    const modalHTML = `
        <div class="simple-payment-modal" id="simple-payment-modal" style="display: block;">
            <div class="simple-payment-overlay" onclick="cerrarModalPago()"></div>
            <div class="simple-payment-content">
                <div class="simple-payment-header">
                    <h3>Finalizar Compra</h3>
                    <button class="simple-payment-close" onclick="cerrarModalPago()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="simple-payment-body">
                    <div class="order-summary">
                        <h4>Resumen de tu Orden</h4>
                        <div class="summary-products">
                            ${carrito.map(producto => `
                                <div class="summary-product">
                                    <span>${producto.nombre} x${producto.cantidad}</span>
                                    <span>$${(producto.precio * producto.cantidad).toLocaleString('es-CL')}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="summary-total">
                            <span>Total a pagar:</span>
                            <span class="total-amount">$${total.toLocaleString('es-CL')}</span>
                        </div>
                    </div>
                    
                    <div class="payment-method-selection">
                        <h4>Selecciona método de pago</h4>
                        <div class="payment-methods-list">
                            <div class="payment-method-option" data-method="transferencia">
                                <i class="fas fa-university"></i>
                                <span>Transferencia Bancaria</span>
                            </div>
                            <div class="payment-method-option" data-method="efectivo">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>Efectivo en Tienda</span>
                            </div>
                            <div class="payment-method-option" data-method="tarjeta">
                                <i class="fas fa-credit-card"></i>
                                <span>Tarjeta de Crédito</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="payment-actions">
                        <button class="btn btn--secondary" onclick="cerrarModalPago()">
                            Cancelar
                        </button>
                        <button class="btn btn--primary" id="confirmar-compra-btn" disabled>
                            <i class="fas fa-lock"></i> Confirmar Compra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior si existe
    const modalAnterior = document.getElementById('simple-payment-modal');
    if (modalAnterior) modalAnterior.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos de selección de método de pago
    document.querySelectorAll('.payment-method-option').forEach(opcion => {
        opcion.addEventListener('click', function() {
            seleccionarMetodoPago(this);
        });
    });
    
    // Configurar evento para confirmar compra
    const confirmarBtn = document.getElementById('confirmar-compra-btn');
    if (confirmarBtn) {
        confirmarBtn.addEventListener('click', finalizarCompra);
    }
}

function seleccionarMetodoPago(elemento) {
    // Remover selección anterior
    document.querySelectorAll('.payment-method-option').forEach(opcion => {
        opcion.classList.remove('selected');
    });
    
    // Agregar selección actual
    elemento.classList.add('selected');
    
    // Guardar método seleccionado
    metodoPagoSeleccionado = elemento.getAttribute('data-method');
    
    // Habilitar botón de confirmar
    const confirmarBtn = document.getElementById('confirmar-compra-btn');
    if (confirmarBtn) {
        confirmarBtn.disabled = false;
        const metodoTexto = elemento.querySelector('span').textContent;
        confirmarBtn.innerHTML = `<i class="fas fa-lock"></i> Confirmar con ${metodoTexto}`;
    }
}

function finalizarCompra() {
    const confirmarBtn = document.getElementById('confirmar-compra-btn');
    
    if (!metodoPagoSeleccionado) {
        mostrarMensaje('Por favor, selecciona un método de pago', 'error');
        return;
    }
    
    // Deshabilitar botón durante el procesamiento
    if (confirmarBtn) {
        confirmarBtn.disabled = true;
        confirmarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    }
    
    // Simular procesamiento de pago
    setTimeout(() => {
        // Crear orden
        const orden = crearOrden(metodoPagoSeleccionado);
        
        // Guardar orden
        guardarOrden(orden);
        
        // Mostrar confirmación
        mostrarConfirmacionCompra(orden);
        
        // Limpiar carrito
        carrito = [];
        guardarCarrito();
        actualizarCarrito();
        
        // Cerrar modales
        cerrarModalPago();
        cerrarCarrito();
        
        // Resetear método de pago
        metodoPagoSeleccionado = null;
    }, 2000);
}

function crearOrden(metodoPago) {
    const total = carrito.reduce((sum, producto) => 
        sum + (producto.precio * producto.cantidad), 0);
    
    return {
        id: 'ORD-' + Date.now().toString().slice(-8),
        fecha: new Date().toISOString(),
        usuario: usuario.email,
        productos: [...carrito],
        total: total,
        metodoPago: metodoPago,
        estado: 'completado'
    };
}

function guardarOrden(orden) {
    const ordenes = JSON.parse(localStorage.getItem('fis-ordenes') || '[]');
    ordenes.push(orden);
    localStorage.setItem('fis-ordenes', JSON.stringify(ordenes));
    console.log("Orden guardada:", orden);
}

function mostrarConfirmacionCompra(orden) {
    const productosLista = orden.productos.map(p => 
        `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`
    ).join('\n');
    
    const mensaje = `
        ¡COMPRA EXITOSA! 🎉

        Número de orden: ${orden.id}
        Fecha: ${new Date(orden.fecha).toLocaleDateString()}
        Método de pago: ${orden.metodoPago}
        Total: $${orden.total.toLocaleString('es-CL')}

        Productos:
        ${productosLista}

        Te contactaremos pronto para coordinar la entrega.
        ¡Gracias por tu compra en Ferretería Industrial del Sur!
    `;
    
    alert(mensaje);
    mostrarMensaje(`¡Compra exitosa! Orden #${orden.id}`, 'success');
}

function cerrarModalPago() {
    const modal = document.getElementById('simple-payment-modal');
    if (modal) {
        modal.remove();
    }
    metodoPagoSeleccionado = null;
}

// ====================
// SISTEMA DE LOGIN/REGISTRO
// ====================

function abrirLogin() {
    const modalLogin = document.getElementById('login-modal');
    if (modalLogin) {
        modalLogin.classList.add('active');
        document.body.style.overflow = 'hidden';
        mostrarFormularioLogin();
        
        setTimeout(() => {
            const emailInput = document.getElementById('login-email');
            if (emailInput) emailInput.focus();
        }, 100);
    }
}

function cerrarLogin() {
    const modalLogin = document.getElementById('login-modal');
    if (modalLogin) {
        modalLogin.classList.remove('active');
        document.body.style.overflow = 'auto';
        limpiarFormularios();
    }
}

function mostrarFormularioLogin() {
    const formLogin = document.getElementById('login-form');
    const formRegistro = document.getElementById('register-form');
    const tituloModal = document.getElementById('modal-title');
    
    if (formLogin) formLogin.style.display = 'block';
    if (formRegistro) formRegistro.style.display = 'none';
    if (tituloModal) tituloModal.textContent = 'Iniciar Sesión';
}

function mostrarFormularioRegistro() {
    const formLogin = document.getElementById('login-form');
    const formRegistro = document.getElementById('register-form');
    const tituloModal = document.getElementById('modal-title');
    
    if (formLogin) formLogin.style.display = 'none';
    if (formRegistro) formRegistro.style.display = 'block';
    if (tituloModal) tituloModal.textContent = 'Crear Cuenta';
    
    setTimeout(() => {
        const nameInput = document.getElementById('register-name');
        if (nameInput) nameInput.focus();
    }, 100);
}

function limpiarFormularios() {
    document.querySelectorAll('#login-form input, #register-form input').forEach(input => {
        input.value = '';
    });
}

function iniciarSesion(evento) {
    if (evento) evento.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return false;
    }
    
    const usuarios = JSON.parse(localStorage.getItem('fis-usuarios') || '[]');
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);
    
    if (!usuarioEncontrado) {
        mostrarMensaje('Email o contraseña incorrectos', 'error');
        return false;
    }
    
    usuario = usuarioEncontrado;
    guardarUsuario();
    actualizarUsuario();
    cerrarLogin();
    mostrarMensaje(`¡Bienvenido ${usuario.name}!`, 'success');
    
    // Si es admin, mostrar panel automáticamente
    if (usuario.tipo === 'admin') {
        setTimeout(() => {
            mostrarPanelAdmin();
        }, 1000);
    }
    
    return true;
}

function registrar(evento) {
    if (evento) evento.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    if (!name || !email || !password || !confirmPassword) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        mostrarMensaje('Las contraseñas no coinciden', 'error');
        return false;
    }
    
    if (password.length < 6) {
        mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }
    
    if (!validateEmail(email)) {
        mostrarMensaje('Por favor, ingresa un email válido', 'error');
        return false;
    }
    
    const usuarios = JSON.parse(localStorage.getItem('fis-usuarios') || '[]');
    
    if (usuarios.some(u => u.email === email)) {
        mostrarMensaje('Este email ya está registrado', 'error');
        return false;
    }
    
    const nuevoUsuario = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        fechaRegistro: new Date().toISOString(),
        tipo: 'cliente'
    };
    
    usuarios.push(nuevoUsuario);
    localStorage.setItem('fis-usuarios', JSON.stringify(usuarios));
    
    usuario = nuevoUsuario;
    guardarUsuario();
    actualizarUsuario();
    cerrarLogin();
    mostrarMensaje(`¡Cuenta creada exitosamente! Bienvenido ${name}!`, 'success');
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        usuario = null;
        guardarUsuario();
        actualizarUsuario();
        mostrarMensaje('Sesión cerrada exitosamente', 'info');
        
        // Cerrar panel admin si está abierto
        if (adminActivo) {
            cerrarPanelAdmin();
        }
    }
}

function actualizarUsuario() {
    const botonLogin = document.getElementById('login-btn');
    const indicadorUsuario = document.getElementById('user-indicator');
    const nombreUsuario = document.getElementById('user-name');
    
    if (usuario) {
        if (botonLogin) {
            botonLogin.style.display = 'none';
            // Cambiar ícono si es admin
            if (usuario.tipo === 'admin') {
                botonLogin.innerHTML = '<i class="fas fa-user-cog"></i> Admin';
            }
        }
        if (indicadorUsuario) {
            indicadorUsuario.style.display = 'block';
            indicadorUsuario.title = `Email: ${usuario.email} (${usuario.tipo})`;
        }
        if (nombreUsuario) nombreUsuario.textContent = usuario.name;
    } else {
        if (botonLogin) {
            botonLogin.style.display = 'block';
            botonLogin.innerHTML = '<i class="fas fa-user"></i> Iniciar Sesión';
        }
        if (indicadorUsuario) indicadorUsuario.style.display = 'none';
    }
}

// ====================
// PANEL DE ADMINISTRACIÓN
// ====================

function mostrarPanelAdmin() {
    const panelAdmin = document.getElementById('admin-panel');
    if (panelAdmin) {
        panelAdmin.style.display = 'block';
        adminActivo = true;
        document.body.style.overflow = 'hidden';
        cargarDatosAdmin();
    }
}

function cerrarPanelAdmin() {
    const panelAdmin = document.getElementById('admin-panel');
    if (panelAdmin) {
        panelAdmin.style.display = 'none';
        adminActivo = false;
        document.body.style.overflow = 'auto';
    }
}

function cargarDatosAdmin() {
    cargarEstadisticas();
    cargarOrdenes();
    cargarProductosAdmin();
    cargarUsuarios();
    cargarCotizaciones();
}

function cargarEstadisticas() {
    const ordenes = JSON.parse(localStorage.getItem('fis-ordenes') || '[]');
    const usuarios = JSON.parse(localStorage.getItem('fis-usuarios') || '[]');
    const productos = JSON.parse(localStorage.getItem('fis-productos') || '[]');
    
    // Ordenes hoy
    const hoy = new Date().toDateString();
    const ordenesHoy = ordenes.filter(o => new Date(o.fecha).toDateString() === hoy);
    
    // Ventas totales
    const ventasTotales = ordenes.reduce((sum, o) => sum + o.total, 0);
    
    // Actualizar UI
    const ordersToday = document.getElementById('orders-today');
    const totalSales = document.getElementById('total-sales');
    const totalUsers = document.getElementById('total-users');
    const totalProducts = document.getElementById('total-products');
    
    if (ordersToday) ordersToday.textContent = ordenesHoy.length;
    if (totalSales) totalSales.textContent = `$${ventasTotales.toLocaleString('es-CL')}`;
    if (totalUsers) totalUsers.textContent = usuarios.length;
    if (totalProducts) totalProducts.textContent = productos.length;
}

function cargarOrdenes() {
    const ordenes = JSON.parse(localStorage.getItem('fis-ordenes') || '[]');
    const tbody = document.getElementById('orders-table-body');
    
    if (tbody) {
        if (ordenes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay órdenes registradas</td></tr>';
            return;
        }
        
        tbody.innerHTML = ordenes.map(orden => `
            <tr>
                <td>${orden.id}</td>
                <td>${orden.usuario}</td>
                <td>${new Date(orden.fecha).toLocaleDateString()}</td>
                <td>$${orden.total.toLocaleString('es-CL')}</td>
                <td><span class="badge badge-${orden.estado}">${orden.estado}</span></td>
                <td>
                    <button class="btn btn--small" onclick="verOrden('${orden.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function verOrden(idOrden) {
    const ordenes = JSON.parse(localStorage.getItem('fis-ordenes') || '[]');
    const orden = ordenes.find(o => o.id === idOrden);
    
    if (orden) {
        const productosDetalle = orden.productos.map(p => 
            `${p.nombre} x${p.cantidad} - $${p.precio} c/u`
        ).join('\n');
        
        alert(`Detalle de Orden #${orden.id}\n\n` +
              `Fecha: ${new Date(orden.fecha).toLocaleString()}\n` +
              `Cliente: ${orden.usuario}\n` +
              `Método de pago: ${orden.metodoPago}\n` +
              `Total: $${orden.total}\n\n` +
              `Productos:\n${productosDetalle}`);
    }
}

function cargarProductosAdmin() {
    const productos = JSON.parse(localStorage.getItem('fis-productos') || '[]');
    const grid = document.getElementById('products-grid-admin');
    
    if (grid) {
        if (productos.length === 0) {
            grid.innerHTML = '<p>No hay productos registrados</p>';
            return;
        }
        
        grid.innerHTML = productos.map(producto => `
            <div class="product-card-admin">
                <div class="product-card__image-admin">
                    <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/100x100?text=Producto'">
                </div>
                <div class="product-card__content-admin">
                    <h4>${producto.nombre}</h4>
                    <p class="product-price">$${producto.precio.toLocaleString('es-CL')}</p>
                    <p class="product-category">${producto.categoria}</p>
                    <p class="product-stock">Stock: ${producto.stock}</p>
                    <div class="product-actions-admin">
                        <button class="btn btn--small btn-edit" onclick="editarProducto(${producto.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn--small btn-delete" onclick="eliminarProductoAdmin(${producto.id})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function editarProducto(id) {
    mostrarMensaje('Función de edición en desarrollo', 'info');
}

function eliminarProductoAdmin(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        const productos = JSON.parse(localStorage.getItem('fis-productos') || '[]');
        const productosFiltrados = productos.filter(p => p.id !== id);
        localStorage.setItem('fis-productos', JSON.stringify(productosFiltrados));
        
        mostrarMensaje('Producto eliminado', 'success');
        cargarProductosAdmin();
        cargarEstadisticas();
    }
}

function cargarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('fis-usuarios') || '[]');
    const tbody = document.getElementById('users-table-body');
    
    if (tbody) {
        tbody.innerHTML = usuarios.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${new Date(user.fechaRegistro).toLocaleDateString()}</td>
                <td><span class="badge badge-${user.tipo}">${user.tipo}</span></td>
                <td>
                    <button class="btn btn--small" onclick="editarUsuario(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function editarUsuario(id) {
    mostrarMensaje('Función de edición de usuario en desarrollo', 'info');
}

function cargarCotizaciones() {
    const cotizaciones = JSON.parse(localStorage.getItem('fis-cotizaciones') || '[]');
    const list = document.getElementById('quotations-list');
    
    if (list) {
        if (cotizaciones.length === 0) {
            list.innerHTML = '<p>No hay cotizaciones recibidas</p>';
            return;
        }
        
        list.innerHTML = cotizaciones.map(cot => `
            <div class="quotation-card">
                <div class="quotation-header">
                    <h5>${cot.name} - ${cot.product}</h5>
                    <span class="quotation-date">${new Date(cot.fecha).toLocaleDateString()}</span>
                </div>
                <div class="quotation-body">
                    <p><strong>Email:</strong> ${cot.email}</p>
                    <p><strong>Teléfono:</strong> ${cot.phone}</p>
                    <p><strong>Mensaje:</strong> ${cot.message}</p>
                </div>
            </div>
        `).join('');
    }
}

// ====================
// FORMULARIO COTIZACIÓN
// ====================

function enviarCotizacion(evento) {
    evento.preventDefault();
    
    const form = evento.target;
    const formData = new FormData(form);
    const datos = Object.fromEntries(formData);
    
    // Validar campos
    for (const [key, value] of Object.entries(datos)) {
        if (!value.trim()) {
            mostrarMensaje(`Por favor, completa el campo ${key}`, 'error');
            return;
        }
    }
    
    mostrarMensaje('Enviando cotización...', 'info');
    
    setTimeout(() => {
        const cotizaciones = JSON.parse(localStorage.getItem('fis-cotizaciones') || '[]');
        const nuevaCotizacion = {
            ...datos,
            fecha: new Date().toISOString(),
            usuario: usuario ? usuario.email : 'Anónimo'
        };
        
        cotizaciones.push(nuevaCotizacion);
        localStorage.setItem('fis-cotizaciones', JSON.stringify(cotizaciones));
        
        mostrarMensaje('¡Cotización enviada exitosamente!', 'success');
        alert(`✅ Gracias ${datos.name}, te contactaremos pronto.`);
        form.reset();
    }, 1500);
}

// ====================
// CONFIGURACIÓN DE EVENTOS
// ====================

function configurarEventos() {
    console.log("Configurando eventos...");
    
    // Eventos del carrito
    const iconoCarrito = document.getElementById('cart__icon');
    if (iconoCarrito) {
        iconoCarrito.addEventListener('click', abrirCarrito);
    }
    
    const botonCerrarCarrito = document.getElementById('close-cart');
    if (botonCerrarCarrito) {
        botonCerrarCarrito.addEventListener('click', cerrarCarrito);
    }
    
    const botonVaciarCarrito = document.getElementById('clear-cart-btn');
    if (botonVaciarCarrito) {
        botonVaciarCarrito.addEventListener('click', vaciarCarrito);
    }
    
    // Eventos de autenticación
    const botonLogin = document.getElementById('login-btn');
    if (botonLogin) {
        botonLogin.addEventListener('click', function(e) {
            e.preventDefault();
            if (usuario && usuario.tipo === 'admin') {
                mostrarPanelAdmin();
            } else {
                abrirLogin();
            }
        });
    }
    
    const botonCerrarLogin = document.getElementById('close-login');
    if (botonCerrarLogin) {
        botonCerrarLogin.addEventListener('click', cerrarLogin);
    }
    
    const botonIrRegistro = document.getElementById('go-register');
    if (botonIrRegistro) {
        botonIrRegistro.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarFormularioRegistro();
        });
    }
    
    const botonIrLogin = document.getElementById('go-login');
    if (botonIrLogin) {
        botonIrLogin.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarFormularioLogin();
        });
    }
    
    const botonLogout = document.getElementById('logout-btn');
    if (botonLogout) {
        botonLogout.addEventListener('click', cerrarSesion);
    }
    
    // Formularios
    const formLogin = document.getElementById('login-form');
    if (formLogin) {
        formLogin.addEventListener('submit', iniciarSesion);
    }
    
    const formRegistro = document.getElementById('register-form');
    if (formRegistro) {
        formRegistro.addEventListener('submit', registrar);
    }
    
    const formCotizacion = document.getElementById('quote-form');
    if (formCotizacion) {
        formCotizacion.addEventListener('submit', enviarCotizacion);
    }
    
    // Botones de productos
    document.querySelectorAll('.add-to-cart').forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
    
    // Botón de checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', procesarCompra);
    }
    
    // Panel admin
    const adminClose = document.getElementById('admin-close');
    if (adminClose) {
        adminClose.addEventListener('click', cerrarPanelAdmin);
    }
    
    const adminOverlay = document.getElementById('admin-overlay');
    if (adminOverlay) {
        adminOverlay.addEventListener('click', cerrarPanelAdmin);
    }
    
    // Tabs del panel admin
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            cambiarTabAdmin(tabId);
        });
    });
    
    // Botón agregar producto
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', mostrarFormularioProducto);
    }
    
    // Botón cancelar formulario producto
    const cancelProductBtn = document.getElementById('cancel-product-form');
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', ocultarFormularioProducto);
    }
    
    // Formulario producto
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', guardarProducto);
    }
    
    // Responsive menu
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const nav = document.querySelector('.nav');
            if (nav) {
                nav.classList.toggle('active');
                this.classList.toggle('active');
            }
        });
    }
    
    // Cerrar menú al hacer click en enlaces
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', function() {
            const nav = document.querySelector('.nav');
            const hamburger = document.getElementById('hamburger');
            
            if (nav && window.innerWidth <= 768) {
                nav.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });
    
    // Cerrar carrito al hacer click fuera
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                cerrarCarrito();
            }
        });
    }
    
    // Manejar resize para menú responsive
    window.addEventListener('resize', function() {
        const nav = document.querySelector('.nav');
        const hamburger = document.getElementById('hamburger');
        
        if (window.innerWidth > 768 && nav) {
            nav.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    });
}

// ====================
// FUNCIONES AUXILIARES
// ====================

function mostrarMensaje(texto, tipo = 'success') {
    // Eliminar notificaciones anteriores
    document.querySelectorAll('.notification').forEach(notif => {
        if (notif.parentNode) notif.parentNode.removeChild(notif);
    });
    
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    const mensaje = document.createElement('div');
    mensaje.className = `notification notification--${tipo}`;
    mensaje.innerHTML = `
        <i class="fas ${iconos[tipo]}"></i>
        <span>${texto}</span>
    `;
    
    document.body.appendChild(mensaje);
    
    // Mostrar con animación
    setTimeout(() => {
        mensaje.classList.add('show');
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        mensaje.classList.remove('show');
        setTimeout(() => {
            if (mensaje.parentNode) {
                document.body.removeChild(mensaje);
            }
        }, 300);
    }, 3000);
}

function cambiarTabAdmin(tabId) {
    // Remover clase active de todas las tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover clase active de todos los contenidos
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Agregar active a la tab seleccionada
    const tabSeleccionada = document.querySelector(`.admin-tab[data-tab="${tabId}"]`);
    if (tabSeleccionada) {
        tabSeleccionada.classList.add('active');
    }
    
    // Mostrar contenido correspondiente
    const contenidoTab = document.getElementById(`${tabId}-tab`);
    if (contenidoTab) {
        contenidoTab.classList.add('active');
    }
}

function mostrarFormularioProducto() {
    const formContainer = document.getElementById('product-form-container');
    const grid = document.getElementById('products-grid-admin');
    
    if (formContainer) formContainer.style.display = 'block';
    if (grid) grid.style.display = 'none';
}

function ocultarFormularioProducto() {
    const formContainer = document.getElementById('product-form-container');
    const grid = document.getElementById('products-grid-admin');
    const form = document.getElementById('product-form');
    
    if (formContainer) formContainer.style.display = 'none';
    if (grid) grid.style.display = 'grid';
    if (form) form.reset();
}

function guardarProducto(evento) {
    evento.preventDefault();
    
    const nombre = document.getElementById('product-name').value;
    const precio = parseInt(document.getElementById('product-price').value);
    const categoria = document.getElementById('product-category').value;
    const stock = parseInt(document.getElementById('product-stock').value);
    const descripcion = document.getElementById('product-description').value;
    const imagen = document.getElementById('product-image').value;
    
    if (!nombre || !precio || !categoria) {
        mostrarMensaje('Por favor, completa los campos obligatorios', 'error');
        return;
    }
    
    const productos = JSON.parse(localStorage.getItem('fis-productos') || '[]');
    const nuevoProducto = {
        id: productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1,
        nombre: nombre,
        precio: precio,
        categoria: categoria,
        stock: stock || 0,
        descripcion: descripcion || '',
        imagen: imagen || 'https://via.placeholder.com/300x200?text=Producto'
    };
    
    productos.push(nuevoProducto);
    localStorage.setItem('fis-productos', JSON.stringify(productos));
    
    mostrarMensaje('Producto guardado exitosamente', 'success');
    ocultarFormularioProducto();
    cargarProductosAdmin();
    cargarEstadisticas();
}

// ====================
// ESTILOS DINÁMICOS
// ====================

function crearEstilosDinamicos() {
    const estilos = `
        <style>
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                transform: translateX(120%);
                transition: transform 0.3s ease;
                max-width: 400px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification--success {
                background: #28a745;
            }
            
            .notification--error {
                background: #c2180c;
            }
            
            .notification--info {
                background: #1a3a5f;
            }
            
            .badge {
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: bold;
                display: inline-block;
            }
            
            .badge-completado {
                background: #28a745;
                color: white;
            }
            
            .badge-admin {
                background: #e45706;
                color: white;
            }
            
            .badge-cliente {
                background: #1a3a5f;
                color: white;
            }
            
            .product-card-admin {
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
                transition: transform 0.3s;
            }
            
            .product-card-admin:hover {
                transform: translateY(-5px);
            }
            
            .product-card__image-admin img {
                width: 100px;
                height: 100px;
                object-fit: contain;
                margin-bottom: 10px;
            }
            
            .product-actions-admin {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-top: 15px;
            }
            
            .btn-edit {
                background: #1a3a5f;
                color: white;
            }
            
            .btn-delete {
                background: #c2180c;
                color: white;
            }
            
            .quotation-card {
                background: white;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 15px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            
            .quotation-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            
            .simple-payment-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 3000;
                display: none;
                justify-content: center;
                align-items: center;
            }
            
            .simple-payment-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
            }
            
            .simple-payment-content {
                position: relative;
                background: white;
                border-radius: 15px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                z-index: 3001;
            }
            
            .payment-method-option {
                padding: 15px;
                border: 2px solid #ddd;
                border-radius: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .payment-method-option:hover {
                border-color: #e45706;
            }
            
            .payment-method-option.selected {
                border-color: #e45706;
                background: rgba(228, 87, 6, 0.1);
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', estilos);
}

// ====================
// FUNCIONES GLOBALES (para onclick)
// ====================

// Hacer funciones disponibles globalmente
window.agregarAlCarrito = agregarAlCarrito;
window.cambiarCantidad = cambiarCantidad;
window.eliminarProducto = eliminarProducto;
window.vaciarCarrito = vaciarCarrito;
window.abrirCarrito = abrirCarrito;
window.cerrarCarrito = cerrarCarrito;
window.procesarCompra = procesarCompra;
window.cerrarModalPago = cerrarModalPago;
window.seleccionarMetodoPago = seleccionarMetodoPago;
window.finalizarCompra = finalizarCompra;
window.mostrarPanelAdmin = mostrarPanelAdmin;
window.cerrarPanelAdmin = cerrarPanelAdmin;
window.cerrarSesion = cerrarSesion;

console.log("✅ JavaScript de FIS completamente cargado y listo");