// script.js - Mostrar y ocultar secciones integradas

const SECCIONES = [
  'universo',
  'tierra',
  'movimiento',
  'cielo',
  'mision'
];

// Sistema de puntos y recompensas
let puntosUsuario = 0;
const NIVELES = [
  { nombre: 'Explorador Espacial', puntos: 0 },
  { nombre: 'Astrónomo Novato', puntos: 100 },
  { nombre: 'Viajero Estelar', puntos: 250 },
  { nombre: 'Maestro del Cosmos', puntos: 500 },
  { nombre: 'Guardián Galáctico', puntos: 1000 }
];

// Sistema de logros
const LOGROS = [
  { id: 'primer_viaje', nombre: 'Primer Viaje Espacial', descripcion: 'Completa tu primera sección', icono: '🚀', puntos: 100 },
  { id: 'curioso', nombre: 'Mente Curiosa', descripcion: 'Lee 5 tarjetas de conocimiento', icono: '🔍', puntos: 50 },
  { id: 'explorador', nombre: 'Explorador del Universo', descripcion: 'Visita todas las secciones', icono: '🌌', puntos: 200 },
  { id: 'astronomo', nombre: 'Astrónomo en Formación', descripcion: 'Completa el diario de observación', icono: '🔭', puntos: 150 },
  { id: 'artista', nombre: 'Artista Espacial', descripcion: 'Completa el dibujo del espacio', icono: '🎨', puntos: 100 }
];

let logrosDesbloqueados = new Set();

function mostrarSeccion(seccionId) {
  if (!SECCIONES.includes(seccionId)) return;
  // Oculta todas las secciones
  SECCIONES.forEach(id => {
    const sec = document.getElementById(id);
    if (sec) sec.style.display = 'none';
  });
  // Muestra la sección seleccionada
  const seleccionada = document.getElementById(seccionId);
  if (seleccionada) seleccionada.style.display = 'block';
  activarBoton(seccionId);
  actualizarBarraProgreso(seccionId);
  // Scroll suave al main
  const main = document.querySelector('main');
  if (main) main.scrollIntoView({ behavior: 'smooth' });
  verificarLogros();
}

function activarBoton(seccionId) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('activo'));
  const btn = document.getElementById(`btn-${seccionId}`);
  if (btn) btn.classList.add('activo');
}

function actualizarBarraProgreso(seccionId) {
  const idx = SECCIONES.indexOf(seccionId);
  const progreso = ((idx + 1) / SECCIONES.length) * 100;
  const barra = document.getElementById('progreso-bar');
  if (barra) barra.style.setProperty('--progreso', progreso + '%');
  // Actualiza los puntos
  SECCIONES.forEach((id, i) => {
    const punto = document.getElementById(`punto-${id}`);
    if (punto) punto.classList.toggle('activo', i === idx);
  });
}

function actualizarPuntos(puntosGanados) {
  puntosUsuario += puntosGanados;
  const nivelActual = obtenerNivelActual();
  actualizarInterfazPuntos(puntosUsuario, nivelActual);
  guardarProgreso();
}

function obtenerNivelActual() {
  return NIVELES.reduce((nivel, actual) => {
    return puntosUsuario >= actual.puntos ? actual : nivel;
  });
}

function actualizarInterfazPuntos(puntos, nivel) {
  const contenedorPuntos = document.getElementById('contenedor-puntos');
  if (contenedorPuntos) {
    contenedorPuntos.innerHTML = `
      <div class="puntos-info">
        <span class="puntos-valor">${puntos} puntos</span>
        <span class="nivel-actual">${nivel.nombre}</span>
      </div>
    `;
  }
}

function guardarProgreso() {
  localStorage.setItem('puntosUsuario', puntosUsuario);
}

function cargarProgreso() {
  const puntosGuardados = localStorage.getItem('puntosUsuario');
  if (puntosGuardados) {
    puntosUsuario = parseInt(puntosGuardados);
    const nivelActual = obtenerNivelActual();
    actualizarInterfazPuntos(puntosUsuario, nivelActual);
  }
}

