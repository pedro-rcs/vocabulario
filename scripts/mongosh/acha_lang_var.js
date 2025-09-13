// Acha o número do langvar.
const lang = "eng"; // constante específica

db.getSiblingDB("panlex").langvar.find({
  lang_code: lang,
  var_code: 0
}, {
  id: 1,
  _id: 0
});

// Por exemplo o italiano: hindi = 275
// gug = 252 - guaraní avañe'e
// spa = 666 - espanhol
// ita = 304
// por = 579
// deu = 157
// fra = 211
// eng = 187


// Idexa o expr para a parada ser ligeira.
db.expr.createIndex({ langvar: 1 });

// Cria uma collection nova para o idioma, separando a palavra e seus meanings.
db.expr.aggregate([
  { $match: { langvar: 187 } },
  { $project: { txt: 1, id: 1 } },
  {
    $lookup: {
      from: "denotation",
      localField: "id",
      foreignField: "expr",
      as: "denotations"
    }
  },
  {
    $project: {
      txt: 1,
      meanings: {
        $map: {
          input: "$denotations",
          as: "d",
          in: "$$d.meaning"
        }
      }
    }
  },
  { $out: "expr_eng" }
])

// 