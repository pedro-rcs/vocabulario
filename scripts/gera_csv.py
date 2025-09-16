import json
import csv

def extrair_dados_cursos(arquivo_json, arquivo_csv):
    """
    Extrai e organiza dados de um arquivo JSON de cursos em um arquivo CSV,
    incluindo palavras e seus respectivos áudios.
    """

    # Mapeamento de idiomas de português para inglês
    idioma_map = {
        'Italiano': 'Italian',
        'Inglês': 'English',
        'Português': 'Portuguese',
        'Espanhol': 'Spanish',
        'Francês': 'French',
        'Alemão': 'German',
        # Adicione outros idiomas conforme necessário
    }

    try:
        with open(arquivo_json, 'r', encoding='utf-8') as f:
            cursos_data = json.load(f)
    except FileNotFoundError:
        print(f"Erro: O arquivo '{arquivo_json}' não foi encontrado.")
        return

    dados_agrupados = {}
    idiomas_encontrados = set()

    for curso in cursos_data:
        idioma_pt = curso.get('idioma')
        if idioma_pt in idioma_map:
            idioma_en = idioma_map[idioma_pt]
            idiomas_encontrados.add(idioma_en)
        else:
            print(f"Aviso: Idioma '{idioma_pt}' não mapeado. Ele não será incluído no CSV.")
            continue
        
        for capitulo in curso.get('capitulos', []):
            categoria = capitulo.get('classe')
            for vocabulo in capitulo.get('vocabulario', []):
                cod_dekoreba = vocabulo.get('cod_dekoreba')
                posicao = vocabulo.get('posicao')
                palavra = vocabulo.get('palavra', {}).get('latino', '-')
                audio = vocabulo.get('audio', '-')
                
                chave = (cod_dekoreba, posicao)
                if chave not in dados_agrupados:
                    dados_agrupados[chave] = {
                        'Categoria': categoria,
                        'Cod_dekoreba': cod_dekoreba,
                        'Posicao': posicao
                    }

                # Cria chaves separadas para a palavra e o áudio de cada idioma
                dados_agrupados[chave][f"{idioma_en}_palavra"] = palavra
                dados_agrupados[chave][f"{idioma_en}_audio"] = audio

    # Cabeçalho do CSV
    idiomas_ordenados = sorted(list(idiomas_encontrados))
    
    cabecalho = ['Categoria', 'Posicao', 'Cod_dekoreba']
    for idioma in idiomas_ordenados:
        cabecalho.append(f"{idioma}_palavra")
        cabecalho.append(f"{idioma}_audio")

    # Escrever os dados no arquivo CSV
    with open(arquivo_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=cabecalho)
        writer.writeheader()

        for chave in sorted(dados_agrupados.keys()):
            linha = dados_agrupados[chave]
            writer.writerow(linha)

    print(f"Dados exportados com sucesso para '{arquivo_csv}'.")

# --- Exemplo de uso ---
if __name__ == "__main__":
    # Substitua 'panlex.cursos.json' pelo caminho real do seu arquivo
    extrair_dados_cursos('panlex.cursos.json', 'dados_com_audio.csv')