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

  carregarFragmento("area-navbar", "../Navegacao/Navbar/navbar.html");
  carregarFragmento("area-footer", "../Navegacao/Footer/footer.html");

  const paginaLogin = document.querySelector(".pagina-login");
  if (!paginaLogin) return;

  const cartoesPerfil = paginaLogin.querySelectorAll(".cartao-perfil");
  const colunaFormulario = paginaLogin.querySelector(".coluna-formulario");
  const tituloLogin = paginaLogin.querySelector(".titulo-login");
  const campoTipoUsuario = document.getElementById("tipo-usuario");
  const formularioLogin = paginaLogin.querySelector(".formulario-login");
  const entradaIdentificador = document.getElementById("entrada-identificador");
  const entradaSenha = document.getElementById("entrada-senha");
  const tituloPadrao = tituloLogin?.textContent || "Entre na sua conta";

  if (!cartoesPerfil.length || !colunaFormulario || !tituloLogin) return;

  const esconderFormulario = () => {
    colunaFormulario.style.display = "none";
    cartoesPerfil.forEach((c) => c.classList.remove("selecionado"));
    tituloLogin.textContent = tituloPadrao;
    if (campoTipoUsuario) {
      campoTipoUsuario.value = "";
    }
  };

  const mostrarFormulario = (cartao) => {
    colunaFormulario.style.display = "block";
    cartao.classList.add("selecionado");

    const nomePerfil = cartao
      .querySelector(".titulo-perfil")
      ?.textContent.trim();

    if (nomePerfil) {
      tituloLogin.textContent = `Entrar como ${nomePerfil}`;
      if (campoTipoUsuario) {
        campoTipoUsuario.value = nomePerfil.toLowerCase();
      }
    }
  };

  esconderFormulario();

  cartoesPerfil.forEach((cartao) => {
    cartao.addEventListener("click", () => {
      const jaSelecionado = cartao.classList.contains("selecionado");

      if (jaSelecionado) {
        esconderFormulario();
      } else {
        esconderFormulario();
        mostrarFormulario(cartao);
      }
    });
  });

  const usuarioTeste = {
    identificador: "silvasantosviniccius@gmail.com",
    cpf: "38971590823",
    senha: "123456",
    tipoUsuario: "voluntário"
  };

  if (formularioLogin && entradaIdentificador && entradaSenha) {
    formularioLogin.addEventListener("submit", (event) => {
      event.preventDefault();

      const ident = entradaIdentificador.value.trim();
      const senha = entradaSenha.value.trim();
      const tipo = campoTipoUsuario ? campoTipoUsuario.value : "";

      const credenciaisOk =
  (ident === usuarioTeste.identificador) ||
  (usuarioTeste.cpf && senha === usuarioTeste.senha && (tipo === "voluntário" || tipo === usuarioTeste.tipoUsuario));


      if (credenciaisOk) {
        window.location.href = "pagina_pos_login.html";
      } else {
        alert("Usuário ou senha inválidos para este perfil de acesso.");
      }
    });
  }
});
