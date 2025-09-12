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
  encontra_lang_ingles,
  altera_cores_idioma
} from './auxiliar.js'

// Definimos variáveis e contantes.
const caminho = location.hostname === "127.0.0.1" ? "../" : "./"

let modo = 'teoria'
let mostra_placeholder_palavras = 'nao'

getCookie('darkMode') === 'sim' ? document.body.classList.add('dark-mode') : document.body.classList.remove('dark-mode')

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

    language_selector_pratica.addEventListener("change", (e) => {
      idioma_praticado = e.target.value
      setCookie('idioma_praticado', idioma_praticado, 365)

      // Aqui, colocar algo que altera o esquema de cores do site.
      altera_cores_idioma(idioma_praticado)
      carrega_csv()
    })
    return createLanguageSelector(language_selector_pratica, currentLanguage, 'pratica', idioma_praticado) // adiciona label + select dentro desse div
  }
}

function cria_modalidades () {
  const container_botoes_modalidades = document.createElement('div')
  container_botoes_modalidades.className = 'container_bots_modalidades'
  container_botoes_modalidades.style.marginTop = '40px'
  container_botoes_modalidades.style.marginBottom = '40px'


  const botao_palavras = cria_botoes_abas_2(traduzir_hud('botao_palavras', currentLanguage), "ativo")
  container_botoes_modalidades.appendChild(botao_palavras)

  const botao_conjugacao = cria_botoes_abas_2(traduzir_hud('botao_conjugacao', currentLanguage), "inativo")
  botao_conjugacao.id = "botao_conjugacao";
  botao_conjugacao.addEventListener("click", () => {
    // Redireciona para uma página de conjugação ou chama uma função/modal
    window.location.href = "conjugacao.html";
  });
  container_botoes_modalidades.appendChild(botao_conjugacao)

  return container_botoes_modalidades
}

function cria_botao_teoria () {
  const atividade_botao_teoria = (modo === 'teoria') ? 'ativo' : 'inativo'
  const botao_teoria = cria_botoes_abas(traduzir_hud('botao_teoria', currentLanguage), atividade_botao_teoria)
  botao_teoria.addEventListener("click", () => {
    modo = 'teoria'

    document.getElementById("botao_placeholder_palavra").style.display = 'none'
    carrega_csv()
  })

  return botao_teoria
}

function cria_botao_pratica () {
  const atividade_botao_pratica = (modo === 'pratica') ? 'ativo' : 'inativo'
  const botao_pratica = cria_botoes_abas(traduzir_hud('botao_pratica', currentLanguage), atividade_botao_pratica)
  botao_pratica.addEventListener("click", () => {
    modo = 'pratica'
    document.getElementById("language_selector_pratica").style.display = 'flex'
    document.getElementById("botao_placeholder_palavra").style.display = 'flex'
    carrega_csv()
  })

  return botao_pratica
}

function cria_botao_multipla_escolha () {
  const atividade_botao_multipla_escolha = (modo === 'multipla_escolha') ? 'ativo' : 'inativo'
  const botao_multipla_escolha = cria_botoes_abas(traduzir_hud('botao_multipla_escolha', currentLanguage), atividade_botao_multipla_escolha)
  
  botao_multipla_escolha.addEventListener("click", () => {
    modo = 'multipla_escolha'
    // Aqui, pode se chamar o buildTable, mas
    // Precisamos ter apenas os enunciados das categorias (classes de palavras).
    // Ao clicar na classe, abre-se uma nova janela, como jogo, talvez.
    
    carrega_csv()
  })

  return botao_multipla_escolha
}

function cria_botao_placeholder_palavra () {

  let botao_placeholder_palavra = document.createElement('button');
  botao_placeholder_palavra.id = 'botao_placeholder_palavra'
  botao_placeholder_palavra.style.display = 'flex'
  botao_placeholder_palavra.className = (mostra_placeholder_palavras === 'sim') ? "bot_mostra_palavras active" : 'bot_mostra_palavras'
  botao_placeholder_palavra.innerHTML = traduzir_hud('placeholder_palavra', currentLanguage)
  
  botao_placeholder_palavra.addEventListener('click', () => {

    if (mostra_placeholder_palavras === 'sim') {
      mostra_placeholder_palavras = 'nao'
      botao_placeholder_palavra.classList.remove('botao_ativado')
    } else {
      mostra_placeholder_palavras = 'sim'
      botao_placeholder_palavra.classList.remove('botao_ativado')
    }
    carrega_csv()
    // window.location.reload()
  })

  return botao_placeholder_palavra
}

function cria_container_placeholder_palavra () {
  // Vai embaixo do container_idioma
  const container_botao_placeholder = document.createElement('div') 
  container_botao_placeholder.id = 'container_botao_placeholder'

  container_botao_placeholder.style.display = 'none'
  if (modo === 'pratica') container_botao_placeholder.style.display = 'flex'
  return container_botao_placeholder
}

