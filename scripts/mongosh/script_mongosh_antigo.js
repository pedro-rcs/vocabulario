const cursos = db.cursos.find().toArray();

const idioma_complexo = "Português"
const idioma_simples = "portugues"

let i_curso_ing;
for (let i = 0; i < cursos.length; i++) {
  if (cursos[i].idioma_1 === 'Inglês') i_curso_ing = i;
}

const cursoOriginal = cursos[i_curso_ing];
console.log(`i_curso_ing: ${i_curso_ing}`)
let capitulos_en = [];
let capitulos_pt = [];

for (let i = 0; i < cursoOriginal.capitulos.length; i++) {
  const classeCapitulo = cursoOriginal.capitulos[i].classe || "";
  const capitulo_en = { _id: ObjectId(), classe: classeCapitulo, vocabulario: [] };
  const capitulo_pt = { _id: ObjectId(), classe: classeCapitulo, vocabulario: [] };

  for (let j = 0; j < cursoOriginal.capitulos[i].vocabulario.length; j++) {
    const palavraAlvo = cursoOriginal.capitulos[i].vocabulario[j].palavra.latino;

    const exprs = db.expr_ingles.aggregate([
      { $match: { txt: palavraAlvo, langvar: 187 } },
      { $limit: 10 },
      { $lookup: {
          from: "denotation",
          localField: "id",
          foreignField: "expr",
          as: "denotations"
      }},
      { $unwind: "$denotations" },
      { $project: {
          meaning: "$denotations.meaning"
      }},
      { $limit: 1 }
    ]).toArray();

    if (exprs.length === 0) continue;

    const significadoAlvo = exprs[0].meaning;

    // Palavras em inglês com o mesmo meaning
    const palavras_en_raw = db.denotation.aggregate([
      { $match: { meaning: significadoAlvo } },
      { $lookup: {
          from: "expr_ingles",
          localField: "expr",
          foreignField: "id",
          as: "ingles"
      }},
      { $unwind: "$ingles" },
      { $project: {
          palavra: "$ingles.txt"
      }}
    ]).toArray();

    // Palavras em idioma_simples com o mesmo meaning
    const palavras_pt_raw = db.denotation.aggregate([
      { $match: { meaning: significadoAlvo } },
      { $lookup: {
          from: `expr_${idioma_simples}`,
          localField: "expr",
          foreignField: "id",
          as: idioma_simples
      }},
      { $unwind: `$${idioma_simples}` },
      { $project: {
          palavra: `${idioma_simples}.txt`
      }}
    ]).toArray();

    function contarFrequencias(lista) {
      const freq = {};
      for (const item of lista) {
        const p = item.palavra;
        if (!freq[p]) freq[p] = { count: 0, palavra: p };
        freq[p].count++;
      }
      return Object.values(freq).sort((a, b) => b.count - a.count);
    }

    const top_en = contarFrequencias(palavras_en_raw).slice(0, 3);
    const top_pt = contarFrequencias(palavras_pt_raw).slice(0, 3);

    for (let k = 0; k < top_en.length; k++) {
      capitulo_en.vocabulario.push({
        _id: ObjectId(),
        cod_dekoreba: significadoAlvo,
        palavra: { latino: top_en[k].palavra },
        posicao: k
      });
    }

    for (let k = 0; k < top_pt.length; k++) {
      capitulo_pt.vocabulario.push({
        _id: ObjectId(),
        cod_dekoreba: significadoAlvo,
        palavra: { latino: top_pt[k].palavra },
        posicao: k
      });
    }
  }

  if (capitulo_en.vocabulario.length > 0) capitulos_en.push(capitulo_en);
  if (capitulo_pt.vocabulario.length > 0) capitulos_pt.push(capitulo_pt);
}

// Curso em inglês
/*
db.cursos.insertOne({
  idioma: "Inglês",
  sistemas_escrita: ["latino"],
  cor: "#b22234",
  imagem_fundo: 3,
  capitulos: capitulos_en,
  __v: 1,
});
*/

// Curso em português
db.cursos.insertOne({
  idioma: `${idioma_complexo} 2`,
  sistemas_escrita: ["latino"],
  cor: "#000000",
  imagem_fundo: 3,
  capitulos: capitulos_pt,
  __v: 1,
});

print("Cursos com múltiplas traduções e posições inseridos com sucesso!");