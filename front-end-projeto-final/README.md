# Projeto Final — Front-End

Este repositório contém o **Front-end** do Projeto Final, desenvolvido com foco em simplicidade, acessibilidade e fácil entendimento por todos os membros do grupo.

## Objetivo

O objetivo do front-end é fornecer uma interface clara e funcional para consumo da API do projeto, garantindo uma boa experiência de uso sem dependência de frameworks externos.

## Tecnologias Utilizadas

- **HTML5** — Estruturação das páginas
- **CSS3** — Estilização e layout responsivo
- **JavaScript (Vanilla)** — Lógica da aplicação e comunicação com a API

## Decisões Técnicas

- Não utilizamos frameworks ou bibliotecas externas para tornar o código mais acessível e fácil de manter por todos os integrantes do grupo.
- As requisições para a API são feitas utilizando a função nativa `fetch()`.
- O token de autenticação é armazenado no `localStorage`, permitindo persistência da sessão do usuário.
- A organização do código prioriza legibilidade e separação clara de responsabilidades.

## Comunicação com a API

- Todas as requisições seguem o padrão REST.
- O token de autenticação é enviado via headers quando necessário.
- Tratamento básico de erros é implementado para melhorar a experiência do usuário.

## Estrutura do Projeto

- Arquivos HTML responsáveis pela estrutura das páginas
- Arquivos CSS para estilos globais e específicos
- Arquivos JavaScript para lógica, eventos e integração com a API