function verificarLogros() {
  // Logro: Primer Viaje Espacial
  if (!logrosDesbloqueados.has('primer_viaje')) {
    const seccionesCompletadas = SECCIONES.filter(id => {
      const seccion = document.getElementById(id);
      return seccion && seccion.style.display === 'block';
    }).length;
    
    if (seccionesCompletadas >= 1) {
      desbloquearLogro('primer_viaje');
    }
  }

  // Logro: Mente Curiosa
  if (!logrosDesbloqueados.has('curioso')) {
    const tarjetasLeidas = document.querySelectorAll('.tarjeta-conocimiento.leida').length;
    if (tarjetasLeidas >= 5) {
      desbloquearLogro('curioso');
    }
  }

  // Logro: Explorador del Universo
  if (!logrosDesbloqueados.has('explorador')) {
    const todasSeccionesVisitadas = SECCIONES.every(id => {
      const seccion = document.getElementById(id);
      return seccion && seccion.style.display === 'block';
    });
    
    if (todasSeccionesVisitadas) {
      desbloquearLogro('explorador');
    }
  }
}

function desbloquearLogro(id) {
  const logro = LOGROS.find(l => l.id === id);
  if (logro && !logrosDesbloqueados.has(id)) {
    logrosDesbloqueados.add(id);
    actualizarPuntos(logro.puntos);
    mostrarNotificacionLogro(logro);
    guardarLogros();
    actualizarPanelLogros();
  }
}

function mostrarNotificacionLogro(logro) {
  const notificacion = document.createElement('div');
  notificacion.className = 'notificacion-logro';
  notificacion.innerHTML = `
    <div class="logro-contenido">
      <span class="logro-icono">${logro.icono}</span>
      <div class="logro-info">
        <h4>${logro.nombre}</h4>
        <p>${logro.descripcion}</p>
        <span class="logro-puntos">+${logro.puntos} puntos</span>
      </div>
    </div>
  `;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.classList.add('mostrar');
  }, 100);

  setTimeout(() => {
    notificacion.classList.remove('mostrar');
    setTimeout(() => notificacion.remove(), 500);
  }, 3000);
}

function guardarLogros() {
  localStorage.setItem('logrosDesbloqueados', JSON.stringify([...logrosDesbloqueados]));
}

function cargarLogros() {
  const logrosGuardados = localStorage.getItem('logrosDesbloqueados');
  if (logrosGuardados) {
    logrosDesbloqueados = new Set(JSON.parse(logrosGuardados));
  }
}

// Funcionalidad del panel de logros
function actualizarPanelLogros() {
  const listaLogros = document.querySelector('.lista-logros');
  if (listaLogros) {
    listaLogros.innerHTML = LOGROS.map(logro => `
      <div class="logro-item ${logrosDesbloqueados.has(logro.id) ? '' : 'bloqueado'}">
        <span class="icono">${logro.icono}</span>
        <div class="info">
          <h4 class="nombre">${logro.nombre}</h4>
          <p class="descripcion">${logro.descripcion}</p>
        </div>
        <span class="puntos">+${logro.puntos}</span>
      </div>
    `).join('');
  }
}

// Toggle del panel de logros
document.getElementById('btn-logros').addEventListener('click', () => {
  const panel = document.getElementById('panel-logros');
  panel.classList.toggle('activo');
  if (panel.classList.contains('activo')) {
    actualizarPanelLogros();
  }
});

// Cerrar panel al hacer click fuera
document.addEventListener('click', (e) => {
  const panel = document.getElementById('panel-logros');
  const btn = document.getElementById('btn-logros');
  if (!panel.contains(e.target) && !btn.contains(e.target)) {
    panel.classList.remove('activo');
  }
});

