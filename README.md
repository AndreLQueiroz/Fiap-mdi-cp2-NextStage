# 🍔 NextStage Cantina FIAP

Aplicativo mobile desenvolvido com **React Native + Expo** com o objetivo de modernizar a experiência da cantina da FIAP, permitindo que alunos realizem reservas de alimentos de forma rápida, prática e sem filas.

---

## 📌 Sobre o Projeto

O **NextStage Cantina FIAP** resolve um problema comum no ambiente acadêmico: filas longas, falta de organização e perda de tempo na hora de comprar alimentos.

A solução proposta permite que o usuário:

* Faça login e cadastro no app
* Visualize o cardápio
* Reserve itens antecipadamente
* Consulte seu histórico de reservas
* Utilize o sistema de forma contínua com sessão persistida

---

## 🚀 Evolução do CP1 → CP2

No Checkpoint 2, o projeto foi evoluído com foco em tornar o app mais próximo de um produto real:

### 🔄 Melhorias implementadas

* Sistema completo de autenticação
* Persistência de dados com AsyncStorage
* Gerenciamento de estado global com Context API
* Validação de formulários com feedback inline
* Proteção de rotas (acesso restrito)
* Interface refinada e mais profissional
* Experiência de usuário aprimorada

---

## 🧩 Funcionalidades

### 🔐 Autenticação

* Cadastro de usuário com:

  * Nome completo
  * E-mail válido
  * Senha (mín. 6 caracteres)
  * Confirmação de senha
* Login com validação real dos dados
* Sessão persistida (usuário continua logado)
* Logout com limpeza de sessão

---

### 🍔 Cardápio

* Lista de produtos disponíveis
* Visual com imagens, descrição e preço
* Reserva de itens
* Feedback visual de sucesso

---

### 🔎 Diferencial Implementado

**Busca em tempo real no cardápio**

O usuário pode buscar itens dinamicamente conforme digita, filtrando:

* Nome
* Descrição
* Preço

📌 **Justificativa:**
Melhora significativamente a experiência do usuário, tornando a navegação mais rápida e eficiente, especialmente em cenários com muitos itens disponíveis.

---

### 📊 Perfil do Usuário

* Exibição de dados do usuário logado
* Quantidade de reservas realizadas
* Histórico de reservas
* Botão de logout

---

### 💾 Persistência de Dados

Utilizando **AsyncStorage**, o app salva:

* Dados do usuário cadastrado
* Sessão de login
* Reservas realizadas

📌 Os dados permanecem mesmo após fechar o app.

---

## 🧠 Decisões Técnicas

### 📁 Estrutura do Projeto

```bash
app/
  (auth)/
    login.js
    cadastro.js
  (tabs)/
    _layout.js
    index.js
    cardapio.js
    perfil.js
  _layout.js
  index.js

components/
  CustomInput.js
  CustomButton.js
  EmptyState.js

context/
  AuthContext.js
  AppDataContext.js

services/
  storage.js

constants/
  colors.js
```

---

### 🔐 AuthContext

Responsável por:

* Armazenar usuário logado
* Funções de login e logout
* Controle de sessão

---

### 📦 AppDataContext

Responsável por:

* Gerenciar reservas
* Persistir dados no AsyncStorage
* Compartilhar dados entre telas

---

### 🧭 Navegação Protegida

* Usuários não autenticados são redirecionados para `/login`
* Telas principais só são acessíveis após login

---

### 💾 AsyncStorage

Utilizado para:

* Persistência de sessão
* Armazenamento de usuário
* Armazenamento de reservas

---

## 🎨 UX/UI

O design foi pensado para garantir:

* Hierarquia visual clara
* Paleta de cores consistente
* Feedback visual (sucesso, erro, loading)
* Espaçamento adequado
* Interface intuitiva

---

## 🛠️ Tecnologias Utilizadas

* React Native
* Expo
* Expo Router
* AsyncStorage
* Context API
* JavaScript

---

## ▶️ Como Rodar o Projeto

### Pré-requisitos:

* Node.js instalado
* Expo CLI
* Expo Go (celular) ou emulador

### Passos:

```bash
git clone https://github.com/seu-usuario/fiap-mdi-cp2-nextstage
cd fiap-mdi-cp2-nextstage

npm install

npx expo start
```

---

## 📸 Demonstração Visual

* Print da tela de Login
* Print da tela de Cadastro
* Print da Home
* Print do Cardápio
* Print do Perfil

Exemplo:

```
/assets/screens/login.png
/assets/screens/cardapio.png
```

---

## 🎥 Demonstração em Vídeo

```
LINK VIDEO YOUTUBE
```

---

## 👥 Integrantes

* Andre Luiz Fernandes de Queiroz - Rm554503
* Paulo Poças - Rm556080
* Rafael Bocchi - Rm557603


---

## 🔮 Próximos Passos

* Integração com backend real
* Pagamento dentro do app
* Notificações de pedidos
* Sistema de favoritos
* Dark mode

---

## 📌 Considerações Finais

O projeto demonstra a evolução de um MVP para um sistema mais robusto, com foco em experiência do usuário, arquitetura escalável e boas práticas de desenvolvimento.

---
