import { audioMap } from './audio_map.js'
import { traducoesCategoria } from './traducoes_categorias.js'
import { parseCSV } from './csv_utils.js'
import {
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
  encontra_lang_ingles
} from './auxiliar.js'

// Definimos variáveis e contantes.
const caminho = location.hostname === "127.0.0.1" ? "../" : "./"

let modo = 'teoria'
let mostra_placeholder_palavras = 'nao'

let currentLanguage = getCookie("currentLanguage")
if (!currentLanguage) {
  currentLanguage = 'en'
  setCookie('currentLanguage', currentLanguage, 365)
}

let idioma_praticado = getCookie("idioma_praticado")
if (!idioma_praticado) {
  idioma_praticado = 'pt'
  setCookie('idioma_praticado', idioma_praticado, 365)
}


function buildTables (data) {
  // --- helpers e índices robustos ---
  const rawHeaders = data[0].slice(1); // remove coluna categoria
  const headers = rawHeaders.map(h => (h || '').trim());
  const headerIndex = (name) => headers.findIndex(h => h && h.toLowerCase() === String(name).trim().toLowerCase());

  const idxPosicao = headerIndex('Posicao');           // normalmente 0
  const idxCod = headerIndex('Cod_dekoreba');         // normalmente 1

  // languages mapping (para tradução dos th)
  const languages = [
    { code: 'en', name_ingles: 'English' },
    { code: 'pt', name_ingles: 'Portuguese' },
    { code: 'es', name_ingles: 'Spanish' },
    { code: 'fr', name_ingles: 'French' },
    { code: 'it', name_ingles: 'Italian' },
    { code: 'de', name_ingles: 'German' }
  ];

  // --- agrupamento por categoria ---
  const grouped = {};
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const categoria = row[0];
    if (!grouped[categoria]) grouped[categoria] = [];
    grouped[categoria].push(row.slice(1)); // linha sem a coluna categoria
  }

  // --- container ---
  const container = document.getElementById('output');
  container.innerHTML = '';

  // --- cria seletores / botões (mantive sua lógica original) ---
  let language_selector = document.createElement('div');
  language_selector.className = "language-selector";
  language_selector.style.marginBottom = "10px";
  createLanguageSelector(language_selector, currentLanguage, 'padrao');
  container.appendChild(language_selector);

  let language_selector_pratica = document.createElement('div');
  language_selector_pratica.className = "language-selector";
  language_selector_pratica.style.marginBottom = "10px";
  language_selector_pratica.id = 'language_selector_pratica';
  createLanguageSelector(language_selector_pratica, currentLanguage, 'pratica', idioma_praticado);
  container.appendChild(language_selector_pratica);

  const container_botoes_modalidades = document.createElement('div');
  container_botoes_modalidades.className = 'container_bots_modalidades';
  container_botoes_modalidades.style.marginTop = '40px';
  container_botoes_modalidades.style.marginBottom = '40px';

  const botao_palavras = cria_botoes_abas_2(traduzir_hud('botao_palavras', currentLanguage), "ativo");
  container_botoes_modalidades.appendChild(botao_palavras);

  const botao_conjugacao = cria_botoes_abas_2(traduzir_hud('botao_conjugacao', currentLanguage), "inativo");
  botao_conjugacao.id = "botao_conjugacao";
  botao_conjugacao.addEventListener("click", () => { window.location.href = "conjugacao.html"; });
  container_botoes_modalidades.appendChild(botao_conjugacao);
  container.appendChild(container_botoes_modalidades);

  const container_idioma = document.createElement('div');
  container_idioma.className = 'container_idioma';

  const atividade_botao_teoria = (modo === 'teoria') ? 'ativo' : 'inativo';
  const botao_teoria = cria_botoes_abas(traduzir_hud('botao_teoria', currentLanguage), atividade_botao_teoria);
  botao_teoria.addEventListener("click", () => { modo = 'teoria'; document.getElementById("botao_placeholder_palavra").style.display = 'none'; carrega_csv(); });
  container_idioma.appendChild(botao_teoria);

  const atividade_botao_pratica = (modo === 'pratica') ? 'ativo' : 'inativo';
  const botao_pratica = cria_botoes_abas(traduzir_hud('botao_pratica', currentLanguage), atividade_botao_pratica);
  botao_pratica.addEventListener("click", () => { modo = 'pratica'; document.getElementById("language_selector_pratica").style.display = 'flex'; document.getElementById("botao_placeholder_palavra").style.display = 'flex'; carrega_csv(); });
  container_idioma.appendChild(botao_pratica);

  const atividade_botao_multipla_escolha = (modo === 'multipla_escolha') ? 'ativo' : 'inativo';
  const botao_multipla_escolha = cria_botoes_abas(traduzir_hud('botao_multipla_escolha', currentLanguage), atividade_botao_multipla_escolha);
  botao_multipla_escolha.addEventListener("click", () => { modo = 'multipla_escolha'; carrega_csv(); });
  container_idioma.appendChild(botao_multipla_escolha);

  let botao_placeholder_palavra = document.createElement('button');
  botao_placeholder_palavra.id = 'botao_placeholder_palavra';
  botao_placeholder_palavra.style.display = 'flex';
  botao_placeholder_palavra.className = (mostra_placeholder_palavras === 'sim') ? "bot_mostra_palavras active" : 'bot_mostra_palavras';
  botao_placeholder_palavra.innerHTML = traduzir_hud('placeholder_palavra', currentLanguage);
  botao_placeholder_palavra.addEventListener('click', () => {
    mostra_placeholder_palavras = (mostra_placeholder_palavras === 'sim') ? 'nao' : 'sim';
    carrega_csv();
  });

  const container_botao_placeholder = document.createElement('div');
  container_botao_placeholder.id = 'container_botao_placeholder';
  container_botao_placeholder.style.display = (modo === 'pratica') ? 'flex' : 'none';
  container_botao_placeholder.appendChild(botao_placeholder_palavra);

  container.appendChild(container_idioma);
  container.appendChild(container_botao_placeholder);

  language_selector_pratica.addEventListener("change", (e) => {
    idioma_praticado = e.target.value;
    setCookie('idioma_praticado', idioma_praticado, 365);
    carrega_csv();
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => { document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); });
    if (modo === 'pratica') {
      if (btn.textContent === traduzir_hud('botao_pratica', currentLanguage)) btn.classList.add('active'); else btn.classList.remove('active');
      document.getElementById("language_selector_pratica").value = idioma_praticado;
    }
  });

  // adiciona um handler global único para fechar popups (evita múltiplas attaches)
  if (!window._popupHandlerAdded) {
    window.addEventListener('click', () => {
      document.querySelectorAll('.popup-variantes').forEach(p => p.style.display = 'none');
    });
    window._popupHandlerAdded = true;
  }

  // índice da coluna do idioma praticado (nome em inglês)
  const idiomaPraticadoIngles = (encontra_lang_ingles && typeof encontra_lang_ingles === 'function') ? String(encontra_lang_ingles(idioma_praticado) || '').trim() : '';
  let idxLangPraticado = idiomaPraticadoIngles ? headerIndex(idiomaPraticadoIngles) : -1;

  // --- loop por categoria ---
  for (const categoria in grouped) {
    const frases = grouped[categoria];
    const categoriaTraduzida = traduzirCategoria(categoria, currentLanguage);

    const h2 = document.createElement('h2');
    h2.textContent = categoriaTraduzida;
    h2.style.cursor = 'pointer';
    h2.style.userSelect = 'none';
    container.appendChild(h2);

    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    wrapper.style.display = 'none';

    const table = document.createElement('table');

    // cabeçalho (pulando Posicao e Cod_dekoreba)
    if (modo !== "multipla_escolha") {
      const thead = document.createElement('thead');
      const trHead = document.createElement('tr');
      headers.forEach((h, idx) => {
        if (h !== "Posicao" && h !== "Cod_dekoreba") {
          const th = document.createElement('th');
          let codigo_idioma_h = languages.find(l => l.name_ingles.trim().toLowerCase() === h.trim().toLowerCase())?.code || null;
          th.textContent = traduzir_idioma_ingles ? traduzir_idioma_ingles(codigo_idioma_h, currentLanguage) : h;
          trHead.appendChild(th);
        }
      });
      thead.appendChild(trHead);
      table.appendChild(thead);
    } else {
      const div_botao_joga = document.createElement("div");
      div_botao_joga.className = "container_botao_joga";
      const botao_joga = document.createElement("button");
      botao_joga.className = "botao_terminei";
      botao_joga.innerHTML = traduzir_hud("botao_joga", currentLanguage);
      botao_joga.addEventListener("click", () => {
        window.location.href = `multipla_escolha/index.html?classe=${categoria}&currentLanguage=${currentLanguage}&idioma_praticado=${idioma_praticado}`;
      });
      div_botao_joga.appendChild(botao_joga);
      table.appendChild(div_botao_joga);
    }

    const tbody = document.createElement('tbody');

    // dedupe por texto do idioma praticado (apenas para evitar linhas idênticas na listagem principal)
    const palavrasAdicionadas = new Set();
    const indicesVisiveis = []; // armazena índices (fraseIndex) das linhas mostradas (Posicao === 1)

    frases.forEach((frase, fraseIndex) => {
      // garante índices válidos
      if (idxPosicao === -1 || idxCod === -1) return;

      // só mostramos as linhas com Posicao === "1"
      if (String(frase[idxPosicao]) !== "1") return;

      // se houver idioma praticado, evita duplicatas idênticas
      if (idxLangPraticado > -1) {
        const textoRef = String(frase[idxLangPraticado] || '').trim();
        if (palavrasAdicionadas.has(textoRef)) return;
        palavrasAdicionadas.add(textoRef);
      }

      indicesVisiveis.push(fraseIndex);
      const tr = document.createElement('tr');

      for (let idx = 0; idx < frase.length; idx++) {
        if (idx === idxPosicao || idx === idxCod) continue; // pula metadados

        const td = document.createElement('td');
        td.style.position = "relative";

        const texto = frase[idx] || '';

        const ehColunaPraticada = (modo === 'pratica' && idx === idxLangPraticado);

        if (ehColunaPraticada) {
          const input = document.createElement('input');
          input.type = 'text';
          input.id = `input_${categoria}_${fraseIndex}`;
          input.name = `input_${categoria}_${fraseIndex}`;
          if (mostra_placeholder_palavras === 'sim') input.placeholder = String(frase[idxLangPraticado] || '');
          const acertadas = getProgress ? getProgress(userName, idioma_praticado, categoria) : [];
          if (Array.isArray(acertadas) && acertadas.includes(fraseIndex)) {
            input.value = String(frase[idxLangPraticado] || '');
            input.readOnly = true;
            input.classList.add('input-audio');
            input.title = 'Clique para ouvir o áudio';
            input.onclick = () => {
              const idioma = headers[idxLangPraticado];
              const arquivoAudio = audioMap[categoria] && audioMap[categoria][fraseIndex];
              if (!arquivoAudio) { showCustomModal('Áudio não encontrado para esta palavra.'); return; }
              const audioPath = `${caminho}/${idioma}/${arquivoAudio}`;
              const audio = new Audio(audioPath);
              audio.play().catch(err => console.error('Erro ao tocar áudio:', err));
            };
          }
          td.appendChild(input);
        } else {
          td.textContent = texto;
          td.style.cursor = 'pointer';
          td.addEventListener('click', () => {
            const idioma = headers[idx];
            const arquivoAudio = audioMap[categoria] && audioMap[categoria][fraseIndex];
            if (!arquivoAudio) { alert('Áudio não encontrado para esta frase.'); return; }
            const audioPath = `${idioma}/${arquivoAudio}`;
            const audio = new Audio(audioPath);
            audio.play().catch(err => console.error('Erro ao tocar áudio:', err));
          });
        }

        // --- variantes: procurar por MESMO Cod_dekoreba, mas outras posições ---
        const currentCod = frase[idxCod];
        const variantes = frases.filter(f => String(f[idxCod]) === String(currentCod) && String(f[idxPosicao]) !== "1");

        if (variantes.length > 0) {
          const toggle = document.createElement("span");
          toggle.innerHTML = "&#9660;"; // ▼
          toggle.setAttribute('aria-label', 'Ver variantes');
          toggle.style.cursor = "pointer";
          toggle.style.fontSize = "0.8em";
          toggle.style.position = "absolute";
          toggle.style.right = "6px";
          toggle.style.top = "50%";
          toggle.style.transform = "translateY(-50%)";
          toggle.style.userSelect = "none";

          const popup = document.createElement("div");
          popup.className = "popup-variantes";
          popup.style.position = "absolute";
          popup.style.top = "100%";
          popup.style.right = "0";
          popup.style.background = "#fff";
          popup.style.border = "1px solid #ccc";
          popup.style.padding = "6px 8px";
          popup.style.borderRadius = "6px";
          popup.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
          popup.style.display = "none";
          popup.style.zIndex = "50";
          popup.style.minWidth = "140px";

          variantes.forEach(v => {
            const item = document.createElement("div");
            const textoVar = v[idx] || '';
            item.textContent = `${textoVar}`;
            item.style.padding = "4px 0";
            popup.appendChild(item);
          });

          toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            // esconde outros popups e alterna este
            document.querySelectorAll('.popup-variantes').forEach(p => { if (p !== popup) p.style.display = 'none'; });
            popup.style.display = popup.style.display === "none" ? "block" : "none";
          });

          td.appendChild(toggle);
          td.appendChild(popup);
        }

        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrapper.appendChild(table);
    container.appendChild(wrapper);

    // --- botão "Terminei!" (prática) contando apenas os índicesVisiveis (Posicao===1) ---
    if (modo === 'pratica') {
      const container_bot_terminei = document.createElement('div');
      container_bot_terminei.className = 'container_bot_terminei';
      const botao_terminei = document.createElement('button');
      botao_terminei.textContent = "Terminei!";
      botao_terminei.className = "botao_terminei";
      container_bot_terminei.appendChild(botao_terminei);
      wrapper.appendChild(container_bot_terminei);

      botao_terminei.addEventListener('click', () => {
        let acertos = 0;
        const total = indicesVisiveis.length;
        indicesVisiveis.forEach((fraseIndex) => {
          const input = document.getElementById(`input_${categoria}_${fraseIndex}`);
          if (!input) return;
          input.onclick = null;
          input.classList.remove('input-audio');

          const resposta = (grouped[categoria][fraseIndex] || [])[idxLangPraticado] || '';
          if (input.value.trim().toLowerCase() === String(resposta).trim().toLowerCase()) {
            input.readOnly = true;
            acertos++;
            input.classList.add('input-audio');
            input.title = 'Clique para ouvir o áudio';
            input.onclick = () => {
              const idioma = headers[idxLangPraticado];
              const arquivoAudio = audioMap[categoria] && audioMap[categoria][fraseIndex];
              if (!arquivoAudio) { showCustomModal('Áudio não encontrado para esta palavra.'); return; }
              const audioPath = `${caminho}/${idioma}/${arquivoAudio}`;
              const audio = new Audio(audioPath);
              audio.play().catch(err => console.error('Erro ao tocar áudio:', err));
            };
            saveProgress && saveProgress(userName, idioma_praticado, categoria, fraseIndex);
          } else {
            input.value = '';
          }
        });

        const msg = (acertos === total)
          ? `<b>${acertos}/${total}</b> 🎉<br>Parabéns, você acertou tudo!`
          : `<b>${acertos}/${total}</b> acertos.<br>Tente novamente!`;

        showCustomModal(msg, () => {
          for (let k = 0; k < indicesVisiveis.length; k++) {
            const fraseIndex = indicesVisiveis[k];
            const input = document.getElementById(`input_${categoria}_${fraseIndex}`);
            if (input && !input.readOnly && input.value === '') { input.focus(); break; }
          }
        });
      });

      // Enter => Terminei (aplica apenas aos inputs visíveis)
      indicesVisiveis.forEach((fraseIndex) => {
        const input = document.getElementById(`input_${categoria}_${fraseIndex}`);
        if (input) {
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); botao_terminei.click(); }
          });
        }
      });
    }

    // toggle da categoria
    h2.addEventListener('click', () => {
      wrapper.style.display = wrapper.style.display === 'none' ? 'block' : 'none';
      h2.classList.toggle('open');
    });
  }

  window.groupedCategorias = grouped;
}


