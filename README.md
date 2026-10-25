# VisionNet-CIFAR10

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-2.x-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<p align="center">
  <strong>Plataforma Fullstack de Visão Computacional e Classificação de Imagens em Tempo Real</strong><br>
  Rede Neural Convolucional (CNN) em PyTorch com API REST Assíncrona de Alta Performance e Interface Web Reativa Glassmorphic.
</p>

</div>

---

## 📌 Visão Geral do Projeto

O **VisionNet-CIFAR10** é uma solução completa e de nível profissional de Inteligência Artificial e Engenharia de Machine Learning (Fullstack AI) para classificação de imagens no dataset canônico **CIFAR-10**.

O projeto integra todo o ciclo de vida da aplicação de visão computacional:
1. **Modelagem Deep Learning**: Arquitetura convolucional autoral `VisionNet` desenvolvida em PyTorch, otimizada para tensores de resolução compacta (32×32) com aceleração automática por hardware (NVIDIA CUDA, Apple Silicon MPS ou fallback inteligente para CPU).
2. **Serviço de Inferência & API REST**: Servidor de alta velocidade baseado em FastAPI e Uvicorn, implementando endpoints assíncronos para classificação individual e em lote (vectorized batching), validação estrita de esquemas com Pydantic v2, suporte completo a CORS e documentação Swagger/OpenAPI interativa.
3. **Frontend Reativo e Moderno**: Interface construída com React 19, TypeScript e Vite, com estética *Dark Glassmorphic*, seletores interativos de amostras (1-clique), pré-visualização de tensores, gráficos de distribuição de probabilidades dinâmicos, métricas de latência em milissegundos e alternância de temas.

---

## 🧠 Arquitetura da Solução

O fluxo de dados da solução conecta a interface do usuário ao pipeline de inferência PyTorch através de requisições HTTP multipart:

```
[ Usuário / Navegador ]
       │
       ▼
[ Frontend: React 19 + TypeScript ]
  • Drag & Drop ou 1-Clique em Amostras CIFAR-10
  • Leitura de arquivo e visualização instantânea
       │
       ▼ (HTTP POST multipart/form-data com cabeçalhos CORS)
[ Backend: FastAPI + Uvicorn ]
  • CORS Middleware (validação de origem http://localhost:5173)
  • Validação de MIME Type (JPEG, PNG, WebP, BMP) e tamanho máx. 10MB
  • Decodificação em memória via PIL (Pillow)
       │
       ▼
[ Pipeline de Transformações ]
  • Resize dinâmico para 32×32 pixels
  • Conversão para Tensor Float32 [3, 32, 32]
  • Normalização CIFAR-10: Média (0.5, 0.5, 0.5) e Std (0.5, 0.5, 0.5)
       │
       ▼
[ Modelo VisionNet CNN (PyTorch) ]
  • Conv2D (3 -> 6, k=5) + ReLU + MaxPool2d (2x2)  --> [6, 14, 14]
  • Conv2D (6 -> 16, k=5) + ReLU + MaxPool2d (2x2) --> [16, 5, 5]
  • Flatten (400 features)
  • Linear (400 -> 120) + ReLU
  • Linear (120 -> 84) + ReLU
  • Linear (84 -> 10) (Logits)
  • Função Softmax: Probabilidades [0.0, 1.0]
       │
       ▼
[ Resposta JSON Estruturada ]
  • Top-K classes com percentuais de confiança
  • Latência de inferência (ms) e hardware ativo (CPU/CUDA)
       │
       ▼
[ Exibição Dinâmica no Frontend ]
  • Prediction Hero (Emoji, Nome PT/EN, Categoria)
  • Barras animadas de probabilidade para todas as 10 classes
  • Painel de auditoria de performance da rede
```

---

## 📂 Estrutura de Arquivos e Pastas