// Mostrar la sección por defecto al iniciar
window.addEventListener('DOMContentLoaded', () => {
  mostrarSeccion('universo');
  cargarProgreso();
  cargarLogros();
  
  // Puntos por completar secciones
  SECCIONES.forEach(seccionId => {
    const seccion = document.getElementById(seccionId);
    if (seccion) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            actualizarPuntos(50); // 50 puntos por descubrir una sección
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(seccion);
    }
  });

  // Puntos por interactuar con elementos
  document.querySelectorAll('.tarjeta-conocimiento').forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
      tarjeta.classList.add('leida');
      actualizarPuntos(10);
      verificarLogros();
    });
  });
});

// Funcionalidad del menú hamburguesa
const menuHamburguesa = document.querySelector('.menu-hamburguesa');
const navegacion = document.querySelector('.navegacion-principal');

menuHamburguesa.addEventListener('click', () => {
  menuHamburguesa.classList.toggle('activo');
  navegacion.classList.toggle('activo');
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    menuHamburguesa.classList.remove('activo');
    navegacion.classList.remove('activo');
  });
});

// Funcionalidad del botón volver arriba
const btnVolverArriba = document.querySelector('.btn-volver-arriba');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    btnVolverArriba.classList.add('visible');
  } else {
    btnVolverArriba.classList.remove('visible');
  }
});

btnVolverArriba.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Función para manejar el efecto de scroll reveal
function handleScrollReveal() {
  const elementos = document.querySelectorAll('.revelar');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  elementos.forEach(elemento => {
    observer.observe(elemento);
  });
}

// Función para manejar el cursor personalizado
function handleCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-personalizado';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

// Función para manejar las transiciones de página
function handlePageTransitions() {
  const botones = document.querySelectorAll('.btn-interactivo');
  
  botones.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const transicion = document.createElement('div');
      transicion.className = 'transicion-pagina';
      document.body.appendChild(transicion);
      
      setTimeout(() => {
        transicion.classList.add('entrada');
      }, 10);
      
      setTimeout(() => {
        transicion.classList.remove('entrada');
        transicion.classList.add('salida');
      }, 500);
      
      setTimeout(() => {
        transicion.remove();
      }, 1000);
    });
  });
}

// Función para manejar la carga inicial
function handleInitialLoad() {
  const elementos = document.querySelectorAll('.cargar-contenido');
  elementos.forEach((elemento, index) => {
    setTimeout(() => {
      elemento.style.opacity = '1';
      elemento.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Inicializar todas las funcionalidades cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  handleScrollReveal();
  handleCustomCursor();
  handlePageTransitions();
  handleInitialLoad();
});

// Funciones de accesibilidad
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggle-accesibilidad');
    const barraAccesibilidad = document.getElementById('barra-accesibilidad');

    // Asegurarse de que la barra esté visible inicialmente
    if (barraAccesibilidad) {
        barraAccesibilidad.style.display = 'block';
    }

    toggleBtn.addEventListener('click', function() {
        barraAccesibilidad.classList.toggle('activa');
    });

    // Cerrar la barra al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!barraAccesibilidad.contains(e.target)) {
            barraAccesibilidad.classList.remove('activa');
        }
    });
});

function cambiarTamanoFuente(accion) {
    const body = document.body;
    const tamanoActual = parseInt(window.getComputedStyle(body).fontSize);
    
    if (accion === 'aumentar' && tamanoActual < 24) {
        body.style.fontSize = (tamanoActual + 2) + 'px';
    } else if (accion === 'disminuir' && tamanoActual > 12) {
        body.style.fontSize = (tamanoActual - 2) + 'px';
    }
    
    // Guardar preferencia
    localStorage.setItem('tamanoFuente', body.style.fontSize);
}

function cambiarTipoFuente(tipo) {
    const body = document.body;
    
    // Remover clases anteriores
    body.classList.remove('fuente-dyslexic', 'fuente-alto-contraste');
    
    if (tipo === 'dyslexic') {
        body.classList.add('fuente-dyslexic');
    } else if (tipo === 'high-contrast') {
        body.classList.add('fuente-alto-contraste');
    }
    
    // Guardar preferencia
    localStorage.setItem('tipoFuente', tipo);
}

