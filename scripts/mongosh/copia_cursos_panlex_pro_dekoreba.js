// Acessa os dois bancos
const panlex = db.getSiblingDB("panlex");
const decoreba = db.getSiblingDB("decoreba");

// Lê todos os documentos da collection "cursos" do panlex
const dados = panlex.cursos.find().toArray();

// Remove todos os documentos da collection "cursos" do decoreba
decoreba.cursos.deleteMany({});

// Insere os dados copiados
if (dados.length > 0) {
  decoreba.cursos.insertMany(dados);
  print(`Copiados ${dados.length} documentos de panlex.cursos para decoreba.cursos`);
} else {
  print("Nenhum documento encontrado em panlex.cursos");
}