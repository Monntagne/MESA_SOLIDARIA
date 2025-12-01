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

  // ================= IMPACTO – REFERÊNCIAS =================
  const numerosKpi = document.querySelectorAll(
    ".numero-indicador-impacto, .numero-kpi-hero, .porcentagem-central"
  );

  const barrasMes = document.querySelectorAll(".barra-mes");
  const blocoGraficoBarras = document.querySelector(".bloco-grafico-barras");

  const elementosAnimados = document.querySelectorAll(".impacto-animado");
  const secaoIndicadores = document.querySelector(".secao-indicadores-impacto");
  const secaoGraficos = document.querySelector(".secao-graficos-impacto");

  // ================= ANIMAÇÃO DOS NÚMEROS =================
  let animacaoNumerosJaRodou = false;

  function animarNumeros() {
    if (animacaoNumerosJaRodou) return;
    animacaoNumerosJaRodou = true;

    numerosKpi.forEach((el) => {
      // 1) tenta pegar do data-contador
      const attr = el.dataset.contador || el.getAttribute("data-contador");
      let alvo;
      let sufixo = "";

      if (attr && attr.trim() !== "") {
        alvo = Number(String(attr).replace(/[^\d]/g, "")) || 0;
      } else {
        // 2) se não tiver data-contador, usa o texto original (ex: "72%")
        const textoOriginal = el.textContent || "";
        const numExtraido = Number(textoOriginal.replace(/[^\d]/g, ""));

        if (!Number.isFinite(numExtraido) || numExtraido === 0) {
          // não tem número pra animar, então não mexe nesse elemento
          return;
        }

        alvo = numExtraido;

        // se tinha % no texto original, guarda pra recolocar
        if (textoOriginal.includes("%")) {
          sufixo = "%";
        }
      }

      // 3) se for o número do centro da rosca, garante o "%"
      if (el.classList.contains("porcentagem-central") && !sufixo) {
        sufixo = "%";
      }

      let atual = 0;
      const duracao = 1200; // ms
      const intervalo = 30; // ms
      const passos = Math.max(Math.floor(duracao / intervalo), 1);
      const incremento = alvo / passos;

      const atualizarTexto = () => {
        const valorFormatado = Math.round(atual).toLocaleString("pt-BR");
        el.textContent = valorFormatado + sufixo;
      };

      // começa em 0 + sufixo
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

  // ================= ANIMAÇÃO DO GRÁFICO DE BARRAS =================
  let animacaoBarrasJaRodou = false;
  let maxValor = 0;

  barrasMes.forEach((barra) => {
    const valor = Number(barra.dataset.valor || barra.getAttribute("data-valor") || "0");
    if (valor > maxValor) maxValor = valor;
  });

  function animarBarras() {
    if (animacaoBarrasJaRodou || maxValor === 0) return;
    animacaoBarrasJaRodou = true;

    barrasMes.forEach((barra) => {
      const valor = Number(barra.dataset.valor || barra.getAttribute("data-valor") || "0");
      const altura = Math.min((valor / maxValor) * 100, 100);
      barra.style.height = altura + "%";
    });
  }

  // ================= ENTRADA SUAVE (.impacto-animado) + DISPARO =================
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;

          // fade/slide dos blocos que têm .impacto-animado
          if (el.classList.contains("impacto-animado")) {
            el.classList.add("visivel");
          }

          // quando indicadores ou gráficos entram, dispara números + barras
          if (
            el.classList.contains("secao-indicadores-impacto") ||
            el.classList.contains("secao-graficos-impacto")
          ) {
            animarNumeros();
            animarBarras();
          }

          // garante que o bloco do gráfico de barras também dispare, se observado
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
    // fallback sem IntersectionObserver
    elementosAnimados.forEach((el) => el.classList.add("visivel"));
    animarNumeros();
    animarBarras();
  }
});
