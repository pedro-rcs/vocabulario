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
  return container
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
  select.id = 'language-select-praticado';
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

function cria_botoes_abas_2 (texto, atividade) {

  const classe_ativo = (atividade === 'ativo') ? 'active' : ''
  const botao = document.createElement('button');
  botao.textContent = texto
  botao.className = `tab-btn2 ${classe_ativo}`
  return botao
}

function traduzir_hud (item, idioma) {
  return traducoes_hud[item]?.[idioma] || item
}

function traduzir_idioma_ingles(codigo_idioma_h, currentLanguage) {
  const langObj = traducoes_hud.idiomas.find(lang => lang.idioma === currentLanguage);
  return langObj?.[codigo_idioma_h] || 'Unknown Language';
}


function encontra_lang_ingles (codigo) {
  for (let i = 0; i < languages.length; i++) {
    if (languages[i].code === codigo) return languages[i].name_ingles
  }
}

function encontra_sigla_do_ingles (name_ingles) {
  for (let i = 0; i < languages.length; i++) {
    if (languages[i].name_ingles == name_ingles) return languages[i].code
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

  const resultadoFiltrado = [];

  for (let i = 0; i < dados.length; i++) {
    const row = dados[i];

    // Sempre mantém a primeira linha (cabeçalho)
    if (i === 0 || row[1] === "1") {
      const novaLinha = indicesParaManter.map(index => row[index]);
      resultadoFiltrado.push(novaLinha);
    }
  }
  
  return resultadoFiltrado;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days*24*60*60*1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  console.log("Cookie definido:", document.cookie);
}
function getCookie(name) {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? decodeURIComponent(v[2]) : null;
}
function apagaCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log(`apagado: ${name}`)
  window.location.reload()
}

function showCustomModal(message, callback) {
  const modal = document.getElementById('custom-modal');
  const msgDiv = document.getElementById('custom-modal-message');
  const closeBtn = document.getElementById('custom-modal-close');
  
  msgDiv.innerHTML = message;
  modal.style.display = 'flex';

  function closeModal() {
    modal.style.display = 'none';
    closeBtn.removeEventListener('click', closeModal);
    modal.removeEventListener('click', outsideClick);
    if (callback) callback();
  }
  function outsideClick(e) {
    if (e.target === modal) closeModal();
  }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', outsideClick);
}

function cria_escolha_idiomas (tipo) {

  if (tipo === 'geral') {
    let language_selector = document.createElement('div');
    language_selector.className = "language-selector";
    language_selector.style.marginBottom = "10px"

    return createLanguageSelector(language_selector, currentLanguage, 'padrao') // adiciona label
  }

  if (tipo === 'pratica') {
    let language_selector_pratica = document.createElement('div');
    language_selector_pratica.className = "language-selector";
    language_selector_pratica.style.marginBottom = "10px"
    language_selector_pratica.id = 'language_selector_pratica'

    return createLanguageSelector(language_selector_pratica, currentLanguage, 'pratica', idioma_praticado) // adiciona label + select dentro desse div
  }
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

/*
function lightenColor(hexColor, percent) {
  const [r, g, b] = hexToRgb(hexColor);
  let [h, s, l] = rgbToHsl(r, g, b);
  l = Math.min(100, l + percent);
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}
*/



function softenColor(hexColor, percent) {
  const [r1, g1, b1] = hexToRgb(hexColor);
  const [r2, g2, b2] = [255, 255, 255]; // branco

  // Mistura RGB com branco
  const mix = (c1, c2) => Math.round(c1 + (c2 - c1) * (percent / 100));
  const r = mix(r1, r2);
  const g = mix(g1, g2);
  const b = mix(b1, b2);

  // Converte para HSL e reduz saturação
  let [h, s, l] = rgbToHsl(r, g, b);
  s = Math.max(0, s - percent * 0.5); // reduz saturação suavemente

  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

function getTextColor(hexColor) {
  const [r, g, b] = hexToRgb(hexColor).map(c => {
    c /= 255;
    return c <= 0.03928
      ? c / 12.92
      : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance > 0.5 ? "#000000" : "#ffffff"; // fundo claro → texto preto, fundo escuro → texto branco
}


function altera_cores_idioma(idioma) {
  
  const root = document.documentElement

  let cor_original
  if (idioma === 'en') cor_original = '#B22234'
  if (idioma === 'pt') cor_original = '#009739'
  if (idioma === 'es') cor_original = '#FFC400'
  if (idioma === 'fr') cor_original = '#0055A4'
  if (idioma === 'de') cor_original = '#FFCE00'
  if (idioma === 'it') cor_original = '#009246'

  root.style.setProperty('--cor_botao',cor_original)
  root.style.setProperty('--texto_botoes', getTextColor(cor_original)) // cor do texto dos botões
  root.style.setProperty('--cor_botao_claro', softenColor(cor_original, 40))
}

export {
  createLanguageSelector,
  cria_botoes_abas,
  cria_botoes_abas_2,
  traduzir_hud,
  traduzir_idioma_ingles,
  separar_idiomas_pratica,
  setCookie,
  getCookie,
  apagaCookie,
  showCustomModal,
  encontra_lang_ingles,
  encontra_sigla_do_ingles,
  altera_cores_idioma
}