// Script base para Perfumes-AMAVI
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌸 Perfumes-AMAVI está funcionando 🚀");

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

      // Aplicar medidas exactas de Figma
      applyPixelPerfect(view);
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

  window.addEventListener("hashchange", router);
  window.addEventListener("load", router);

  // --- Inicializar eventos ---
  function initEvents(view) {
    if (view === "login") {
      const form = document.querySelector(".login-form");
      if (!form) return;

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = form.querySelector("#email").value.trim();
        const pass = form.querySelector("#password").value.trim();

        if (!email || !pass) {
          alert("Por favor completa todos los campos ❌");
          return;
        }

        alert("Inicio de sesión exitoso ✅ Bienvenido " + email);
        // Redirigir a home cuando esté listo:
        // window.location.hash = "home";
      });
    }
  }

  // --- Aplicar estilos/medidas del diseño Figma ---
  function applyPixelPerfect(view) {
    if (view === "login") {
      // Título
      const title = document.querySelector(".auth-title");
      if (title) {
        title.style.fontSize = "28px";
        title.style.lineHeight = "34px";
        title.style.fontWeight = "700";
        title.style.letterSpacing = "0px";
      }

      // Inputs
      const inputs = document.querySelectorAll(".input");
      inputs.forEach(input => {
        input.style.height = "48px";
        input.style.borderRadius = "10px";
        input.style.fontSize = "15px";
        input.style.padding = "12px 14px";
      });

      // Botón principal
      const btn = document.querySelector(".auth-btn");
      if (btn) {
        btn.style.height = "44px";
        btn.style.borderRadius = "12px";
        btn.style.fontSize = "15px";
        btn.style.fontWeight = "600";
      }

      // Subtítulo
      const sub = document.querySelector(".muted");
      if (sub) {
        sub.style.fontSize = "15px";
        sub.style.lineHeight = "22px";
        sub.style.color = "#7b7b7b";
      }
    }
  }
});
