const nomeUsuario = document.querySelector("#usuario");
const senha = document.querySelector("#senha");

async function verificarCredenciais() {
  // Guarda os valores com .value e usa o trim() para ignorar espaços em branco
  const usuarioValor = nomeUsuario.value.trim();
  const senhaValor = senha.value.trim();

  // Verificar se os campos estão vazios
  if (usuarioValor === "" || senhaValor === "") {
    alert("Preencha os campos obrigatórios");
    return;
  }

  // Guarda as informações da api que ja foram convertidas em formato JSON
  const usuarios = await buscarUsuarios();

  // Arrow Function que utiliza o .find() para procurar, dentro do array de usuários, um objeto que corresponda às credenciais digitadas.
  const usuarioEncontrado = usuarios.find((procurandoUsuario) => {
    return (
      procurandoUsuario.username === usuarioValor &&
      procurandoUsuario.email === senhaValor
    );
  });

  // Verifica se usuarioEncontrado retorna um objeto ou seja (Usuario encontrado)
  if (usuarioEncontrado) {
    alert("Login realizado com sucesso!");
    window.location.href = "galeria.html";
    return;
  } else {
    alert("Credenciais inválidas.");
    return;
  }
}

// Função para acessar API e converter os dados em formato JSON
async function buscarUsuarios() {
  const resposta = await fetch("https://jsonplaceholder.typicode.com/users");
  const usuarios = await resposta.json();
  return usuarios;
}

voltarLogin.addEventListener('click', () => {
    const confirmacao = confirm('Deseja realmente voltar a pagina de Login?')
    if (confirmacao){
        window.location.href = "index.html"    
    }
})