faixas = [
    {"classe": "artigos", "primeiro_cod": 1, "ultimo_cod": 8},
    {"classe": "pronomes", "primeiro_cod": 9, "ultimo_cod": 50},
    {"classe": "conjuncoes", "primeiro_cod": 51, "ultimo_cod": 65},
    {"classe": "preposicoes", "primeiro_cod": 66, "ultimo_cod": 108},
    {"classe": "substantivos", "primeiro_cod": 109, "ultimo_cod": 1094},
    {"classe": "adjetivos", "primeiro_cod": 1095, "ultimo_cod": 1584},
    {"classe": "adverbios", "primeiro_cod": 1585, "ultimo_cod": 1728},
    {"classe": "verbos_infinitivos", "primeiro_cod": 1729, "ultimo_cod": 1974}
]

# 🧱 Gera o dicionário com índice 0-based
arquivos_por_classe = {}

for faixa in faixas:
    classe = faixa["classe"]
    primeiro = faixa["primeiro_cod"]
    ultimo = faixa["ultimo_cod"]
    arquivos_por_classe[classe] = {
        idx: f"{cod}.mp3"
        for idx, cod in enumerate(range(primeiro, ultimo + 1))
    }

# 📝 Gera conteúdo JS formatado
def format_js(obj):
    linhas = ["const arquivosPorClasse = {"]
    for classe, codigos in obj.items():
        linhas.append(f"  '{classe}': {{")
        for k, v in codigos.items():
            linhas.append(f"    {k}: '{v}',")
        linhas.append("  },")
    linhas.append("};")
    return "\n".join(linhas)

# 💾 Salva como arquivo JS
with open("arquivosPorClasse.js", "w", encoding="utf-8") as f:
    f.write(format_js(arquivos_por_classe))

print("✅ Arquivo 'arquivosPorClasse.js' gerado com sucesso!")
