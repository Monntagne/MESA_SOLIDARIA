// script_inicio.js

document.addEventListener("DOMContentLoaded", function () {
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

  const conteudoBanner = document.querySelector(".conteudo-banner-inicial");
  if (conteudoBanner) {
    setTimeout(() => {
      conteudoBanner.classList.add("banner-visivel");
    }, 150);
  }

  const botaoDoar = document.getElementById("botao-doar-agora");

  function criarConfeteNoClique(x, y) {
    const quantidadeConfetes = 100;
    const cores = ["#FF7A00", "#FFD54F", "#2E8B57", "#00123B", "#FFFFFF"];

    for (let i = 0; i < quantidadeConfetes; i++) {
      const confete = document.createElement("span");
      confete.classList.add("confete");

      confete.style.left = `${x}px`;
      confete.style.top = `${y}px`;

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
    botaoDoar.addEventListener("click", (evento) => {
      console.log("Clique no botão DOAR!");

      evento.preventDefault();

      const cliqueX = evento.clientX + window.scrollX;
      const cliqueY = evento.clientY + window.scrollY;

      botaoDoar.classList.add("botao-clicado");

      setTimeout(() => {
        botaoDoar.classList.remove("botao-clicado");
      }, 300);

      criarConfeteNoClique(cliqueX, cliqueY);
    });
  } else {
    console.warn('Elemento com id "botao-doar-agora" não foi encontrado.');
  }

  const elementosAnimados = document.querySelectorAll(
    ".cartao-ajuda, .cartao-publico, .cartao-passo-funcionamento, .cartao-seguranca, .cartao-ods, .cartao-empresa"
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

  const cartoesAjuda = document.querySelectorAll(".cartao-ajuda");

  cartoesAjuda.forEach((cartao) => {
    const icone = cartao.querySelector(".icone-cartao");
    if (!icone) return;

    const estilosIcone = window.getComputedStyle(icone);
    const corIcone = estilosIcone.backgroundColor;

    const alturaOriginal = cartao.offsetHeight;
    cartao.style.height = `${alturaOriginal}px`;

    const estilosCartao = window.getComputedStyle(cartao);
    const corOriginal = estilosCartao.backgroundColor;
    cartao.dataset.corOriginal = corOriginal;

    cartao.addEventListener("click", () => {
      const estaVirado = cartao.classList.contains("virado");

      if (!estaVirado) {
        const sinal = Math.random() < 0.5 ? "" : "-";
        const angulo = 180;

        cartao.style.transform = `rotateY(${sinal}${angulo}deg)`;
        cartao.style.backgroundColor = corIcone;
        cartao.classList.add("virado");
      } else {
        cartao.style.transform = "rotateY(0deg)";
        cartao.style.backgroundColor = cartao.dataset.corOriginal || "";
        cartao.classList.remove("virado");
      }
    });
  });

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
