document.addEventListener("DOMContentLoaded", () => {
  carregarFragmento("../Navegacao/Navbar/navbar.html", "area-navbar");
  carregarFragmento("../Navegacao/Footer/footer.html", "area-footer");

  const botoesDoar = document.querySelectorAll(".botao-doacoes");
  botoesDoar.forEach((botao) => {
    botao.addEventListener("click", (evento) => {
      const cliqueX = evento.clientX + window.scrollX;
      const cliqueY = evento.clientY + window.scrollY;

      botao.classList.add("botao-clicado");
      setTimeout(() => {
        botao.classList.remove("botao-clicado");
      }, 300);

      criarConfeteNaPosicao(cliqueX, cliqueY);
    });
  });

  const botaoHeroDoacoes = document.querySelector(".botao-doacoes");
  const secaoOQueDoar = document.getElementById("secao-o-que-doar");

  if (botaoHeroDoacoes && secaoOQueDoar) {
    botaoHeroDoacoes.addEventListener("click", (evento) => {
      evento.preventDefault();
      const topo = secaoOQueDoar.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topo, behavior: "smooth" });
    });
  }

  const elementosAnimar = document.querySelectorAll(
    ".cartao-tipo-doacao, .cartao-plano-doacao, .cartao-transparencia-doacao, .cartao-duvida-doador"
  );

  if ("IntersectionObserver" in window && elementosAnimar.length) {
    const observer = new IntersectionObserver(
      (entradas, obs) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            obs.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    elementosAnimar.forEach((el) => observer.observe(el));
  } else {
    elementosAnimar.forEach((el) => el.classList.add("visivel"));
  }
});

function criarConfeteNaPosicao(x, y) {
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
