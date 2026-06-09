// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB1JloEkokZ9pdQwQwuiImRwjfeVO5sFEs",
    authDomain: "los-calentanos.firebaseapp.com",
    projectId: "los-calentanos",
    storageBucket: "los-calentanos.firebasestorage.app",
    messagingSenderId: "734994765291",
    appId: "1:734994765291:web:18fd83bf0307e3bb23f5ae"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= RESEÑAS =================

let fotoBase64 = "";

const inputFoto = document.getElementById("input-foto");
const fotoStatus = document.getElementById("foto-status");

inputFoto.addEventListener("change", async function (e) {
    const file = e.target.files[0];

    if (!file) {
        fotoBase64 = "";
        fotoStatus.innerText = "Sin imagen";
        fotoStatus.style.color = "var(--text-muted)";
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Solo puedes subir imágenes.");
        inputFoto.value = "";
        fotoBase64 = "";
        fotoStatus.innerText = "Sin imagen";
        fotoStatus.style.color = "var(--text-muted)";
        return;
    }

    fotoStatus.innerText = "Procesando imagen...";
    fotoStatus.style.color = "var(--brand-orange)";

    try {
        fotoBase64 = await comprimirImagen(file, 800, 0.65);

        if (fotoBase64.length > 900000) {
            alert("La imagen sigue siendo muy pesada. Prueba con otra foto más ligera.");
            inputFoto.value = "";
            fotoBase64 = "";
            fotoStatus.innerText = "Sin imagen";
            fotoStatus.style.color = "var(--text-muted)";
            return;
        }

        fotoStatus.innerText = "Imagen lista";
        fotoStatus.style.color = "var(--brand-orange)";
    } catch (error) {
        console.error("Error al procesar imagen:", error);
        alert("No se pudo procesar la imagen.");
        inputFoto.value = "";
        fotoBase64 = "";
        fotoStatus.innerText = "Sin imagen";
        fotoStatus.style.color = "var(--text-muted)";
    }
});

async function guardarResena() {
    const inputComentario = document.getElementById("input-comentario");
    const texto = inputComentario.value.trim();

    if (texto === "") {
        alert("Por favor, escribe un comentario antes de publicar.");
        return;
    }

    const boton = document.querySelector("#sec-resenas .btn-primary");
    const textoOriginal = boton.innerText;

    try {
        boton.disabled = true;
        boton.innerText = "Publicando...";

        await addDoc(collection(db, "resenas"), {
            texto: texto,
            imagen: fotoBase64 || "",
            fechaCreacion: serverTimestamp()
        });

        inputComentario.value = "";
        inputFoto.value = "";
        fotoBase64 = "";

        fotoStatus.innerText = "Sin imagen";
        fotoStatus.style.color = "var(--text-muted)";

        boton.innerText = "Publicado ✓";

        setTimeout(() => {
            boton.innerText = textoOriginal;
            boton.disabled = false;
        }, 1200);

    } catch (error) {
        console.error("Error al guardar reseña:", error);
        alert("No se pudo publicar la reseña. Revisa las reglas de Firestore.");

        boton.innerText = textoOriginal;
        boton.disabled = false;
    }
}

function cargarResenas() {
    const feed = document.getElementById("feed-resenas");

    const consulta = query(
        collection(db, "resenas"),
        orderBy("fechaCreacion", "desc")
    );

    onSnapshot(consulta, (snapshot) => {
        feed.innerHTML = "";

        if (snapshot.empty) {
            feed.innerHTML = `
                <p style="color:var(--text-muted); text-align:center; font-size:13px; font-weight:300;">
                    Aún no hay reseñas. Sé el primero en dejar tu opinión.
                </p>
            `;
            return;
        }

        snapshot.forEach((doc, index) => {
            const resena = doc.data();

            let fechaTexto = "Fecha reciente";

            if (resena.fechaCreacion && resena.fechaCreacion.toDate) {
                fechaTexto = resena.fechaCreacion.toDate().toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });
            }

            const imgHtml = resena.imagen
                ? `<img src="${resena.imagen}" class="review-img" alt="Foto de reseña">`
                : "";

            const delay = index * 0.1;

            feed.innerHTML += `
                <div class="review-card animate-on-scroll" style="animation-delay:${delay}s">
                    <div class="review-header">
                        <span class="review-author">Anónimo</span>
                        <span class="review-date">${fechaTexto}</span>
                    </div>
                    <div class="review-text">${escapeHTML(resena.texto)}</div>
                    ${imgHtml}
                </div>
            `;
        });

        if (typeof initScrollAnimations === "function") {
            initScrollAnimations();
        }
    }, (error) => {
        console.error("Error cargando reseñas:", error);

        feed.innerHTML = `
            <p style="color:var(--text-muted); text-align:center; font-size:13px; font-weight:300;">
                No se pudieron cargar las reseñas.
            </p>
        `;
    });
}

function comprimirImagen(file, maxWidth, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();

            img.onload = function () {
                const canvas = document.createElement("canvas");

                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                const imagenComprimida = canvas.toDataURL("image/jpeg", quality);
                resolve(imagenComprimida);
            };

            img.onerror = reject;
            img.src = event.target.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function escapeHTML(texto) {
    return texto
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", cargarResenas);

window.guardarResena = guardarResena;