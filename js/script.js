/**
 * Mesa Solidária — main.js
 * Script unificado. Cada módulo verifica se seus elementos existem
 * antes de executar, garantindo que rodem apenas na página correta.
 */

"use strict";

// ─────────────────────────────────────────────────────────────
// UTILITÁRIOS COMPARTILHADOS
// ─────────────────────────────────────────────────────────────

const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];

/** Cria um IntersectionObserver genérico que adiciona a classe `visivel`. */
function observarElementos(seletores, opcoes = {}) {
  const elementos = qsa(seletores.join(", "));
  if (!elementos.length) return;

  const cfg = { threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...opcoes };

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("visivel"));
    return;
  }

  const obs = new IntersectionObserver((entradas, o) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visivel");
      o.unobserve(e.target);
    });
  }, cfg);

  elementos.forEach((el) => obs.observe(el));
}

// ─────────────────────────────────────────────────────────────
// NAVBAR — hambúrguer (todas as páginas)
// ─────────────────────────────────────────────────────────────

function iniciarNavbar() {
  const botaoMenu = qs(".botao-menu");
  const menu = qs(".menu");
  if (!botaoMenu || !menu) return;

  botaoMenu.addEventListener("click", () => {
    const ativo = menu.classList.toggle("ativo");
    botaoMenu.setAttribute("aria-expanded", ativo ? "true" : "false");
  });

  qsa(".item-menu", menu).forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("ativo");
      botaoMenu.setAttribute("aria-expanded", "false");
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SMOOTH SCROLL para links âncora (páginas que usam #)
// ─────────────────────────────────────────────────────────────

function iniciarSmoothScroll() {
  qsa('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const alvo = qs(id);
      if (!alvo) return;
      e.preventDefault();
      window.scrollTo({
        top: alvo.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    });
  });
}

// ─────────────────────────────────────────────────────────────
// INÍCIO — confetti + animações de cards
// ─────────────────────────────────────────────────────────────

function iniciarPaginaInicio() {
  const botaoDoar = qs("#botao-doar-agora");
  if (!botaoDoar) return; // não é a página início

  let redirecionando = false;

  const criarConfete = (x, y) => {
    const cores = ["#FF7A00", "#FFD54F", "#2E8B57", "#00123B", "#FFFFFF"];
    for (let i = 0; i < 100; i++) {
      const c = document.createElement("span");
      c.className = "confete";
      c.style.left = `${x}px`;
      c.style.top  = `${y}px`;
      c.style.setProperty("--confete-x", `${(Math.random() - 0.5) * 200}px`);
      c.style.setProperty("--confete-y", `${-(Math.random() * 200 + 80)}px`);
      c.style.setProperty("--confete-rotacao", `${(Math.random() - 0.5) * 360}deg`);
      c.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 800);
    }
  };

  botaoDoar.addEventListener("click", (e) => {
    e.preventDefault();
    if (redirecionando) return;
    redirecionando = true;
    criarConfete(e.clientX + window.scrollX, e.clientY + window.scrollY);
    setTimeout(() => { window.location.href = "doador.html"; }, 1500);
  });

  observarElementos([
    ".cartao-ajuda", ".cartao-publico", ".cartao-passo-funcionamento",
    ".cartao-seguranca", ".cartao-ods", ".cartao-empresa",
  ]);
}

// ─────────────────────────────────────────────────────────────
// SOBRE — flip cards + animações
// ─────────────────────────────────────────────────────────────

function iniciarPaginaSobre() {
  const cards = qsa(".card-membro-sobre");
  if (!cards.length) return;

  observarElementos([
    ".conteiner-banner-sobre", ".cartao-mvv", ".etapa-linha-tempo",
    ".cartao-pilar-sobre", ".card-membro-sobre", ".conteiner-ods-sobre",
  ]);

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-social-membro")) return;
      card.classList.toggle("virado");
    });
  });
}

// ─────────────────────────────────────────────────────────────
// FAQ — acordeão + filtro de categorias
// ─────────────────────────────────────────────────────────────

