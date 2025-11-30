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
 });
// ================= CONFETE BOTÃO DOAR =================

// cria confete em uma posição específica da tela
function criarConfeteNaPosicao(x, y) {
  const quantidadeConfetes = 100;
  const cores = ["#FF7A00", "#FFD54F", "#2E8B57", "#00123B", "#FFFFFF"];

  for (let i = 0; i < quantidadeConfetes; i++) {
    const confete = document.createElement("span");
    confete.classList.add("confete");

    // posição inicial do confete = posição do clique
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

document.addEventListener("DOMContentLoaded", () => {
  const botoesDoar = document.querySelectorAll(".botao-doacoes");

  botoesDoar.forEach((botao) => {
    botao.addEventListener("click", (evento) => {
      // posição exata do clique (considerando scroll da página)
      const cliqueX = evento.clientX + window.scrollX;
      const cliqueY = evento.clientY + window.scrollY;

      // animação de "apertar" o botão
      botao.classList.add("botao-clicado");
      setTimeout(() => {
        botao.classList.remove("botao-clicado");
      }, 300);

      // confete saindo do ponto clicado
      criarConfeteNaPosicao(cliqueX, cliqueY);
    });
  });
});
