// Simulação do arquivo CSV. Em um ambiente real, você faria um fetch para 'data.csv'.
const csvData = `Categoria,English,Portuguese,Spanish,French,German,Italian
artigos,the,o/a,el/la,le/la,der/die/das,il/la
artigos,a/an,um/uma,un/una,un/une,ein/eine,un/una
artigos,some,alguns/algumas,algunos/algunas,des,einige,alcuni
animais,dog,cachorro,perro,chien,Hund,cane
animais,cat,gato,gato,chat,Katze,gatto
cores,red,vermelho,rojo,rouge,rot,rosso
cores,blue,azul,azul,bleu,blau,blu
`;

// Variáveis de estado do jogo
let parsedData = [];
let availableWords = [];
let correctCount = 0;
let wrongCount = 0;
let fromLang = '';
let toLang = '';
let currentCorrectAnswer = '';

// Referências aos elementos do DOM
const categorySelect = document.getElementById('category-select');
const fromLangSelect = document.getElementById('from-lang-select');
const toLangSelect = document.getElementById('to-lang-select');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');
const questionWord = document.getElementById('question-word');
const optionsContainer = document.getElementById('options-container');
const correctCountSpan = document.getElementById('correct-count');
const wrongCountSpan = document.getElementById('wrong-count');
const messageContainer = document.getElementById('message-container');
const endMessage = document.getElementById('end-message');
const restartBtn = document.getElementById('restart-btn');
const optionButtons = document.querySelectorAll('.option-btn');

// Função para parsear o CSV
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = values[j];
        }
        data.push(row);
    }
    return data;
}

// Inicializa os seletores de categoria e idioma
function initializeSelectors() {
    parsedData = parseCSV(csvData);
    const categories = [...new Set(parsedData.map(row => row.Categoria))];
    const languages = Object.keys(parsedData[0]).filter(key => key !== 'Categoria');
    
    // Popula o seletor de categorias
    categorySelect.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

    // Popula os seletores de idioma
    fromLangSelect.innerHTML = languages.map(lang => `<option value="${lang}">${lang}</option>`).join('');
    toLangSelect.innerHTML = languages.map(lang => `<option value="${lang}">${lang}</option>`).join('');
    
    // Seta valores padrão
    fromLangSelect.value = 'Portuguese';
    toLangSelect.value = 'English';
}

// Inicia o jogo
function startGame() {
    const selectedCategory = categorySelect.value;
    fromLang = fromLangSelect.value;
    toLang = toLangSelect.value;

    if (fromLang === toLang) {
        alert("Por favor, selecione idiomas diferentes para a pergunta e a resposta.");
        return;
    }

    availableWords = parsedData.filter(row => row.Categoria === selectedCategory);
    correctCount = 0;
    wrongCount = 0;
    updateStats();

    // Esconde controles e exibe o jogo
    document.querySelector('.controls').classList.add('hidden');
    gameContainer.classList.remove('hidden');

    showNextQuestion();
}

// Exibe a próxima pergunta
function showNextQuestion() {
    if (availableWords.length === 0) {
        endGame('Você acertou todas as palavras! Parabéns!');
        return;
    }

    // Seleciona uma palavra aleatória
    const questionIndex = Math.floor(Math.random() * availableWords.length);
    const questionData = availableWords[questionIndex];

    const questionText = questionData[fromLang];
    currentCorrectAnswer = questionData[toLang];

    // Seleciona uma resposta incorreta de forma aleatória
    let wrongAnswerData;
    do {
        const wrongIndex = Math.floor(Math.random() * availableWords.length);
        wrongAnswerData = availableWords[wrongIndex];
    } while (wrongAnswerData[toLang] === currentCorrectAnswer);

    const wrongAnswer = wrongAnswerData[toLang];

    // Cria as opções de resposta e embaralha
    let options = [currentCorrectAnswer, wrongAnswer];
    options.sort(() => Math.random() - 0.5);

    // Atualiza a interface
    questionWord.textContent = questionText;
    options.forEach((option, index) => {
        optionButtons[index].textContent = option;
        optionButtons[index].onclick = () => handleAnswer(option, questionData);
        // Limpa classes de feedback de cores
        optionButtons[index].classList.remove('correct', 'wrong');
        optionButtons[index].disabled = false;
    });

    // Se quiser expandir para 3 opções, adicione mais um botão no HTML e um valor no array `options`.
    // Exemplo:
    // const anotherWrongAnswer = ...
    // options = [currentCorrectAnswer, wrongAnswer, anotherWrongAnswer];
}

// Lida com a resposta do usuário
function handleAnswer(selectedAnswer, questionData) {
    const isCorrect = selectedAnswer === currentCorrectAnswer;

    // Desativa botões para evitar múltiplos cliques
    optionButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === currentCorrectAnswer) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedAnswer) {
            btn.classList.add('wrong');
        }
    });

    if (isCorrect) {
        correctCount++;
        // Remove a palavra acertada
        availableWords = availableWords.filter(word => word !== questionData);
    } else {
        wrongCount++;
    }

    updateStats();

    // Espera um pouco antes de ir para a próxima pergunta
    setTimeout(showNextQuestion, 1000);
}

// Atualiza o contador de acertos e erros
function updateStats() {
    correctCountSpan.textContent = correctCount;
    wrongCountSpan.textContent = wrongCount;
}

// Finaliza o jogo
function endGame(message) {
    gameContainer.classList.add('hidden');
    messageContainer.classList.remove('hidden');
    endMessage.textContent = message;
}

// Reinicia o jogo
function restartGame() {
    messageContainer.classList.add('hidden');
    document.querySelector('.controls').classList.remove('hidden');
    initializeSelectors();
}

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

// Inicia o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', initializeSelectors);