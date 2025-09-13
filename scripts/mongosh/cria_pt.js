use panlex;

// 1. Busca o curso com idioma_1: "Português"
const curso = db.cursos.findOne({ idioma_1: "Português" });
if (!curso) {
  print("Curso em Português não encontrado.");
} else {
  // 2. Cria índice de termos para busca rápida
  print("Indexando panlex_pt...");
  const termoToMeanings = {};

  db.panlex_pt.find().forEach(function(entry) {
    entry.palavras_pt.forEach(function(palavra, index) {
      if (typeof palavra === "string") {
        const termo = palavra.toLowerCase();
        if (!Array.isArray(termoToMeanings[termo])) {
          termoToMeanings[termo] = [];
        }
        termoToMeanings[termo].push({
          cod_dekoreba: entry.meaning,
          posicao: index
        });
      }
    });
  });


  // 3. Cria novo array capitulos_2 com vocabulário expandido
  print("Construindo capitulos_2...");
  const novosCapitulos = curso.capitulos.map(function(cap) {
    const novoVocab = [];

    cap.vocabulario.forEach(function(item) {
      if (item && item.palavra && typeof item.palavra.latino === "string") {
        const termo = item.palavra.latino.toLowerCase();
        const sinonimos = termoToMeanings[termo];

        if (sinonimos) {
          sinonimos.forEach(function(s) {
            novoVocab.push({
              cod_dekoreba: s.cod_dekoreba,
              posicao: s.posicao,
              arquivo: "",
              palavra: {
                latino: termo
              }
            });
          });
        }
      }
    });

    return {
      classe: cap.classe,
      vocabulario: novoVocab
    };
  });

  // 4. Atualiza o documento com novo campo capitulos_2
  db.cursos.updateOne(
    { _id: curso._id },
    { $set: { capitulos: novosCapitulos } }
  );

  print("✅ capitulos_2 adicionado com sucesso!");
}