function cambiarContraste(tipo) {
    const body = document.body;
    
    if (tipo === 'alto') {
        body.classList.add('alto-contraste');
    } else {
        body.classList.remove('alto-contraste');
    }
    
    // Guardar preferencia
    localStorage.setItem('contraste', tipo);
}

// Cargar preferencias guardadas
function cargarPreferenciasAccesibilidad() {
    const tamanoFuente = localStorage.getItem('tamanoFuente');
    const tipoFuente = localStorage.getItem('tipoFuente');
    const contraste = localStorage.getItem('contraste');
    
    if (tamanoFuente) {
        document.body.style.fontSize = tamanoFuente;
    }
    
    if (tipoFuente) {
        cambiarTipoFuente(tipoFuente);
        document.getElementById('tipo-fuente').value = tipoFuente;
    }
    
    if (contraste) {
        cambiarContraste(contraste);
    }
}

// Cargar preferencias al iniciar
document.addEventListener('DOMContentLoaded', cargarPreferenciasAccesibilidad);

// Funciones para el modo TEA
function activarModoTEA() {
    const body = document.body;
    body.classList.add('modo-tea');
    
    // Aplicar cambios específicos para modo reducido
    aplicarCambiosTEA();
    
    // Guardar preferencia
    localStorage.setItem('modoTea', 'activo');
    
    // Mostrar notificación
    mostrarNotificacion('Modo Reducido activado', 'Se han aplicado ajustes para mejorar la experiencia de aprendizaje');
}

function desactivarModoTEA() {
    const body = document.body;
    body.classList.remove('modo-tea');
    
    // Restaurar cambios
    restaurarCambiosTEA();
    
    // Guardar preferencia
    localStorage.setItem('modoTea', 'inactivo');
    
    // Mostrar notificación
    mostrarNotificacion('Modo Reducido desactivado', 'Se han restaurado los ajustes originales');
}

function aplicarCambiosTEA() {
    // Reducir animaciones
    document.querySelectorAll('.flotar, .pulso, .brillo').forEach(elemento => {
        elemento.style.animationDuration = '4s';
    });
    
    // Aumentar espaciado
    document.querySelectorAll('p, h1, h2, h3').forEach(elemento => {
        elemento.style.marginBottom = '1.5em';
    });
    
    // Simplificar transiciones
    document.querySelectorAll('*').forEach(elemento => {
        elemento.style.transition = 'all 0.3s ease';
    });

    // Simplificar contenido de tarjetas
    document.querySelectorAll('.tarjeta-conocimiento').forEach(tarjeta => {
        const contenidoOriginal = tarjeta.getAttribute('data-contenido-original');
        if (!contenidoOriginal) {
            // Guardar contenido original si no existe
            tarjeta.setAttribute('data-contenido-original', tarjeta.innerHTML);
        }
        
        // Simplificar el contenido
        const parrafos = tarjeta.querySelectorAll('p');
        if (parrafos.length > 0) {
            // Mantener solo el primer párrafo y el dato curioso
            const primerParrafo = parrafos[0];
            const datoCurioso = tarjeta.querySelector('.dato-curioso');
            
            // Limpiar contenido
            tarjeta.innerHTML = '';
            
            // Restaurar icono y título
            const icono = tarjeta.querySelector('.icono-tarjeta');
            const titulo = tarjeta.querySelector('h3');
            if (icono) tarjeta.appendChild(icono.cloneNode(true));
            if (titulo) tarjeta.appendChild(titulo.cloneNode(true));
            
            // Añadir contenido simplificado
            tarjeta.appendChild(primerParrafo.cloneNode(true));
            if (datoCurioso) tarjeta.appendChild(datoCurioso.cloneNode(true));
        }
    });
}

function restaurarCambiosTEA() {
    // Restaurar animaciones
    document.querySelectorAll('.flotar, .pulso, .brillo').forEach(elemento => {
        elemento.style.animationDuration = '';
    });
    
    // Restaurar espaciado
    document.querySelectorAll('p, h1, h2, h3').forEach(elemento => {
        elemento.style.marginBottom = '';
    });
    
    // Restaurar transiciones
    document.querySelectorAll('*').forEach(elemento => {
        elemento.style.transition = '';
    });

    // Restaurar contenido original de tarjetas
    document.querySelectorAll('.tarjeta-conocimiento').forEach(tarjeta => {
        const contenidoOriginal = tarjeta.getAttribute('data-contenido-original');
        if (contenidoOriginal) {
            tarjeta.innerHTML = contenidoOriginal;
        }
    });
}

