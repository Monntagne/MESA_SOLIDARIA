document.addEventListener("DOMContentLoaded", () => {
  carregarFragmento("../Navegacao/Navbar/navbar.html", "area-navbar");
  carregarFragmento("../Navegacao/Footer/footer.html", "area-footer");

  const numerosKpi = document.querySelectorAll(
    ".numero-indicador-impacto, .numero-kpi-hero, .porcentagem-central"
  );

  const barrasMes = document.querySelectorAll(".barra-mes");
  const blocoGraficoBarras = document.querySelector(".bloco-grafico-barras");

  const elementosAnimados = document.querySelectorAll(".impacto-animado");
  const secaoIndicadores = document.querySelector(".secao-indicadores-impacto");
  const secaoGraficos = document.querySelector(".secao-graficos-impacto");

  let animacaoNumerosJaRodou = false;

  function animarNumeros() {
    if (animacaoNumerosJaRodou) return;
    animacaoNumerosJaRodou = true;

    numerosKpi.forEach((el) => {
      const attr = el.dataset.contador;
      let alvo;
      let sufixo = "";

      if (attr && attr.trim() !== "") {
        alvo = Number(String(attr).replace(/[^\d]/g, "")) || 0;
      } else {
        const textoOriginal = el.textContent || "";
        const numExtraido = Number(textoOriginal.replace(/[^\d]/g, ""));

        if (!Number.isFinite(numExtraido) || numExtraido === 0) return;

        alvo = numExtraido;

        if (textoOriginal.includes("%")) {
          sufixo = "%";
        }
      }

      if (el.classList.contains("porcentagem-central") && !sufixo) {
        sufixo = "%";
      }

      let atual = 0;
      const duracao = 1200;
      const intervalo = 30;
      const passos = Math.max(Math.floor(duracao / intervalo), 1);
      const incremento = alvo / passos;

      const atualizarTexto = () => {
        const valorFormatado = Math.round(atual).toLocaleString("pt-BR");
        el.textContent = valorFormatado + sufixo;
      };

      atualizarTexto();

      const timer = setInterval(() => {
        atual += incremento;
        if (atual >= alvo) {
          atual = alvo;
          clearInterval(timer);
        }
        atualizarTexto();
      }, intervalo);
    });
  }

  let animacaoBarrasJaRodou = false;
  let maxValor = 0;

  barrasMes.forEach((barra) => {
    const valor = Number(barra.dataset.valor || "0");
    if (valor > maxValor) maxValor = valor;
  });

  function animarBarras() {
    if (animacaoBarrasJaRodou || maxValor === 0) return;
    animacaoBarrasJaRodou = true;

    barrasMes.forEach((barra) => {
      const valor = Number(barra.dataset.valor || "0");
      const altura = Math.min((valor / maxValor) * 100, 100);
      barra.style.height = altura + "%";
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;

          if (el.classList.contains("impacto-animado")) {
            el.classList.add("visivel");
          }

          if (
            el.classList.contains("secao-indicadores-impacto") ||
            el.classList.contains("secao-graficos-impacto")
          ) {
            animarNumeros();
            animarBarras();
          }

          if (el === blocoGraficoBarras) {
            animarBarras();
          }

          obs.unobserve(el);
        });
      },
      {
        threshold: 0.3,
      }
    );

    elementosAnimados.forEach((el) => observer.observe(el));
    if (secaoIndicadores) observer.observe(secaoIndicadores);
    if (secaoGraficos) observer.observe(secaoGraficos);
    if (blocoGraficoBarras && !blocoGraficoBarras.classList.contains("impacto-animado")) {
      observer.observe(blocoGraficoBarras);
    }
  } else {
    elementosAnimados.forEach((el) => el.classList.add("visivel"));
    animarNumeros();
    animarBarras();
  }
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
