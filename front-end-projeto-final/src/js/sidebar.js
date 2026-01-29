import { getMe } from '../api/users.js';

const sidebar = document.querySelector('.sidebar');

const response = await getMe();
console.log(response); // DEBUG

const { first_name, last_name, matricula, role_name } = response.data;

function renderMenu(role) {
  switch (role) {
    case 'ADM':
      return `
        <li><a href="../pages/dashboard.html">Home</a></li>
        <li><a href="../pages/meus-dados.html">Meus Dados</a></li>
        <li><a href="../pages/lista-usuarios.html">Usuários</a></li>
        <li><a href="../pages/lista-produtos.html">Produtos</a></li>
        <li><a href="../pages/lista-movimentacoes.html">Movimentações</a></li>
      `;

    case 'TI':
      return `
        <li><a href="../pages/dashboard.html">Home</a></li>
        <li><a href="../pages/meus-dados.html">Meus Dados</a></li>
        <li><a href="../pages/lista-usuarios.html">Gerenciar Usuários</a></li>
      `;

    case 'Supervisor':
      return `
        <li><a href="../pages/dashboard.html">Home</a></li>
        <li><a href="../pages/meus-dados.html">Meus Dados</a></li>
        <li><a href="../pages/lista-produtos.html">Produtos</a></li>
        <li><a href="../pages/lista-movimentacoes.html">Movimentações</a></li>
      `;

    case 'Almoxarife':
      return `
        <li><a href="../pages/dashboard.html">Home</a></li>
        <li><a href="../pages/meus-dados.html">Meus Dados</a></li>
        <li><a href="../pages/lista-movimentacoes.html">Movimentações</a></li>
        <li><a href="../pages/lista-produtos.html">Produtos</a></li>
      `;

    case 'Auxiliar de Almoxarife':
      return `
        <li><a href="../pages/dashboard.html">Home</a></li>
        <li><a href="../pages/meus-dados.html">Meus Dados</a></li>
        <li><a href="../pages/movimentacoes.html">Movimentações</a></li>
      `;

    case 'Estoquista':
      return `
        <li><a href="../pages/dashboard.html">Home</a></li>
        <li><a href="../pages/meus-dados.html">Meus Dados</a></li>
        <li><a href="../pages/lista-produtos.html">Produtos</a></li>
      `;

    case 'RH':
      return `
        <li><a href="../pages/dashboard.html">Home</a></li>
        <li><a href="../pages/meus-dados.html">Meus Dados</a></li>
        <li><a href="../pages/funcionarios.html">Funcionários</a></li>
        <li><a href="../pages/relatorios.html">Relatórios</a></li>
      `;

    default:
      return `<li><a href="../dashboard.html">Home</a></li>`;
  }
}


sidebar.innerHTML = `
   <div class="constainer-user-info">
        <img src="../assets/user-icon.png" alt="" class="user-icon">
        <div class="user-infos">
            <h3 class="nome-txt">
              ${(last_name?.length > 12) ? first_name : `${first_name} ${last_name ||''}`}
            </h3>
            <p class="cargo-txt">${role_name}</p>
        </div>
    </div>
  <ul class="menu">
    ${renderMenu(role_name)}
  </ul>

   <button id="btn-logout" class="btn-logout">
    Sair
  </button>
`;


const btnLogout = document.querySelector('#btn-logout');

btnLogout.addEventListener('click', () => {
  localStorage.removeItem('authToken');
  window.location.href = '/index.html';
});