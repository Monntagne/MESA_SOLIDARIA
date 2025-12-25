document.addEventListener("DOMContentLoaded", () => {
  carregarFragmento("../Navegacao/Navbar/navbar.html", "area-navbar");
  carregarFragmento("../Navegacao/Footer/footer.html", "area-footer");

  const elementosAnimados = document.querySelectorAll(".faq-animado");

  if ("IntersectionObserver" in window && elementosAnimados.length) {
    const observador = new IntersectionObserver(
      (entradas, observer) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            observer.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    elementosAnimados.forEach((el) => observador.observe(el));
  } else {
    elementosAnimados.forEach((el) => el.classList.add("visivel"));
  }

  const itensPergunta = document.querySelectorAll(".item-pergunta-faq");

  itensPergunta.forEach((item) => {
    const cabecalho = item.querySelector(".cabecalho-pergunta-faq");
    const corpo = item.querySelector(".corpo-pergunta-faq");

    if (!cabecalho || !corpo) return;

    corpo.style.maxHeight = "0px";

    cabecalho.addEventListener("click", () => {
      const estaAberta = item.classList.contains("aberta");

      itensPergunta.forEach((outro) => {
        const outroCorpo = outro.querySelector(".corpo-pergunta-faq");
        if (!outroCorpo) return;
        outro.classList.remove("aberta");
        outroCorpo.style.maxHeight = "0px";
      });

      if (!estaAberta) {
        item.classList.add("aberta");
        corpo.style.maxHeight = corpo.scrollHeight + "px";
      }
    });
  });

  const botoesFiltro = document.querySelectorAll(".botao-filtro-faq");

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      const filtro = botao.dataset.filtro || "todos";

      botoesFiltro.forEach((b) => b.classList.remove("ativo"));
      botao.classList.add("ativo");

      itensPergunta.forEach((item) => {
        const categoria = item.dataset.categoria || "geral";

        if (
          filtro === "todos" ||
          categoria === filtro ||
          categoria === "geral"
        ) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  const botaoTodos = document.querySelector('.botao-filtro-faq[data-filtro="todos"]');
  if (botaoTodos) botaoTodos.click();
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
