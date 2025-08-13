function createLanguageSelector(container, idioma_selecionado) {
  const label = document.createElement('label');
  label.setAttribute('for', 'language-select');
  label.textContent = 'Select your language:';

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
  
  container.appendChild(label);
  container.appendChild(select);
}

function cria_botoes_abas (texto, atividade) {

  const classe_ativo = (atividade === 'ativo') ? 'active' : ''
  const botao = document.createElement('button');
  botao.textContent = texto
  botao.className = `tab-btn ${classe_ativo}`
  return botao
}

export { createLanguageSelector, cria_botoes_abas }