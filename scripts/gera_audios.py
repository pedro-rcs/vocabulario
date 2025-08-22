import csv
import os
from gtts import gTTS

# 📁 Caminho do CSV
csv_path = "cursos_multilingue.csv"

# 🌍 Mapeamento de idioma para código gTTS
lang_codes = {
    "English": "en",
    "Portuguese": "pt",
    "Spanish": "es",
    "French": "fr",
    "German": "de",
    "Italian": "it"
}

# 🔢 Contador começa em 600
contador = 600

# 📖 Leitura do CSV
with open(csv_path, mode="r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(f"🔄 Processando linha {contador}: {row}")

        for idioma_en, lang_code in lang_codes.items():
            palavra = row.get(idioma_en, "").strip()
            if palavra == "-" or not palavra:
                continue  # ignora palavras ausentes

            # 📁 Cria pasta do idioma se não existir
            os.makedirs(idioma_en, exist_ok=True)

            # 🔊 Gera áudio
            try:
                path = f"{idioma_en}/{contador}.mp3"
                tts = gTTS(text=palavra, lang=lang_code)
                tts.save(path)
                print(f"✅ {path} gerado com a palavra '{palavra}'")
            except Exception as e:
                print(f"⚠️ Erro ao gerar áudio para '{palavra}' ({idioma_en}): {e}")

        contador += 1  # ⬆️ Incrementa após processar a linha inteira
