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

# 🧠 Estrutura: [(categoria, posicao, cod_dekoreba, traducoes_dict)]
dados = []

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
            palavra = item.get("palavra", {}).get("latino", "")
            cod = item.get("cod_dekoreba")
            posicao = item.get("posicao", "")
            if palavra and cod is not None:
                # Verifica se já existe esse item
                encontrado = False
                for registro in dados:
                    if registro[0] == categoria and registro[1] == posicao and registro[2] == cod:
                        registro[3][idioma_en] = palavra
                        encontrado = True
                        break
                if not encontrado:
                    dados.append([categoria, posicao, cod, {idioma_en: palavra}])

# 📁 Exportar para CSV
idiomas_csv = ["English", "Portuguese", "Spanish", "French", "German", "Italian"]

with open("cursos_multilingue.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Categoria", "Posicao", "Cod_dekoreba"] + idiomas_csv)

    for categoria, posicao, cod, traducoes in dados:
        linha = [categoria, posicao, cod]
        for lang in idiomas_csv:
            linha.append(traducoes.get(lang, "-"))
        writer.writerow(linha)
