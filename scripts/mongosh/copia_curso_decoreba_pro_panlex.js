use decoreba

const cursor = db.cursos.find();
const docs = [];

cursor.forEach(doc => {
  docs.push(doc);
  if (docs.length === 1000) {
    db.getSiblingDB("panlex").cursos.insertMany(docs);
    docs.length = 0;
  }
});

// Insere o que sobrar
if (docs.length > 0) {
  db.getSiblingDB("panlex").cursos.insertMany(docs);
}