function carrega_csv () {

  // body...
  fetch(`${caminho}/dados.csv`) // ou 'subpasta/data.csv' se estiver em uma subpasta
  .then(response => {
    if (!response.ok) throw new Error('CSV não encontrado');
    return response.text();
  })
  .then(csvText => {
    const data = parseCSV(csvText);
    
    if (modo === 'teoria') buildTables(data)
    if (modo === 'pratica') {

      const resultado_filtrado = separar_idiomas_pratica(data, currentLanguage, idioma_praticado)
      buildTables(resultado_filtrado)
    }
    if (modo === 'multipla_escolha') {
      buildTables(data)
    }
    // ...dentro de carrega_csv() ou logo após definir o modo...
    if (modo === 'pratica') {
      document.body.classList.add('pratica');
    } else {
      document.body.classList.remove('pratica');
    }

    let select = document.getElementById('language-select')
    select.addEventListener('change', (e) => {
      currentLanguage = e.target.value;


      if (currentLanguage === idioma_praticado) {
        if (currentLanguage === 'en') {
          idioma_praticado = 'pt'
        } else {
          idioma_praticado = 'en'
        }
      }

      setCookie('currentLanguage', currentLanguage, 365)
      setCookie('idioma_praticado', idioma_praticado, 365)

      updateUserInfo(); // <-- Atualiza o "Olá, ..."
      carrega_csv();
    });


  })
  .catch(err => console.error('Erro ao carregar CSV:', err));
}

