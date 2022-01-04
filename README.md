# LuizaLabs - Wishlist

## ⚡ Sobre
A aplicação é uma Api REST desenvolvida para o desafio da Magalu que tem como objetivo a criação de uma funcionalidade de favoritar produtos para clientes, utilizando uma API de produtos da propria magalu. Antes disso, deve ser possivel criar, atualizar, listar e remover clientes.
Foi feito um sistema de login admin para autenticação e autorização das rotas.


## ⚡ Techs
Esse projeto foi desenvolvido utilizando as seguintes tecnologias e ferramentas:

- Typescript
- NodeJS
- Axios
- Postgres
- Knex
- Jest


## ⚡ Executando o Projeto

1. Faça um clone:

```sh
  $ git clone https://github.com/neaar3/wishlist-luizalabs.git
```

2. Entre na pasta da aplicação:

  - Crie um arquivo ``.env`` na raiz do projeto.
  - Copie o conteúdo do arquivo .env.example e cole no seu arquivo ``.env``.

3. Adicione as chaves de acesso no ``.env``.

  No fim, o seu .env deve ser parecido com isso: 
  ```ts
    DB_HOST=localhost
    DB_PORT=porta_do_database
    DB_USER=seu_username
    DB_PASSWORD=sua_senha
    DATABASE=wishlist
    PORT=porta_local
    USERNAME_ADMIN=um_nome_de_usuario
    PASSWORD_ADMIN=uma_senha
    SECRET=wishlist
  ```
4. Instale as depedências:
```sh
  # Instale as dependências
  npm ci
```

5. Crie um banco com o mesmo nome que você colocou no item DATABASE do seu env.
```sh
  CREATE DATABASE database (database minusculo => arquivo env)
```

6. Ajuste o banco de dados com os seguintes comandos:
```sh
  # Crie as tabelas
  npm run migrate:latest
```

7. Execute a aplicação:
```sh
  # Inicie a API
  npm run dev
```

Assim que a mensagem ``Running on http://localhost:porta_local`` aparecerer em seu terminal, você ja pode fazer suas requisições.

Caso queira rodar os testes, use o comando abaixo:

```sh
  npm run test
```
## ⚡ Rotas

Como a aplicação estará executando em ambiente local, utilize o endereço ``http://localhost:SUA_PORTA_ENV`` como baseUrl.

A aplicação possue diversos endpoints e aceita requisições do tipo GET, POST, PUT e DELETE, sendo elas: 


  - ``POST /login``
  Loga como admin conferindo com os dados fornecidos no arquivo ENV. É necessario passar username e password no body.


  Para todas as requisições abaixo, deve ser passado o token para autenticação. O token vem como resposta do /login.

  - ``POST /customer``
  Cria um cliente no banco de dados. É necessario passar name e email no body.
  - ``PUT /customer/:id``
  Atualiza um cliente no banco de dados. É necessario passar name ou email no body para atualizar e id do usuario a ser editado como parametro na url.
  - ``DELETE /customer/:id``
  Remove um cliente no banco de dados. É necessario passar id do usuario a ser removido como parametro na url.
  - ``GET /customer/:id``
  Detalha um cliente especifico cadastrado. É necessario passar id do usuario a ser detalhado como parametro na url
  - ``GET /customer``
  Detalha todos os clientes cadastrados.

  - ``GET /product``
  Lista todos os produtos de um determinado cliente. É necessario passar o id do cliente como customerId no body.
  - ``POST /product/:id``
  Cadastra um produto para um cliente no banco de dados. É necessario passar o id do produto a ser cadastrado como parametro na url e id do cliente como customerId no body.
  - ``DELETE /product/:id``
  Remove um produto de um cliente no banco de dados. É necessario passar o id do produto a ser removido como parametro na url e id do cliente como customerId no body.


---
<h4 align="center">
    Feito por <a href="https://www.linkedin.com/in/iago-tostes/" target="_blank">Iago Tostes</a>
</h4>
