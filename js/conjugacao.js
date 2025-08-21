import { createLanguageSelector, cria_botoes_abas, traduzir_hud, traduzir_idioma_ingles, separar_idiomas_pratica } from './auxiliar.js'
// import {  currentLanguage, idioma_praticado } from './principal.js'

var modo = 'teoria'
// Utilitário para cookie
function getCookie(name) {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? decodeURIComponent(v[2]) : null;
}

// Exibe nome do usuário
let userName = getCookie('userName');
let currentLanguage = getCookie('currentLanguage');
let idioma_praticado = getCookie('idioma_praticado');

if (userName) {
  document.getElementById('user-info').textContent = `${traduzir_hud('ola', currentLanguage)}, ${userName}!`;
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






// Cria o container principal
const container = document.createElement('div');
container.className = 'container_idioma';
container.style.marginBottom = '2em';

// Função para criar um seletor de idioma
function criarSeletorIdioma(id, labelText, selectId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'language-selector';
  wrapper.id = id;

  const label = document.createElement('label');
  label.setAttribute('for', selectId);

  if (labelText === 'Praticar:') labelText = traduzir_hud('label_idioma_praticado', currentLanguage)
  label.textContent = labelText;

  const select = document.createElement('select');
  select.id = selectId;

  const idiomas = [
    { value: 'pt', text: traduzir_idioma_ingles('pt', currentLanguage) },
    { value: 'en', text: traduzir_idioma_ingles('en', currentLanguage) },
    { value: 'es', text: traduzir_idioma_ingles('es', currentLanguage) },
    { value: 'fr', text: traduzir_idioma_ingles('fr', currentLanguage) },
    { value: 'it', text: traduzir_idioma_ingles('it', currentLanguage) },
    { value: 'de', text: traduzir_idioma_ingles('de', currentLanguage) }
  ];

  idiomas.forEach(idioma => {
    const option = document.createElement('option');
    option.value = idioma.value;
    option.textContent = idioma.text;
    select.appendChild(option);
  });

  let valor
  if (selectId === 'idioma_geral') valor = currentLanguage
  if (selectId === 'idioma_praticado') valor = idioma_praticado
  select.value = valor
  
  wrapper.appendChild(label);
  wrapper.appendChild(select);
  return wrapper;
}

// Cria os dois seletores
const seletorGeral = criarSeletorIdioma('language-select', 'Idioma:', 'idioma_geral');
const seletorPratica = criarSeletorIdioma('language-select-pratica', 'Praticar:', 'idioma_praticado');

// Adiciona ao container
container.appendChild(seletorGeral);
seletorGeral.style.display = 'none'
container.appendChild(seletorPratica);

// Insere no body ou em outro lugar da página
const container_escolha_idiomas = document.getElementById('container_escolha_idiomas')
container_escolha_idiomas.appendChild(container);

// Eventos de troca de idioma
document.getElementById('h2_treino_conjugacao').innerHTML = traduzir_hud('treino_conjugacao', currentLanguage)




  const dados = {
    idioma: "frances",
    modos: [
        {
          modo: "indicatif",
          ordem_tempos: ["présent", "passé composé", "imparfait", "plus-que-parfait", "passé simple", "passé antérieur", "futur simple", "futur antérieur"],
          ordenacao: [
            {
              tempos: ["présent", "imparfait", "passé simple", "futur simple"],
              pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
              elementos: ["pessoas", "conjugado"]
            },
            {
              tempos: ["passé composé"],
              pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
              auxs: ["ai", "as", "a", "avons", "avez", "ont"],
              elementos: ["pessoas", "auxs", "conjugado"]
            },
            {
              tempos: ["plus-que-parfait"],
              pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
              auxs: ["avais", "avais", "avait", "avions", "aviez", "avaient"],
              elementos: ["pessoas", "auxs", "conjugado"]
            },
            {
              tempos: ["passé antérieur"],
              pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
              auxs: ["eus", "eus", "eut", "eûmes", "eûtes", "eurent"],
              elementos: ["pessoas", "auxs", "conjugado"]
            },
            {
              tempos: ["futur antérieur"],
              pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
              auxs: ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
              elementos: ["pessoas", "auxs", "conjugado"]
            }
          ]
        },
        {
          modo: "subjonctif",
          ordem_tempos: ["présent", "passé", "imparfait", "plus-que-parfait"],
          ordenacao: [
            {
              tempos: ["présent", "imparfait"],
              pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
              elementos: ["pessoas", "conjugado"]
            },
            {
              tempos: ["passé"],
              pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
              auxs: ["aie", "aies", "ait", "ayons", "ayez", "aient"],
              elementos: ["pessoas", "auxs", "conjugado"]
            },
            {
              tempos: ["plus-que-parfait"],
              pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
              auxs: ["eusse", "eusses", "eût", "eussions", "eussiez", "eussent"],
              elementos: ["pessoas", "auxs", "conjugado"]
            }
          ]
        },
        {
          modo: "conditionnel",
          ordem_tempos: ["présent", "passé 1ère forme"],
          ordenacao: [
            {
              tempos: ["présent"],
              pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
              elementos: ["pessoas", "conjugado"]
            },
            {
              tempos: ["passé 1ère forme"],
              pessoas: ["je", "tu", "il/elle", "nous", "vous", "ils/elles"],
              auxs: ["aurais", "aurais", "aurait", "aurions", "auriez", "auraient"],
              elementos: ["pessoas", "auxs", "conjugado"]
            }
          ]
        },
        {
          modo: "impératif",
          ordem_tempos: ["présent"],
          ordenacao: [
            {
              tempos: ["présent"],
              pessoas: ["tu", "nous", "vous"],
              elementos: ["pessoas", "conjugado"]
            }
          ]
        } 
    ]
  }


function cria_tabela_verbos () {

      const app = document.getElementById("app");
  app.innerHTML = ''
    dados.modos.forEach(modo => {
      const divModo = document.createElement("div");
      divModo.className = "modo";

      const tituloModo = document.createElement("h2");
      tituloModo.textContent = modo.modo;
      divModo.appendChild(tituloModo);

      const temposContainer = document.createElement("div");
      temposContainer.className = "tempos-container";

      modo.ordenacao.forEach(ord => {
        ord.tempos.forEach(tempo => {
          const divTempo = document.createElement("div");
          divTempo.className = "tempo";

          const tituloTempo = document.createElement("h3");
          tituloTempo.textContent = tempo;
          divTempo.appendChild(tituloTempo);

          ord.pessoas.forEach((pessoa, i) => {
            const linha = document.createElement("div");
            linha.className = "linha";

            const label = document.createElement("label");
            label.textContent = pessoa;
            linha.appendChild(label);

            if (ord.auxs) {
              const auxInput = document.createElement("input");
              // auxInput.placeholder = ord.auxs[i] || "aux";
              auxInput.placeholder = traduzir_hud('placeholder_auxiliar', currentLanguage)
              linha.appendChild(auxInput);
            }

            const verboInput = document.createElement("input");
            verboInput.placeholder = traduzir_hud('placeholder_verbo', currentLanguage)

            linha.appendChild(verboInput);

            divTempo.appendChild(linha);
          });

          temposContainer.appendChild(divTempo);
        });
      });

      divModo.appendChild(temposContainer);
      app.appendChild(divModo);
    });
}













let conjDados = {};



function carregarCSV(arquivo) {

  Papa.parse(`../verbos/${idioma_praticado}/${arquivo}.csv`, {
  download: true, // <- importante!
    header: true,
    complete: function(results) {
      results.data.forEach(row => {
        const key = `${row.modo}-${row.tempo}-${row.pessoa}`;
        conjDados[key] = {
          aux: row.aux || "",
          conjugado: row.conjugado || ""
        };
      });
      // alert("CSV carregado!");
      cria_tabela_verbos()
      document.getElementById("botao_teoria").click();

    }
  });
}

function verificar() {
  const resultadoTexto = document.getElementById("resultadoTexto");
  resultadoTexto.innerHTML = ""; // limpa antes

  document.querySelectorAll(".tempo").forEach(divTempo => {
    const modo = divTempo.closest(".modo").querySelector("h2").textContent;
    const tempo = divTempo.querySelector("h3").textContent;

    // título de seção
    const bloco = document.createElement("div");
    bloco.innerHTML = `<h3>${modo} – ${tempo}</h3>`;
    
    divTempo.querySelectorAll(".linha").forEach(linha => {
      const pessoa = linha.querySelector("label").textContent;
      const inputs = linha.querySelectorAll("input");
      const key = `${modo}-${tempo}-${pessoa}`;
      const esperado = conjDados[key] || {};

      let saida = `${pessoa}: `;
      let certo = true;

      if (inputs.length === 2) {
        const auxUser = inputs[0].value.trim();
        const verboUser = inputs[1].value.trim();

        if (auxUser === esperado.aux) {
          saida += `<span class="correto">${auxUser}</span> `;
        } else {
          saida += `<span class="errado">${auxUser || "∅"}</span> (<span class="correto">${esperado.aux}</span>) `;
          certo = false;
        }

        if (verboUser === esperado.conjugado) {
          saida += `<span class="correto">${verboUser}</span>`;
        } else {
          saida += `<span class="errado">${verboUser || "∅"}</span> (<span class="correto">${esperado.conjugado}</span>)`;
          certo = false;
        }
      }

      if (inputs.length === 1) {
        const verboUser = inputs[0].value.trim();
        if (verboUser === esperado.conjugado) {
          saida += `<span class="correto">${verboUser}</span>`;
        } else {
          saida += `<span class="errado">${verboUser || "∅"}</span> (<span class="correto">${esperado.conjugado}</span>)`;
          certo = false;
        }
      }

      const linhaRes = document.createElement("div");
      linhaRes.className = "resultado-linha";
      linhaRes.innerHTML = saida;
      bloco.appendChild(linhaRes);

      // se errado -> limpar input
      if (!certo) {
        inputs.forEach(inp => { if (inp.value.trim() !== esperado.aux && inp.value.trim() !== esperado.conjugado) inp.value = ""; });
      }
    });

    resultadoTexto.appendChild(bloco);
  });

  // mostra modal
  document.getElementById("resultadoModal").style.display = "flex";
}

// fechar modal
document.getElementById("fecharModal").addEventListener("click", () => {
  document.getElementById("resultadoModal").style.display = "none";

  // foca no primeiro input vazio
  const vazio = document.querySelector("input[value=''], input:not([value])");
  if (vazio) vazio.focus();
});



// --- Botão TEORIA (preencher com os corretos do CSV)
document.getElementById("botao_teoria").addEventListener("click", () => {

  document.getElementById('botao_verificar').style.display = 'none'

  document.querySelectorAll(".tempo").forEach(divTempo => {
    const modo = divTempo.closest(".modo").querySelector("h2").textContent;
    const tempo = divTempo.querySelector("h3").textContent;

    divTempo.querySelectorAll(".linha").forEach(linha => {
      const pessoa = linha.querySelector("label").textContent;
      const inputs = linha.querySelectorAll("input");
      const key = `${modo}-${tempo}-${pessoa}`;
      const esperado = conjDados[key] || {};

      inputs.forEach(input => {
        input.disabled = true;
      });

      if (inputs.length === 2) {
        inputs[0].value = esperado.aux || "";
        inputs[1].value = esperado.conjugado || "";
      } else if (inputs.length === 1) {
        inputs[0].value = esperado.conjugado || "";
      }
    });
  });
});

// --- Botão PRÁTICA (esvaziar tudo)
document.getElementById("botao_pratica").addEventListener("click", () => {
  
  document.querySelectorAll("input").forEach(inp => {
    inp.value = ""
    inp.disabled = false;
  });
  
  document.getElementById('botao_verificar').style.display = 'inline'

  // foca já no primeiro input vazio
  const vazio = document.querySelector("input");
  if (vazio) vazio.focus();
});





document.getElementById('botao_verificar').addEventListener('click', () => verificar())


const verbos_infinitivo = [
  {
    idioma: "pt",
    verbos: ["amar", "falar", "sorrir"]
  },
  {
    idioma: "en",
    verbos: ["love", "speak", "smile"]
  },
  {
    idioma: "es",
    verbos: ["amar", "hablar", "sonreír"]
  },
  {
    idioma: "fr",
    verbos: ["aimer", "parler", "sourire"]
  },
  {
    idioma: "it",
    verbos: ["amare", "parlare", "sorridere"]
  },
  {
    idioma: "de",
    verbos: ["lieben", "sprechen", "lächeln"]
  }
]


function faz_botoes_verbos () {

  for (let i = 0; i < verbos_infinitivo.length; i++) {

    if (verbos_infinitivo[i].idioma === idioma_praticado) {
      for (let j = 0; j < verbos_infinitivo[i].verbos.length; j++) {

        const span = document.createElement("span");
        span.className = "link-botao";
        span.textContent = verbos_infinitivo[i].verbos[j];
        span.onclick = function () { clicou_link(this, verbos_infinitivo[i].verbos[j]) }
        document.getElementById("links").appendChild(span);
      }
    }
  }
}

function clicou_link (botao, verbo) {
  document.querySelectorAll('.link-botao').forEach(b => b.classList.remove('link_ativo'));
  botao.classList.add("link_ativo")
  carregarCSV(verbo)
}

// aqui você pode trocar o conteúdo da interface baseado no btn.dataset.tab

faz_botoes_verbos()

const botaoTeoria = document.getElementById("botao_teoria");
const botaoPratica = document.getElementById("botao_pratica");

function ativarBotao(botaoAtivo) {
  // Remove 'active' de ambos
  botaoTeoria.classList.remove("active");
  botaoPratica.classList.remove("active");

  // Adiciona 'active' no botão clicado
  botaoAtivo.classList.add("active");
}

// Eventos de clique
botaoTeoria.addEventListener("click", () => ativarBotao(botaoTeoria));
botaoPratica.addEventListener("click", () => ativarBotao(botaoPratica));

document.getElementById('escolha_verbo_abaixo').innerHTML = traduzir_hud('escolha_verbo', currentLanguage)
document.getElementById('botao_teoria').innerHTML = traduzir_hud('botao_teoria', currentLanguage)
document.getElementById('botao_pratica').innerHTML = traduzir_hud('botao_pratica', currentLanguage)