function iniciarPaginaFaq() {
  const itensPergunta = qsa(".item-pergunta-faq");
  if (!itensPergunta.length) return;

  observarElementos([".faq-animado"], { threshold: 0.18 });

  itensPergunta.forEach((item) => {
    const cabecalho = qs(".cabecalho-pergunta-faq", item);
    const corpo     = qs(".corpo-pergunta-faq", item);
    if (!cabecalho || !corpo) return;
    corpo.style.maxHeight = "0px";

    cabecalho.addEventListener("click", () => {
      const estaAberta = item.classList.contains("aberta");
      itensPergunta.forEach((outro) => {
        const c = qs(".corpo-pergunta-faq", outro);
        if (c) c.style.maxHeight = "0px";
        outro.classList.remove("aberta");
      });
      if (!estaAberta) {
        item.classList.add("aberta");
        corpo.style.maxHeight = corpo.scrollHeight + "px";
      }
    });
  });

  qsa(".botao-filtro-faq").forEach((botao) => {
    botao.addEventListener("click", () => {
      const filtro = botao.dataset.filtro || "todos";
      qsa(".botao-filtro-faq").forEach((b) => b.classList.remove("ativo"));
      botao.classList.add("ativo");
      itensPergunta.forEach((item) => {
        const cat = item.dataset.categoria || "geral";
        item.style.display =
          filtro === "todos" || cat === filtro || cat === "geral"
            ? "block" : "none";
      });
    });
  });

  const botaoTodos = qs('.botao-filtro-faq[data-filtro="todos"]');
  if (botaoTodos) botaoTodos.click();
}

// ─────────────────────────────────────────────────────────────
// IMPACTO — contadores animados + barras de gráfico
// ─────────────────────────────────────────────────────────────

function iniciarPaginaImpacto() {
  const secaoIndicadores = qs(".secao-indicadores-impacto");
  if (!secaoIndicadores) return;

  observarElementos([".impacto-animado"]);

  const numerosKpi = qsa(".numero-indicador-impacto, .numero-kpi-hero, .porcentagem-central");
  const barrasMes  = qsa(".barra-mes");
  const blocoGrafico = qs(".bloco-grafico-barras");
  const secaoGraficos = qs(".secao-graficos-impacto");

  let numerosAnimados = false;
  let barrasAnimadas  = false;
  let maxValor = 0;
  barrasMes.forEach((b) => { const v = Number(b.dataset.valor || 0); if (v > maxValor) maxValor = v; });

  function animarNumeros() {
    if (numerosAnimados) return;
    numerosAnimados = true;
    numerosKpi.forEach((el) => {
      const attr = el.dataset.contador;
      let alvo, sufixo = "";
      if (attr && attr.trim()) {
        alvo = Number(String(attr).replace(/[^\d]/g, "")) || 0;
      } else {
        const txt = el.textContent || "";
        alvo = Number(txt.replace(/[^\d]/g, ""));
        if (!Number.isFinite(alvo) || alvo === 0) return;
        if (txt.includes("%")) sufixo = "%";
      }
      if (el.classList.contains("porcentagem-central") && !sufixo) sufixo = "%";
      let atual = 0;
      const passos = Math.max(Math.floor(1200 / 30), 1);
      const inc = alvo / passos;
      const t = setInterval(() => {
        atual += inc;
        if (atual >= alvo) { atual = alvo; clearInterval(t); }
        el.textContent = Math.round(atual).toLocaleString("pt-BR") + sufixo;
      }, 30);
    });
  }

  function animarBarras() {
    if (barrasAnimadas || maxValor === 0) return;
    barrasAnimadas = true;
    barrasMes.forEach((b) => {
      b.style.height = Math.min((Number(b.dataset.valor || 0) / maxValor) * 100, 100) + "%";
    });
  }

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (e.target.classList.contains("impacto-animado")) e.target.classList.add("visivel");
        if (e.target === secaoIndicadores || e.target === secaoGraficos) { animarNumeros(); animarBarras(); }
        if (e.target === blocoGrafico) animarBarras();
        o.unobserve(e.target);
      });
    }, { threshold: 0.3 });

    qsa(".impacto-animado").forEach((el) => obs.observe(el));
    if (secaoIndicadores) obs.observe(secaoIndicadores);
    if (secaoGraficos) obs.observe(secaoGraficos);
    if (blocoGrafico && !blocoGrafico.classList.contains("impacto-animado")) obs.observe(blocoGrafico);
  } else {
    qsa(".impacto-animado").forEach((el) => el.classList.add("visivel"));
    animarNumeros();
    animarBarras();
  }
}

