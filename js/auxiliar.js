import { traducoes_hud } from './traducoes_hud.js'

  const languages = [
    { code: 'en', name: 'English', name_ingles: 'English' },
    { code: 'pt', name: 'Português', name_ingles: 'Portuguese' },
    { code: 'es', name: 'Español', name_ingles: 'Spanish' },
    { code: 'fr', name: 'Français', name_ingles: 'French' },
    { code: 'de', name: 'Deutsch', name_ingles: 'German' },
    { code: 'it', name: 'Italiano', name_ingles: 'Italian' }
  ];

function createLanguageSelector(container, idioma_selecionado, tipo, idioma_praticado) {
  const label = document.createElement('label');
  label.setAttribute('for', 'language-select');
  
  const traducao_select = (tipo === 'padrao') ? 'label_select_language' : 'label_idioma_praticado'
  label.textContent = traduzir_hud(traducao_select, idioma_selecionado)

  let select
  if (tipo === 'padrao') {
    select = idioma_select_padrao(idioma_selecionado, tipo, idioma_praticado)
  }
  if (tipo === 'pratica') {
    select = idioma_select_praticado(idioma_selecionado, tipo, idioma_praticado)
  }
  
  container.appendChild(label)
  container.appendChild(select)
}

function idioma_select_padrao (idioma_selecionado, tipo, idioma_praticado) {

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

  select.value = idioma_selecionado

  return select
}

function idioma_select_praticado (idioma_selecionado, tipo, idioma_praticado) {
  
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

  select.value = idioma_praticado

  return select
}



function cria_botoes_abas (texto, atividade) {

  const classe_ativo = (atividade === 'ativo') ? 'active' : ''
  const botao = document.createElement('button');
  botao.textContent = texto
  botao.className = `tab-btn ${classe_ativo}`
  return botao
}

function traduzir_hud (item, idioma) {
  return traducoes_hud[item]?.[idioma] || item
}

function traduzir_idioma_ingles(codigo_idioma_h, currentLanguage) {
  const langObj = traducoes_hud.idiomas.find(lang => lang.idioma === currentLanguage);
  console.log('langObj:', langObj, 'codigo_idioma_h:', codigo_idioma_h);
  return langObj?.[codigo_idioma_h] || 'Unknown Language';
}


function encontra_lang_ingles (codigo) {
  for (let i = 0; i < languages.length; i++) {
    if (languages[i].code === codigo) return languages[i].name_ingles
  }
}

function separar_idiomas_pratica(dados, selecionado, praticado) {
  const idioma_padrao_ingles = encontra_lang_ingles(selecionado).trim();
  const idioma_pratica_ingles = encontra_lang_ingles(praticado).trim();

  const header = dados[0].map(h => h.trim());
  const idx_padrao = header.findIndex(h => h.toLowerCase() === idioma_padrao_ingles.toLowerCase());
  const idx_pratica = header.findIndex(h => h.toLowerCase() === idioma_pratica_ingles.toLowerCase());

  console.log('Header:', header);
  console.log('Procurando:', idioma_padrao_ingles, idioma_pratica_ingles);
  console.log('Índices:', idx_padrao, idx_pratica);

  const indicesParaManter = [0, idx_padrao, idx_pratica];

  const resultadoFiltrado = dados.map(row =>
    indicesParaManter.map(index => row[index])
  );

  return resultadoFiltrado;
}



export { createLanguageSelector, cria_botoes_abas, traduzir_hud, traduzir_idioma_ingles, separar_idiomas_pratica }