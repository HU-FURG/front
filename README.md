# front

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### base
```bash
src/
├── assets/        # Imagens, ícones e outros arquivos estáticos
├── components/    # Componentes reutilizáveis da interface (botões, inputs, etc.)
├── hooks/         # Custom hooks React para lógica compartilhada
├── modal/         # Componentes específicos de modais usados na aplicação
├── routers/       # Configuração de rotas e navegação
├── services/      # Comunicação com API / camada de serviços
├── types/         # Definições de tipos e interfaces TypeScript
├── utils/         # Funções utilitárias e helpers
├── App.tsx        # Componente raiz da aplicação React
├── main.tsx       # Ponto de entrada React (renderização na DOM do Electron)
├── env.d.ts       # Tipos globais para variáveis de ambiente
├── global.d.ts    # Declarações globais adicionais de TypeScript
```
### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
