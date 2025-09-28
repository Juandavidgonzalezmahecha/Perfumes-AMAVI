// Script base para Perfumes-AMAVI
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌸 Perfumes-AMAVI está funcionando 🚀");

  // Contenedor principal donde se cargan las vistas
  const app = document.getElementById("app");

  // --- Router SPA ---
  async function loadView(view) {
    try {
      const res = await fetch(`./views/${view}.html`);
      if (!res.ok) throw new Error("Vista no encontrada: " + view);
      const html = await res.text();
      app.innerHTML = html;

      // Inicializar eventos de esa vista
      initEvents(view);
    } catch (error) {
      console.error("Error cargando la vista:", error);
      app.innerHTML = `<p class="center">⚠️ No se pudo cargar <strong>${view}</strong>.</p>`;
    }
  }

  // --- Router principal ---
  function router() {
    const hash = window.location.hash.replace("#", "") || "login";
    loadView(hash);
  }

  // Escuchar cambios en hash y cargar vista inicial
  window.addEventListener("hashchange", router);
  window.addEventListener("load", router);

  // --- Inicializar eventos por vista ---
  function initEvents(view) {
    if (view === "login") {
      const form = document.querySelector(".login-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const email = form.querySelector('input[type="email"]').value;
          const pass = form.querySelector('input[type="password"]').value;

          if (email && pass) {
            alert("Inicio de sesión exitoso ✅ Bienvenido " + email);
            // Cuando tengas el Home listo, lo rediriges así:
            // window.location.hash = "home";
          } else {
            alert("Por favor completa todos los campos ❌");
          }
        });
      }
    }
  }
});


