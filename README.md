# API REST em JavaScript com Node.js

<table>
  <tr>
    <td>
      <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" width="150px" height="50px">
      <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" width="150px" height="50px">
      <img src="https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white" width="150px" height="50px">
      <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white" width="150px" height="50px">
    </td>
  </tr>
</table>

## 📌 Sobre o projeto
Este projeto consiste em uma API REST desenvolvida em JavaScript utilizando Node.js e MySQL como banco de dados.

## 🚀 Tecnologias
- Node.js
- Express.js
- MySQL
- Jest
- Eslint Airbnb

## 📦 Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/zShizuki/Api-Rest-CRUD-com-JavaScript.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Rode um banco de dados mySql usando softwares como XAMPP
   
## ▶️ Execução
Inicie o servidor com o comando:
```bash
npm start
```

## 📌 Endpoints

<table>
  <tr>
    <td>
      <h3>Categorias</h3>
      <table>
        <tr>
          <th>Método</th>
          <th>Rota</th>
          <th>Descrição</th>
        </tr>
        <tr>
          <td>GET</td>
          <td>/categorias</td>
          <td>Retorna todas as categorias</td>
        </tr>
        <tr>
          <td>GET</td>
          <td>/categorias/:id</td>
          <td>Retorna uma categoria específica</td>
        </tr>
        <tr>
          <td>POST</td>
          <td>/categorias</td>
          <td>Criar uma nova categoria</td>
        </tr>
        <tr>
          <td>PATCH</td>
          <td>/categorias/:id</td>
          <td>Atualiza uma categoria existente</td>
        </tr>
        <tr>
          <td>DELETE</td>
          <td>/categorias/:id</td>
          <td>Remove uma categoria</td>
        </tr>
      </table>
    </td>
    <td>
      <h3>Vídeos</h3>
      <table>
        <tr>
          <th>Método</th>
          <th>Rota</th>
          <th>Descrição</th>
        </tr>
        <tr>
          <td>GET</td>
          <td>/videos</td>
          <td>Retorna todos os vídeos</td>
        </tr>
        <tr>
          <td>GET</td>
          <td>/videos/?search=</td>
          <td>Retorna vídeos com o titulo</td>
        </tr>
        <tr>
          <td>GET</td>
          <td>/videos/:id</td>
          <td>Retorna um vídeo específico</td>
        </tr>
        <tr>
          <td>POST</td>
          <td>/videos</td>
          <td>Criar um novo vídeo</td>
        </tr>
        <tr>
          <td>PATCH</td>
          <td>/videos/:id</td>
          <td>Atualiza um vídeo existente</td>
        </tr>
        <tr>
          <td>DELETE</td>
          <td>/videos/:id</td>
          <td>Remove um vídeo</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
