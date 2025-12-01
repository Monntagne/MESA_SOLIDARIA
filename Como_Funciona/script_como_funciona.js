document.addEventListener("DOMContentLoaded", () => {
  carregarFragmento("../Navegacao/Navbar/navbar.html", "area-navbar");
  carregarFragmento("../Navegacao/Footer/footer.html", "area-footer");

  const fundoPilares = document.querySelector(".fundo-pilares");
  const imagemPilares = document.querySelector(".imagem-pilares");
  const conteudoPilares = document.querySelector(".conteudo-pilares");
  const sobreposicaoPilares = document.querySelector(".sobreposicao-pilares");

  const cardsPilares = document.querySelectorAll(".card-pilar-persona");
  const passosFluxo = document.querySelectorAll(".passo-fluxo");
  const cardsPerfil = document.querySelectorAll(".cartao-fluxo-perfil");
  const cardsTecnologia = document.querySelectorAll(".cartao-tecnologia");

  const fundoFluxo = document.querySelector(".fundo-fluxo-doacao");
  const conteudoFluxo = document.querySelector(".conteudo-fluxo-doacao");
  const imagemFluxo = document.querySelector(".imagem-fluxo-doacao");

  if (fundoPilares && imagemPilares && conteudoPilares) {
    if (getComputedStyle(fundoPilares).position === "static") {
      fundoPilares.style.position = "relative";
    }
    fundoPilares.style.overflow = "hidden";

    imagemPilares.style.transformOrigin = "center center";
    imagemPilares.style.transform = "scale(1.06)";
    imagemPilares.style.filter = "brightness(0.9)";
    imagemPilares.style.transition = "transform 1.4s ease, filter 1.4s ease";

    conteudoPilares.style.opacity = "0";
    conteudoPilares.style.transform = "translateY(20px)";
    conteudoPilares.style.transition = "opacity 0.8s ease, transform 0.8s ease";

    if (sobreposicaoPilares) {
      sobreposicaoPilares.style.opacity = "0";
      sobreposicaoPilares.style.transition = "opacity 1s ease";
    }

    requestAnimationFrame(() => {
      imagemPilares.style.transform = "scale(1)";
      imagemPilares.style.filter = "brightness(1)";
      conteudoPilares.style.opacity = "1";
      conteudoPilares.style.transform = "translateY(0)";
      if (sobreposicaoPilares) {
        sobreposicaoPilares.style.opacity = "1";
      }
    });
  }

  let observer = null;

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay || "0s";
            el.style.transitionDelay = delay;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            obs.unobserve(el);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -10% 0px",
      }
    );
  }

  function preparaAnimacaoLista(lista, delayInicial, passoDelay) {
    if (!lista || !lista.length) return;

    lista.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";

      el.dataset.delay = (delayInicial + index * passoDelay).toFixed(2) + "s";

      if (observer) {
        observer.observe(el);
      } else {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    });
  }

  preparaAnimacaoLista(cardsPilares, 0, 0.12);
  preparaAnimacaoLista(passosFluxo, 0.2, 0.08);
  preparaAnimacaoLista(cardsPerfil, 0.3, 0.08);
  preparaAnimacaoLista(cardsTecnologia, 0.4, 0.08);

  cardsPilares.forEach((el) => {
    const bgOriginal = getComputedStyle(el).backgroundColor;
    el.dataset.bgOriginal = bgOriginal;

    el.style.transition =
      "transform 0.18s ease-out, box-shadow 0.18s ease-out, background-color 0.18s ease-out";

    el.addEventListener("mouseenter", () => {
      el.style.transform = "translateY(-4px)";
      el.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
      el.style.backgroundColor = "rgba(0, 18, 59, 0.02)";
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translateY(0)";
      el.style.boxShadow = "none";
      el.style.backgroundColor = el.dataset.bgOriginal || "";
    });
  });

  passosFluxo.forEach((passo) => {
    const icone = passo.querySelector(".icone-passo-fluxo");
    const caixa = passo.querySelector(".caixa-passo-fluxo");

    if (icone) {
      icone.style.transition =
        "transform 0.2s ease-out, box-shadow 0.2s ease-out";
    }
    if (caixa) {
      caixa.style.transition =
        "box-shadow 0.2s ease-out, transform 0.2s ease-out";
    }

    passo.addEventListener("mouseenter", () => {
      if (icone) {
        icone.style.transform = "scale(1.05)";
        icone.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.18)";
      }
      if (caixa) {
        caixa.style.boxShadow = "0 8px 26px rgba(0, 0, 0, 0.18)";
        caixa.style.transform = "translateY(-2px)";
      }
    });

    passo.addEventListener("mouseleave", () => {
      if (icone) {
        icone.style.transform = "scale(1)";
        icone.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.18)";
      }
      if (caixa) {
        caixa.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.15)";
        caixa.style.transform = "translateY(0)";
      }
    });
  });

  if (fundoFluxo && conteudoFluxo && passosFluxo.length > 1) {
    if (getComputedStyle(fundoFluxo).position === "static") {
      fundoFluxo.style.position = "relative";
    }
    if (imagemFluxo) {
      imagemFluxo.style.zIndex = "0";
    }
    conteudoFluxo.style.position = conteudoFluxo.style.position || "relative";
    conteudoFluxo.style.zIndex = "2";

    const segmentos = [];
    const totalSegmentos = passosFluxo.length - 1;

    for (let i = 0; i < totalSegmentos; i++) {
      const seg = document.createElement("div");
      seg.style.position = "absolute";
      seg.style.height = "4px";
      seg.style.backgroundColor = "#FFFFFF";
      seg.style.opacity = "0";
      seg.style.pointerEvents = "none";
      seg.style.transition = "opacity 0.15s ease, width 0.25s ease-out";
      seg.style.zIndex = "1";
      seg.style.width = "0px";
      fundoFluxo.appendChild(seg);
      segmentos.push(seg);
    }

    function atualizarSegmentos() {
      const rectContainer = fundoFluxo.getBoundingClientRect();

      for (let i = 0; i < segmentos.length; i++) {
        const passoA = passosFluxo[i];
        const passoB = passosFluxo[i + 1];
        const iconeA = passoA.querySelector(".icone-passo-fluxo");
        const iconeB = passoB.querySelector(".icone-passo-fluxo");

        if (!iconeA || !iconeB) continue;

        const rectA = iconeA.getBoundingClientRect();
        const rectB = iconeB.getBoundingClientRect();

        const centroAX = rectA.left + rectA.width / 2;
        const centroBX = rectB.left + rectB.width / 2;
        const centroY = rectA.top + rectA.height / 2;

        const left = Math.min(centroAX, centroBX) - rectContainer.left;
        const widthFinal = Math.abs(centroBX - centroAX);

        const seg = segmentos[i];
        seg.style.top = centroY - rectContainer.top - 2 + "px";
        seg.style.left = left + "px";
        seg.dataset.widthFinal = widthFinal.toString();
      }
    }

    atualizarSegmentos();
    window.addEventListener("resize", atualizarSegmentos);

    passosFluxo.forEach((passo, index) => {
      passo.addEventListener("mouseenter", () => {
        const maxSegmento = Math.min(index, segmentos.length - 1);

        for (let i = 0; i < segmentos.length; i++) {
          const seg = segmentos[i];
          if (i <= maxSegmento) {
            const widthFinal = Number(seg.dataset.widthFinal || "0");
            seg.style.opacity = "1";
            seg.style.width = "0px";
            requestAnimationFrame(() => {
              seg.style.width = widthFinal + "px";
            });
          } else {
            seg.style.opacity = "0";
            seg.style.width = "0px";
          }
        }
      });

      passo.addEventListener("mouseleave", () => {
        segmentos.forEach((seg) => {
          seg.style.opacity = "0";
        });
      });
    });
  }

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
});
