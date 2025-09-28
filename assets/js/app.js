// Script base para Perfumes-AMAVI
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌸 Perfumes-AMAVI está funcionando 🚀");

  // Contenedor principal donde se cargan las vistas
  const app = document.getElementById("app");

  // --- Router SPA ---
  async function loadView(view) {
    try {
      const res = await fetch(`./views/${view}.html`);
      const html = await res.text();
      document.getElementById("app").innerHTML = html;

      // Inicializar eventos específicos después de cargar la vista
      initEvents(view);
    } catch (error) {
      console.error("Error cargando la vista:", error);
      app.innerHTML = `<p>Error cargando la vista <strong>${view}</strong>.</p>`;
    }
  }

  // --- Manejo de rutas ---
  function router() {
    const hash = window.location.hash.replace("#", "") || "login";
    loadView(hash);
  }

  // Escuchar cambios en el hash de la URL
  window.addEventListener("hashchange", router);
  window.addEventListener("load", router);

  // --- Eventos personalizados por vista ---
  function initEvents(view) {
    if (view === "home") {
      // Ejemplo de evento en Home
      const perfumeImg = document.querySelector("img");
      if (perfumeImg) {
        perfumeImg.addEventListener("click", () => {
          alert("Has hecho clic en un perfume 🌸");
        });
      }
    }

    if (view === "login") {
      // Ejemplo de evento en Login
      const form = document.querySelector(".login-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          alert("Inicio de sesión exitoso ✅");
          window.location.hash = "home"; // Redirige a Home después del login
        });
      }
    }
  }
});