// ─────────────────────────────────────────────────────────────
// FAMÍLIA — animações com atraso em cascata
// ─────────────────────────────────────────────────────────────

function iniciarPaginaFamilia() {
  const elementos = qsa(".familia-animado");
  if (!elementos.length) return;

  elementos.forEach((el, i) => {
    const atrasoAttr = el.getAttribute("data-atraso");
    const atraso = atrasoAttr !== null ? Number(atrasoAttr) : NaN;
    el.style.transitionDelay = Number.isFinite(atraso) ? `${atraso}s` : `${(i * 0.08).toFixed(2)}s`;
  });

  const revelar = (el) => el.classList.add("familia-visivel");

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entradas, o) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        revelar(e.target);
        o.unobserve(e.target);
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
    elementos.forEach((el) => obs.observe(el));
  } else {
    elementos.forEach(revelar);
  }

  const botaoIniciar = qs(".botao-iniciar-cadastro-familia");
  const secaoCadastro = qs("#cadastro-familia");
  if (botaoIniciar && secaoCadastro) {
    botaoIniciar.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: secaoCadastro.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    });
  }
}

// ─────────────────────────────────────────────────────────────
// COMO FUNCIONA — animações em grupo com atraso escalonado
// ─────────────────────────────────────────────────────────────

function iniciarPaginaComoFunciona() {
  const grupos = qsa("[data-animar-grupo]");
  if (!grupos.length) return;

  document.body.classList.add("js-ativo");
  const elementos = [];
  grupos.forEach((grupo) => {
    qsa(".animar-entrada", grupo).forEach((el, i) => {
      el.style.transitionDelay = `${(i * 0.08).toFixed(2)}s`;
      elementos.push(el);
    });
  });

  if (!elementos.length) return;

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entradas, o) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visivel");
        o.unobserve(e.target);
      });
    }, { threshold: 0.22, rootMargin: "0px 0px -10% 0px" });
    elementos.forEach((el) => obs.observe(el));
  } else {
    elementos.forEach((el) => el.classList.add("visivel"));
  }
}

// ─────────────────────────────────────────────────────────────
// VOLUNTÁRIO — animações .animar-entrada
// ─────────────────────────────────────────────────────────────

function iniciarPaginaVoluntario() {
  const elementos = qsa(".animar-entrada");
  // Só roda se a página tiver .animar-entrada E não tiver [data-animar-grupo]
  // (para não conflitar com comoFunciona)
  if (!elementos.length || qs("[data-animar-grupo]")) return;
  if (qs(".secao-beneficios-voluntariado-nova") === null) return;

  document.body.classList.add("js-ativo");

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entradas, o) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visivel");
        o.unobserve(e.target);
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
    elementos.forEach((el) => obs.observe(el));
  } else {
    elementos.forEach((el) => el.classList.add("visivel"));
  }
}

// ─────────────────────────────────────────────────────────────
// DOADOR — tabs de perfil + animações .animar-entrada
// ─────────────────────────────────────────────────────────────

function iniciarPaginaDoador() {
  const abas = qsa(".aba-perfil");
  const paineis = qsa(".painel-perfil");
  if (!abas.length && !paineis.length) return;

  document.body.classList.add("js-ativo");

  // Animações
  const elementos = qsa(".animar-entrada");
  if (elementos.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entradas, o) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visivel");
        o.unobserve(e.target);
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
    elementos.forEach((el) => obs.observe(el));
  }

  // Tabs
  if (abas.length && paineis.length) {
    const ativar = (id) => {
      abas.forEach((a) => a.classList.toggle("ativa", a.dataset.aba === id));
      paineis.forEach((p) => p.classList.toggle("ativo", p.id === id));
    };
    abas.forEach((aba) => aba.addEventListener("click", () => ativar(aba.dataset.aba)));
  }
}

