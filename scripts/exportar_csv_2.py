import csv
from pymongo import MongoClient

# 🔗 Conexão com MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["panlex_cursos"]
collection = db["cursos"]

# 📁 Arquivo CSV de saída
with open("cursos_export.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["classe", "posicao", "cod_dekoreba", "palavra_latino"])  # cabeçalhos atualizados

    # 🔄 Loop pelos documentos
    for doc in collection.find():
        capitulos = doc.get("capitulos", [])
        for capitulo in capitulos:
            classe = capitulo.get("classe", "")
            vocabulario = capitulo.get("vocabulario", [])

            for item in vocabulario:
                posicao = item.get("posicao", "")
                palavra_latino = item.get("palavra", {}).get("latino", "")
                cod_dekoreba = item.get("cod_dekoreba", "")
                writer.writerow([classe, posicao, cod_dekoreba, palavra_latino])
