db.expr_por.createIndex({ txt: 1 });
// db.expr_eng.createIndex({ meanings: 1 });
db.expr_por.createIndex({ meanings: 1 });


use panlex;

let codDekoreba = 1;
const capitulos = [];

db.classes_pt.find({}).forEach(docClasse => {

  const vocabulario = [];

  docClasse.palavras.forEach(palavra => {

    const docExprPor = db.expr_por.findOne({ txt: palavra });

    if (docExprPor && Array.isArray(docExprPor.meanings)) {
      const freqMap = {};

        docExprPor.meanings.forEach(meaning => {
          db.expr_por.find({ meanings: meaning }).forEach(docIta => {
            const txt = docIta.txt;
            if (!freqMap[txt]) {
              freqMap[txt] = { count: 0, meaning: meaning };
            }
            freqMap[txt].count++;
          });
        });

        const top3 = Object.entries(freqMap)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 3);

        if (top3.length > 0) {
          top3.forEach(([txt, data], index) => {
            vocabulario.push({
              _id: ObjectId(),
              cod_dekoreba: codDekoreba,
              meaning: data.meaning, // 👈 adicionando o meaning
              palavra: {
                latino: txt
              },
              posicao: index + 1
            });
          });
        }

    }

    codDekoreba++;
  });

  if (vocabulario.length > 0) {

    capitulos.push({
      _id: ObjectId(),
      classe: docClasse.classe,
      vocabulario: vocabulario
    });
  }
});

if (capitulos.length > 0) {
  db.cursos.insertOne({
    _id: ObjectId(),
    idioma: "Português",
    cor: "#FFF000",
    sistemas_escrita: ["latino"],
    imagem_fundo: 3,
    capitulos: capitulos
  });
}
