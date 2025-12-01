// script_sobre.js
document.addEventListener("DOMContentLoaded", function () {
  // Carrega NAVBAR
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

  // Carrega FOOTER
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

  // Animação de entrada suave nos blocos da página Sobre
  const elementosAnimados = document.querySelectorAll(
    ".conteiner-banner-sobre, .cartao-mvv, .etapa-linha-tempo, .cartao-pilar-sobre, .card-membro-sobre, .conteiner-ods-sobre"
  );

  if (elementosAnimados.length) {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            observador.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    elementosAnimados.forEach((el) => observador.observe(el));
  }

  // Scroll suave para âncoras internas (#alguma-coisa)
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
          80;

        window.scrollTo({
          top: topo,
          behavior: "smooth",
        });
      }
    });
  });
});
