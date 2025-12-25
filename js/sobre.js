document.addEventListener("DOMContentLoaded", () => {
  const elementosAnimados = document.querySelectorAll(
    ".conteiner-banner-sobre, .cartao-mvv, .etapa-linha-tempo, .cartao-pilar-sobre, .card-membro-sobre, .conteiner-ods-sobre"
  );

  if ("IntersectionObserver" in window && elementosAnimados.length) {
    const observador = new IntersectionObserver(
      (entradas, observer) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            observer.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elementosAnimados.forEach((el) => observador.observe(el));
  } else {
    elementosAnimados.forEach((el) => el.classList.add("visivel"));
  }
});


























document.addEventListener("DOMContentLoaded", () => {
  const botaoMenu = document.querySelector(".botao-menu");
  const menu = document.querySelector(".menu");

  if (!botaoMenu || !menu) return;

  botaoMenu.addEventListener("click", () => {
    const ativo = menu.classList.toggle("ativo");
    botaoMenu.setAttribute("aria-expanded", ativo ? "true" : "false");
  });

  // Fecha ao clicar em um item
  menu.querySelectorAll(".item-menu").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("ativo");
      botaoMenu.setAttribute("aria-expanded", "false");
    });
  });
});
