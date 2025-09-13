db.expr_spa.createIndex({ meanings: 1 });

const panlex_por = db.panlex_por.find().toArray();
const expr_spa = db.expr_spa.find().toArray();

// Mapeia meanings para seus txts
const meaningToTxts = {};
expr_spa.forEach(doc => {
  if (doc.meanings) {
    doc.meanings.forEach(m => {
      if (!meaningToTxts[m]) meaningToTxts[m] = [];
      meaningToTxts[m].push(doc.txt);
    });
  }
});

function contarMaisPopulares(txts) {
  const contagem = {};
  txts.forEach(t => contagem[t] = (contagem[t] || 0) + 1);
  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1]) // ordem decrescente
    .slice(0, 3) // top 3
    .map(([txt], i) => ({ txt, posicao: i + 1 }));
}

const novoCurso = {
  _id: ObjectId(),
  idioma: "Espanhol",
  cor: "#FFF000",
  sistemas_escrita: ["latino"],
  imagem_fundo: 3,
  capitulos: panlex_por.map(classeDoc => {
    const vocabulario = [];

    classeDoc.palavras.forEach(p => {
      const txts = meaningToTxts[p.meaning] || [];

      if (txts.length > 0) {
        const top3 = contarMaisPopulares(txts);
        top3.forEach(palavraPopular => {
          vocabulario.push({
            _id: ObjectId(),
            cod_dekoreba: p.meaning,
            palavra: { latino: palavraPopular.txt },
            posicao: palavraPopular.posicao
          });
        });
      }
    });

    return {
      _id: ObjectId(),
      classe: classeDoc.classe,
      vocabulario
    };
  }).filter(cap => cap.vocabulario.length > 0) // remove capítulos vazios
};

db.cursos.insertOne(novoCurso);
