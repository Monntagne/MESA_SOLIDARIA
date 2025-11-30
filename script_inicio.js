// script_inicio.js

document.addEventListener("DOMContentLoaded", function () {
  // ================= NAVBAR =================
  fetch("Navegacao/Navbar/navbar.html")
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
  fetch("Navegacao/Footer/footer.html")
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

  // ================= CONFETE BOTÃO DOAR =================
  const botaoDoar = document.getElementById("botao-doar-agora");

  function criarConfeteNoBotao(botao) {
    const rect = botao.getBoundingClientRect();
    const centroX = rect.left + rect.width / 2 + window.scrollX;
    const centroY = rect.top + rect.height / 2 + window.scrollY;

    const quantidadeConfetes = 100;
    const cores = ["#FF7A00", "#FFD54F", "#2E8B57", "#00123B", "#FFFFFF"];

    for (let i = 0; i < quantidadeConfetes; i++) {
      const confete = document.createElement("span");
      confete.classList.add("confete");

      confete.style.left = `${centroX}px`;
      confete.style.top = `${centroY}px`;

      const deslocamentoX = (Math.random() - 0.5) * 200;
      const deslocamentoY = -(Math.random() * 200 + 80);

      confete.style.setProperty("--confete-x", `${deslocamentoX}px`);
      confete.style.setProperty("--confete-y", `${deslocamentoY}px`);

      const rotacao = (Math.random() - 0.5) * 360;
      confete.style.setProperty("--confete-rotacao", `${rotacao}deg`);

      const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
      confete.style.backgroundColor = corAleatoria;

      document.body.appendChild(confete);

      setTimeout(() => {
        confete.remove();
      }, 800);
    }
  }

  if (botaoDoar) {
    botaoDoar.addEventListener("click", () => {
      botaoDoar.classList.add("botao-clicado");

      setTimeout(() => {
        botaoDoar.classList.remove("botao-clicado");
      }, 300);

      criarConfeteNoBotao(botaoDoar);
    });
  }

  // ================= ANIMAÇÃO DOS CARDS =================
  const cartoesAjuda = document.querySelectorAll(".cartao-ajuda");

  if (cartoesAjuda.length) {
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

    cartoesAjuda.forEach((cartao) => observador.observe(cartao));
  }
});
