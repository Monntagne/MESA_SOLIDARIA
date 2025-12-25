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













document.addEventListener("DOMContentLoaded", () => {
  const carregarFragmento = (idDestino, caminho) => {
    const destino = document.getElementById(idDestino);
    if (!destino) return;

    fetch(caminho)
      .then((res) => res.text())
      .then((html) => {
        destino.innerHTML = html;
      })
      .catch((erro) => {
        console.error(`Erro ao carregar ${caminho}:`, erro);
      });
  };

  carregarFragmento("area-navbar", "../../Navegacao/Navbar/navbar.html");
  carregarFragmento("area-footer", "../../Navegacao/Footer/footer.html");

  const paginaCadastro = document.querySelector(".pagina-cadastro-beneficiario");
  if (!paginaCadastro) return;

  const formulario = paginaCadastro.querySelector(".formulario-cadastro-beneficiario");

  const nomeInput = document.getElementById("nome-completo");
  const cpfInput = document.getElementById("cpf");
  const telefoneInput = document.getElementById("telefone");
  const emailInput = document.getElementById("email");
  const dataNascimentoInput = document.getElementById("data-nascimento");

  const cepInput = document.getElementById("cep");
  const cidadeInput = document.getElementById("cidade");
  const estadoInput = document.getElementById("estado");
  const bairroInput = document.getElementById("bairro");
  const logradouroInput = document.getElementById("logradouro");
  const numeroInput = document.getElementById("numero");

  const moradoresInput = document.getElementById("quantidade-moradores");
  const rendaSelect = document.getElementById("renda-familiar");

  const restricoesInput = document.getElementById("restricoes-alimentares");
  const observacoesInput = document.getElementById("observacoes");

  const senhaInput = document.getElementById("senha-acesso");
  const confirmacaoInput = document.getElementById("confirmacao-senha");

  const blocoEndereco = document.getElementById("bloco-endereco");
  const blocoSituacao = document.getElementById("bloco-situacao-familiar");
  const blocoSaude = document.getElementById("bloco-saude-alimentacao");
  const blocoAcesso = document.getElementById("bloco-acesso-plataforma");

  const erroEmail = document.getElementById("erro-email");
  const erroSenha = document.getElementById("erro-senha");
  const erroConfirmacao = document.getElementById("erro-confirmacao-senha");
  const erroDataNascimento = document.getElementById("erro-data-nascimento");

  const botaoPrincipal = document.querySelector(".botao-principal-cadastro");

  if (!formulario) return;

  let enderecoLiberado = false;
  let situacaoLiberada = false;
  let saudeLiberada = false;

  if (blocoEndereco) blocoEndereco.style.display = "none";
  if (blocoSituacao) blocoSituacao.style.display = "none";
  if (blocoSaude) blocoSaude.style.display = "none";
  if (blocoAcesso) blocoAcesso.style.display = "none";

  // função pra trocar o texto do botão
  const atualizarTextoBotao = () => {
    if (!botaoPrincipal) return;

    const acessoVisivel =
      blocoAcesso && blocoAcesso.style.display !== "none";

    if (acessoVisivel) {
      botaoPrincipal.textContent = "Concluir cadastro";
    } else {
      botaoPrincipal.textContent = "Continuar";
    }
  };

  atualizarTextoBotao();

  let dataMinima = null;
  let dataMaxima = null;

  if (dataNascimentoInput) {
    const hoje = new Date();

    dataMaxima = new Date(
      hoje.getFullYear() - 18,
      hoje.getMonth(),
      hoje.getDate()
    );

    dataMinima = new Date(
      hoje.getFullYear() - 100,
      hoje.getMonth(),
      hoje.getDate()
    );

    const formatarData = (data) => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const dia = String(data.getDate()).padStart(2, "0");
      return `${ano}-${mes}-${dia}`;
    };

    dataNascimentoInput.max = formatarData(dataMaxima);
    dataNascimentoInput.min = formatarData(dataMinima);
  }

  const limparErros = () => {
    if (erroEmail) erroEmail.textContent = "";
    if (erroSenha) erroSenha.textContent = "";
    if (erroConfirmacao) erroConfirmacao.textContent = "";
    if (erroDataNascimento) erroDataNascimento.textContent = "";

    [
      emailInput,
      senhaInput,
      confirmacaoInput,
      dataNascimentoInput,
      nomeInput,
      cpfInput,
      telefoneInput
    ].forEach((campo) => {
      if (campo) campo.classList.remove("campo-invalido");
    });
  };

  const validarEmail = () => {
    if (!emailInput || !erroEmail) return true;

    erroEmail.textContent = "";
    emailInput.classList.remove("campo-invalido");

    const valor = emailInput.value.trim().toLowerCase();
    emailInput.value = valor;

    const regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!valor) {
      erroEmail.textContent = "Informe um e-mail.";
      emailInput.classList.add("campo-invalido");
      return false;
    }

    if (!regexEmail.test(valor)) {
      erroEmail.textContent =
        "Digite um e-mail válido, ex: seuemail@exemplo.com.";
      emailInput.classList.add("campo-invalido");
      return false;
    }

    return true;
  };

  const validarSenha = () => {
    if (!senhaInput || !erroSenha) return true;

    erroSenha.textContent = "";
    senhaInput.classList.remove("campo-invalido");

    const valor = senhaInput.value;
    const faltando = [];

    if (!valor) {
      erroSenha.textContent = "Crie uma senha.";
      senhaInput.classList.add("campo-invalido");
      return false;
    }

    if (valor.length < 8) {
      faltando.push("no mínimo 8 caracteres");
    }
    if (!/[A-Z]/.test(valor)) {
      faltando.push("uma letra maiúscula");
    }
    if (!/[a-z]/.test(valor)) {
      faltando.push("uma letra minúscula");
    }
    if (!/\d/.test(valor)) {
      faltando.push("um número");
    }
    if (!/[^A-Za-z0-9]/.test(valor)) {
      faltando.push("um caractere especial");
    }

    if (faltando.length > 0) {
      erroSenha.textContent =
        "A senha deve conter: " + faltando.join(", ") + ".";
      senhaInput.classList.add("campo-invalido");
      return false;
    }

    return true;
  };

  const validarConfirmacaoSenha = () => {
    if (!senhaInput || !confirmacaoInput || !erroConfirmacao) return true;

    erroConfirmacao.textContent = "";
    confirmacaoInput.classList.remove("campo-invalido");

    const senha = senhaInput.value;
    const confirmacao = confirmacaoInput.value;

    if (!confirmacao) {
      erroConfirmacao.textContent = "Confirme a senha.";
      confirmacaoInput.classList.add("campo-invalido");
      return false;
    }

    if (senha !== confirmacao) {
      erroConfirmacao.textContent = "A confirmação precisa ser igual à senha.";
      confirmacaoInput.classList.add("campo-invalido");
      return false;
    }

    return true;
  };

  const validarDataNascimento = () => {
    if (!dataNascimentoInput || !erroDataNascimento) return true;

    erroDataNascimento.textContent = "";
    dataNascimentoInput.classList.remove("campo-invalido");

    const valor = dataNascimentoInput.value;
    if (!valor) {
      erroDataNascimento.textContent = "Informe a data de nascimento.";
      dataNascimentoInput.classList.add("campo-invalido");
      return false;
    }

    const dataNasc = new Date(valor);

    if (dataMinima && dataNasc < dataMinima) {
      erroDataNascimento.textContent =
        "Idade máxima para cadastro é de 100 anos.";
      dataNascimentoInput.classList.add("campo-invalido");
      return false;
    }

    if (dataMaxima && dataNasc > dataMaxima) {
      erroDataNascimento.textContent =
        "Você precisa ter pelo menos 18 anos para se cadastrar.";
      dataNascimentoInput.classList.add("campo-invalido");
      return false;
    }

    return true;
  };

  const validarDadosPessoaisBasico = () => {
    let ok = true;

    if (!nomeInput || !cpfInput || !telefoneInput || !dataNascimentoInput || !emailInput) {
      return false;
    }

    const nome = nomeInput.value.trim();
    const telefoneMascara = telefoneInput.value;
    const telefoneNumerico = telefoneMascara.replace(/\D/g, "");
    const cpfNumerico = cpfInput.value.replace(/\D/g, "");

    [nomeInput, cpfInput, telefoneInput].forEach((campo) => {
      if (campo) campo.classList.remove("campo-invalido");
    });

    if (!nome) {
      nomeInput.classList.add("campo-invalido");
      ok = false;
    }

    if (cpfNumerico.length !== 11) {
      cpfInput.classList.add("campo-invalido");
      ok = false;
    }

    if (!telefoneNumerico || telefoneNumerico.length !== 11) {
      telefoneInput.classList.add("campo-invalido");
      ok = false;
    }

    if (!validarEmail()) ok = false;
    if (!validarDataNascimento()) ok = false;

    return ok;
  };

  const validarEnderecoBasico = () => {
    if (!cepInput || !cidadeInput || !estadoInput || !bairroInput || !logradouroInput || !numeroInput) {
      return false;
    }

    const cepNumerico = cepInput.value.replace(/\D/g, "");

    if (cepNumerico.length !== 8) return false;
    if (!cidadeInput.value.trim()) return false;
    if (!estadoInput.value.trim()) return false;
    if (!bairroInput.value.trim()) return false;
    if (!logradouroInput.value.trim()) return false;
    if (!numeroInput.value.trim()) return false;

    return true;
  };

  const validarSituacaoBasico = () => {
    if (!moradoresInput || !rendaSelect) return false;

    const moradores = parseInt(moradoresInput.value, 10);
    if (Number.isNaN(moradores) || moradores < 1) return false;
    if (!rendaSelect.value) return false;

    return true;
  };

  const validarSaudeBasico = () => {
    return true;
  };

  const tentarLiberarEndereco = () => {
    if (enderecoLiberado || !blocoEndereco) return;
    if (validarDadosPessoaisBasico()) {
      blocoEndereco.style.display = "block";
      enderecoLiberado = true;
      atualizarTextoBotao();
    }
  };

  const tentarLiberarSituacao = () => {
    if (!enderecoLiberado || situacaoLiberada || !blocoSituacao) return;
    if (validarEnderecoBasico()) {
      blocoSituacao.style.display = "block";
      situacaoLiberada = true;
      atualizarTextoBotao();
    }
  };

  const tentarLiberarSaude = () => {
    if (!situacaoLiberada || saudeLiberada || !blocoSaude) return;
    if (validarSituacaoBasico()) {
      blocoSaude.style.display = "block";
      saudeLiberada = true;
      atualizarTextoBotao();
    }
  };

  const tentarLiberarAcesso = () => {
    if (!saudeLiberada || !blocoAcesso) return;
    if (validarSaudeBasico()) {
      blocoAcesso.style.display = "block";
      atualizarTextoBotao();
    }
  };

  // CEP
  if (cepInput) {
    cepInput.addEventListener("input", () => {
      let valor = cepInput.value;
      valor = valor.replace(/\D/g, "");

      if (valor.length > 8) {
        valor = valor.slice(0, 8);
      }

      if (valor.length > 5) {
        cepInput.value = valor.slice(0, 5) + "-" + valor.slice(5);
      } else {
        cepInput.value = valor;
      }
    });
  }

  // CPF
  if (cpfInput) {
    cpfInput.addEventListener("input", () => {
      cpfInput.classList.remove("campo-invalido");

      let valor = cpfInput.value;
      valor = valor.replace(/\D/g, "");

      if (valor.length > 11) {
        valor = valor.slice(0, 11);
      }

      if (valor.length > 9) {
        cpfInput.value =
          valor.slice(0, 3) +
          "." +
          valor.slice(3, 6) +
          "." +
          valor.slice(6, 9) +
          "-" +
          valor.slice(9);
      } else if (valor.length > 6) {
        cpfInput.value =
          valor.slice(0, 3) + "." + valor.slice(3, 6) + "." + valor.slice(6);
      } else if (valor.length > 3) {
        cpfInput.value = valor.slice(0, 3) + "." + valor.slice(3);
      } else {
        cpfInput.value = valor;
      }
    });
  }

  // Telefone
  if (telefoneInput) {
    telefoneInput.addEventListener("input", () => {
      telefoneInput.classList.remove("campo-invalido");

      let valor = telefoneInput.value;
      valor = valor.replace(/\D/g, "");

      if (valor.length > 11) {
        valor = valor.slice(0, 11);
      }

      if (!valor) {
        telefoneInput.value = "";
        return;
      }

      if (valor.length <= 2) {
        telefoneInput.value = "(" + valor;
      } else if (valor.length <= 7) {
        telefoneInput.value =
          "(" + valor.slice(0, 2) + ") " + valor.slice(2);
      } else {
        telefoneInput.value =
          "(" +
          valor.slice(0, 2) +
          ") " +
          valor.slice(2, 7) +
          "-" +
          valor.slice(7);
      }
    });
  }

  if (nomeInput) {
    nomeInput.addEventListener("input", () => {
      nomeInput.classList.remove("campo-invalido");
    });
  }

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      emailInput.value = emailInput.value.toLowerCase();
      if (erroEmail) erroEmail.textContent = "";
      emailInput.classList.remove("campo-invalido");
    });
  }

  if (senhaInput) {
    senhaInput.addEventListener("input", () => {
      erroSenha.textContent = "";
      senhaInput.classList.remove("campo-invalido");
      validarSenha();
    });
  }

  if (confirmacaoInput) {
    confirmacaoInput.addEventListener("input", () => {
      erroConfirmacao.textContent = "";
      confirmacaoInput.classList.remove("campo-invalido");
      validarConfirmacaoSenha();
    });
  }

  if (dataNascimentoInput) {
    dataNascimentoInput.addEventListener("change", () => {
      erroDataNascimento.textContent = "";
      dataNascimentoInput.classList.remove("campo-invalido");
      validarDataNascimento();
    });
  }

  [nomeInput, cpfInput, telefoneInput, emailInput, dataNascimentoInput].forEach(
    (campo) => {
      if (campo) {
        campo.addEventListener("blur", tentarLiberarEndereco);
      }
    }
  );

  [cepInput, cidadeInput, estadoInput, bairroInput, logradouroInput, numeroInput].forEach(
    (campo) => {
      if (campo) {
        campo.addEventListener("blur", tentarLiberarSituacao);
      }
    }
  );

  [moradoresInput, rendaSelect].forEach((campo) => {
    if (campo) {
      campo.addEventListener("blur", tentarLiberarSaude);
    }
  });

  [restricoesInput, observacoesInput].forEach((campo) => {
    if (campo) {
      campo.addEventListener("blur", tentarLiberarAcesso);
    }
  });

  formulario.addEventListener("submit", (event) => {
    limparErros();

    let valido = true;
    if (!validarDadosPessoaisBasico()) valido = false;
    if (!validarEmail()) valido = false;
    if (!validarSenha()) valido = false;
    if (!validarConfirmacaoSenha()) valido = false;
    if (!validarDataNascimento()) valido = false;

    if (!valido) {
      event.preventDefault();
    }
  });
});
