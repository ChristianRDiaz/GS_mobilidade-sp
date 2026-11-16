# 🚌 Mobilidade Urbana --- Ônibus em São Paulo

**Global Solution --- Disciplina:** Cross-Platform Application
Development\
**Integrante: CHRISTIAN RAYMUNDO DIAZ - RM568324**

## 📖 Sobre o Projeto

O **Mobilidade Urbana SP** é um aplicativo mobile desenvolvido em React
Native com o objetivo de facilitar o deslocamento de ônibus na cidade de
São Paulo. O app consome a API oficial Olho Vivo (SPTrans) para fornecer
dados em tempo real sobre a frota de veículos, ajudando o cidadão a
planejar sua viagem de forma mais eficiente.

Além da consulta em tempo real, o aplicativo conta com persistência
local de dados (AsyncStorage), permitindo que o usuário salve suas
linhas favoritas e mantenha um cache inteligente das paradas, reduzindo
o número de requisições à API.

## 📺 Vídeo Pitch (Demonstração e Explicação)
Assista ao vídeo de apresentação e demonstração da solução rodando na prática:
👉 [Clique aqui para assistir no YouTube](https://youtube.com/shorts/24_-gLgfzg4)

---

## ✅ Cumprimento dos Requisitos da Disciplina

Abaixo está o mapeamento de como cada requisito solicitado pelo
professor foi implementado no projeto:

---
Requisito solicitado  | Como foi implementado  no projeto |  Status

**React Native** :  Projeto desenvolvido com Expo e React Native, utilizandocomponentes nativos(`View`, `Text`,       `FlatList`,`TouchableOpacity`). ✅ Concluído

**React Native** : Projeto desenvolvido com Expo e React Native, utilizando componentes nativos(`View`, `Text`,`FlatList`,`TouchableOpacity`).      ✅ Concluído

**Integração com a API Olho Vivo** : Consumo de múltiplos endpoints da SPTrans(Autenticação, Busca de Linhas, Posição em Tempo Real, Previsão de Chegada e Paradas).       ✅ Concluído

**Persistência Local com AsyncStorage** : Implementação de um serviço de storage para salvar Linhas Favoritas, Paradas Favoritas e fazer Cache de Paradas para otimizar chamadas à API.    ✅ Concluído                  

**Navegação entre Telas** : Utilização do React Navigation (Stack Navigator) para navegar entre a tela de Busca (`SearchScreen`), tela de Favoritos(`HomeScreen`) e tela do Mapa(`MapScreen`).    ✅ Concluído

**Interface Utilizável** : Design limpo e focado na usabilidade, com feedback visual de carregamento, tratamento de erros e componentes reutilizáveis(`BusCard`,`Button`,`Input`).      ✅ Concluído   

---

## 🚀 Funcionalidades Implementadas

**🔍 Pesquisa de Linhas:** Busca por número ou nome da linha de
    ônibus.

**🚏 Pesquisa de Paradas:** Busca por nome ou endereço da parada.

**🗺️ Rastreamento em Tempo Real:** Visualização da posição exata dos
    ônibus no mapa, com o prefixo de cada veículo.

**♿ Filtro de Acessibilidade:** Opção para visualizar apenas linhas
    que possuem ônibus acessíveis naquele momento.

**📍 Ponto Mais Próximo:** Cálculo da distância (em linha reta)
    entre o usuário e a parada mais próxima da linha selecionada.

**⏱️ Previsão de Chegada:** Exibição do tempo estimado para o
    próximo ônibus chegar à parada (quando disponível pela API).

**❤️ Favoritos (AsyncStorage):** Salvar linhas e paradas favoritas
    para acesso rápido, mesmo ao fechar o app.

**💾 Cache Inteligente (AsyncStorage):** Armazenamento local das
    paradas de cada linha para reduzir o consumo da API e evitar
    bloqueios.

## ⚠️ Limitações Conhecidas e Tratamento de Erros

Durante o desenvolvimento, foram identificadas limitações documentadas
da API Olho Vivo da SPTrans. O aplicativo foi projetado para lidar com
essas limitações de forma amigável, sem quebrar a experiência do
usuário:

### Paradas Apenas em Corredores

A API só fornece dados de paradas monitoradas para corredores
inteligentes. Se o usuário buscar uma linha que não passa por um
corredor (ex.: linha `5028-10`), o app exibe uma mensagem clara
explicando a ausência de dados, mas continua mostrando a posição dos
ônibus em tempo real.

### Instabilidade e Limite de Requisições

A API possui um limite de chamadas. Para contornar isso, foi
implementado um sistema de cache local com AsyncStorage e um controle na
contagem de ônibus (limitado às primeiras 10 linhas da busca).

### Previsões Estimadas

Os horários de chegada são estimativas baseadas na última transmissão do
veículo. O app exibe a informação apenas quando ela está realmente
disponível.

## 🛠️ Tecnologias Utilizadas

-   React Native (com Expo)
-   JavaScript
-   React Navigation (Navegação em Stack)
-   AsyncStorage (`@react-native-async-storage/async-storage`)
-   React Native Maps (Mapas e Marcadores)
-   Expo Location (Geolocalização do usuário)
-   API Olho Vivo (SPTrans)

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para rodar o aplicativo na sua máquina.

### 1. Clone o repositório

``` bash
git clone https://github.com/ChristianRDiaz/GS_mobilidade-sp.git
```

### 2. Acesse a pasta do projeto

``` bash
cd GS_mobilidade-sp
```

### 3. Instale as dependências

``` bash
npm install
```

### 4. Configure o Token da API

1.  Abra o arquivo `config.js` na raiz do projeto.
2.  Substitua o valor `"SEU_TOKEN_AQUI"` pelo seu token de acesso à API
    Olho Vivo da SPTrans.

> **Nota:** Por questões de segurança, o token real não foi versionado
> no repositório.


## 🌐 Informações Importantes sobre Rede e Conexão (Expo Go)

Para executar o projeto no celular utilizando o **Expo Go**, tenha em
atenção os seguintes cenários de rede:

### 1. Conexão Wi-Fi local (padrão)

O computador onde o projeto está a ser executado e o celular devem
estar conectados à **mesma rede Wi-Fi**. Nessa condição, a leitura do QR
Code gerado pelo Expo deverá permitir a conexão local.

### 2. Autenticação no Expo (conta)

Se o Expo solicitar autenticação ou ocorrer alguma restrição de sessão
no terminal, poderá ser necessário iniciar sessão numa conta Expo:

``` bash
npx expo login
````

Também é possível criar uma conta gratuita no site oficial do Expo. Um
**Access Token** só será necessário quando o fluxo ou serviço utilizado
o exigir; para iniciar o servidor local com `npx expo start`,
normalmente não é obrigatório.

 **Como executar utilizando o Access Token:**
 
 Primeiro, defina a variável de ambiente no seu terminal (PowerShell) para autenticar a sua conta:
 ```powershell
 $env:EXPO_TOKEN="O_SEU_TOKEN_GERADO"
 ```
 
Logo em seguida, na mesma janela do terminal, execute o comando do Expo para iniciar o projeto:
```powershell
npx expo start
 ```

### 3. Redes corporativas ou universitárias com firewall (modo túnel)

Em redes de faculdades ou empresas, firewalls podem bloquear portas
utilizadas pelo Metro Bundler. Se a conexão direta por Wi-Fi falhar,
tente iniciar o projeto em **modo túnel**:

```bash
npx expo start --tunnel
```

O modo túnel permite conectar celular ao projeto mesmo quando
computador e celular estão em redes diferentes ou há restrições na
rede local. O carregamento inicial pode ser um pouco mais lento.

---

### 5. Inicie o servidor do Expo

``` bash
npx expo start
```

### 6. Abra o app

-   Escaneie o QR Code com o aplicativo Expo Go no seu celular
    (Android/iOS).
-   Ou pressione `a` no terminal para abrir no emulador Android, ou `i`
    para o simulador iOS.

## 📱 Estrutura do Projeto

``` text
src/
├── components/      # Componentes reutilizáveis (BusCard, Button, Input)
├── screens/         # Telas do app (SearchScreen, MapScreen, HomeScreen)
├── services/        # Integração com a API (api.js, config.js)
├── storage/         # Persistência local (AsyncStorage)
├── styles/          # Estilos separados por tela/componente
└── utils/           # Funções auxiliares (ex.: cálculo de distância)
```

---

## 7. **Desenvolvido por \[CHRISTIAN RAYMUNDO DIAZ\] --- Global Solution 2026 🚀**
------------------------------------------------------------------------