function mostrarNotificacion(titulo, mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-tea';
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <h4>${titulo}</h4>
            <p>${mensaje}</p>
        </div>
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 100);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => notificacion.remove(), 500);
    }, 3000);
}

// Cargar preferencias TEA al iniciar
function cargarPreferenciasTEA() {
    const modoTea = localStorage.getItem('modoTea');
    if (modoTea === 'activo') {
        activarModoTEA();
    }
}

// Añadir a la carga inicial
document.addEventListener('DOMContentLoaded', () => {
    cargarPreferenciasTEA();
    // ... resto del código existente ...
});

// Función para comenzar la aventura
function comenzarAventura() {
    // Ocultar la sección de bienvenida
    document.querySelector('.seccion-bienvenida').style.display = 'none';
    
    // Mostrar el header y la primera sección
    document.querySelector('header').classList.add('cargar-contenido');
    document.getElementById('universo').style.display = 'block';
    
    // Activar el primer punto en la barra de progreso
    document.getElementById('punto-universo').classList.add('activo');
    
    // Actualizar la barra de progreso
    document.documentElement.style.setProperty('--progreso', '20%');
    
    // Mostrar el botón de volver arriba
    document.querySelector('.btn-volver-arriba').classList.add('visible');
}

// Función para mostrar los logros
function mostrarLogros() {
    const panelLogros = document.getElementById('panel-logros');
    const logrosContenido = panelLogros.querySelector('.logros-contenido');
    
    // Alternar la visibilidad del panel de logros
    if (logrosContenido.style.display === 'block') {
        logrosContenido.style.display = 'none';
        panelLogros.classList.remove('activo');
    } else {
        logrosContenido.style.display = 'block';
        panelLogros.classList.add('activo');
        
        // Cargar los logros si no están cargados
        if (!logrosContenido.querySelector('.lista-logros').children.length) {
            cargarLogros();
        }
    }
}

// Función para cargar los logros
function cargarLogros() {
    const listaLogros = document.querySelector('.lista-logros');
    const logros = [
        {
            icono: '🌠',
            nombre: 'Explorador del Universo',
            descripcion: 'Completaste la sección del Universo',
            puntos: 100,
            desbloqueado: true
        },
        {
            icono: '🌍',
            nombre: 'Conocedor de la Tierra',
            descripcion: 'Completaste la sección de la Tierra',
            puntos: 100,
            desbloqueado: false
        },
        {
            icono: '🔄',
            nombre: 'Maestro del Movimiento',
            descripcion: 'Completaste la sección de Movimiento',
            puntos: 100,
            desbloqueado: false
        },
        {
            icono: '✨',
            nombre: 'Observador del Cielo',
            descripcion: 'Completaste la sección del Cielo',
            puntos: 100,
            desbloqueado: false
        },
        {
            icono: '📝',
            nombre: 'Misión Completada',
            descripcion: 'Completaste todas las misiones',
            puntos: 500,
            desbloqueado: false
        }
    ];

    // Limpiar la lista actual
    listaLogros.innerHTML = '';

    // Añadir cada logro a la lista
    logros.forEach(logro => {
        const logroElement = document.createElement('div');
        logroElement.className = `logro-item ${logro.desbloqueado ? '' : 'bloqueado'}`;
        logroElement.innerHTML = `
            <span class="icono">${logro.icono}</span>
            <div class="info">
                <h4 class="nombre">${logro.nombre}</h4>
                <p class="descripcion">${logro.descripcion}</p>
            </div>
            <span class="puntos">+${logro.puntos} puntos</span>
        `;
        listaLogros.appendChild(logroElement);
    });
} 