function ativa_e_desativa_botoes_tab_btn () {

  document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // aqui você pode trocar o conteúdo da interface baseado no btn.dataset.tab
  });

    // Acho que é aqui.
    if (modo === 'pratica') {
      if (btn.textContent === traduzir_hud('botao_pratica', currentLanguage)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
      
      // document.getElementById("language_selector_pratica").style.display = 'flex'
      document.getElementById("language_selector_pratica").value = idioma_praticado
    }
  });
}

function cria_h2_categoria (categoria, wrapper) {
  const categoriaTraduzida = traduzirCategoria(categoria, currentLanguage)

  const h2 = document.createElement('h2');
  h2.textContent = categoriaTraduzida;
  h2.style.cursor = 'pointer';
  h2.style.userSelect = 'none';

    // Toggle de exibição
    h2.addEventListener('click', () => {
      wrapper.style.display = wrapper.style.display === 'none' ? 'block' : 'none';
      h2.classList.toggle('open');
    });
  return h2
}

function cria_div_botao_joga (categoria) {
  const div_botao_joga = document.createElement("div")
  div_botao_joga.className = "container_botao_joga"

  const botao_joga = document.createElement("button")
  botao_joga.className = "botao_terminei"
  botao_joga.innerHTML = traduzir_hud("botao_joga", currentLanguage)

  botao_joga.addEventListener("click", () => {
    window.location.href = `multipla_escolha/index.html?classe=${categoria}&currentLanguage=${currentLanguage}&idioma_praticado=${idioma_praticado}`
  })

  div_botao_joga.appendChild(botao_joga)
  return div_botao_joga
}

function cria_input_pratica (categoria, fraseIndex, frase, headers) {
  const input = document.createElement('input');
  input.type = 'text';
  input.id = `input_${categoria}_${fraseIndex}`;
              input.name = `input_${categoria}_${fraseIndex}`;
              if (mostra_placeholder_palavras === 'sim') input.placeholder = `${frase[1]}`

              const acertadas = getProgress(userName, idioma_praticado, categoria);
              if (acertadas.includes(fraseIndex)) {
                input.value = frase[1];

                input.readOnly = true;
                input.classList.add('input-audio');
                input.title = 'Clique para ouvir o áudio';
                input.onclick = () => {
                  const idioma = headers[1];
                  const arquivoAudio = audioMap[categoria] && audioMap[categoria][fraseIndex];
                  if (!arquivoAudio) {
                    showCustomModal('Áudio não encontrado para esta palavra.');
                    return;
                  }
                  const audioPath = `${caminho}/${idioma}/${arquivoAudio}`;
                  const audio = new Audio(audioPath);
                  audio.play().catch(err => console.error('Erro ao tocar áudio:', err));
                };
              }

              
  return input
}

function cria_botao_terminei (categoria, headers, frases) {
  const botao_terminei = document.createElement('button')
  botao_terminei.textContent = "Terminei!"
  botao_terminei.className = "botao_terminei"

  botao_terminei.addEventListener('click', () => {
    let acertos = 0;
    let total = frases.length;
    console.log(frases)
    frases.forEach((frase, fraseIndex) => {
      const input = document.getElementById(`input_${categoria}_${fraseIndex}`);
      if (!input) return;
      
      // Remove botão de som antigo, se existir
      const oldBtn = document.getElementById(`audio-btn-${categoria}-${fraseIndex}`);
      if (oldBtn) oldBtn.remove();

      // Remove event listener antigo, se houver
      input.onclick = null;
      input.classList.remove('input-audio');
          
      if (input.value.trim().toLowerCase() === frase[1].trim().toLowerCase()) {
        input.readOnly = true;
        acertos++;

        // Adiciona classe visual e evento de áudio ao input
        input.classList.add('input-audio');
        input.title = 'Clique para ouvir o áudio';

        input.onclick = () => {
          const idioma = headers[1]; // coluna do input praticado
          const arquivoAudio = audioMap[categoria] && audioMap[categoria][fraseIndex];
          if (!arquivoAudio) {
            showCustomModal('Áudio não encontrado para esta palavra.');
            return;
          }
          const audioPath = `${caminho}/${idioma}/${arquivoAudio}`;
          const audio = new Audio(audioPath);
          audio.play().catch(err => console.error('Erro ao tocar áudio:', err));
        };

        // Salva progresso aqui:
        saveProgress(userName, idioma_praticado, categoria, fraseIndex);
      } else {
        input.value = '';
      }
    });

    // Mostra popup estilizado
    let msg;
    if (acertos === total) {
      msg = `<b>${acertos}/${total}</b> 🎉<br>Parabéns, você acertou tudo!`;
    } else {
      msg = `<b>${acertos}/${total}</b> acertos.<br>Tente novamente!`;
    }
    showCustomModal(msg, () => {
      // Após fechar o modal, foca no primeiro input vazio e habilitado
      for (let fraseIndex = 0; fraseIndex < frases.length; fraseIndex++) {
        const input = document.getElementById(`input_${categoria}_${fraseIndex}`);
        if (input && !input.readOnly && input.value === '') {
          input.focus();
          break;
        }
      }
    });
  });

  return botao_terminei
}

