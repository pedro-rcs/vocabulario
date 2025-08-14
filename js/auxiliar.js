import { traducoes_hud } from './traducoes_hud.js'

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

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' }
  ];

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

function praticar () {
  // Primeiro, selecionar o idioma que quer praticar.

  const div_o = document.createElement('div');
  div_o.innerHTML = ''

  const idioma_selecionado = 'pt'

  const label = document.createElement('label');
  label.setAttribute('for', 'language-select');
  
  label.textContent = traduzir_hud('label_select_language', idioma_selecionado)

  const select = document.createElement('select');
  select.id = 'language-select';
  select.name = 'language';

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' }
  ];

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


export { createLanguageSelector, cria_botoes_abas, traduzir_hud, praticar }