# Imagem base oficial do Playwright com navegadores
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e instala as dependências primeiro para aproveitar o cache
COPY package*.json ./
RUN npm ci

# Copia o resto do código do projeto
COPY . .

# Comando padrão para rodar os testes
CMD ["npm", "test"]