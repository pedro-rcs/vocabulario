use panlex

// Passo 1: montar mapa id → palavra
print("Carregando mapa de expr_portugues...");
const idToPalavra = {};
db.expr_portugues.find({}, { id: 1, palavra: 1 }).forEach(doc => {
  idToPalavra[doc.id] = doc.palavra;
});
print("Mapa carregado!");

// Passo 2: iterar denotation e agrupar por meaning
print("Agrupando denotations...");
const agrupado = {};
let count = 0;

db.denotation.find({}, { expr: 1, meaning: 1 }).forEach(doc => {
  const palavra = idToPalavra[doc.expr];
  if (palavra) {
    if (!agrupado[doc.meaning]) agrupado[doc.meaning] = new Set();
    agrupado[doc.meaning].add(palavra);
  }
  count++;
  if (count % 100000 === 0) print(`${count} denotations processadas...`);
});

// Passo 3: salvar na nova collection
print("Salvando resultados na panlex_pt...");
const bulk = [];
for (const meaning in agrupado) {
  bulk.push({
    insertOne: {
      document: {
        meaning: parseInt(meaning),
        palavras_pt: Array.from(agrupado[meaning])
      }
    }
  });
}
db.panlex_pt.drop();
db.panlex_pt.bulkWrite(bulk);
print(`Concluído! Criados ${bulk.length} documentos em panlex_pt.`);
