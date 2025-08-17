import { audioMap } from './audio_map.js';

import { traducoesCategoria } from './traducoes_categorias.js'
import { createLanguageSelector, cria_botoes_abas, traduzir_hud, traduzir_idioma_ingles, separar_idiomas_pratica } from './auxiliar.js'
import { parseCSV } from './csv_utils.js';

let currentLanguage = 'en'; // valor padrão
const caminho = location.hostname === "127.0.0.1" ? "../" : "./";
var modo = 'teoria'
let idioma_praticado = 'pt'

function buildTables(data) {
  const headers = data[0].slice(1);
  const grouped = {};

  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const categoria = row[0];
    if (!grouped[categoria]) grouped[categoria] = [];
    grouped[categoria].push(row.slice(1));
  }

  const container = document.getElementById('output');
  container.innerHTML = '';

  let language_selector = document.createElement('div');
  language_selector.className = "language-selector";
  language_selector.id = 'language-select'

  createLanguageSelector(language_selector, currentLanguage, 'padrao') // adiciona label
  container.appendChild(language_selector);  // insere no container


  // Cria título principal
  const h1 = document.createElement('h1');  
  h1.className = 'h1_titulo'
  h1.textContent = traduzir_hud('100_useful_travel_phrases', currentLanguage)
  container.appendChild(h1);
  
  // Criar botão "Teoria" e "Prática"
  const container_idioma = document.createElement('div');
  container_idioma.className = 'container_idioma'

  const botao_teoria = cria_botoes_abas(traduzir_hud('botao_teoria', currentLanguage), "ativo")
  botao_teoria.addEventListener("click", () => {
    modo = 'teoria'
    document.getElementById("language_selector_pratica").style.display = 'none'
    carrega_csv()
  })
  container_idioma.appendChild(botao_teoria)

  const botao_pratica = cria_botoes_abas(traduzir_hud('botao_pratica', currentLanguage), "inativo")  
  botao_pratica.addEventListener("click", () => {
    modo = 'pratica'
    document.getElementById("language_selector_pratica").style.display = 'flex'
    carrega_csv()
  })
  container_idioma.appendChild(botao_pratica)


  let language_selector_pratica = document.createElement('div');
  language_selector_pratica.className = "language-selector";
  language_selector_pratica.style.display = "none"
  language_selector_pratica.id = 'language_selector_pratica'

  createLanguageSelector(language_selector_pratica, currentLanguage, 'pratica', idioma_praticado) // adiciona label + select dentro desse div
  container_idioma.appendChild(language_selector_pratica); // insere no container

  container.appendChild(container_idioma);

    language_selector_pratica.addEventListener("change", (e) => {
    idioma_praticado = e.target.value

    carrega_csv()
  }) // Adiciona função ao clicar

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
    
    document.getElementById("language_selector_pratica").style.display = 'flex'
    document.getElementById("language_selector_pratica").value = idioma_praticado
  }
});
  for (const categoria in grouped) {
    const frases = grouped[categoria];

    const categoriaTraduzida = traduzirCategoria(categoria, currentLanguage)

    const h2 = document.createElement('h2');
    h2.textContent = categoriaTraduzida;
    h2.style.cursor = 'pointer';
    h2.style.userSelect = 'none';
    container.appendChild(h2);

    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    wrapper.style.display = 'none'; // inicia escondido

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
    
  ];


    headers.forEach((h, idx) => {
      const th = document.createElement('th');
      let codigo_idioma_h
      for (let i = 0; i < languages.length; i++) {
        // Aqui, precisa desses trim e toLowerCase para evitar problemas com espaços ou maiúsculas/minúsculas
        if (languages[i].name_ingles.trim().toLowerCase() === h.trim().toLowerCase()) {
          codigo_idioma_h = languages[i].code;
          break;
        }
      }
            console.log(`${codigo_idioma_h} ESSE É O H`);

      th.textContent = traduzir_idioma_ingles(codigo_idioma_h, currentLanguage);
      // th.textContent = h;
      if (modo === 'pratica' && idx === 0) {
        th.style.textAlign = 'right'; // só a primeira coluna
      }
      trHead.appendChild(th);
    });

    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    frases.forEach((frase, fraseIndex) => {
      const tr = document.createElement('tr');
      
      frase.forEach((texto, idx) => {
        const td = document.createElement('td');

        if (modo === 'pratica' && idx === 0) {
          td.style.textAlign = 'right'; // texto alinhado à direita
        }

        if (modo === 'pratica' && idx === 1) {
          const input = document.createElement('input');
          input.type = 'text';
          input.id = `input_${categoria}_${fraseIndex}`;
          input.name = `input_${categoria}_${fraseIndex}`;
          td.appendChild(input);
        } else {
          td.textContent = texto;
          td.style.cursor = 'pointer';
        
          td.addEventListener('click', () => {
            const idioma = headers[idx];
            const arquivoAudio = audioMap[categoria] && audioMap[categoria][fraseIndex];
            if (!arquivoAudio) {
              alert('Áudio não encontrado para esta frase.');
              return;
            }
            const audioPath = `${caminho}/${idioma}/${arquivoAudio}`;
            const audio = new Audio(audioPath);
            audio.play().catch(err => console.error('Erro ao tocar áudio:', err));
          });
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrapper.appendChild(table);
    container.appendChild(wrapper);

    // Botão Terminei!
    if (modo === 'pratica') {

      const container_bot_terminei = document.createElement('div');
      container_bot_terminei.className = 'container_bot_terminei';

      const botao_terminei = document.createElement('button')
      botao_terminei.textContent = "Terminei!"
      botao_terminei.className = "botao_terminei"
      container_bot_terminei.appendChild(botao_terminei);

      wrapper.appendChild(container_bot_terminei);

      botao_terminei.addEventListener('click', () => {
        let acertos = 0;
        let total = frases.length;
        frases.forEach((frase, fraseIndex) => {
          const input = document.getElementById(`input_${categoria}_${fraseIndex}`);
          if (!input) return;
          if (input.value.trim().toLowerCase() === frase[1].trim().toLowerCase()) {
            input.disabled = true;
            acertos++;
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
            if (input && !input.disabled && input.value === '') {
              input.focus();
              break;
            }
          }
        });
      });

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

    // Toggle de exibição
    h2.addEventListener('click', () => {
      wrapper.style.display = wrapper.style.display === 'none' ? 'block' : 'none';
      h2.classList.toggle('open');
    });

  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // aqui você pode trocar o conteúdo da interface baseado no btn.dataset.tab
  });
});
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
      carrega_csv()
    });


  })
  .catch(err => console.error('Erro ao carregar CSV:', err));
}

carrega_csv()

function traduzirCategoria(categoria, idioma) {
  return traducoesCategoria[categoria]?.[idioma] || categoria
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