# VisionNet-CIFAR10

> **Enterprise-Ready Computer Vision & Deep Learning Inference Platform**  
> Classificação de Imagens em Tempo Real com Redes Neurais Convolucionais (CNN) em PyTorch e API REST de Alta Performance com FastAPI.

---

## 📌 Visão Geral do Projeto

O **VisionNet-CIFAR10** é uma solução autoral de Engenharia de Machine Learning e Visão Computacional projetada para classificar imagens nas 10 categorias clássicas do dataset CIFAR-10:

| Índice | Identificador | Nome (Inglês) | Nome (Português) |
|:------:|:-------------:|:-------------:|:----------------:|
| 0 | `airplane` | Airplane | Avião |
| 1 | `automobile` | Automobile | Automóvel |
| 2 | `bird` | Bird | Pássaro |
| 3 | `cat` | Cat | Gato |
| 4 | `deer` | Deer | Cervo |
| 5 | `dog` | Dog | Cachorro |
| 6 | `frog` | Frog | Sapo |
| 7 | `horse` | Horse | Cavalo |
| 8 | `ship` | Ship | Navio |
| 9 | `truck` | Truck | Caminhão |

O sistema oferece um pipeline robusto e desacoplado:
1. **Modelagem Deep Learning**: Arquitetura convolucional `VisionNet` construída em PyTorch com suporte inteligente a aceleração em hardware (NVIDIA CUDA, Apple Silicon MPS e fallback para CPU).
2. **Pré-Processamento Padronizado**: Pipeline com redimensionamento dinâmico para 32x32 pixels, conversão para tensores PyTorch e normalização com média `(0.5, 0.5, 0.5)` e desvio padrão `(0.5, 0.5, 0.5)`.
3. **Serviço de Inferência & API REST**: Servidor assíncrono em FastAPI com documentação Swagger/OpenAPI interativa, suporte a predições individuais e em lote (vectorized batch), rankings Top-K e métricas de latência em milissegundos.
4. **Scripts de Treinamento e Avaliação**: Scripts CLI modulares para treino de ponta a ponta e auditoria detalhada de acurácia por classe.

---

## 🧠 Arquitetura da Rede Neural (VisionNet)

A arquitetura convolucional segue os melhores padrões de redes profundas para resolução compacta (32x32):

```
       [Entrada: Imagem RGB 3x32x32]
                     │
                     ▼
  [Conv2d: 3 -> 6 canais, kernel 5x5]
                     │
                     ▼
            [Ativação: ReLU]
                     │
                     ▼
       [MaxPool2d: 2x2, stride 2]  ──> [Mapa: 6x14x14]
                     │
                     ▼
  [Conv2d: 6 -> 16 canais, kernel 5x5]
                     │
                     ▼
            [Ativação: ReLU]
                     │
                     ▼
       [MaxPool2d: 2x2, stride 2]  ──> [Mapa: 16x5x5]
                     │
                     ▼
    [Flatten: 16 * 5 * 5 = 400 features]
                     │
                     ▼
        [Linear: 400 -> 120] + ReLU
                     │
                     ▼
        [Linear: 120 -> 84]  + ReLU
                     │
                     ▼
        [Linear: 84  -> 10] (Logits)
                     │
                     ▼
        [Softmax: Probabilidades [0, 1]]
```

### Hiperparâmetros Padrão de Treinamento
- **Otimizador**: Adam (`lr = 0.001`)
- **Função de Perda**: `CrossEntropyLoss` (com Softmax integrado)
- **Tamanho do Lote (Batch Size)**: 64
- **Épocas**: 10

---

## 📂 Estrutura do Repositório

```text
VisionNet/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # Instância FastAPI, middlewares e ciclo de vida (lifespan)
│   │   ├── config.py                   # Configurações do sistema e variáveis de ambiente
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── router.py               # Agregador central de rotas (/api/v1)
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       ├── predict.py          # Endpoints de upload e inferência (/predict, /predict/batch)
│   │   │       ├── model_info.py       # Endpoints de metadados (/model/info, /model/classes)
│   │   │       └── health.py           # Endpoint de monitoramento (/health)
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── model.py                # Arquitetura VisionNet (nn.Module)
│   │   │   ├── transforms.py           # Pipelines de transformação e normalização
│   │   │   └── device.py               # Detecção e seleção de hardware (CUDA, MPS, CPU)
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── prediction.py           # Modelos Pydantic para predições e Top-K
│   │   │   └── health.py               # Modelos Pydantic para diagnóstico e modelo
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── predictor.py            # Serviço de carregamento de pesos e motor de inferência
│   │   │   └── trainer.py              # Motor de treino e avaliação com métricas por classe
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── logger.py               # Logger estruturado e formatado
│   │       └── image_ops.py            # Validação e decodificação segura de imagens
│   ├── scripts/
│   │   ├── __init__.py
│   │   ├── train.py                    # Script CLI para treinamento no CIFAR-10
│   │   ├── evaluate.py                 # Script CLI para avaliação e acurácia por classe
│   │   └── generate_sample_weights.py  # Gerador de pesos iniciais para testes imediatos
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_model.py               # Testes unitários da arquitetura VisionNet
│   │   ├── test_transforms.py          # Testes unitários do pipeline de transformações
│   │   └── test_api.py                 # Testes de integração de todos os endpoints HTTP
│   ├── weights/
│   │   ├── .gitkeep
│   │   └── visionnet_cifar10.pth       # Pesos treinados do modelo PyTorch
│   ├── data/
│   │   └── .gitkeep                    # Diretório local para cache do CIFAR-10
│   ├── Dockerfile                      # Containerização de produção
│   ├── requirements.txt                # Dependências Python
│   └── run.py                          # Executável para iniciar o servidor Uvicorn
├── .gitignore
└── README.md
```

