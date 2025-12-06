document.addEventListener("DOMContentLoaded", function () {
  carregarFragmento("../Navegacao/Navbar/navbar.html", "area-navbar");
  carregarFragmento("../Navegacao/Footer/footer.html", "area-footer");

  const elementosAnimados = document.querySelectorAll(
    ".cartao-motivo-empresa, .cartao-passo-empresa, .cartao-beneficio-empresa"
  );

  if (elementosAnimados.length && "IntersectionObserver" in window) {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elementosAnimados.forEach((el) => observador.observe(el));
  } else {
    elementosAnimados.forEach((el) => el.classList.add("visivel"));
  }

  const linksInternos = document.querySelectorAll('a[href^="#"]');

  linksInternos.forEach((link) => {
    link.addEventListener("click", (evento) => {
      const destinoId = link.getAttribute("href");
      const destinoElemento = document.querySelector(destinoId);

      if (destinoId !== "#" && destinoElemento) {
        evento.preventDefault();

        const topo =
          destinoElemento.getBoundingClientRect().top + window.scrollY - 80;

        window.scrollTo({
          top: topo,
          behavior: "smooth",
        });
      }
    });
  });
});

function carregarFragmento(url, idAlvo) {
  fetch(url)
    .then((resposta) => resposta.text())
    .then((html) => {
      const area = document.getElementById(idAlvo);
      if (area) area.innerHTML = html;
    })
    .catch((erro) => {
      console.error("Erro ao carregar fragmento:", url, erro);
    });
}
