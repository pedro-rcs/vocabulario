import json
import os

# Caminho do arquivo JSON
json_path = 'panlex.cursos.json'

# Pasta de saída
output_dir = 'mapas_audios'
os.makedirs(output_dir, exist_ok=True)

# Carrega o JSON
with open(json_path, 'r', encoding='utf-8') as f:
    cursos = json.load(f)

# Itera sobre cada curso (idioma)
for curso in cursos:
    idioma = curso.get('idioma')
    capitulos = curso.get('capitulos', [])

    audio_map = {}

    for capitulo in capitulos:
        classe = capitulo.get('classe')
        vocabulario = capitulo.get('vocabulario', [])

        audio_map[classe] = {}
        for idx, palavra in enumerate(vocabulario):
            audio = palavra.get('audio')
            audio_map[classe][idx] = f"{audio}.mp3"

    # Gera o conteúdo do arquivo JS
    js_lines = ["// Exporta o mapa de áudios", "const audioMap = {"]
    for classe, audios in audio_map.items():
        js_lines.append(f"  '{classe}': {{")
        for idx, nome_arquivo in audios.items():
            js_lines.append(f"    {idx}: '{nome_arquivo}',")
        js_lines.append("  },")
    js_lines.append("};")

    # Salva o arquivo
    output_path = os.path.join(output_dir, f"{idioma}.js")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(js_lines))

print("Arquivos gerados com sucesso em:", output_dir)