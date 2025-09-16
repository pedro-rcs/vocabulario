import json
import os

# Função para carregar o JSON
def carregar_json(caminho_arquivo):
    with open(caminho_arquivo, 'r', encoding='utf-8') as f:
        return json.load(f)

# Função para gerar os arquivos .js
def gerar_arquivos_js(json_data, pasta_saida="audios_js"):
    os.makedirs(pasta_saida, exist_ok=True)

    for curso in json_data:
        idioma = curso.get("idioma", "").lower().replace(" ", "_")
        capitulos = curso.get("capitulos", [])

        mapa_audio = {}

        for capitulo in capitulos:
            categoria = capitulo.get("classe", "")
            vocabulario = capitulo.get("vocabulario", [])

            if categoria not in mapa_audio:
                mapa_audio[categoria] = {}

            for idx, item in enumerate(vocabulario):
                audio = item.get("audio", "")
                if audio:
                    mapa_audio[categoria][idx] = f"{audio}.mp3"

        # Gera conteúdo do arquivo .js
        conteudo_js = "export default {\n"
        for categoria, audios in mapa_audio.items():
            conteudo_js += f"  '{categoria}': {{\n"
            for idx, nome_arquivo in audios.items():
                conteudo_js += f"    {idx}: '{nome_arquivo}',\n"
            conteudo_js += "  },\n"
        conteudo_js += "};\n"

        # Salva o arquivo
        caminho_saida = os.path.join(pasta_saida, f"{idioma}.js")
        with open(caminho_saida, 'w', encoding='utf-8') as f:
            f.write(conteudo_js)

        print(f"Arquivo gerado: {caminho_saida}")

# Caminho do JSON
arquivo_json = "panlex.cursos.json"

# Execução
json_data = carregar_json(arquivo_json)
gerar_arquivos_js(json_data)