carrega_csv()

function traduzirCategoria(categoria, idioma) {
  return traducoesCategoria[categoria]?.[idioma] || categoria
}




let userName = getCookie('userName');
if (!userName) {
  const html = `<Qual é o seu nome?<br><input type="text"></input>`
  showCustomModal(html)
  userName = prompt('Qual é o seu nome?');
  if (userName) setCookie('userName', userName, 365);
}

function updateUserInfo() {
  const ola = traduzir_hud('ola', currentLanguage);
  const statsLabel = traduzir_hud('estatisticas', currentLanguage) || 'Estatísticas';
  const userInfoDiv = document.getElementById('user-info');
  if (userInfoDiv && userName) {
    userInfoDiv.innerHTML = `${ola}, ${userName}!`;

    // Remove botão antigo se existir
    const oldBtn = document.getElementById('stats-btn');
    if (oldBtn) oldBtn.remove();

    // Cria botão estilizado
    let statsBtn = document.createElement('button');
    statsBtn.textContent = `📊 ${statsLabel}`;
    statsBtn.className = 'stats-btn';
    statsBtn.id = 'stats-btn';
    statsBtn.type = 'button';
    statsBtn.style.marginLeft = '1em';
    userInfoDiv.appendChild(statsBtn);

    statsBtn.addEventListener('click', showStatsModal);
  }
}

