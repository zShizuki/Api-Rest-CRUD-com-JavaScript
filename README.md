# 🚀 API REST em JavaScript com Node.js  

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" height="40px">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" height="40px">
  <img src="https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white" height="40px">
  <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white" height="40px">
</p>

## 📌 Sobre o projeto
Esta API REST foi desenvolvida utilizando **Node.js**, **Express.js** e **MySQL**.  
Ela permite o **gerenciamento de categorias e vídeos**, oferecendo operações CRUD (Create, Read, Update, Delete).  

## 🚀 Tecnologias
- **Node.js** - Ambiente de execução JavaScript.  
- **Express.js** - Framework para criação de APIs.  
- **MySQL** - Banco de dados relacional.  
- **Jest** - Testes automatizados.  
- **ESLint Airbnb** - Padrões de código.  

---

## 📦 Instalação

### 🔹 1. Clonar o repositório
```bash
git clone https://github.com/zShizuki/Api-Rest-CRUD-com-JavaScript.git
cd Api-Rest-CRUD-com-JavaScript
```

### 🔹 2. Instalar as dependências
```bash
npm install
```

### 🔹 3. Configurar o Banco de Dados
- Rode um **banco de dados MySQL** (pode usar o XAMPP, WAMP, ou um banco online).  
- Crie um banco de dados chamado `api_database`.  
- Configure as credenciais no arquivo `.db`.

### 🔹 4. Iniciar o servidor
```bash
npm start
```

---

## 🎲 Tabelas do Banco de Dados

### 📌 Tabela: `informacoes`
Guarda informações sobre os vídeos, vinculando-os a categorias.  
```sql
CREATE TABLE informacoes (
  ID INT(11) NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(30) DEFAULT NULL,
  descricao VARCHAR(50) DEFAULT NULL,
  url VARCHAR(50) DEFAULT NULL,
  categoriaId INT(11) DEFAULT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (categoriaId) REFERENCES categoria (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### 📌 Tabela: `categoria`
Armazena as categorias dos vídeos.  
```sql
CREATE TABLE categoria (
  ID INT(11) NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(50) DEFAULT NULL,
  cor VARCHAR(30) DEFAULT NULL,
  PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

---

## ⚙ Testes  

### 🔹 Rodar um teste único  
```bash
npm test
```

### 🔹 Rodar testes em modo observação  
```bash
npm run test:watch
```

### 🔹 Gerar relatório de cobertura de testes  
```bash
npm run test:coverage
```

---

## 📌 Endpoints da API  

### 🔹 Categorias  
| Método  | Rota                 | Descrição                         |
|---------|----------------------|-----------------------------------|
| **GET** | `/categorias`        | Retorna todas as categorias.     |
| **GET** | `/categorias/:id`    | Retorna uma categoria específica. |
| **GET** | `/categorias/:id/videos` | Retorna vídeos de uma categoria. |
| **POST** | `/categorias`       | Cria uma nova categoria.         |
| **PATCH** | `/categorias/:id`  | Atualiza uma categoria.          |
| **DELETE** | `/categorias/:id` | Remove uma categoria.            |

### 🔹 Vídeos  
| Método  | Rota                 | Descrição                         |
|---------|----------------------|-----------------------------------|
| **GET** | `/videos`            | Retorna todos os vídeos.         |
| **GET** | `/videos/:id`        | Retorna um vídeo específico.     |
| **GET** | `/videos/?search=`   | Retorna vídeos filtrados por título. |
| **POST** | `/videos`           | Cria um novo vídeo.              |
| **PATCH** | `/videos/:id`      | Atualiza um vídeo existente.     |
| **DELETE** | `/videos/:id`     | Remove um vídeo.                 |

---