// ─────────────────────────────────────────────────────────────
// EMPRESA PARCEIRA — animações de cards + smooth scroll
// ─────────────────────────────────────────────────────────────

function iniciarPaginaEmpresa() {
  const cards = qsa(".cartao-motivo-empresa, .cartao-passo-empresa, .cartao-beneficio-empresa");
  if (!cards.length) return;

  observarElementos([
    ".cartao-motivo-empresa", ".cartao-passo-empresa", ".cartao-beneficio-empresa",
  ]);
}

// ─────────────────────────────────────────────────────────────
// CONTATO — seleção de perfil + validação de formulário
// ─────────────────────────────────────────────────────────────

function iniciarPaginaContato() {
  const formulario = qs("#form-contato");
  if (!formulario) return;

  const botoesPerfil = qsa(".botao-perfil");
  const textoPerfilSelecionado = qs("#texto-perfil-selecionado");
  const inputPerfil = qs("#perfil-contato");
  const mensagemErro = qs("#mensagem-erro-formulario");
  const mensagemSucesso = qs("#mensagem-sucesso-formulario");

  const validarEmail = (e) => /\S+@\S+\.\S+/.test(e);

  const atualizarPerfil = (perfil) => {
    if (textoPerfilSelecionado) textoPerfilSelecionado.textContent = perfil;
    if (inputPerfil) inputPerfil.value = perfil;
  };

  if (botoesPerfil.length) {
    botoesPerfil.forEach((b) => {
      b.addEventListener("click", () => {
        botoesPerfil.forEach((x) => x.classList.remove("botao-perfil-ativo"));
        b.classList.add("botao-perfil-ativo");
        atualizarPerfil(b.getAttribute("data-perfil") || b.textContent.trim());
      });
    });
    const inicial = qs(".botao-perfil.botao-perfil-ativo") || botoesPerfil[0];
    if (inicial) atualizarPerfil(inicial.getAttribute("data-perfil") || "Beneficiário");
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    if (mensagemErro) mensagemErro.textContent = "";
    if (mensagemSucesso) mensagemSucesso.textContent = "";

    const nome     = (qs("#nome-contato")?.value || "").trim();
    const email    = (qs("#email-contato")?.value || "").trim();
    const assunto  = qs("#assunto-contato")?.value || "";
    const mensagem = (qs("#mensagem-contato")?.value || "").trim();
    const aceite   = qs("#aceite-contato")?.checked || false;
    const perfil   = inputPerfil?.value || "";

    const erros = [];
    if (!nome)                    erros.push("Informe seu nome completo.");
    if (!email)                   erros.push("Informe um e-mail para contato.");
    else if (!validarEmail(email)) erros.push("Informe um e-mail válido.");
    if (!assunto)                 erros.push("Selecione um assunto.");
    if (!mensagem)                erros.push("Escreva uma mensagem para a equipe.");
    if (!perfil)                  erros.push("Selecione seu perfil.");
    if (!aceite)                  erros.push("Confirme a autorização de contato.");

    if (erros.length) { if (mensagemErro) mensagemErro.textContent = erros.join(" "); return; }

    if (mensagemSucesso)
      mensagemSucesso.textContent = "Mensagem enviada com sucesso! Nossa equipe retornará em breve.";
    formulario.reset();
    if (botoesPerfil.length) {
      botoesPerfil.forEach((b) => b.classList.remove("botao-perfil-ativo"));
      const p = botoesPerfil[0];
      if (p) { p.classList.add("botao-perfil-ativo"); atualizarPerfil(p.getAttribute("data-perfil") || "Beneficiário"); }
    }
  });
}

