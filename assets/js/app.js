// Script base para Perfumes-AMAVI
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌸 Perfumes-AMAVI está funcionando 🚀");

  const app = document.getElementById("app");

  // --- Función para cargar vistas dinámicamente ---
  async function loadView(view) {
    try {
      let path = "";

      if (view === "login" || view === "register") {
        path = `./views/${view}.html`;
      } else if (view === "home") {
        path = `./views/pagina_principal/home.html`;
      } else {
        throw new Error("Vista desconocida: " + view);
      }

      const res = await fetch(path);
      if (!res.ok) throw new Error("Vista no encontrada: " + view);

      const html = await res.text();
      app.innerHTML = html;

      initEvents(view);
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

  // --- Inicializar eventos según la vista ---
  function initEvents(view) {

    // --- LOGIN ---
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
        window.location.hash = "home"; // redirige a home
      });

      // enlace para ir a registro
      const goRegister = document.querySelector("#go-register");
      if (goRegister) {
        goRegister.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.hash = "register";
        });
      }
    }

    // --- REGISTER ---
    if (view === "register") {
      const form = document.querySelector("form");
      if (!form) return;

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = form.querySelector("#name").value.trim();
        const email = form.querySelector("#email").value.trim();
        const pass = form.querySelector("#password").value.trim();
        const confirm = form.querySelector("#password-confirm").value.trim();

        if (!name || !email || !pass || !confirm) {
          alert("Completa todos los campos para registrarte ❌");
          return;
        }

        if (pass !== confirm) {
          alert("Las contraseñas no coinciden ⚠️");
          return;
        }

        alert("Registro exitoso 🎉 Ahora puedes iniciar sesión");
        window.location.hash = "login";
      });

      // enlace para volver al login
      const goLogin = document.querySelector("#go-login");
      if (goLogin) {
        goLogin.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.hash = "login";
        });
      }
    }

    // --- HOME ---
    if (view === "home") {
      console.log("🏠 Página principal cargada correctamente");

      // Cerrar sesión
      const logoutBtn = document.querySelector("#logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          alert("Sesión cerrada 👋");
          window.location.hash = "login";
        });
      }

      // Menú hamburguesa
      const burger = document.querySelector(".burger");
      const nav = document.querySelector(".home-nav");

      if (burger && nav) {
        burger.addEventListener("click", () => {
          nav.classList.toggle("active");
          burger.classList.toggle("open");
        });

        const navLinks = nav.querySelectorAll("a");
        navLinks.forEach(link => {
          link.addEventListener("click", () => {
            nav.classList.remove("active");
            burger.classList.remove("open");
          });
        });
      }
    }
  }
});




