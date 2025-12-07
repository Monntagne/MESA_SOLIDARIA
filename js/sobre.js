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
