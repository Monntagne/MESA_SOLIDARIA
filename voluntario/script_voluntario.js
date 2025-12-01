
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









document.addEventListener("DOMContentLoaded", function () {
  const cartoesMotivo = document.querySelectorAll(".cartao-motivo-voluntario");

  cartoesMotivo.forEach((cartao) => {
    // trava a altura atual do card pra ele não “pular” quando vira
    const alturaOriginal = cartao.offsetHeight;
    cartao.style.height = `${alturaOriginal}px`;

    cartao.addEventListener("click", () => {
      const estaVirado = cartao.classList.contains("virado");

      if (!estaVirado) {
        // escolhe aleatoriamente 180 ou -180
        const sinal = Math.random() < 0.5 ? "" : "-";
        const angulo = 180;

        cartao.style.transform = `rotateY(${sinal}${angulo}deg)`;
        cartao.classList.add("virado");
      } else {
        cartao.style.transform = "rotateY(0deg)";
        cartao.classList.remove("virado");
      }
    });
  });
});
