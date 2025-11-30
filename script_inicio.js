// script_inicio.js

document.addEventListener("DOMContentLoaded", function () {
  /* =========================================================
     NAVBAR – CARREGA ARQUIVO EXTERNO
     ========================================================= */
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

  /* =========================================================
     FOOTER – CARREGA ARQUIVO EXTERNO
     ========================================================= */
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

  /* =========================================================
     ANIMAÇÃO DO BANNER INICIAL (FADE + SLIDE)
     ========================================================= */
  const conteudoBanner = document.querySelector(".conteudo-banner-inicial");
  if (conteudoBanner) {
    setTimeout(() => {
      conteudoBanner.classList.add("banner-visivel");
    }, 150);
  }

  /* =========================================================
     CONFETE NO BOTÃO "DOAR AGORA"
     - Cria vários spans .confete no ponto do clique
     - Usa variáveis CSS para direção e rotação
     ========================================================= */
  const botaoDoar = document.getElementById("botao-doar-agora");

  function criarConfeteNoClique(x, y) {
    const quantidadeConfetes = 100;
    const cores = ["#FF7A00", "#FFD54F", "#2E8B57", "#00123B", "#FFFFFF"];

    for (let i = 0; i < quantidadeConfetes; i++) {
      const confete = document.createElement("span");
      confete.classList.add("confete");

      // começa exatamente no ponto do clique
      confete.style.left = `${x}px`;
      confete.style.top = `${y}px`;

      // deslocamento aleatório em X e Y
      const deslocamentoX = (Math.random() - 0.5) * 200;
      const deslocamentoY = -(Math.random() * 200 + 80);

      confete.style.setProperty("--confete-x", `${deslocamentoX}px`);
      confete.style.setProperty("--confete-y", `${deslocamentoY}px`);

      // rotação aleatória
      const rotacao = (Math.random() - 0.5) * 360;
      confete.style.setProperty("--confete-rotacao", `${rotacao}deg`);

      // cor aleatória dentro do array
      const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
      confete.style.backgroundColor = corAleatoria;

      document.body.appendChild(confete);

      // remove o confete depois da animação
      setTimeout(() => {
        confete.remove();
      }, 800);
    }
  }

  if (botaoDoar) {
    botaoDoar.addEventListener("click", (evento) => {
      // log para debug (pode remover depois)
      console.log("Clique no botão DOAR!");

      // evita o comportamento padrão do link (scroll direto)
      evento.preventDefault();

      // posição exata do clique na página
      const cliqueX = evento.clientX + window.scrollX;
      const cliqueY = evento.clientY + window.scrollY;

      // efeito de clique visual no botão
      botaoDoar.classList.add("botao-clicado");

      setTimeout(() => {
        botaoDoar.classList.remove("botao-clicado");
      }, 300);

      // dispara os confetes no ponto do clique
      criarConfeteNoClique(cliqueX, cliqueY);
    });
  } else {
    console.warn('Elemento com id "botao-doar-agora" não foi encontrado.');
  }

  /* =========================================================
     ANIMAÇÃO DE ENTRADA DOS CARDS (IntersectionObserver)
     - Aplica .visivel quando o elemento entra na tela
     - Usado em vários tipos de cards
     ========================================================= */
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
        threshold: 0.2, // 20% visível já ativa a animação
      }
    );

    elementosAnimados.forEach((el) => observador.observe(el));
  }

  /* =========================================================
     FLIP DOS CARDS .cartao-ajuda (frente/verso)
     - Usa rotateY(180) ou -180
     - Verso usa cor do ícone como fundo
     ========================================================= */
  const cartoesAjuda = document.querySelectorAll(".cartao-ajuda");

  cartoesAjuda.forEach((cartao) => {
    const icone = cartao.querySelector(".icone-cartao");
    if (!icone) return;

    // pega a cor de fundo do círculo do ícone
    const estilosIcone = window.getComputedStyle(icone);
    const corIcone = estilosIcone.backgroundColor;

    // trava a altura do card (para não "pular" ao virar)
    const alturaOriginal = cartao.offsetHeight;
    cartao.style.height = `${alturaOriginal}px`;

    // guarda a cor original do card para voltar depois
    const estilosCartao = window.getComputedStyle(cartao);
    const corOriginal = estilosCartao.backgroundColor;
    cartao.dataset.corOriginal = corOriginal;

    cartao.addEventListener("click", () => {
      const estaVirado = cartao.classList.contains("virado");

      if (!estaVirado) {
        const sinal = Math.random() < 0.5 ? "" : "-"; // 180 ou -180
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

  /* =========================================================
     SCROLL SUAVE PARA LINKS INTERNOS (Âncoras com #)
     - Só funciona se o destino existir no HTML
     ========================================================= */
  const linksInternos = document.querySelectorAll('a[href^="#"]');

  linksInternos.forEach((link) => {
    link.addEventListener("click", (evento) => {
      const destinoId = link.getAttribute("href");
      const destinoElemento = document.querySelector(destinoId);

      // se for "#", deixa o comportamento padrão
      if (destinoId !== "#" && destinoElemento) {
        evento.preventDefault();

        const topo =
          destinoElemento.getBoundingClientRect().top +
          window.scrollY -
          80; // ajuste se tiver navbar fixa

        window.scrollTo({
          top: topo,
          behavior: "smooth",
        });
      }
    });
  });
});
