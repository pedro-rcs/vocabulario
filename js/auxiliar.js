import { traducoes_hud } from './traducoes_hud.js'

  const languages = [
    { code: 'en', name: 'English', name_ingles: 'English' },
    { code: 'pt', name: 'Português', name_ingles: 'Portuguese' },
    { code: 'es', name: 'Español', name_ingles: 'Spanish' },
    { code: 'fr', name: 'Français', name_ingles: 'French' },
    { code: 'de', name: 'Deutsch', name_ingles: 'German' },
    { code: 'it', name: 'Italiano', name_ingles: 'Italian' }
  ];

function createLanguageSelector(container, idioma_selecionado, tipo) {
  const label = document.createElement('label');
  label.setAttribute('for', 'language-select');
  
  const traducao_select = (tipo === 'padrao') ? 'label_select_language' : 'label_idioma_praticado'
  label.textContent = traduzir_hud(traducao_select, idioma_selecionado)

  const select = escolhe_idioma_select(idioma_selecionado, tipo)
  
  container.appendChild(label)
  container.appendChild(select)
}

function escolhe_idioma_select (idioma_selecionado, tipo) {

  const select = document.createElement('select');
  select.id = 'language-select';
  select.name = 'language';

  languages.forEach(lang => {

    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = lang.name;

    if (tipo === 'padrao') select.appendChild(option);
    if (tipo != 'padrao' && lang.code != idioma_selecionado) select.appendChild(option)
  });

  let valor
  if (tipo === 'padrao') valor = idioma_selecionado
  if (tipo != 'padrao') {
    if (idioma_selecionado === 'en') {
      valor = 'pt'
    } else {
      valor = 'en'
    }    
  }

  select.value = valor

  return select
}

function cria_botoes_abas (texto, atividade) {

  const classe_ativo = (atividade === 'ativo') ? 'active' : ''
  const botao = document.createElement('button');
  botao.textContent = texto
  botao.className = `tab-btn ${classe_ativo}`
  return botao
}

function teorizar () {
  document.getElementById("language_selector_pratica").style.display = 'none'
}

function praticar () {
  // Primeiro, selecionar o idioma que quer praticar.
  document.getElementById("language_selector_pratica").style.display = 'flex'
  modo = 'pratica'
  const div_o = document.createElement('div');
  div_o.innerHTML = ''

  const idioma_selecionado = 'pt'

  const label = document.createElement('label');
  label.setAttribute('for', 'language-select');
  
  label.textContent = traduzir_hud('label_select_language', idioma_selecionado)

  const select = document.createElement('select');
  select.id = 'language-select';
  select.name = 'language';

  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = lang.name;
    select.appendChild(option);
  });

  select.value = idioma_selecionado

  document.getElementById('container_idioma').appendChild(select)
  // Depois, mostrar o idioma e o praticado, mas o praticado só com inputs
  // MOstrar um botão de conferencia.

}

function traduzir_hud (item, idioma) {
  return traducoes_hud[item]?.[idioma] || item
}


function encontra_lang_ingles (codigo) {
  for (let i = 0; i < languages.length; i++) {
    if (languages[i].code === codigo) return languages.name_ingles
  }
}

function separar_idiomas_pratica (dados) {

  const idioma_padrao_ingles = encontra_lang_ingles(document.getElementById('language_selector').value)
  const idioma_pratica_ingles = encontra_lang_ingles(document.getElementById('language_selector_pratica').value)
  
    // Identificar os índices das colunas que queremos manter
    const header = dados[0];
    const indicesParaManter = [
      0, // primeira coluna
      header.indexOf(idioma_padrao_ingles),
      header.indexOf(idioma_pratica_ingles)
    ];

    // Filtrar cada linha para manter apenas essas colunas
    const resultadoFiltrado = dados.map(row =>
      indicesParaManter.map(index => row[index])
    );

    return resultadoFiltrado

}



export { createLanguageSelector, cria_botoes_abas, traduzir_hud, teorizar, praticar, separar_idiomas_pratica }