// script_inicio.js

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1) CARREGAR FRAGMENTOS
  // =========================
  const carregarFragmento = (idDestino, caminho, nome) => {
    const destino = document.getElementById(idDestino);
    if (!destino) {
      console.warn(`Elemento com id "${idDestino}" não encontrado (${nome}).`);
      return;
    }

    fetch(caminho)
      .then((res) => res.text())
      .then((html) => (destino.innerHTML = html))
      .catch((erro) => console.error(`Erro ao carregar ${nome}:`, erro));
  };

  carregarFragmento("area-navbar", "Navegacao/Navbar/navbar.html", "navbar");
  carregarFragmento("area-footer", "Navegacao/Footer/footer.html", "footer");

  // =========================
  // 2) CONFETE
  // =========================
  const botaoDoar = document.getElementById("botao-doar-agora");

  const criarConfete = (x, y) => {
    const cores = ["#FF7A00", "#FFD54F", "#2E8B57", "#00123B", "#FFFFFF"];
    const quantidade = 100;

    for (let i = 0; i < quantidade; i++) {
      const confete = document.createElement("span");
      confete.className = "confete";

      confete.style.left = `${x}px`;
      confete.style.top = `${y}px`;

      confete.style.setProperty("--confete-x", `${(Math.random() - 0.5) * 200}px`);
      confete.style.setProperty("--confete-y", `${-(Math.random() * 200 + 80)}px`);
      confete.style.setProperty("--confete-rotacao", `${(Math.random() - 0.5) * 360}deg`);
      confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];

      document.body.appendChild(confete);
      setTimeout(() => confete.remove(), 800);
    }
  };

  if (botaoDoar) {
    botaoDoar.addEventListener("click", (e) => {
      e.preventDefault();
      criarConfete(
        e.clientX + window.scrollX,
        e.clientY + window.scrollY
      );
    });
  } else {
    console.warn('Elemento com id "botao-doar-agora" não foi encontrado.');
  }

  // =========================
  // 3) REVEAL AO SCROLL
  // =========================
  const seletoresAnimados = [
    ".cartao-ajuda",
    ".cartao-publico",
    ".cartao-passo-funcionamento",
    ".cartao-seguranca",
    ".cartao-ods",
    ".cartao-empresa",
  ].join(", ");

  const elementosAnimados = document.querySelectorAll(seletoresAnimados);

  if (elementosAnimados.length) {
    const observador = new IntersectionObserver(
      (entradas, obs) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            obs.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elementosAnimados.forEach((el) => observador.observe(el));
  }

  // =========================
  // 4) FLIP DOS CARTÕES AJUDA
  // =========================
  document.querySelectorAll(".cartao-ajuda").forEach((cartao) => {
    const icone = cartao.querySelector(".icone-cartao");
    if (!icone) return;

    // guarda cor original
    cartao.dataset.corOriginal =
      window.getComputedStyle(cartao).backgroundColor;

    const corIcone = window.getComputedStyle(icone).backgroundColor;

    cartao.addEventListener("click", () => {
      const virado = cartao.classList.toggle("virado");

      if (virado) {
        const sinal = Math.random() < 0.5 ? "" : "-";
        cartao.style.transform = `rotateY(${sinal}180deg)`;
        cartao.style.backgroundColor = corIcone;
      } else {
        cartao.style.transform = "rotateY(0deg)";
        cartao.style.backgroundColor = cartao.dataset.corOriginal || "";
      }
    });
  });
});