// ─────────────────────────────────────────────────────────────
// CADASTRO BENEFICIÁRIO — formulário multietapas
// ─────────────────────────────────────────────────────────────

function iniciarPaginaCadastro() {
  const pagina = qs(".pagina-cadastro-beneficiario");
  if (!pagina) return;

  const formulario = qs(".formulario-cadastro-beneficiario", pagina);
  if (!formulario) return;

  const nomeInput          = qs("#nome-completo");
  const cpfInput           = qs("#cpf");
  const telefoneInput      = qs("#telefone");
  const emailInput         = qs("#email");
  const dataNascInput      = qs("#data-nascimento");
  const cepInput           = qs("#cep");
  const cidadeInput        = qs("#cidade");
  const estadoInput        = qs("#estado");
  const bairroInput        = qs("#bairro");
  const logradouroInput    = qs("#logradouro");
  const numeroInput        = qs("#numero");
  const moradoresInput     = qs("#quantidade-moradores");
  const rendaSelect        = qs("#renda-familiar");
  const restricoesInput    = qs("#restricoes-alimentares");
  const observacoesInput   = qs("#observacoes");
  const senhaInput         = qs("#senha-acesso");
  const confirmacaoInput   = qs("#confirmacao-senha");
  const blocoEndereco      = qs("#bloco-endereco");
  const blocoSituacao      = qs("#bloco-situacao-familiar");
  const blocoSaude         = qs("#bloco-saude-alimentacao");
  const blocoAcesso        = qs("#bloco-acesso-plataforma");
  const erroEmail          = qs("#erro-email");
  const erroSenha          = qs("#erro-senha");
  const erroConfirmacao    = qs("#erro-confirmacao-senha");
  const erroDataNasc       = qs("#erro-data-nascimento");
  const botaoPrincipal     = qs(".botao-principal-cadastro");

  let enderecoLiberado = false, situacaoLiberada = false, saudeLiberada = false;

  if (blocoEndereco) blocoEndereco.style.display = "none";
  if (blocoSituacao) blocoSituacao.style.display = "none";
  if (blocoSaude)    blocoSaude.style.display    = "none";
  if (blocoAcesso)   blocoAcesso.style.display   = "none";

  const atualizarBotao = () => {
    if (!botaoPrincipal) return;
    botaoPrincipal.textContent =
      blocoAcesso && blocoAcesso.style.display !== "none" ? "Concluir cadastro" : "Continuar";
  };
  atualizarBotao();

  // Datas limite
  let dataMin = null, dataMax = null;
  if (dataNascInput) {
    const hoje = new Date();
    dataMax = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());
    dataMin = new Date(hoje.getFullYear() - 100, hoje.getMonth(), hoje.getDate());
    const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    dataNascInput.max = fmt(dataMax);
    dataNascInput.min = fmt(dataMin);
  }

  // Validações
  const validarEmail = () => {
    if (!emailInput || !erroEmail) return true;
    erroEmail.textContent = "";
    emailInput.classList.remove("campo-invalido");
    const v = emailInput.value.trim().toLowerCase();
    emailInput.value = v;
    if (!v) { erroEmail.textContent = "Informe um e-mail."; emailInput.classList.add("campo-invalido"); return false; }
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v)) {
      erroEmail.textContent = "Digite um e-mail válido."; emailInput.classList.add("campo-invalido"); return false;
    }
    return true;
  };

  const validarSenha = () => {
    if (!senhaInput || !erroSenha) return true;
    erroSenha.textContent = ""; senhaInput.classList.remove("campo-invalido");
    const v = senhaInput.value;
    if (!v) { erroSenha.textContent = "Crie uma senha."; senhaInput.classList.add("campo-invalido"); return false; }
    const falta = [];
    if (v.length < 8)         falta.push("no mínimo 8 caracteres");
    if (!/[A-Z]/.test(v))     falta.push("uma letra maiúscula");
    if (!/[a-z]/.test(v))     falta.push("uma letra minúscula");
    if (!/\d/.test(v))        falta.push("um número");
    if (!/[^A-Za-z0-9]/.test(v)) falta.push("um caractere especial");
    if (falta.length) { erroSenha.textContent = "A senha deve conter: " + falta.join(", ") + "."; senhaInput.classList.add("campo-invalido"); return false; }
    return true;
  };

  const validarConfirmacao = () => {
    if (!senhaInput || !confirmacaoInput || !erroConfirmacao) return true;
    erroConfirmacao.textContent = ""; confirmacaoInput.classList.remove("campo-invalido");
    if (!confirmacaoInput.value) { erroConfirmacao.textContent = "Confirme a senha."; confirmacaoInput.classList.add("campo-invalido"); return false; }
    if (senhaInput.value !== confirmacaoInput.value) { erroConfirmacao.textContent = "As senhas não coincidem."; confirmacaoInput.classList.add("campo-invalido"); return false; }
    return true;
  };

  const validarDataNasc = () => {
    if (!dataNascInput || !erroDataNasc) return true;
    erroDataNasc.textContent = ""; dataNascInput.classList.remove("campo-invalido");
    const v = dataNascInput.value;
    if (!v) { erroDataNasc.textContent = "Informe a data de nascimento."; dataNascInput.classList.add("campo-invalido"); return false; }
    const d = new Date(v);
    if (dataMin && d < dataMin) { erroDataNasc.textContent = "Idade máxima é 100 anos."; dataNascInput.classList.add("campo-invalido"); return false; }
    if (dataMax && d > dataMax) { erroDataNasc.textContent = "Você precisa ter ao menos 18 anos."; dataNascInput.classList.add("campo-invalido"); return false; }
    return true;
  };

  const validarDadosPessoais = () => {
    if (!nomeInput || !cpfInput || !telefoneInput || !dataNascInput || !emailInput) return false;
    let ok = true;
    [nomeInput, cpfInput, telefoneInput].forEach((c) => c.classList.remove("campo-invalido"));
    if (!nomeInput.value.trim()) { nomeInput.classList.add("campo-invalido"); ok = false; }
    if (cpfInput.value.replace(/\D/g,"").length !== 11) { cpfInput.classList.add("campo-invalido"); ok = false; }
    if (telefoneInput.value.replace(/\D/g,"").length !== 11) { telefoneInput.classList.add("campo-invalido"); ok = false; }
    if (!validarEmail()) ok = false;
    if (!validarDataNasc()) ok = false;
    return ok;
  };

  const validarEndereco = () => {
    if (!cepInput||!cidadeInput||!estadoInput||!bairroInput||!logradouroInput||!numeroInput) return false;
    return cepInput.value.replace(/\D/g,"").length === 8 &&
      cidadeInput.value.trim() && estadoInput.value.trim() &&
      bairroInput.value.trim() && logradouroInput.value.trim() && numeroInput.value.trim();
  };

  const validarSituacao = () => {
    if (!moradoresInput || !rendaSelect) return false;
    return !isNaN(parseInt(moradoresInput.value,10)) && parseInt(moradoresInput.value,10) >= 1 && rendaSelect.value;
  };

  const tentarLiberarEndereco = () => {
    if (enderecoLiberado || !blocoEndereco) return;
    if (validarDadosPessoais()) { blocoEndereco.style.display = "block"; enderecoLiberado = true; atualizarBotao(); }
  };
  const tentarLiberarSituacao = () => {
    if (!enderecoLiberado || situacaoLiberada || !blocoSituacao) return;
    if (validarEndereco()) { blocoSituacao.style.display = "block"; situacaoLiberada = true; atualizarBotao(); }
  };
  const tentarLiberarSaude = () => {
    if (!situacaoLiberada || saudeLiberada || !blocoSaude) return;
    if (validarSituacao()) { blocoSaude.style.display = "block"; saudeLiberada = true; atualizarBotao(); }
  };
  const tentarLiberarAcesso = () => {
    if (!saudeLiberada || !blocoAcesso) return;
    blocoAcesso.style.display = "block"; atualizarBotao();
  };

  // Máscaras
  if (cepInput) cepInput.addEventListener("input", () => {
    let v = cepInput.value.replace(/\D/g,"").slice(0,8);
    cepInput.value = v.length > 5 ? v.slice(0,5)+"-"+v.slice(5) : v;
  });
  if (cpfInput) cpfInput.addEventListener("input", () => {
    cpfInput.classList.remove("campo-invalido");
    let v = cpfInput.value.replace(/\D/g,"").slice(0,11);
    if (v.length > 9)      cpfInput.value = v.slice(0,3)+"."+v.slice(3,6)+"."+v.slice(6,9)+"-"+v.slice(9);
    else if (v.length > 6) cpfInput.value = v.slice(0,3)+"."+v.slice(3,6)+"."+v.slice(6);
    else if (v.length > 3) cpfInput.value = v.slice(0,3)+"."+v.slice(3);
    else                   cpfInput.value = v;
  });
  if (telefoneInput) telefoneInput.addEventListener("input", () => {
    telefoneInput.classList.remove("campo-invalido");
    let v = telefoneInput.value.replace(/\D/g,"").slice(0,11);
    if (!v) { telefoneInput.value = ""; return; }
    if (v.length <= 2)     telefoneInput.value = "("+v;
    else if (v.length <= 7) telefoneInput.value = "("+v.slice(0,2)+") "+v.slice(2);
    else                   telefoneInput.value = "("+v.slice(0,2)+") "+v.slice(2,7)+"-"+v.slice(7);
  });

  if (nomeInput)         nomeInput.addEventListener("input", () => nomeInput.classList.remove("campo-invalido"));
  if (emailInput)        emailInput.addEventListener("input", () => { emailInput.value = emailInput.value.toLowerCase(); if(erroEmail) erroEmail.textContent=""; emailInput.classList.remove("campo-invalido"); });
  if (senhaInput)        senhaInput.addEventListener("input", () => { if(erroSenha) erroSenha.textContent=""; senhaInput.classList.remove("campo-invalido"); validarSenha(); });
  if (confirmacaoInput)  confirmacaoInput.addEventListener("input", () => { if(erroConfirmacao) erroConfirmacao.textContent=""; confirmacaoInput.classList.remove("campo-invalido"); validarConfirmacao(); });
  if (dataNascInput)     dataNascInput.addEventListener("change", () => { if(erroDataNasc) erroDataNasc.textContent=""; dataNascInput.classList.remove("campo-invalido"); validarDataNasc(); });

  [nomeInput,cpfInput,telefoneInput,emailInput,dataNascInput].forEach((c) => c && c.addEventListener("blur", tentarLiberarEndereco));
  [cepInput,cidadeInput,estadoInput,bairroInput,logradouroInput,numeroInput].forEach((c) => c && c.addEventListener("blur", tentarLiberarSituacao));
  [moradoresInput,rendaSelect].forEach((c) => c && c.addEventListener("blur", tentarLiberarSaude));
  [restricoesInput,observacoesInput].forEach((c) => c && c.addEventListener("blur", tentarLiberarAcesso));

  formulario.addEventListener("submit", (e) => {
    let valido = true;
    if (!validarDadosPessoais()) valido = false;
    if (!validarEmail())         valido = false;
    if (!validarSenha())         valido = false;
    if (!validarConfirmacao())   valido = false;
    if (!validarDataNasc())      valido = false;
    if (!valido) e.preventDefault();
  });
}

