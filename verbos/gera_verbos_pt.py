import csv
from mlconjug3 import Conjugator

# Inicializa o conjugador para português
conjugator = Conjugator(language='pt')

# Verbo alvo (pode mudar para "ler", "partir", etc.)
verbo = "amar"

# Estrutura conforme seu objeto original
estrutura = {
    "indicativo": {
        "presente": ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"],
        "pretérito imperfeito": ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"],
        "pretérito perfeito simples": ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"],
        "pretérito mais-que-perfeito simples": ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"],
        "futuro do presente": ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"],
        "futuro do pretérito": ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"]
    },
    "subjuntivo": {
        "presente": ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"],
        "pretérito imperfeito": ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"],
        "futuro": ["eu", "tu", "ele/ela", "nós", "vós", "eles/elas"]
    },
    "imperativo": {
        "afirmativo": ["tu", "você", "nós", "vós", "vocês"],
        "negativo": ["tu", "você", "nós", "vós", "vocês"]
    }
}

# Partículas específicas
particulas = {
    "subjuntivo": {
        "presente": "que",
        "pretérito imperfeito": "se",
        "futuro": "quando"
    },
    "imperativo": {
        "negativo": "não"
    }
}

# Conjuga o verbo
conjugado = conjugator.conjugate(verbo)

# Cria o CSV
with open(f"{verbo}_conjugado.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["modo", "tempo", "pessoa", "aux", "conjugado"])

    for modo, tempos in estrutura.items():
        for tempo, pessoas in tempos.items():
            for pessoa in pessoas:
                try:
                    forma = conjugado[modo][tempo][pessoa]
                except KeyError:
                    forma = ""  # caso não exista na estrutura da lib

                aux = particulas.get(modo, {}).get(tempo, "")
                writer.writerow([modo, tempo, pessoa, aux, forma])