// No carregamento inicial
if (userName) {
  document.addEventListener('DOMContentLoaded', updateUserInfo);
}



function saveProgress(user, idioma, categoria, fraseIndex) {
  let progresso = {};
  const cookie = getCookie('progresso');
  if (cookie) progresso = JSON.parse(cookie);

  if (!progresso[user]) progresso[user] = {};
  if (!progresso[user][idioma]) progresso[user][idioma] = {};
  if (!progresso[user][idioma][categoria]) progresso[user][idioma][categoria] = [];
  if (!progresso[user][idioma][categoria].includes(fraseIndex)) {
    progresso[user][idioma][categoria].push(fraseIndex);
  }
  setCookie('progresso', JSON.stringify(progresso), 365);
}

function getProgress(user, idioma, categoria) {
  try {
    const cookie = getCookie('progresso');
    if (!cookie) return [];
    const progresso = JSON.parse(cookie);
    return progresso[user]?.[idioma]?.[categoria] || [];
  } catch (e) {
    return [];
  }
}

function showStatsModal() {
  const progresso = getCookie('progresso');
  let stats = progresso ? JSON.parse(progresso) : {};
  let userStats = stats[userName] && stats[userName][idioma_praticado] ? stats[userName][idioma_praticado] : {};

  // Descubra todas as categorias e quantas frases existem em cada uma
  // Supondo que você tem acesso ao objeto 'grouped' ou similar
  // Se não, salve o grouped globalmente ao montar as tabelas
  let grouped = window.groupedCategorias || {};
  if (!Object.keys(grouped).length && window.ultimaTabelaGrouped) {
    grouped = window.ultimaTabelaGrouped;
  }

  let totalAcertos = 0;
  let totalFrases = 0;
  let html = `<h3>Estatísticas (${idioma_praticado.toUpperCase()})</h3><table style="margin:auto;"><tr><th>Categoria</th><th>Acertos</th></tr>`;

  for (const categoria in grouped) {
    const total = grouped[categoria].length;
    const acertos = (userStats[categoria] || []).length;
    totalAcertos += acertos;
    totalFrases += total;
    html += `<tr>
      <td>${traduzirCategoria(categoria, currentLanguage)}</td>
      <td style="text-align:center;">${acertos}/${total}</td>
    </tr>`;
  }

  html += `<tr style="font-weight:bold;">
    <td>Total</td>
    <td style="text-align:center;">${totalAcertos}/${totalFrases}</td>
    <br><br>

  </tr>

</table>    <button id="botao_apaga_progresso" class="botao_terminei">
    Apagar Progresso
  </button>`;

  showCustomModal(html);

document.getElementById('botao_apaga_progresso').addEventListener('click', () => apagaCookie('progresso') )

  // Descubra os índices das colunas dos idiomas selecionados
  /*
  const idxIdiomaGeral = headers.findIndex(h => {
    // Use seu array languages para comparar código
    return languages.find(l => l.code === currentLanguage && l.name_ingles.trim().toLowerCase() === h.trim().toLowerCase());
  });
  
  const idxIdiomaPraticado = headers.findIndex(h => {
    return languages.find(l => l.code === idioma_praticado && l.name_ingles.trim().toLowerCase() === h.trim().toLowerCase());

  });*/
}

export { currentLanguage, idioma_praticado }