// ─────────────────────────────────────────────────────────────
// TELA DE LOGIN — seleção de perfil + formulário
// ─────────────────────────────────────────────────────────────

function iniciarTelaLogin() {
  const cartoesPerfil = qsa(".cartao-perfil");
  if (!cartoesPerfil.length) return;

  const inputTipoUsuario  = qs("#tipo-usuario");
  const linkCadastro      = qs("#link-cadastro");
  const formularioWrapper = qs("#formulario-wrapper");

  const mapaCadastro = {
    beneficiario:    "cadastro_beneficiario.html",
    voluntario:      "voluntario.html",
    doador:          "doador.html",
    ponto_de_coleta: "empresaParceira.html",
  };

  cartoesPerfil.forEach((cartao) => {
    cartao.addEventListener("click", () => {
      const jaAtivo = cartao.classList.contains("ativo");
      cartoesPerfil.forEach((c) => c.classList.remove("ativo"));

      if (jaAtivo) {
        if (inputTipoUsuario) inputTipoUsuario.value = "";
        if (formularioWrapper) formularioWrapper.classList.remove("visivel");
        return;
      }

      cartao.classList.add("ativo");
      const tipo = cartao.dataset.tipo || "";
      if (inputTipoUsuario) inputTipoUsuario.value = tipo;
      if (linkCadastro) linkCadastro.href = mapaCadastro[tipo] || "cadastro_beneficiario.html";
      if (formularioWrapper) formularioWrapper.classList.add("visivel");
    });
  });

  const formulario        = qs(".formulario-login");
  const identificadorInput = qs("#entrada-identificador");
  const senhaInput        = qs("#entrada-senha");
  const mensagemErro      = qs("#erro-login");

  const mostrarErro = (msg) => {
    if (!mensagemErro) return;
    mensagemErro.textContent = msg;
    mensagemErro.style.display = msg ? "block" : "none";
  };

  // Usuários de teste (apenas para demonstração)
  const usuariosTeste = {
    beneficiario:    { email: "beneficiario@beneficiario.com", senha: "1234", destino: "dashboard_beneficiario.html" },
    voluntario:      { email: "voluntario@voluntario.com",     senha: "1234", destino: "dashboard_voluntario.html" },
    doador:          { email: "doador@doador.com",             senha: "1234", destino: "dashboard_doador.html" },
    ponto_de_coleta: { email: "ponto@ponto.com",               senha: "1234", destino: "dashboard_ponto.html" },
  };

  if (formulario) {
    formulario.addEventListener("submit", (e) => {
      e.preventDefault();
      mostrarErro("");
      const id    = (identificadorInput?.value || "").trim().toLowerCase();
      const senha = senhaInput?.value || "";
      const tipo  = inputTipoUsuario?.value || "";

      if (!tipo)  { mostrarErro("Selecione um perfil antes de entrar."); return; }
      if (!id)    { identificadorInput?.classList.add("campo-invalido"); mostrarErro("Informe seu e-mail ou CPF."); return; }
      if (!senha) { senhaInput?.classList.add("campo-invalido"); mostrarErro("Informe sua senha."); return; }

      const usuario = usuariosTeste[tipo];
      const isAdmin = id === "adm@adm.com" && senha === "1234";
      if (!isAdmin && (!usuario || id !== usuario.email || senha !== usuario.senha)) {
        identificadorInput?.classList.add("campo-invalido");
        senhaInput?.classList.add("campo-invalido");
        mostrarErro("E-mail ou senha incorretos.");
        return;
      }

      identificadorInput?.classList.remove("campo-invalido");
      senhaInput?.classList.remove("campo-invalido");
      const destino = isAdmin
        ? (usuariosTeste[tipo]?.destino || "index.html")
        : usuario.destino;
      window.location.href = destino;
    });

    [identificadorInput, senhaInput].forEach((c) => {
      if (c) c.addEventListener("input", () => { c.classList.remove("campo-invalido"); mostrarErro(""); });
    });
  }
}

// ─────────────────────────────────────────────────────────────
// INICIALIZAÇÃO
// ─────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  iniciarNavbar();
  iniciarSmoothScroll();

  iniciarPaginaInicio();
  iniciarPaginaSobre();
  iniciarPaginaFaq();
  iniciarPaginaImpacto();
  iniciarPaginaFamilia();
  iniciarPaginaComoFunciona();
  iniciarPaginaVoluntario();
  iniciarPaginaDoador();
  iniciarPaginaEmpresa();
  iniciarPaginaContato();
  iniciarPaginaCadastro();
  iniciarTelaLogin();
});
