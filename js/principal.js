import { audioMap } from './audio_map.js';

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

  // Exemplo simplificado do mapa de áudio para Greetings (complete conforme seus arquivos)


  const h1 = document.createElement('h1');
  h1.textContent = '100 Useful Travel Phrases';
  container.appendChild(h1);

  for (const categoria in grouped) {
    const frases = grouped[categoria];

    const h2 = document.createElement('h2');
    h2.textContent = categoria;
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
          const audioPath = `../${idioma}/${arquivoAudio}`;
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
}

// Idiomas disponíveis
const idiomas = ["English", "Portuguese", "Spanish", "French", "German", "Italian"];
const idiomaNomes = {
  "English": "English",
  "Portuguese": "Português",
  "Spanish": "Español",
  "French": "Français",
  "German": "Deutsch",
  "Italian": "Italiano"
};

// Criar div do seletor
const langSelector = document.createElement('div');
langSelector.id = 'langSelector';
langSelector.style.marginBottom = '12px';

// Criar botões dinamicamente
idiomas.forEach(idioma => {
  const btn = document.createElement('button');
  btn.dataset.lang = idioma;
  btn.textContent = idiomaNomes[idioma];
  btn.style.marginRight = '6px';
  btn.style.cursor = 'pointer';
  btn.style.padding = '6px 10px';
  btn.style.borderRadius = '5px';
  btn.style.border = '1px solid #ccc';
  btn.style.background = '#f5f5f5';
  btn.style.transition = 'background 0.2s';
  btn.addEventListener('mouseenter', () => btn.style.background = '#e2e2e2');
  btn.addEventListener('mouseleave', () => btn.style.background = '#f5f5f5');

  // Clique do botão troca idioma
  btn.addEventListener('click', () => updateCategoryTitles(idioma));

  langSelector.appendChild(btn);
});

// Inserir acima do container principal
const container = document.getElementById('output');
container.parentNode.insertBefore(langSelector, container);

fetch('../dados.csv') // ou 'subpasta/data.csv' se estiver em uma subpasta
  .then(response => {
    if (!response.ok) throw new Error('CSV não encontrado');
    return response.text();
  })
  .then(csvText => {
    const data = parseCSV(csvText);
    buildTables(data);
  })
  .catch(err => console.error('Erro ao carregar CSV:', err));