```text
VisionNet/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # Entrypoint FastAPI, CORS Middleware e lifespan
│   │   ├── config.py                   # Configurações Pydantic, paths e variáveis de ambiente
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── router.py               # Agregador central de rotas (/api/v1)
│   │   │   └── routes/
│   │   │       ├── health.py           # Endpoint de diagnóstico (/health)
│   │   │       ├── model_info.py       # Endpoints de arquitetura e classes (/model/info, /model/classes)
│   │   │       └── predict.py          # Endpoints de inferência (/predict, /predict/batch)
│   │   ├── core/
│   │   │   ├── device.py               # Detecção automática de aceleração (CUDA, MPS, CPU)
│   │   │   ├── model.py                # Arquitetura convolucional VisionNet (nn.Module)
│   │   │   └── transforms.py           # Pipeline de redimensionamento e normalização PyTorch
│   │   ├── schemas/
│   │   │   ├── health.py               # Schemas Pydantic para monitoramento de sistema
│   │   │   └── prediction.py           # Schemas Pydantic para respostas de inferência
│   │   ├── services/
│   │   │   ├── predictor.py            # Motor de carregamento de pesos e inferência PyTorch
│   │   │   └── trainer.py              # Pipeline completo de treino e cálculo de métricas
│   │   └── utils/
│   │       ├── image_ops.py            # Validação segura e conversão de bytes em tensores
│   │       └── logger.py               # Logger formatado para eventos de inferência
│   ├── data/                           # Cache local do dataset CIFAR-10
│   ├── scripts/
│   │   ├── train.py                    # CLI para treinamento do modelo do zero
│   │   ├── evaluate.py                 # CLI para auditoria de acurácia por classe no conjunto de teste
│   │   └── generate_sample_weights.py  # Gerador de pesos iniciais para testes
│   ├── tests/
│   │   ├── test_api.py                 # Testes de integração de endpoints HTTP e validação de CORS
│   │   ├── test_model.py               # Testes unitários de shapes de tensores e forward pass
│   │   └── test_transforms.py          # Testes unitários do pipeline de transformações
│   ├── weights/
│   │   └── visionnet_cifar10.pth       # Pesos treinados do modelo PyTorch (62.006 parâmetros)
│   ├── Dockerfile                      # Containerização de produção do backend
│   ├── requirements.txt                # Dependências Python
│   └── run.py                          # Script de inicialização do servidor Uvicorn
├── frontend/
│   ├── public/                         # Favicon e ícones vetoriais SVG
│   ├── src/
│   │   ├── components/
│   │   │   ├── BackendStatusModal.tsx  # Modal de inspeção e configuração da URL da API
│   │   │   ├── ConfidenceBars.tsx      # Gráfico de barras animadas de probabilidades
│   │   │   ├── Dropzone.tsx            # Zona de drag & drop com suporte a colar (Ctrl+V)
│   │   │   ├── ErrorAlert.tsx          # Banner de erro reativo com botão de reconexão
│   │   │   ├── Header.tsx              # Barra de navegação, status da API e alternador de tema
│   │   │   ├── ImagePreview.tsx        # Pré-visualização da imagem e dimensões originais
│   │   │   ├── InferenceControls.tsx   # Controles de Top-K e execução manual/automática
│   │   │   ├── ModelInfoModal.tsx      # Modal com especificações das camadas da CNN
│   │   │   ├── PredictionHero.tsx      # Card principal com classe vencedora e score percentual
│   │   │   └── SamplePicker.tsx        # Galeria interativa de amostras CIFAR-10 (1-clique)
│   │   ├── data/
│   │   │   ├── cifar10Classes.ts       # Metadados das classes (nomes PT/EN, emojis, cores)
│   │   │   └── sampleImages.ts         # Geradores em Canvas para testes instantâneos
│   │   ├── services/
│   │   │   └── api.ts                  # Cliente HTTP centralizado com tratamento de erros
│   │   ├── styles/
│   │   │   ├── global.css              # Reset, layout e classes de utilidade glassmorphism
│   │   │   └── variables.css           # Tokens de design, paleta de cores e temas claro/escuro
│   │   ├── types/
│   │   │   └── api.ts                  # Interfaces TypeScript espelhando os schemas Pydantic
│   │   ├── App.tsx                     # Componente raiz do Dashboard Fullstack
│   │   ├── index.css                   # Tipografia Outfit/JetBrains Mono e variáveis raiz
│   │   └── main.tsx                    # Ponto de montagem React 19
│   ├── package.json                    # Dependências e scripts do frontend
│   ├── tsconfig.json                   # Configurações do compilador TypeScript
│   └── vite.config.ts                  # Configuração do Vite com proxy reverso local
├── start.ps1                           # Script PowerShell para inicialização simultânea
├── start.bat                           # Script Windows Batch para inicialização com 1 clique
├── .gitignore
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.10+**: Linguagem base para engenharia de Machine Learning.
- **PyTorch 2.x & Torchvision**: Construção da rede convolucional, aceleração de hardware e transformações de tensores.
- **FastAPI**: Framework web moderno, assíncrono e de alto desempenho para APIs REST.
- **Uvicorn**: Servidor ASGI ultrarrápido para execução do FastAPI.
- **Pydantic v2**: Validação estrita de tipos e serialização de respostas JSON.
- **Pillow (PIL)**: Decodificação segura e manipulação de fluxos de bytes de imagens.
- **Pytest**: Suíte de testes automatizados para modelos, transformações e rotas HTTP.

### Frontend
- **React 19**: Biblioteca para construção de interfaces reativas baseadas em componentes.
- **TypeScript 5.x**: Tipagem estática rigorosa para garantir consistência de dados entre API e UI.
- **Vite 8.x**: Bundler e servidor de desenvolvimento frontend ultrarrápido.
- **Lucide React**: Conjunto de ícones consistentes e otimizados em SVG.
- **CSS3 Moderno**: Arquitetura CSS com Design Tokens, Glassmorphism, temas Dark/Light e animações suaves de transição.
- **Fetch API nativa**: Comunicação assíncrona com o backend sem dependências pesadas externas.

---

## 🚀 Como Executar o Projeto (Guia Passo a Passo)

### 1. Pré-requisitos
- **Python 3.10 ou superior** instalado ([python.org](https://www.python.org/))
- **Node.js 18 ou superior** e npm instalados ([nodejs.org](https://nodejs.org/))
- **Git** instalado no sistema

---

### Opção A: Inicialização Rápida Automatizada (Windows)

Você pode iniciar o backend e o frontend simultaneamente com um único comando:

```powershell
# Via PowerShell
.\start.ps1
```

Ou simplesmente dê dois cliques no arquivo `start.bat`. O script criará o ambiente virtual caso necessário, instalará as dependências e abrirá os dois serviços em paralelo.

---

### Opção B: Inicialização Manual Passo a Passo

#### Passo 1: Configurar e Rodar o Backend

1. Abra um terminal na raiz do projeto:
```bash
# Criar ambiente virtual Python
python -m venv .venv

