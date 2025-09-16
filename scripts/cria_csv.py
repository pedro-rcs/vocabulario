import json
import csv

# Dicionário de traduções baseado no exemplo fornecido
translations = {
    35702: {
        "English": "it",
        "Portuguese": "a",
        "Spanish": "ello",
        "French": "ce",
        "German": "es",
        "Italian": "essa"
    },
    19688800: {
        "English": "him",
        "Portuguese": "ela",
        "Spanish": "eso",
        "French": "il",
        "German": "ihm",
        "Italian": "esso"
    }
}

# Função para processar o JSON e gerar o CSV
def json_to_csv(json_file, csv_file):
    # Ler o arquivo JSON
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Abrir o arquivo CSV para escrita
    with open(csv_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        # Escrever o cabeçalho do CSV
        writer.writerow(["Categoria", "Posicao", "Cod_dekoreba", "English", "Portuguese", "Spanish", "French", "German", "Italian"])

        # Processar cada idioma no JSON
        for language_data in data:
            idioma = language_data.get("idioma")
            if idioma != "Italiano":  # Filtrar apenas italiano, se necessário
                continue

            # Processar capítulos
            for chapter in language_data.get("capitulos", []):
                classe = chapter.get("classe")
                # Processar vocabulário
                for vocab in chapter.get("vocabulario", []):
                    cod_dekoreba = vocab.get("cod_dekoreba")
                    posicao = vocab.get("posicao")
                    meaning = vocab.get("meaning")
                    palavra_italiano = vocab.get("palavra", {}).get("latino")

                    # Obter traduções do dicionário
                    translation = translations.get(meaning, {})
                    if not translation:
                        continue  # Pular se não houver traduções para o meaning

                    # Escrever linha no CSV
                    writer.writerow([
                        classe,
                        posicao,
                        cod_dekoreba,
                        translation.get("English", ""),
                        translation.get("Portuguese", ""),
                        translation.get("Spanish", ""),
                        translation.get("French", ""),
                        translation.get("German", ""),
                        palavra_italiano
                    ])

# Caminhos dos arquivos de entrada e saída
json_file = "panlex.cursos.json"
csv_file = "output.csv"

# Executar a conversão
json_to_csv(json_file, csv_file)
print(f"Arquivo CSV gerado: {csv_file}")