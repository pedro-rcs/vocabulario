from pymongo import MongoClient
from gtts import gTTS
from gtts.lang import tts_langs
import random
import string
import os
import sys

# === Configurações ===
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "panlex"
COLLECTION = "cursos"
OUTPUT_BASE = "audios"

# Conexão MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
cursos = db[COLLECTION]

# Mapeamento de idiomas para códigos gTTS
IDIOMAS_GTTS = {
    "português": "pt",
    "inglês": "en",
    "espanhol": "es",
    "francês": "fr",
    "italiano": "it",
    "alemão": "de",
    "japonês": "ja",
    "chinês": "zh-cn"
    # Adicione mais conforme necessário
}

# Função para gerar nome aleatório
def gerar_nome():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=7))

try:
    for curso in cursos.find({}):
        idioma_raw = curso["idioma"].strip().lower()
        codigo_idioma = IDIOMAS_GTTS.get(idioma_raw, "it")  # fallback: italiano

        # Verifica se o idioma é suportado pelo gTTS
        if codigo_idioma not in tts_langs():
            print(f"[AVISO] Idioma '{idioma_raw}' não suportado pelo gTTS. Pulando curso.")
            continue

        for capitulo in curso["capitulos"]:
            classe = capitulo["classe"].replace(" ", "_").lower()

            for vocab in capitulo["vocabulario"]:
                palavra = vocab["palavra"]["latino"]

                if "audio" in vocab:
                    continue

                pasta = os.path.join(OUTPUT_BASE, idioma_raw, classe)
                os.makedirs(pasta, exist_ok=True)

                nome_arquivo = gerar_nome()
                caminho = os.path.join(pasta, f"{nome_arquivo}.mp3")

                # Gerar áudio com idioma correto
                tts = gTTS(palavra, lang=codigo_idioma)
                tts.save(caminho)

                # Atualizar MongoDB
                cursos.update_one(
                    {
                        "_id": curso["_id"],
                        "capitulos._id": capitulo["_id"],
                        "capitulos.vocabulario._id": vocab["_id"]
                    },
                    {"$set": {"capitulos.$[c].vocabulario.$[v].audio": nome_arquivo}},
                    array_filters=[
                        {"c._id": capitulo["_id"]},
                        {"v._id": vocab["_id"]}
                    ]
                )

                print(f"[SUCESSO] {palavra} ({codigo_idioma}) → {caminho}")

except Exception as e:
    print(f"[ERRO] {e}")
    sys.exit(1)