const index = document.querySelector("#index");

// Array que armazena as telas do projeto
let Telas = [
  /* html */
  `
    <header>
      <h1>Login & Galeria de fotos</h1>
    </header>

    <div class="formularioLogin">

      <!-- Input nome do Usuário -->
      <label class="form-label" for="usuario">Usuário</label>
      <input class="form-input" type="text" id="usuario" name="usuario">

      <!-- Input senha do usuário -->
      <label class="form-label" for="senha">Senha</label>
      <input class="form-input" type="password" id="senha" name="senha">

      <!-- Botão para verificar credenciais -->
      <button class="form-input" style="margin-top:20px;"
        onclick="verificarCredenciais()">
        Entrar
      </button>

    </div>
  `,

  /* html */
  `
    <header>
      <h1>Galeria de fotos</h1>
      <button onclick="voltarLogin()">Sair</button>
    </header>

    <p id="mensagem">Aguardando carregamento...</p>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>TÍTULO</th>
          <th>FOTO</th>
        </tr>
      </thead>

      <tbody id="tabelaFotos"></tbody>
    </table>
  `,
];

// Função responsável por trocar as telas
function exibirTela(indiceTela) {
  index.innerHTML = `<section>${Telas[indiceTela]}</section>`;
}

// Inicia o projeto na tela de login
exibirTela(0);

// ==========================================
// FUNÇÃO DE LOGIN
// ==========================================

async function verificarCredenciais() {
  // Seleciona os campos do formulário
  const nomeUsuario = document.querySelector("#usuario");
  const senha = document.querySelector("#senha");

  // Captura os valores digitados
  const usuarioValor = nomeUsuario.value.trim();
  const senhaValor = senha.value.trim();

  // Verifica se os campos estão vazios
  if (usuarioValor === "" || senhaValor === "") {
    alert("Preencha os campos obrigatórios");
    return;
  }

  try {
    // Busca os usuários na API
    const usuarios = await buscarUsuarios();

    // Procura um usuário que corresponda às credenciais
    const usuarioEncontrado = usuarios.find((procurandoUsuario) => {
      return (
        procurandoUsuario.username === usuarioValor &&
        procurandoUsuario.email === senhaValor
      );
    });

    // Verifica se encontrou o usuário
    if (usuarioEncontrado) {
      alert("Login realizado com sucesso!");

      // Exibe a galeria
      exibirTela(1);

      // Carrega as fotos
      carregarFotos();
    } else {
      alert("Credenciais inválidas.");
    }
  } catch (erro) {
    alert("Não foi possível realizar o login. Tente novamente.");
    console.error("Erro no login:", erro);
  }
}

// ==========================================
// API DE USUÁRIOS
// ==========================================

async function buscarUsuarios() {
  const resposta = await fetch("https://jsonplaceholder.typicode.com/users");

  // Verifica se a resposta foi bem-sucedida
  if (!resposta.ok) {
    throw new Error("Erro ao consultar usuários.");
  }

  const usuarios = await resposta.json();

  return usuarios;
}

// ==========================================
// API DE FOTOS
// ==========================================

async function apiFotos() {
  const brutoApi = await fetch("https://jsonplaceholder.typicode.com/photos");

  // Verifica se a resposta foi bem-sucedida
  if (!brutoApi.ok) {
    throw new Error("Erro ao consultar fotos.");
  }

  const apiFotosJson = await brutoApi.json();

  return apiFotosJson;
}

// ==========================================
// CARREGAMENTO DA GALERIA
// ==========================================

async function carregarFotos() {
  const tabela = document.querySelector("#tabelaFotos");
  const mensagem = document.querySelector("#mensagem");

  try {
    // Exibe mensagem enquanto os dados são carregados
    mensagem.innerHTML = "Carregando fotos...";

    // Busca as fotos na API
    const fotos = await apiFotos();

    // Limita a exibição inicial a 20 fotos
    const fotosExibidas = fotos.slice(0, 20);

    // Variável que armazenará o HTML das fotos
    let conteudoTabela = "";

    // Percorre cada foto da API
    fotosExibidas.forEach((paraCadaFoto) => {
      let idFoto = paraCadaFoto.id;
      let tituloFoto = paraCadaFoto.title;
      let srcFoto = paraCadaFoto.thumbnailUrl;
      let urlFoto = paraCadaFoto.url;

      // Monta cada linha da tabela
      conteudoTabela += `
        <tr>

          <td>${idFoto}</td>

          <td>${tituloFoto}</td>

          <td>
            <a href="${urlFoto}" target="_blank"
               rel="noopener noreferrer">

              <img
                src="${srcFoto}"
                width="32"
                height="32"
                alt="${tituloFoto}"
              >

            </a>
          </td>

        </tr>
      `;
    });

    // Insere todas as fotos na tabela de uma vez
    tabela.innerHTML = conteudoTabela;

    // Remove a mensagem de carregamento
    mensagem.innerHTML = "";
  } catch (erro) {
    // Exibe mensagem caso ocorra algum problema
    mensagem.innerHTML = "Não foi possível carregar as fotos.";

    console.error("Erro ao carregar fotos:", erro);
  }
}

// ==========================================
// FUNÇÃO PARA SAIR DA GALERIA
// ==========================================

function voltarLogin() {
  // Retorna para a tela inicial
  exibirTela(0);
}
