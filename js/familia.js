document.addEventListener("DOMContentLoaded", () => {
  // Ativa o modo de animação controlado por CSS
  document.body.classList.add("js-ativo");

  const elementosAnimados = Array.from(
    document.querySelectorAll(".familia-animado")
  );

  if (elementosAnimados.length) {
    // Atraso em cascata (aceita data-atraso)
    elementosAnimados.forEach((el, i) => {
      const atrasoAttr = el.getAttribute("data-atraso");
      const atraso = atrasoAttr !== null ? Number(atrasoAttr) : NaN;

      el.style.transitionDelay = Number.isFinite(atraso)
        ? `${atraso}s`
        : `${(i * 0.08).toFixed(2)}s`;
    });

    const revelar = (el) => el.classList.add("familia-visivel");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entradas, obs) => {
          entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            revelar(entrada.target);
            obs.unobserve(entrada.target);
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );

      elementosAnimados.forEach((el) => observer.observe(el));
    } else {
      elementosAnimados.forEach(revelar);
    }
  }

  const linksInternos = document.querySelectorAll('a[href^="#"]');

  linksInternos.forEach((link) => {
    link.addEventListener("click", (evento) => {
      const destinoId = link.getAttribute("href");
      if (!destinoId || destinoId === "#") return;

      const destinoElemento = document.querySelector(destinoId);
      if (!destinoElemento) return;

      evento.preventDefault();

      const topo =
        destinoElemento.getBoundingClientRect().top + window.scrollY - 80;

      window.scrollTo({ top: topo, behavior: "smooth" });
    });
  });


  const botaoIniciar = document.querySelector(".botao-iniciar-cadastro-familia");
  const secaoCadastro = document.getElementById("cadastro-familia");

  if (botaoIniciar && secaoCadastro) {
    botaoIniciar.addEventListener("click", (evento) => {
      // Se estiver como href="#" no HTML
      evento.preventDefault();

      const topo =
        secaoCadastro.getBoundingClientRect().top + window.scrollY - 80;

      window.scrollTo({ top: topo, behavior: "smooth" });
    });
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
