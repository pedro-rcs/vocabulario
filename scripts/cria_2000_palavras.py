import csv
from pymongo import MongoClient
from collections import defaultdict

# 🔗 Conexão com MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["panlex_cursos"]
collection = db["cursos"]

# 🗺️ Mapeamento de idiomas
idioma_map = {
    "inglês": "English",
    "português": "Portuguese",
    "espanhol": "Spanish",
    "francês": "French",
    "alemão": "German",
    "italiano": "Italian"
}

# 🧠 Estrutura: {classe: {cod_dekoreba: {idioma_en: palavra}}}
dados = defaultdict(lambda: defaultdict(dict))

# 🔄 Loop pelos cursos
for curso in collection.find():
    idioma_pt = curso.get("idioma", "").lower()
    idioma_en = idioma_map.get(idioma_pt)
    if not idioma_en:
        continue  # ignora idiomas não mapeados

    capitulos = curso.get("capitulos", [])
    for capitulo in capitulos:
        categoria = capitulo.get("classe", "")
        vocabulario = capitulo.get("vocabulario", [])

        for item in vocabulario:
            if item.get("posicao") == 1:
                palavra = item.get("palavra", {}).get("latino", "")
                cod = item.get("cod_dekoreba")
                if palavra and cod is not None:
                    dados[categoria][cod][idioma_en] = palavra

# 📁 Exportar para CSV
idiomas_csv = ["English", "Portuguese", "Spanish", "French", "German", "Italian"]

with open("cursos_multilingue.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Categoria"] + idiomas_csv)

    for categoria, grupo_cod in dados.items():
        for cod, traducoes in grupo_cod.items():
            linha = [categoria]
            for lang in idiomas_csv:
                linha.append(traducoes.get(lang, "-"))
            writer.writerow(linha)
