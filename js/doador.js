const qs = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];

const carregarFragmento = (url, id) => {
  const area = document.getElementById(id);
  if (!area) return;
  fetch(url)
    .then((r) => r.text())
    .then((html) => (area.innerHTML = html))
    .catch(() => {});
};

const ativarRevelacao = () => {
  document.body.classList.add("js-ativo");

  const elementos = qsa(".animar-entrada");
  if (!elementos.length) return;

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("visivel"));
    return;
  }

  const obs = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visivel");
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  elementos.forEach((el) => obs.observe(el));
};

const ativarAbasPerfis = () => {
  const abas = qsa(".aba-perfil");
  const paineis = qsa(".painel-perfil");
  if (!abas.length || !paineis.length) return;

  const ativar = (id) => {
    abas.forEach((a) =>
      a.classList.toggle("ativa", a.dataset.aba === id)
    );
    paineis.forEach((p) =>
      p.classList.toggle("ativo", p.id === id)
    );
  };

  abas.forEach((aba) => {
    aba.addEventListener("click", () => ativar(aba.dataset.aba));
  });
};

document.addEventListener("DOMContentLoaded", () => {
  carregarFragmento("../Navegacao/Navbar/navbar.html", "area-navbar");
  carregarFragmento("../Navegacao/Footer/footer.html", "area-footer");
  ativarRevelacao();
  ativarAbasPerfis();
});



















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
