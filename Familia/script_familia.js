document.addEventListener("DOMContentLoaded", () => {
  // ================= NAVBAR =================
  fetch("../Navegacao/Navbar/navbar.html")
    .then((resposta) => resposta.text())
    .then((html) => {
      const areaNavbar = document.getElementById("area-navbar");
      if (areaNavbar) {
        areaNavbar.innerHTML = html;
      } else {
        console.warn('Elemento com id "area-navbar" não encontrado na página.');
      }
    })
    .catch((erro) => {
      console.error("Erro ao carregar o navbar:", erro);
    });

  // ================= FOOTER =================
  fetch("../Navegacao/Footer/footer.html")
    .then((resposta) => resposta.text())
    .then((html) => {
      const areaFooter = document.getElementById("area-footer");
      if (areaFooter) {
        areaFooter.innerHTML = html;
      } else {
        console.warn('Elemento com id "area-footer" não encontrado na página.');
      }
    })
    .catch((erro) => {
      console.error("Erro ao carregar o footer:", erro);
    });

  // ================= ANIMAÇÕES DE ENTRADA =================
  const elementosAnimados = document.querySelectorAll(".familia-animado");

  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(
      (entradas, obs) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            const el = entrada.target;
            el.classList.add("familia-visivel");
            obs.unobserve(el);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    elementosAnimados.forEach((el) => {
      observador.observe(el);
    });
  } else {
    // fallback – se o navegador não tiver IntersectionObserver
    elementosAnimados.forEach((el) => {
      el.classList.add("familia-visivel");
    });
  }

  // ================= SCROLL SUAVE PARA ÂNCORAS =================
  const linksInternos = document.querySelectorAll('a[href^="#"]');

  linksInternos.forEach((link) => {
    link.addEventListener("click", (evento) => {
      const destinoId = link.getAttribute("href");
      const destinoElemento = document.querySelector(destinoId);

      if (destinoId !== "#" && destinoElemento) {
        evento.preventDefault();

        const topo =
          destinoElemento.getBoundingClientRect().top +
          window.scrollY -
          80; // ajuste da altura aproximada da navbar

        window.scrollTo({
          top: topo,
          behavior: "smooth",
        });
      }
    });
  });
});
