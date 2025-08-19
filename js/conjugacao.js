// Utilitário para cookie
function getCookie(name) {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? decodeURIComponent(v[2]) : null;
}

// Exibe nome do usuário
let userName = getCookie('userName');
if (userName) {
  document.getElementById('user-info').textContent = `Olá, ${userName}!`;
}

// Verbos para treinar
const verbos = {
  pt: ['falar', 'comer', 'partir'],
  en: ['to speak', 'to eat', 'to leave'],
  es: ['hablar', 'comer', 'partir'],
  fr: ['parler', 'manger', 'partir'],
  it: ['parlare', 'mangiare', 'partire'],
  de: ['sprechen', 'essen', 'verlassen']
};

// Renderiza lista de verbos como links
function renderTreino() {
  const idioma = document.getElementById('idioma_praticado').value;
  const area = document.getElementById('treino-area');
  area.innerHTML = '<b>Verbos para treinar:</b><ul id="lista-verbos"></ul><div id="conjuga-div" style="display:none;margin-top:1em;"></div>';
  const ul = document.getElementById('lista-verbos');
  verbos[idioma].forEach(verb => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = "#";
    a.textContent = verb;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      mostrarConjugacao(verb, idioma);
    });
    li.appendChild(a);
    ul.appendChild(li);
  });
}

// Mostra o div de conjugação para o verbo escolhido
function mostrarConjugacao(verbo, idioma) {
  const conjugaDiv = document.getElementById('conjuga-div');
  conjugaDiv.style.display = 'block';
  conjugaDiv.innerHTML = `
    <h3>Conjugue o verbo <span style="color:#2a7">${verbo}</span> (${idioma.toUpperCase()})</h3>
    <form id="form-conjuga">
      <label>Eu / I / Yo / Je / Io / Ich: <input type="text" name="p1"></label><br>
      <label>Tu / You / Tú / Tu / Tu / Du: <input type="text" name="p2"></label><br>
      <label>Ele/Ela / He/She / Él/Ella / Il/Elle / Lui/Lei / Er/Sie: <input type="text" name="p3"></label><br>
      <label>Nós / We / Nosotros / Nous / Noi / Wir: <input type="text" name="p4"></label><br>
      <label>Vós / You(pl) / Vosotros / Vous / Voi / Ihr: <input type="text" name="p5"></label><br>
      <label>Eles/Elas / They / Ellos/Ellas / Ils/Elles / Loro / Sie: <input type="text" name="p6"></label><br>
      <button type="submit" style="margin-top:1em;">Verificar</button>
      <button type="button" id="fechar-conjuga" style="margin-left:1em;">Fechar</button>
    </form>
    <div id="resultado-conjuga" style="margin-top:1em;"></div>
  `;
  document.getElementById('fechar-conjuga').onclick = () => {
    conjugaDiv.style.display = 'none';
  };
  document.getElementById('form-conjuga').onsubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar validação real das respostas
    document.getElementById('resultado-conjuga').innerHTML = '<span style="color:green;">(Exemplo) Respostas enviadas!</span>';
  };
}

// Eventos de troca de idioma
document.getElementById('idioma_praticado').addEventListener('change', renderTreino);
renderTreino();