---

## 🚀 Instalação e Execução

### 1. Pré-requisitos
- Python 3.10 ou superior
- Pip e virtualenv

### 2. Configurar o Ambiente Virtual
```bash
# Criar ambiente virtual
python -m venv .venv

# Ativar ambiente virtual (Windows PowerShell)
.venv\Scripts\Activate.ps1

# Ativar ambiente virtual (Linux / macOS)
source .venv/bin/activate

# Instalar dependências
pip install -r backend/requirements.txt
```

### 3. Iniciar o Servidor da API
```bash
python backend/run.py
```
O servidor estará disponível em:
- **API Base**: `http://localhost:8000`
- **Documentação Swagger Interativa**: `http://localhost:8000/docs`
- **Documentação Redoc**: `http://localhost:8000/redoc`

---

## 📡 Referência dos Endpoints da API

### `POST /api/v1/predict`
Executa a classificação de uma imagem enviada via formulário multipart.

**Parâmetros de Requisição**:
- `file`: Arquivo de imagem (`image/jpeg`, `image/png`, `image/webp`, `image/bmp`).
- `top_k` (query, opcional): Quantidade de classes com maior probabilidade a retornar (padrão: 5).

**Exemplo de Resposta JSON**:
```json
{
  "success": true,
  "filename": "airplane_sample.jpg",
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
    "confidence": 0.8924,
    "confidence_percentage": 89.24,
    "top_k": [
      {
        "class_index": 0,
        "label": "airplane",
        "display_name": "Airplane",
        "display_pt": "Avião",
        "probability": 0.8924,
        "confidence_percentage": 89.24
      },
      {
        "class_index": 8,
        "label": "ship",
        "display_name": "Ship",
        "display_pt": "Navio",
        "probability": 0.0512,
        "confidence_percentage": 5.12
      }
    ],
    "all_probabilities": {
      "airplane": 0.8924,
      "automobile": 0.0121,
      "bird": 0.0215,
      "cat": 0.0034,
      "deer": 0.0018,
      "dog": 0.0022,
      "frog": 0.0041,
      "horse": 0.0011,
      "ship": 0.0512,
      "truck": 0.0102
    }
  }
}
```

### `POST /api/v1/predict/batch`
Classifica múltiplos arquivos de imagem em uma única requisição utilizando passagem vetorizada em lote.

### `GET /api/v1/health`
Verifica a saúde operacional do serviço, backend de aceleração ativo e status de carregamento dos pesos.

### `GET /api/v1/model/info`
Retorna a arquitetura detalhada, dimensões de entrada e contagem de parâmetros treináveis.

### `GET /api/v1/model/classes`
Retorna a lista das 10 categorias suportadas com metadados em português e inglês.

---

## 🛠️ Treinamento e Avaliação via Linha de Comando (CLI)

### Treinar o Modelo
Para treinar a rede no CIFAR-10 a partir do zero:
```bash
python backend/scripts/train.py --epochs 10 --batch-size 64 --lr 0.001
```

### Avaliar o Modelo
Para calcular a acurácia global e detalhada por classe no conjunto de teste:
```bash
python backend/scripts/evaluate.py --weights backend/weights/visionnet_cifar10.pth
```

---

## 🧪 Testes Automatizados

O projeto inclui uma suíte abrangente de testes unitários e de integração com `pytest`:
```bash
pytest backend/tests -v
```

Cobertura dos testes:
- Inicialização e shapes de tensores na rede neural `VisionNet`.
- Passagem forward individual e em lote (batching).
- Redimensionamento e normalização no pipeline de dados.
- Respostas de todos os endpoints HTTP e tratamento de arquivos inválidos.

---

## 🐳 Execução via Docker

Para construir e executar a imagem de produção em contêiner:
```bash
# Construir a imagem Docker
docker build -t visionnet-cifar10:latest -f backend/Dockerfile backend

# Executar o contêiner
docker run -d -p 8000:8000 --name visionnet-api visionnet-cifar10:latest
```

---

## 📄 Licença

Desenvolvido como projeto autoral de Visão Computacional e Engenharia de Machine Learning.
