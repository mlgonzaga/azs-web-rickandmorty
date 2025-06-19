# Rick & Morty Episode Manager

Gerencie, explore e marque episódios da série Rick and Morty! Veja detalhes, marque favoritos, acompanhe episódios assistidos e descubra personagens de cada episódio.

## Demonstração em Produção

Acesse a aplicação rodando em produção:
👉 [https://azs-web-rickandmorty-ecru.vercel.app/](https://azs-web-rickandmorty-ecru.vercel.app/)

## Funcionalidades
- Listagem paginada de episódios
- Filtro por favoritos e assistidos
- Marcação de episódios como favorito/assistido
- Visualização dos personagens de cada episódio
- Modal de detalhes do episódio
- Interface responsiva e moderna

## Como rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/mlgonzaga/azs-web-rickandmorty.git
   cd azs-web-rickandmorty
   ```

2. **Instale as dependências:**
   ```bash
   npm install

   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev

   ```

4. **Acesse no navegador:**
   Abra [http://localhost:5173](http://localhost:5173) (ou a porta exibida no terminal).

## Tecnologias utilizadas
- React + Vite
- TypeScript
- Re
- Tailwidux ToolkitndCSS
- shadcn/ui

---

Desenvolvido por [mlgonzaga](https://github.com/mlgonzaga)

## 🚀 Funcionalidades

### ✅ **Listar todos os episódios**
Para cada episódio é exibido:
- Número do episódio
- Nome
- Data em que foi ao ar
- Quantidade de personagens que participaram

### ✅ **Detalhar o episódio**
Na tela de detalhes é mostrado:
- Número do episódio
- Nome
- Data em que foi ao ar
- Lista dos personagens do episódio, para cada personagem:
  - Foto
  - Nome
  - Espécie
  - Status

### ✅ **Gerenciamento de episódios**
- Favoritar e Desfavoritar um episódio
- Marcar um episódio como Visto
- Listar episódios favoritos
- Buscar episódio pelo nome

## 🛠️ Ferramentas e Tecnologias

- **Framework Frontend:** React com TypeScript
- **Gerenciamento de Estado:** Redux Toolkit
- **Estilização:** Tailwind CSS
- **Componentes UI:** Shadcn/ui
- **Ícones:** Lucide React
- **Notificações:** Sonner

## 📋 Requisitos Implementados

### ✅ **Exibição da Lista de Episódios**
- Layout em grade com design responsivo
- Cards de episódios com informações essenciais
- Estados de carregamento e tratamento de erros

### ✅ **Busca e Filtragem**
- Funcionalidade de busca em tempo real por nome do episódio
- Filtro para mostrar apenas episódios favoritos
- Filtro para mostrar apenas episódios vistos

### ✅ **Interações do Usuário**
- Sistema de favoritar/desfavoritar episódios
- Marcar episódios como vistos
- Modal detalhado com informações completas do episódio
- Lista completa de personagens por episódio

### ✅ **UI/UX**
- Interface moderna e limpa
- Design responsivo
- Estados de carregamento
- Feedback ao usuário (toasts)
- Modal para detalhes do episódio


## 🎯 **Funcionalidades Principais**

1. **Listagem de Episódios**: Exibe todos os episódios com informações básicas
2. **Busca**: Pesquisa episódios por nome
3. **Filtros**: Mostra apenas favoritos ou episódios vistos
4. **Detalhes**: Modal com informações completas do episódio e personagens
5. **Gerenciamento**: Marcar como visto/favorito com persistência local
6. **Responsivo**: Funciona em todos os tamanhos de tela


