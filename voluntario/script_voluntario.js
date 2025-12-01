document.addEventListener("DOMContentLoaded", () => {
  carregarFragmento("../Navegacao/Navbar/navbar.html", "area-navbar");
  carregarFragmento("../Navegacao/Footer/footer.html", "area-footer");

  const cartoesMotivo = document.querySelectorAll(".cartao-motivo-voluntario");

  cartoesMotivo.forEach((cartao) => {
    const alturaOriginal = cartao.offsetHeight;
    cartao.style.height = `${alturaOriginal}px`;

    cartao.addEventListener("click", () => {
      const estaVirado = cartao.classList.contains("virado");

      if (!estaVirado) {
        const sinal = Math.random() < 0.5 ? "" : "-";
        cartao.style.transform = `rotateY(${sinal}180deg)`;
        cartao.classList.add("virado");
      } else {
        cartao.style.transform = "rotateY(0deg)";
        cartao.classList.remove("virado");
      }
    });
  });
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
