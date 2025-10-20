// Script base para Perfumes-AMAVI
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌸 Perfumes-AMAVI está funcionando 🚀");

  const app = document.getElementById("app");

  // --- Función para cargar vistas dinámicamente ---
  async function loadView(view) {
    try {
      // Ajustamos la ruta según el tipo de vista
      let path = "";

      if (view === "login" || view === "register") {
        path = `./views/${view}.html`;
      } else if (view === "home") {
        // home está dentro de views/pagina-principal/
        path = `./views/pagina-principal/home.html`;
      } else {
        throw new Error("Vista desconocida: " + view);
      }

      const res = await fetch(path);
      if (!res.ok) throw new Error("Vista no encontrada: " + view);

      const html = await res.text();
      app.innerHTML = html;

      // Inicializar eventos de la vista cargada
      initEvents(view);

      // Aplicar estilos específicos si los hay
      applyPixelPerfect(view);
    } catch (error) {
      console.error("❌ Error cargando la vista:", error);
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

  // --- Inicializar eventos de cada vista ---
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

        // Redirigir a la página principal (home)
        window.location.hash = "home";
      });

      // Evento para ir a registro
      const goRegister = document.querySelector("#go-register");
      if (goRegister) {
        goRegister.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.hash = "register";
        });
      }
    }

    if (view === "register") {
      const form = document.querySelector(".register-form");
      if (!form) return;

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = form.querySelector("#name").value.trim();
        const email = form.querySelector("#email").value.trim();
        const pass = form.querySelector("#password").value.trim();

        if (!name || !email || !pass) {
          alert("Completa todos los campos para registrarte ❌");
          return;
        }

        alert("Registro exitoso 🎉 Ahora puedes iniciar sesión");
        window.location.hash = "login";
      });
    }

    if (view === "home") {
      console.log("🏠 Página principal cargada correctamente");

      // Aquí puedes agregar botones, eventos, sliders, etc.
      const logoutBtn = document.querySelector("#logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          alert("Sesión cerrada 👋");
          window.location.hash = "login";
        });
      }
    }
  }

  // --- Ajustes visuales tipo Figma (opcionales) ---
  function applyPixelPerfect(view) {
    if (view === "login") {
      const title = document.querySelector(".auth-title");
      if (title) {
        title.style.fontSize = "28px";
        title.style.lineHeight = "34px";
        title.style.fontWeight = "700";
      }

      const inputs = document.querySelectorAll(".input");
      inputs.forEach((input) => {
        input.style.height = "48px";
        input.style.borderRadius = "10px";
        input.style.fontSize = "15px";
        input.style.padding = "12px 14px";
      });

      const btn = document.querySelector(".auth-btn");
      if (btn) {
        btn.style.height = "44px";
        btn.style.borderRadius = "12px";
        btn.style.fontSize = "15px";
        btn.style.fontWeight = "600";
      }

      const sub = document.querySelector(".muted");
      if (sub) {
        sub.style.fontSize = "15px";
        sub.style.lineHeight = "22px";
        sub.style.color = "#7b7b7b";
      }
    }
  }
});

