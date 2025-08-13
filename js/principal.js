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

  let language_selector = document.createElement('div'); // <--- precisa do document
  language_selector.className = "language-selector";

  createLanguageSelector(language_selector); // adiciona label + select dentro desse div
  container.appendChild(language_selector);  // insere no container


  const h1 = document.createElement('h1');
  h1.textContent = '100 Useful Travel Phrases';
  container.appendChild(h1);

  const container_idioma = document.createElement('div');
  container_idioma.className = 'container_idioma';

  // Criar botão "Teoria" e "Prática"
  const btn_teoria = document.createElement('button');
  btn_teoria.textContent = 'Teoria';
  btn_teoria.className = 'tab-btn active';

  const btn_pratica = document.createElement('button');
  btn_pratica.textContent = 'Prática';
  btn_pratica.className = 'tab-btn';

  container_idioma.appendChild(btn_teoria);
  container_idioma.appendChild(btn_pratica);
  container.appendChild(container_idioma);


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

  document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // aqui você pode trocar o conteúdo da interface baseado no btn.dataset.tab
  });
});
}




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


function createLanguageSelector(container) {
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

  container.appendChild(label);
  container.appendChild(select);
}