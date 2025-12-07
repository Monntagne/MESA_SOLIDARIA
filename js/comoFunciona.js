document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-ativo");

  const grupos = document.querySelectorAll("[data-animar-grupo]");

  const prepararAtrasos = (container) => {
    const itens = container.querySelectorAll(".animar-entrada");
    itens.forEach((el, i) => {
      el.style.transitionDelay = `${(i * 0.08).toFixed(2)}s`;
    });
    return itens;
  };

  const elementos = [];
  grupos.forEach((grupo) => {
    elementos.push(...prepararAtrasos(grupo));
  });

  if (!elementos.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entradas, obs) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("visivel");
          obs.unobserve(entrada.target);
        });
      },
      { threshold: 0.22, rootMargin: "0px 0px -10% 0px" }
    );

    elementos.forEach((el) => observer.observe(el));
  } else {
    elementos.forEach((el) => el.classList.add("visivel"));
  }
});
