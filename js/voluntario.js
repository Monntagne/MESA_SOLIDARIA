const qsa = (s, c = document) => [...c.querySelectorAll(s)];
const qs = (s, c = document) => c.querySelector(s);

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
        if (e.isIntersecting) {
          e.target.classList.add("visivel");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  elementos.forEach((el) => obs.observe(el));
};

const criarCarrosselBeneficios = () => {
  const grade = qs(".secao-beneficios-voluntariado-nova .grade-beneficios");
  if (!grade) return;

  const originais = qsa(".cartao-beneficio", grade);
  const total = originais.length;
  if (total < 2) return;

  const wrapper = document.createElement("div");
  wrapper.className = "carrossel-beneficios";

  const janela = document.createElement("div");
  janela.className = "carrossel-janela";

  const trilha = document.createElement("div");
  trilha.className = "carrossel-trilha";

  grade.parentNode.insertBefore(wrapper, grade);
  wrapper.appendChild(janela);
  janela.appendChild(trilha);

  originais.forEach((c) => {
    c.classList.add("carrossel-item");
    trilha.appendChild(c);
  });

  grade.remove();

  const copia2 = originais.map((c) => c.cloneNode(true));
  const copia3 = originais.map((c) => c.cloneNode(true));

  [...copia2, ...copia3].forEach((c) => {
    c.classList.add("carrossel-item");
    trilha.appendChild(c);
  });

  const controles = document.createElement("div");
  controles.className = "carrossel-controles";

  const criarBotao = (texto, ativo = false) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `botao-carrossel${ativo ? " ativo" : ""}`;
    b.textContent = texto;
    return b;
  };

  const btnPrev = criarBotao("Voltar");
  const btnPlay = criarBotao("Pausar", true);
  const btnNext = criarBotao("Avançar");

  controles.append(btnPrev, btnPlay, btnNext);
  wrapper.appendChild(controles);

  const preferReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = total;
  let tocando = !preferReduce;
  let timer = null;

  const itens = () => qsa(".carrossel-item", trilha);

  const passo = () => {
    const item = itens()[0];
    if (!item) return 0;
    const gap = parseFloat(getComputedStyle(trilha).gap || "0");
    return item.getBoundingClientRect().width + gap;
    };

  const transicao = (ativa) => {
    trilha.style.transition = ativa ? "transform .45s ease" : "none";
  };

  const atualizar = (animar = true) => {
    const p = passo();
    if (!p) return;
    transicao(animar);
    trilha.style.transform = `translateX(-${p * index}px)`;
  };

  const normalizar = () => {
    if (index >= total * 2) {
      index -= total;
      atualizar(false);
    } else if (index < total) {
      index += total;
      atualizar(false);
    }
  };

  const proximo = () => {
    index += 1;
    atualizar(true);
  };

  const anterior = () => {
    index -= 1;
    atualizar(true);
  };

  const pausar = () => {
    clearInterval(timer);
    timer = null;
  };

  const iniciar = () => {
    if (!tocando) return;
    pausar();
    timer = setInterval(proximo, 3200);
  };

  btnPrev.addEventListener("click", () => {
    pausar();
    anterior();
    if (tocando) iniciar();
  });

  btnNext.addEventListener("click", () => {
    pausar();
    proximo();
    if (tocando) iniciar();
  });

  btnPlay.addEventListener("click", () => {
    tocando = !tocando;
    btnPlay.textContent = tocando ? "Pausar" : "Play";
    btnPlay.classList.toggle("ativo", tocando);
    tocando ? iniciar() : pausar();
  });

  trilha.addEventListener("transitionend", normalizar);

  trilha.addEventListener("mouseenter", () => tocando && pausar());
  trilha.addEventListener("mouseleave", () => tocando && iniciar());

  window.addEventListener("resize", () => atualizar(false));

  requestAnimationFrame(() => {
    atualizar(false);
    iniciar();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  ativarRevelacao();
  criarCarrosselBeneficios();
});
