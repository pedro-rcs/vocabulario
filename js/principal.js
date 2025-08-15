import { audioMap } from './audio_map.js';

import { traducoesCategoria } from './traducoes_categorias.js'
import { createLanguageSelector, cria_botoes_abas, traduzir_hud, separar_idiomas_pratica } from './auxiliar.js'
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

    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      trHead.appendChild(th);
    });

    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    frases.forEach((frase, fraseIndex) => {
      const tr = document.createElement('tr');
      frase.forEach((texto, idx) => {
        const td = document.createElement('td');
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

        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    wrapper.appendChild(table);
    container.appendChild(wrapper);

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