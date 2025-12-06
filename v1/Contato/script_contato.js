document.addEventListener("DOMContentLoaded", () => {
  carregarFragmento("../Navegacao/Navbar/navbar.html", "area-navbar");
  carregarFragmento("../Navegacao/Footer/footer.html", "area-footer");

  const botoesPerfil = document.querySelectorAll(".botao-perfil");
  const textoPerfilSelecionado = document.getElementById("texto-perfil-selecionado");
  const inputPerfil = document.getElementById("perfil-contato");

  const formulario = document.getElementById("form-contato");
  const mensagemErro = document.getElementById("mensagem-erro-formulario");
  const mensagemSucesso = document.getElementById("mensagem-sucesso-formulario");

  if (!formulario) return;

  function atualizarPerfil(perfil) {
    if (textoPerfilSelecionado) textoPerfilSelecionado.textContent = perfil;
    if (inputPerfil) inputPerfil.value = perfil;
  }

  if (botoesPerfil.length) {
    botoesPerfil.forEach((botao) => {
      botao.addEventListener("click", () => {
        botoesPerfil.forEach((b) => b.classList.remove("botao-perfil-ativo"));
        botao.classList.add("botao-perfil-ativo");

        const perfil = botao.getAttribute("data-perfil") || botao.textContent.trim();
        atualizarPerfil(perfil);
      });
    });

    const botaoInicial =
      document.querySelector(".botao-perfil.botao-perfil-ativo") || botoesPerfil[0];

    if (botaoInicial) {
      const perfilPadrao = botaoInicial.getAttribute("data-perfil") || "Beneficiário";
      atualizarPerfil(perfilPadrao);
    }
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (mensagemErro) mensagemErro.textContent = "";
    if (mensagemSucesso) mensagemSucesso.textContent = "";

    const nome = (document.getElementById("nome-contato")?.value || "").trim();
    const email = (document.getElementById("email-contato")?.value || "").trim();
    const telefone = (document.getElementById("telefone-contato")?.value || "").trim();
    const assunto = document.getElementById("assunto-contato")?.value || "";
    const mensagem = (document.getElementById("mensagem-contato")?.value || "").trim();
    const aceite = document.getElementById("aceite-contato")?.checked || false;
    const perfil = inputPerfil?.value || "";

    const erros = [];

    if (!nome) erros.push("Informe seu nome completo.");
    if (!email) {
      erros.push("Informe um e-mail para contato.");
    } else if (!validarEmail(email)) {
      erros.push("Informe um e-mail válido.");
    }
    if (!assunto) erros.push("Selecione um assunto.");
    if (!mensagem) erros.push("Escreva uma mensagem para a equipe.");
    if (!perfil) erros.push("Selecione se você é beneficiário, doador, voluntário ou ponto de coleta.");
    if (!aceite) erros.push("Confirme a autorização de contato para continuar.");

    if (erros.length > 0) {
      if (mensagemErro) mensagemErro.textContent = erros.join(" ");
      return;
    }

    if (mensagemSucesso) {
      mensagemSucesso.textContent =
        "Mensagem enviada com sucesso! Nossa equipe do Mesa Solidária retornará em breve.";
    }

    formulario.reset();

    if (botoesPerfil.length) {
      botoesPerfil.forEach((b) => b.classList.remove("botao-perfil-ativo"));
      const primeiro = botoesPerfil[0];
      if (primeiro) {
        primeiro.classList.add("botao-perfil-ativo");
        const perfilPadrao = primeiro.getAttribute("data-perfil") || "Beneficiário";
        atualizarPerfil(perfilPadrao);
      }
    }
  });

  function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
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
});
