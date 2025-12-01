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

  // ================= ANIMAÇÃO DE ENTRADA =================
  const elementosAnimados = document.querySelectorAll(".faq-animado");

  if ("IntersectionObserver" in window && elementosAnimados.length) {
    const observador = new IntersectionObserver(
      (entradas, obs) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            const el = entrada.target;
            el.classList.add("visivel");
            obs.unobserve(el);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    elementosAnimados.forEach((el) => observador.observe(el));
  } else {
    elementosAnimados.forEach((el) => el.classList.add("visivel"));
  }

  // ================= ACORDEÃO (PERGUNTAS) =================
  const itensPergunta = document.querySelectorAll(".item-pergunta-faq");

  itensPergunta.forEach((item) => {
    const cabecalho = item.querySelector(".cabecalho-pergunta-faq");
    const corpo = item.querySelector(".corpo-pergunta-faq");

    if (!cabecalho || !corpo) return;

    // estado inicial
    corpo.style.maxHeight = "0px";

    cabecalho.addEventListener("click", () => {
      const estaAberta = item.classList.contains("aberta");

      // fecha todas
      itensPergunta.forEach((outro) => {
        const outroCorpo = outro.querySelector(".corpo-pergunta-faq");
        if (!outroCorpo) return;
        outro.classList.remove("aberta");
        outroCorpo.style.maxHeight = "0px";
      });

      // abre a clicada
      if (!estaAberta) {
        item.classList.add("aberta");
        corpo.style.maxHeight = corpo.scrollHeight + "px";
      }
    });
  });

  // ================= FILTROS POR CATEGORIA =================
  const botoesFiltro = document.querySelectorAll(".botao-filtro-faq");

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      const filtro = botao.dataset.filtro || "todos";

      // estado visual dos botões
      botoesFiltro.forEach((b) => b.classList.remove("ativo"));
      botao.classList.add("ativo");

      // filtrar perguntas
      itensPergunta.forEach((item) => {
        const categoria = item.dataset.categoria || "geral";

        if (filtro === "todos" || categoria === filtro || categoria === "geral") {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // aciona filtro "todos" no carregamento (pra garantir)
  const botaoTodos = document.querySelector('.botao-filtro-faq[data-filtro="todos"]');
  if (botaoTodos) {
    botaoTodos.click();
  }
});
