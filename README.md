# 🍔 Cantina FIAP App

## 📌 Sobre o Projeto

O **Cantina FIAP App** é um aplicativo mobile desenvolvido em React Native com Expo, com o objetivo de melhorar a experiência dos alunos ao consumir produtos na cantina da FIAP.

### 🎯 Problema Resolvido

Filas na cantina e falta de controle prático de pedidos e saldo.

### 🏫 Operação Escolhida

Foi escolhida a operação de **cantina/consumo interno da FIAP**, pois é uma experiência comum a todos os alunos e possui grande potencial de otimização com tecnologia.

### 🚀 Funcionalidades

* Visualização do cardápio
* Reserva de itens diretamente pelo app
* Visualização de saldo do aluno
* Interface simples e intuitiva
* Navegação entre telas com tabs

---

## 👥 Integrantes do Grupo

* Andre Luiz Fernandes de Queiroz - Rm554503
* Paulo Poças - RM556080
* Rafael Bocchi - RM557603

---

## ⚙️ Como Rodar o Projeto

### 📋 Pré-requisitos

* Node.js instalado
* Expo CLI (`npm install -g expo-cli`)
* Aplicativo **Expo Go** no celular (ou emulador)

### ▶️ Passo a passo

```bash
# Clonar o repositório
git clone https://github.com/seu-repo/cantina-fiap.git

# Entrar na pasta
cd cantina-fiap

# Instalar dependências
npm install

# Rodar o projeto
npx expo start
```

Depois:

* Escaneie o QR Code com o Expo Go
  OU
* Rode no emulador

---

## 📱 Demonstração

### 🖼️ Prints das Telas

#### 🏠 Tela Home
![Tela Home](./assets/Home.png)

#### 🍔 Tela Cardápio
![Tela Cardápio](./assets/Cardapio.png)

#### 👤 Tela Perfil
![Tela Perfil](./assets/Perfil.png)
---

## 🧠 Decisões Técnicas

### 📦 Estrutura do Projeto

O projeto foi estruturado utilizando o **Expo Router**, com separação por telas:

* `index` → Home
* `cardapio` → Lista de produtos
* `perfil` → Informações do usuário

### ⚛️ Hooks Utilizados

* `useState`

  * Controle de estado para pedidos (ex: reserva de item)
  * Atualização dinâmica da interface

### 🧭 Navegação

* Implementada com **Expo Router (Tabs)**
* Três abas principais:

  * Home
  * Cardápio
  * Perfil

### 🎨 Estilização

* Utilização de `StyleSheet` nativo do React Native
* Design focado em simplicidade e experiência do usuário
* Uso de cores consistentes (ex: destaque em rosa FIAP)

---

## 🔮 Próximas Evoluções do Projeto

Para tornar o aplicativo mais completo e próximo de um sistema real de produção, as seguintes melhorias foram planejadas:

### 💾 Persistência de Dados
- Implementação de armazenamento local com **AsyncStorage**
- Evolução para backend com **API REST (Node.js ou Spring Boot)**
- Sincronização de pedidos em tempo real

### 🛒 Sistema de Pedidos Real
- Envio de pedidos diretamente para a cantina
- Status do pedido (em preparo, pronto, retirado)
- Redução de filas físicas

### 📊 Histórico e Controle
- Histórico de compras do usuário
- Controle de gastos dentro do app
- Relatórios simples de consumo

### 💳 Pagamentos
- Integração com pagamento digital (PIX ou cartão)
- Débito automático do saldo do aluno

### 🔐 Autenticação
- Sistema de login do aluno
- Integração com dados institucionais (RM)
- Segurança básica com tokens

### 🔔 Notificações
- Notificação quando o pedido estiver pronto
- Avisos de promoções da cantina

### ⚡ Melhorias de UX/UI
- Feedback visual ao adicionar itens
- Animações simples (loading, confirmação)
- Melhor organização do cardápio (categorias)

### 📡 Integração com IoT (diferencial)
- Integração com sistemas físicos da cantina
- Possível uso de sensores ou painéis para retirada de pedidos

---

## 📌 Considerações Finais

O projeto demonstra a aplicação prática de conceitos de:

* Componentes React Native
* Hooks
* Navegação com Expo Router
* Estruturação de aplicações mobile

Além disso, resolve um problema real do cotidiano dos alunos da FIAP.

---
