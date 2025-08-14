import { audioMap } from './audio_map.js';
import { createLanguageSelector } from './auxiliar.js';
import { cria_botoes_abas } from './auxiliar.js'
import { traducoesCategoria } from './traducoes_categorias.js'
import { traducoes_hud } from './traducoes_hud.js'

let currentLanguage = 'en'; // valor padrão
const caminho = location.hostname === "127.0.0.1" ? "../" : "./";

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const result = lines.map(line => {
    const values = [];
    let insideQuotes = false;
    let value = '';
    for (let char of line) {
      if (char === '"') insideQuotes = !insideQuotes;
      else if (char === ',' && !insideQuotes) {
        values.push(value);
        value = '';
      } else {
        value += char;
      }
    }
    values.push(value);
    return values;
  });
  return result;
}

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

  createLanguageSelector(language_selector, currentLanguage); // adiciona label + select dentro desse div
  container.appendChild(language_selector);  // insere no container

  // Cria título principal
  const h1 = document.createElement('h1');

  // h1.textContent = '100 Useful Travel Phrases';
  h1.textContent = traduzir_hud('100_useful_travel_phrases', currentLanguage)
  container.appendChild(h1);
  
  // Criar botão "Teoria" e "Prática"
  const container_idioma = document.createElement('div');
  container_idioma.className = 'container_idioma'

  const botao_teoria = cria_botoes_abas("Teoria", "ativo")
  const botao_pratica = cria_botoes_abas("Prática", "inativo")

  container_idioma.appendChild(botao_teoria);
  container_idioma.appendChild(botao_pratica);
  container.appendChild(container_idioma);


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
    buildTables(data);

    let select = document.getElementById('language-select')
    select.addEventListener('change', (e) => {
      currentLanguage = e.target.value;
      updateContentForLanguage(currentLanguage);
    });


  })
  .catch(err => console.error('Erro ao carregar CSV:', err));
}

carrega_csv()

function updateContentForLanguage(language) {
  // Exemplo: recarregar as frases com base no idioma
  // const data = getDataForLanguage(language); // função que retorna os dados certos
  // buildTables(data); // reconstrói a interface com os dados atualizados

  // O que muda...
  // Título.
  // Select your language.
  // Botoes prática e teoria
  // subtitulo. "greetings, etc."
  carrega_csv()  // alert(currentLanguage)

}

function traduzirCategoria(categoria, idioma) {
  return traducoesCategoria[categoria]?.[idioma] || categoria
}

function traduzir_hud (item, idioma) {
  return traducoes_hud[item]?.[idioma] || item
}