function cria_audio (categoria, fraseIndex, idioma) {
        const arquivoAudio = audioMap[categoria] && audioMap[categoria][fraseIndex];
                if (!arquivoAudio) {
                  alert('Áudio não encontrado para esta frase.');
                  return;
                }
                const audioPath = `${idioma}/${arquivoAudio}`;
                const audio = new Audio(audioPath);
                console.log(audioPath)
  return audio
}

function cria_toggle () {
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
  return toggle
}

function cria_popup_variantes () {
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

  return popup
}


function buildTables (data) {


  const container = document.getElementById('output');
  container.innerHTML = ''

  let language_selector = cria_escolha_idiomas('geral')
  container.appendChild(language_selector)  // insere no container
 
  let language_selector_pratica = cria_escolha_idiomas('pratica')
  container.appendChild(language_selector_pratica) // insere no container

  const modalidades = cria_modalidades()
  container.appendChild(modalidades)



  // Criar botão "Teoria" e "Prática" e "Múltipla Escolha"
  const container_idioma = document.createElement('div');
  container_idioma.className = 'container_idioma'

  // Teoria.
  const botao_teoria = cria_botao_teoria()
  container_idioma.appendChild(botao_teoria)

  // Múltipla Escolha.
  const botao_multipla_escolha = cria_botao_multipla_escolha()
  container_idioma.appendChild(botao_multipla_escolha)

  // Prática.
  const botao_pratica = cria_botao_pratica()
  container_idioma.appendChild(botao_pratica)

  // Botão e container do placeholder palavra, do Prática.
  const botao_placeholder_palavra = cria_botao_placeholder_palavra()
  const container_placeholder_palavra = cria_container_placeholder_palavra()
  container_placeholder_palavra.appendChild(botao_placeholder_palavra)

  container.appendChild(container_idioma)
  container.appendChild(container_placeholder_palavra)

  ativa_e_desativa_botoes_tab_btn()


  const headers = data[0].slice(1)

  // Aqui, nessa const grouped, agrupamos todas as linhas do .csv por categorias (classes).
  const grouped = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const categoria = row[0];
    if (!grouped[categoria]) grouped[categoria] = [];
    grouped[categoria].push(row.slice(1));
  }

  
  for (const categoria in grouped) {
    const frases = grouped[categoria]

    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    wrapper.style.display = 'none'; // inicia escondido

    const h2 = cria_h2_categoria(categoria, wrapper)
    container.appendChild(h2)


    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');

    const languages = [
      { code: 'en', name: 'English', name_ingles: 'English' },
      { code: 'pt', name: 'Português', name_ingles: 'Portuguese' },
      { code: 'es', name: 'Español', name_ingles: 'Spanish' },
      { code: 'fr', name: 'Français', name_ingles: 'French' },
      { code: 'it', name: 'Italiano', name_ingles: 'Italian' },
      { code: 'de', name: 'Deutsch', name_ingles: 'German' }  
    ]


    headers.forEach((h, idx) => {
      if (idx != 0 & idx != 1 || modo === "pratica") {


      const th = document.createElement('th');
      let codigo_idioma_h
      for (let i = 0; i < languages.length; i++) {
        // Aqui, precisa desses trim e toLowerCase para evitar problemas com espaços ou maiúsculas/minúsculas
        if (languages[i].name_ingles.trim().toLowerCase() === h.trim().toLowerCase()) {
          codigo_idioma_h = languages[i].code;
          break;
        }
      }

      th.textContent = traduzir_idioma_ingles(codigo_idioma_h, currentLanguage);
      // th.textContent = h;
      if (modo === 'pratica' && idx === 0) {
        th.style.textAlign = 'right'; // só a primeira coluna
      }
      trHead.appendChild(th);
      }
    });

    if (modo != "multipla_escolha") {
      thead.appendChild(trHead)
      table.appendChild(thead)
    }

    if (modo === "multipla_escolha") {

      const div_botao_joga = cria_div_botao_joga(categoria)
      table.appendChild(div_botao_joga)
    }

    const tbody = document.createElement('tbody');
    const palavrasAdicionadas = new Set();

    frases.forEach((frase, fraseIndex) => {
      
      const idioma_em_ingles = encontra_lang_ingles(currentLanguage).trim()
      const textoReferencia = frase[headers.indexOf(idioma_em_ingles)]

      if (palavrasAdicionadas.has(textoReferencia)) {
        return; // pula esta frase
      }
      palavrasAdicionadas.add(textoReferencia);


      const tr = document.createElement('tr')
      
      const posicao_atual = frases[fraseIndex][0]
      let frases_variantes = []

      let i = fraseIndex + 1;
      const codAtual = frases[fraseIndex][1]; // valor da primeira coluna da frase atual

      if (posicao_atual === "1") {
         while (i < frases.length && frases[i] && frases[i][1] === codAtual) {

          const fraseRelacionada = frases[i]

          for (let j = 0; j < fraseRelacionada.length; j++) {
            if (j != 0 & j != 1) {
              frases_variantes.push({idx: j, texto: fraseRelacionada[j]})
            }
          }

          i++;
        }
      }


      frase.forEach((texto, idx) => {
        // alert(frase)
        const td = document.createElement('td');
        td.style.position = "relative";

        if (modo === "teoria") {
          
          if (idx != 0 & idx != 1 & posicao_atual === "1") {

            td.textContent = texto;
            td.style.cursor = 'pointer'
              
            td.addEventListener('click', () => {
              const idioma = headers[idx];
              const audio = cria_audio(categoria, fraseIndex, idioma)
            
              audio.play().catch(err => console.error('Erro ao tocar áudio:', err));
            })


            if (frases_variantes.length > 0) {

              const toggle = cria_toggle()

              const popup = cria_popup_variantes()

              
              for (let j = 0; j < frases_variantes.length; j++) {
                if (frases_variantes[j].idx === idx) {
                  const item = document.createElement("div");
                  const textoVar = frases_variantes[j].texto || '';
                  item.textContent = `${textoVar}`;
                  item.style.padding = "4px 0";
                  popup.appendChild(item);
                }
              }

              toggle.addEventListener("click", (e) => {
                e.stopPropagation();
                // esconde outros popups e alterna este
                document.querySelectorAll('.popup-variantes').forEach(p => { if (p !== popup) p.style.display = 'none'; });
                popup.style.display = popup.style.display === "none" ? "block" : "none";
              });

              td.appendChild(toggle);
              td.appendChild(popup);
            }
            
            tr.appendChild(td)
          }
        }

        if (modo === "pratica") {
          if (idx === 0) {

            td.style.textAlign = 'right'; // texto alinhado à direita
            td.textContent = texto;
            td.style.cursor = 'pointer'
              
            td.addEventListener('click', () => {
              const idioma = headers[idx];
              const audio = cria_audio(categoria, fraseIndex, idioma)
            
              audio.play().catch(err => console.error('Erro ao tocar áudio:', err));
            })
          }

          else if (idx === 1) {
            const input = cria_input_pratica(categoria, fraseIndex, frase, headers)
            td.appendChild(input)
          } else {
                        
          }
          tr.appendChild(td)
        }

        if (modo === "multipla_escolha") {

        }

      })

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrapper.appendChild(table);
    container.appendChild(wrapper);

    // Botão Terminei!
    if (modo === 'pratica') {

      const container_bot_terminei = document.createElement('div');
      container_bot_terminei.className = 'container_bot_terminei';

      const botao_terminei = cria_botao_terminei(categoria, headers, frases)
      container_bot_terminei.appendChild(botao_terminei)

      wrapper.appendChild(container_bot_terminei)

      // Permite Enter para simular clique no Terminei
      for (let fraseIndex = 0; fraseIndex < frases.length; fraseIndex++) {
        const input = document.getElementById(`input_${categoria}_${fraseIndex}`);
        if (input) {
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              botao_terminei.click();
            }
          });
        }
      }
    }
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // aqui você pode trocar o conteúdo da interface baseado no btn.dataset.tab
    });
  });
  
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

    const isDarkMode = document.body.classList.contains('dark-mode');
    const div_noturno = document.createElement('div')
    div_noturno.innerHTML = `
    <i class="fa-solid  ${isDarkMode ? 'fa-sun' : 'fa-moon'}"
    style="
      margin-left: 6px;
      font-size: 25px;
      cursor: pointer;
    "></i>`

    div_noturno.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMod_2 = document.body.classList.contains('dark-mode');
      setCookie('darkMode', isDarkMod_2 ? 'sim' : 'nao', 365);
      div_noturno.innerHTML = `<i class="fa-solid ${isDarkMod_2 ? 'fa-sun' : 'fa-moon'}"
      style="
        margin-left: 6px;
        font-size: 25px;
        cursor: pointer;
        "></i>`
    })
    userInfoDiv.appendChild(div_noturno)

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