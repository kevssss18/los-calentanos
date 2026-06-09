let fotoBase64 = null;

// Manejo de la foto
document.getElementById('input-foto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('foto-status').innerText = 'Imagen lista (' + file.name + ')';
        document.getElementById('foto-status').style.color = 'var(--sunset-gold)';
        
        const reader = new FileReader();
        reader.onload = function(event) {
            fotoBase64 = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function guardarResena() {
    const texto = document.getElementById('input-comentario').value;
    
    if(texto.trim() === '') {
        alert("Por favor, escribe un comentario antes de publicar.");
        return;
    }

    const nuevaResena = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
        texto: texto,
        imagen: fotoBase64
    };

    let dbCalentanos = JSON.parse(localStorage.getItem('bd_resenas')) || [];
    dbCalentanos.unshift(nuevaResena);
    localStorage.setItem('bd_resenas', JSON.stringify(dbCalentanos));

    // Resetear formulario
    document.getElementById('input-comentario').value = '';
    document.getElementById('foto-status').innerText = 'Ninguna imagen seleccionada';
    document.getElementById('foto-status').style.color = 'var(--text-muted)';
    fotoBase64 = null;

    cargarResenas();
}

function cargarResenas() {
    const feed = document.getElementById('feed-resenas');
    feed.innerHTML = ''; 
    
    let dbCalentanos = JSON.parse(localStorage.getItem('bd_resenas')) || [];

    if(dbCalentanos.length === 0) {
        feed.innerHTML = '<p style="color:var(--text-muted); text-align:center; font-size:13px; font-weight: 300;">Aún no hay reseñas. Sé el primero en dejar tu opinión.</p>';
        return;
    }

    dbCalentanos.forEach((resena, index) => {
        let imgHtml = resena.imagen ? `<img src="${resena.imagen}" class="review-img">` : '';
        // Agregar la clase de animación para que los comentarios también aparezcan suavemente
        let delay = index * 0.1; // Efecto cascada
        
        feed.innerHTML += `
            <div class="review-card animate-on-scroll" style="animation-delay: ${delay}s">
                <div class="review-header">
                    <span>Anónimo</span>
                    <span>${resena.fecha}</span>
                </div>
                <div class="review-text">${resena.texto}</div>
                ${imgHtml}
            </div>
        `;
    });
    
    // Re-observar los nuevos elementos del feed
    if (typeof initScrollAnimations === "function") {
        initScrollAnimations();
    }
}

document.addEventListener('DOMContentLoaded', cargarResenas);