document.addEventListener("DOMContentLoaded", () => {
  const formulario =
    document.getElementById("form-cadastro-beneficiario") ||
    document.querySelector(".formulario-cadastro-beneficiario");

  if (!formulario) return;

  const botaoPrincipal =
    document.getElementById("botao-principal-cadastro") ||
    formulario.querySelector(".botao-principal-cadastro");

  const overlay = document.getElementById("overlay-confirmacao");
  const botaoOk = document.getElementById("botao-confirmacao");

  const cpfInput = document.getElementById("cpf");
  const telefoneInput = document.getElementById("telefone");
  const cepInput = document.getElementById("cep");
  const emailInput = document.getElementById("email");
  const dataNascimentoInput = document.getElementById("data-nascimento");
  const senhaInput = document.getElementById("senha-acesso");
  const confirmacaoSenhaInput = document.getElementById("confirmacao-senha");

  const erroEmail = document.getElementById("erro-email");
  const erroDataNascimento = document.getElementById("erro-data-nascimento");
  const erroSenha = document.getElementById("erro-senha");
  const erroConfirmacaoSenha = document.getElementById("erro-confirmacao-senha");

  const blocoEndereco = document.getElementById("bloco-endereco");
  const blocoSituacao = document.getElementById("bloco-situacao-familiar");
  const blocoSaude = document.getElementById("bloco-saude-alimentacao");
  const blocoAcesso = document.getElementById("bloco-acesso-plataforma");

  const blocosEtapas = [blocoEndereco, blocoSituacao, blocoSaude, blocoAcesso].filter(Boolean);

  let etapaAtual = 0;

  const destinoLogin = () => formulario.dataset.redirecionar || "login.html";

  const abrirPopup = () => {
    if (overlay) overlay.classList.add("ativo");
  };

  const fecharPopup = () => {
    if (overlay) overlay.classList.remove("ativo");
  };

  const somenteDigitos = (v) => (v || "").replace(/\D/g, "");

  const aplicarMascaraCPF = (evento) => {
    const el = evento.target;
    const dig = somenteDigitos(el.value).slice(0, 11);
    let v = dig;

    if (dig.length > 3) v = `${dig.slice(0, 3)}.${dig.slice(3)}`;
    if (dig.length > 6) v = `${dig.slice(0, 3)}.${dig.slice(3, 6)}.${dig.slice(6)}`;
    if (dig.length > 9) v = `${dig.slice(0, 3)}.${dig.slice(3, 6)}.${dig.slice(6, 9)}-${dig.slice(9)}`;

    el.value = v;
  };

  const aplicarMascaraTelefone = (evento) => {
    const el = evento.target;
    const dig = somenteDigitos(el.value).slice(0, 11);

    if (dig.length <= 10) {
      const p1 = dig.slice(0, 2);
      const p2 = dig.slice(2, 6);
      const p3 = dig.slice(6, 10);
      el.value =
        dig.length > 6
          ? `(${p1}) ${p2}-${p3}`
          : dig.length > 2
          ? `(${p1}) ${p2}`
          : dig.length > 0
          ? `(${p1}`
          : "";
      return;
    }

    const d1 = dig.slice(0, 2);
    const d2 = dig.slice(2, 7);
    const d3 = dig.slice(7, 11);
    el.value = `(${d1}) ${d2}-${d3}`;
  };

  const aplicarMascaraCEP = (evento) => {
    const el = evento.target;
    const dig = somenteDigitos(el.value).slice(0, 8);
    el.value = dig.length > 5 ? `${dig.slice(0, 5)}-${dig.slice(5)}` : dig;
  };

  const limparErro = (input, span) => {
    if (input) input.classList.remove("campo-invalido");
    if (span) span.textContent = "";
  };

  const marcarErro = (input, span, msg) => {
    if (input) input.classList.add("campo-invalido");
    if (span) span.textContent = msg;
  };

  const validarEmailSimples = () => {
    if (!emailInput) return true;
    limparErro(emailInput, erroEmail);

    const v = emailInput.value.trim();
    if (!v) return false;

    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (!ok) {
      marcarErro(emailInput, erroEmail, "E-mail inválido.");
      return false;
    }
    return true;
  };

  const validarDataNascimento = () => {
    if (!dataNascimentoInput) return true;
    limparErro(dataNascimentoInput, erroDataNascimento);

    const v = dataNascimentoInput.value;
    if (!v) return false;

    const data = new Date(v + "T00:00:00");
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (data > hoje) {
      marcarErro(dataNascimentoInput, erroDataNascimento, "Data de nascimento não pode ser futura.");
      return false;
    }
    return true;
  };

  const validarSenha = () => {
    if (!senhaInput) return true;
    limparErro(senhaInput, erroSenha);

    const v = senhaInput.value || "";
    if (!v) return false;

    const regra = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!regra.test(v)) {
      marcarErro(
        senhaInput,
        erroSenha,
        "A senha deve ter 8+ caracteres, 1 maiúscula, números e 1 caractere especial."
      );
      return false;
    }
    return true;
  };

  const validarConfirmacaoSenha = () => {
    if (!confirmacaoSenhaInput || !senhaInput) return true;
    limparErro(confirmacaoSenhaInput, erroConfirmacaoSenha);

    const s1 = senhaInput.value || "";
    const s2 = confirmacaoSenhaInput.value || "";

    if (!s2) return false;

    if (s1 !== s2) {
      marcarErro(confirmacaoSenhaInput, erroConfirmacaoSenha, "As senhas não coincidem.");
      return false;
    }
    return true;
  };

  const validarMinimos = () => {
    const cpfOk = !cpfInput || somenteDigitos(cpfInput.value).length === 11;
    const telOk = !telefoneInput || somenteDigitos(telefoneInput.value).length >= 10;
    const cepOk = !cepInput || somenteDigitos(cepInput.value).length === 8;
    return cpfOk && telOk && cepOk;
  };

  const camposDoBloco = (bloco) =>
    Array.from(bloco.querySelectorAll("input, select, textarea"));

  const blocoVisivel = (bloco) =>
    bloco && getComputedStyle(bloco).display !== "none";

  const validarBlocosVisiveis = () => {
    const blocosParaValidar = [];

    const todosBlocos = Array.from(formulario.querySelectorAll(".bloco-formulario"));
    todosBlocos.forEach((b) => {
      if (blocoVisivel(b)) blocosParaValidar.push(b);
    });

    for (const b of blocosParaValidar) {
      for (const campo of camposDoBloco(b)) {
        if (campo.hasAttribute("required") && !campo.checkValidity()) {
          campo.reportValidity();
          return false;
        }
      }
    }

    if (!validarEmailSimples()) {
      emailInput?.focus();
      return false;
    }

    if (!validarDataNascimento()) {
      dataNascimentoInput?.focus();
      return false;
    }

    return true;
  };

  const validarFinal = () => {
    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return false;
    }

    const emailOk = validarEmailSimples();
    const dataOk = validarDataNascimento();
    const senhaOk = validarSenha();
    const confirmOk = validarConfirmacaoSenha();

    if (!emailOk || !dataOk || !senhaOk || !confirmOk) return false;
    if (!validarMinimos()) return false;

    return true;
  };

  const esconderEtapas = () => {
    blocosEtapas.forEach((b) => {
      if (b) b.style.display = "none";
    });
  };

  const mostrarEtapa = (indice) => {
    const bloco = blocosEtapas[indice];
    if (!bloco) return;
    bloco.style.display = "block";
    bloco.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const atualizarTextoBotao = () => {
    if (!botaoPrincipal) return;
    botaoPrincipal.textContent = etapaAtual < blocosEtapas.length ? "Continuar" : "Concluir cadastro";
  };

  esconderEtapas();
  atualizarTextoBotao();

  if (cpfInput) cpfInput.addEventListener("input", aplicarMascaraCPF);
  if (telefoneInput) telefoneInput.addEventListener("input", aplicarMascaraTelefone);
  if (cepInput) cepInput.addEventListener("input", aplicarMascaraCEP);

  if (emailInput) emailInput.addEventListener("blur", validarEmailSimples);
  if (dataNascimentoInput) dataNascimentoInput.addEventListener("blur", validarDataNascimento);

  if (senhaInput) {
    senhaInput.addEventListener("input", () => {
      validarSenha();
      validarConfirmacaoSenha();
    });
  }

  if (confirmacaoSenhaInput) {
    confirmacaoSenhaInput.addEventListener("input", validarConfirmacaoSenha);
  }

  if (botaoOk) {
    botaoOk.addEventListener("click", () => {
      fecharPopup();
      window.location.href = destinoLogin();
    });
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    if (etapaAtual < blocosEtapas.length) {
      const okVisiveis = validarBlocosVisiveis();
      if (!okVisiveis) return;

      mostrarEtapa(etapaAtual);
      etapaAtual += 1;
      atualizarTextoBotao();
      return;
    }

    if (!validarFinal()) return;

    abrirPopup();

    setTimeout(() => {
      window.location.href = destinoLogin();
    }, 2000);
  });
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
