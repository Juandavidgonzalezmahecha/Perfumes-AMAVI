// Script base para Perfumes-AMAVI

// Cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌸 Perfumes-AMAVI está funcionando 🚀");

  // Ejemplo: mostrar alerta cuando se haga clic en una imagen
  const perfumeImg = document.querySelector("img");
  if (perfumeImg) {
    perfumeImg.addEventListener("click", () => {
      alert("Has hecho clic en un perfume 🌸");
    });
  }
});
