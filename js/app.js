// Configuración para animaciones al hacer scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

// Función para reiniciar animaciones en la sección activa
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.active .animate-on-scroll');
    animatedElements.forEach(el => {
        el.classList.remove('show'); 
        setTimeout(() => { observer.observe(el); }, 50); 
    });
}

// Navegación fluida entre pestañas
function cambiarSeccion(secId, btnElement) {
    document.querySelectorAll('.tab-section').forEach(sec => {
        sec.classList.remove('active');
        sec.style.opacity = '0'; // Efecto fade out
    });
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    
    // Controlar visibilidad del header arriba.png
    const header = document.getElementById('main-header');
    if (secId === 'sec-menu') {
        header.style.display = 'none';
    } else {
        header.style.display = 'block';
    }

    const currentSec = document.getElementById(secId);
    currentSec.classList.add('active');
    setTimeout(() => { currentSec.style.opacity = '1'; }, 50); // Efecto fade in
    
    btnElement.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Disparar animaciones
    initScrollAnimations();
}

// Botón de copiar confirmación visual
function copiarDato(elementId, btn) {
    var texto = document.getElementById(elementId).innerText.replace(/\s+/g, '');
    navigator.clipboard.writeText(texto).then(() => {
        var originalText = btn.innerText;
        btn.innerText = 'Copiado ✓';
        btn.style.backgroundColor = '#10b981'; // Verde sutil
        btn.style.color = '#fff';
        
        setTimeout(() => { 
            btn.innerText = originalText; 
            btn.style.backgroundColor = 'rgba(15, 46, 83, 0.08)';
            btn.style.color = 'var(--brand-blue)';
        }, 2000);
    });
}

// Asegurarse de que el header esté oculto al iniciar si estamos en menú
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('main-header').style.display = 'none';
    initScrollAnimations();
});