# Ativar ambiente virtual
# No Windows (PowerShell):
.venv\Scripts\Activate.ps1
# No Windows (CMD):
.venv\Scripts\activate.bat
# No Linux / macOS:
source .venv/bin/activate

# Instalar dependências do backend
pip install -r backend/requirements.txt
```

2. Iniciar o servidor da API FastAPI:
```bash
python backend/run.py
```
*O servidor estará ativo em `http://localhost:8000`.*  
*Você pode acessar a documentação interativa em `http://localhost:8000/docs`.*

#### Passo 2: Configurar e Rodar o Frontend

1. Abra um novo terminal, navegue até a pasta `frontend` e instale as dependências:
```bash
cd frontend
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
*A aplicação web estará acessível em `http://localhost:5173`.*

---

## 📡 Endpoints da API REST

A API do VisionNet disponibiliza rotas sob o prefixo `/api/v1`:

| Método | Endpoint | Descrição |
|:------:|:---------|:----------|
| `GET` | `/` | Boas-vindas, status do serviço e links para documentação |
| `GET` | `/api/v1/health` | Diagnóstico de saúde, uptime, device de aceleração e status do modelo |
| `GET` | `/api/v1/model/info` | Topologia da rede, contagem de parâmetros treináveis e hiperparâmetros |
| `GET` | `/api/v1/model/classes` | Lista das 10 classes CIFAR-10 com nomes canônicos e descrições em PT/EN |
| `POST` | `/api/v1/predict` | Classificação de imagem individual com ranking Top-K configurável |
| `POST` | `/api/v1/predict/batch` | Inferência vetorizada em lote para múltiplos arquivos em um único tensor 4D |

### Exemplo de Requisição de Inferência (`POST /api/v1/predict`)

**Parâmetros de Requisição**:
- `file`: Arquivo de imagem multipart (`image/jpeg`, `image/png`, `image/webp`, `image/bmp`).
- `top_k` (query param, opcional): Número de probabilidades a retornar (1 a 10, padrão: 5).

