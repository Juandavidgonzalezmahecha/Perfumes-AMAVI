// assets/js/app.js
// Script base para Perfumes-AMAVI SPA
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
      const errorBox = document.getElementById("login-error");

      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const email = form.querySelector("#email").value.trim();
          const pass = form.querySelector("#password").value.trim();

          // Validación accesible
          if (!email || !pass) {
            errorBox.textContent = "Por favor completa todos los campos ❌";
            errorBox.hidden = false;
            errorBox.focus();
            return;
          }

          errorBox.hidden = true;

          // Simulación login
          alert("Inicio de sesión exitoso ✅ Bienvenido " + email);

          // Redirección futura al Home (cuando esté listo)
          // window.location.hash = "home";
        });
      }
    }

    if (view === "register") {
      const regForm = document.querySelector(".register-form");
      if (regForm) {
        regForm.addEventListener("submit", (e) => {
          e.preventDefault();
          alert("Registro enviado 🚀");
        });
      }
    }
  }
});
