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

  // ================= A PARTIR DAQUI, TODO O RESTO DO SEU CÓDIGO =================

  const elementosParaAnimar = [
    ...document.querySelectorAll(".card-sobre"),
    ...document.querySelectorAll(".bloco-realidade"),
    ...document.querySelectorAll(".card-unico"),
    ...document.querySelectorAll(".card-membro"),
    ...document.querySelectorAll(".item-persona"),
    ...document.querySelectorAll(".imagem-ods")
  ];

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
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
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    function prepararLista(lista, atrasoInicial = 0, atrasoIncremento = 0.08) {
      lista.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition =
          "opacity 0.7s ease, transform 0.7s ease, box-shadow 0.4s ease, transform 0.2s ease-out";
        el.dataset.delay = (atrasoInicial + index * atrasoIncremento).toFixed(2) + "s";

        observer.observe(el);
      });
    }

    prepararLista(document.querySelectorAll(".card-sobre"), 0.0, 0.12);
    prepararLista(document.querySelectorAll(".bloco-realidade"), 0.2, 0.1);
    prepararLista(document.querySelectorAll(".card-unico"), 0.3, 0.1);
    prepararLista(document.querySelectorAll(".card-membro"), 0.4, 0.1);
    prepararLista(document.querySelectorAll(".item-persona"), 0.4, 0.08);
    prepararLista(document.querySelectorAll(".imagem-ods"), 0.5, 0.1);
  }

  function adicionarHoverElevacao(seletor) {
    const elementos = document.querySelectorAll(seletor);

    elementos.forEach((el) => {
      el.style.transition =
        (el.style.transition || "") +
        ", transform 0.2s ease-out, box-shadow 0.2s ease-out";

      el.addEventListener("mouseenter", () => {
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      });
    });
  }

  adicionarHoverElevacao(".card-sobre");
  adicionarHoverElevacao(".card-unico");
  adicionarHoverElevacao(".bloco-realidade");
  adicionarHoverElevacao(".card-membro");

  const itensPersona = document.querySelectorAll(".item-persona");

  itensPersona.forEach((item) => {
    item.style.transition = "transform 0.2s ease-out, background-color 0.2s ease-out";

    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateY(-3px) scale(1.02)";
      item.style.backgroundColor = "rgba(0, 18, 59, 0.04)";
      item.style.borderRadius = "12px";
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateY(0) scale(1)";
      item.style.backgroundColor = "transparent";
    });
  });

  const odsImagens = document.querySelectorAll(".imagem-ods");

  odsImagens.forEach((img) => {
    img.style.transition = "transform 0.6s ease-in-out";
  });

  let crescendo = true;

  if (odsImagens.length > 0) {
    setInterval(() => {
      odsImagens.forEach((img) => {
        img.style.transform = crescendo ? "scale(1.04)" : "scale(1)";
      });
      crescendo = !crescendo;
    }, 2200);
  }

  const colunaEsquerda = document.querySelector(".coluna-esquerda");
  const colunaDireita = document.querySelector(".coluna-direita");

  function aplicarParallax() {
    const scrollY = window.scrollY || window.pageYOffset;
    const fator = 0.04;

    if (colunaEsquerda) {
      colunaEsquerda.style.transform = `translateY(${scrollY * fator * -1}px)`;
      colunaEsquerda.style.transition = "transform 0.1s linear";
    }

    if (colunaDireita) {
      colunaDireita.style.transform = `translateY(${scrollY * fator}px)`;
      colunaDireita.style.transition = "transform 0.1s linear";
    }
  }

  window.addEventListener("scroll", aplicarParallax);
  aplicarParallax();
});