**Exemplo de Resposta JSON**:
```json
{
  "success": true,
  "filename": "airplane_sample.png",
  "inference_time_ms": 2.45,
  "total_time_ms": 4.12,
  "device": "cpu",
  "original_image_size": [640, 480],
  "transformed_image_size": [32, 32],
  "prediction": {
    "predicted_class_index": 0,
    "predicted_label": "airplane",
    "display_name": "Airplane",
    "display_pt": "Avião",
    "confidence": 0.9482,
    "confidence_percentage": 94.82,
    "top_k": [
      {
        "class_index": 0,
        "label": "airplane",
        "display_name": "Airplane",
        "display_pt": "Avião",
        "probability": 0.9482,
        "confidence_percentage": 94.82
      },
      {
        "class_index": 8,
        "label": "ship",
        "display_name": "Ship",
        "display_pt": "Navio",
        "probability": 0.0315,
        "confidence_percentage": 3.15
      },
      {
        "class_index": 2,
        "label": "bird",
        "display_name": "Bird",
        "display_pt": "Pássaro",
        "probability": 0.0121,
        "confidence_percentage": 1.21
      }
    ],
    "all_probabilities": {
      "airplane": 0.9482,
      "automobile": 0.0012,
      "bird": 0.0121,
      "cat": 0.0008,
      "deer": 0.0004,
      "dog": 0.0005,
      "frog": 0.0011,
      "horse": 0.0003,
      "ship": 0.0315,
      "truck": 0.0039
    }
  }
}
```

---

## 📊 Métricas e Especificações do Modelo

| Métrica / Propriedade | Valor |
|:----------------------|:------|
| **Arquitetura** | VisionNet (CNN Convolucional) |
| **Dataset de Treinamento** | CIFAR-10 (60.000 imagens 32×32) |
| **Resolução de Entrada** | 3 canais RGB (3×32×32 pixels) |
| **Parâmetros Totais** | 62.006 pesos treináveis |
| **Tamanho dos Pesos** | ~252 KB (`weights/visionnet_cifar10.pth`) |
| **Otimizador** | Adam (`learning_rate = 0.001`) |
| **Função de Custo** | Cross-Entropy Loss com Log-Softmax |
| **Normalização** | Média: `(0.5, 0.5, 0.5)`, Std: `(0.5, 0.5, 0.5)` |
| **Latência Típica (CPU)** | 2.0 a 5.0 ms por inferência |
| **Classes Suportadas** | 10 categorias clássicas (Veículos e Animais) |

### Categorias do Dataset CIFAR-10

| Índice | Identificador | Nome (PT) | Nome (EN) | Categoria |
|:------:|:-------------:|:---------:|:---------:|:---------:|
| 0 | `airplane` | Avião | Airplane | Veículo |
| 1 | `automobile` | Automóvel | Automobile | Veículo |
| 2 | `bird` | Pássaro | Bird | Animal |
| 3 | `cat` | Gato | Cat | Animal |
| 4 | `deer` | Cervo | Deer | Animal |
| 5 | `dog` | Cachorro | Dog | Animal |
| 6 | `frog` | Sapo | Frog | Animal |
| 7 | `horse` | Cavalo | Horse | Animal |
| 8 | `ship` | Navio | Ship | Veículo |
| 9 | `truck` | Caminhão | Truck | Veículo |

---

## 🧪 Testes Automatizados

O repositório possui cobertura completa de testes unitários e de integração implementados com `pytest`:

```bash
# Executar a suíte de testes do backend
pytest backend/tests -v
```

Cenários cobertos:
- Verificação de dimensões e shapes de tensores na rede convolucional `VisionNet`.
- Transformações, resizing de imagem e normalização matemática.
- Todos os endpoints HTTP (`/health`, `/model/info`, `/model/classes`, `/predict`, `/predict/batch`).
- Tratamento de exceções e rejeição de formatos não suportados (código 415).
- Validação estrita de cabeçalhos de preflight e resposta de **CORS**.

---

## 🐳 Execução via Docker

Para construir e executar a API em contêiner Docker isolado:

```bash
# Construir a imagem Docker
docker build -t visionnet-api:latest -f backend/Dockerfile backend

# Executar o contêiner mapeando a porta 8000
docker run -d -p 8000:8000 --name visionnet-service visionnet-api:latest
```

---

## 📄 Licença

Este projeto está licenciado sob os termos da licença **MIT**.
Desenvolvido com foco em boas práticas de Engenharia de Software, Machine Learning e padrões de arquitetura corporativa.
