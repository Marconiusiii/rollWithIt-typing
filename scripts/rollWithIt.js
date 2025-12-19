let lyricsText = ``;

let lines = [];
let currentLineIndex = 0;
let currentCharIndex = 0;
let gameState = 'MENU';
let totalKeystrokes = 0;
let errors = 0;
let startTime = null;

const captureInput = document.getElementById('keyboard-capture');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isSpeaking = false;

const punctuationMap = {
	"'": "apostrophe",
	",": "comma",
	".": "period",
	"-": "hyphen",
	"!": "exclamation mark",
	"?": "question mark",
	" ": "space"
};

function ensureFocus() {
	if (gameState === 'PLAYING') {
		captureInput.focus();
	}
}
function setScreenState(targetState) {
	const appHeader = document.querySelector('.app-header');
	const gameScreen = document.getElementById('game-screen');
	const resultsScreen = document.getElementById('results-screen');

	if (targetState === 'MENU') {
		appHeader.classList.remove('hidden');
		appHeader.removeAttribute('inert');

		gameScreen.classList.add('hidden');
		gameScreen.setAttribute('inert', '');

		resultsScreen.classList.add('hidden');
		resultsScreen.setAttribute('inert', '');
	}

	if (targetState === 'PLAYING') {
		appHeader.classList.add('hidden');
		appHeader.setAttribute('inert', '');

		gameScreen.classList.remove('hidden');
		gameScreen.removeAttribute('inert');

		resultsScreen.classList.add('hidden');
		resultsScreen.setAttribute('inert', '');
	}

	if (targetState === 'RESULTS') {
		appHeader.classList.add('hidden');
		appHeader.setAttribute('inert', '');

		gameScreen.classList.add('hidden');
		gameScreen.setAttribute('inert', '');

		resultsScreen.classList.remove('hidden');
		resultsScreen.removeAttribute('inert');
	}
}


// --- GAME START (New explicit entry point) ---
function startTypingLesson() {
	if (gameState !== 'MENU') {
		return;
	}

	if (!lyricsText.trim()) {
	speak("No typing lesson content is available yet.");
	return;
}


	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	lines = lyricsText.split('\n').filter(l => l.trim());
	gameState = 'PLAYING';
	startTime = Date.now();

	setScreenState('PLAYING');

	captureInput.focus();
	render();
	promptChar();
}


// --- LOCAL SPEECH API ---
function speak(text) {
	return new Promise((resolve) => {
		if (isSpeaking) {
			window.speechSynthesis.cancel();
		}

		isSpeaking = true;

		const utterance = new SpeechSynthesisUtterance(text);

		const voices = window.speechSynthesis.getVoices();
		const enVoice =
			voices.find(v => v.lang.includes('en') && v.name.includes('Samantha')) ||
			voices[0];

		if (enVoice) {
			utterance.voice = enVoice;
		}

		utterance.rate = 1.0;
		utterance.pitch = 1.0;

		utterance.onend = () => {
			isSpeaking = false;
			resolve();
		};

		utterance.onerror = () => {
			isSpeaking = false;
			resolve();
		};

		window.speechSynthesis.speak(utterance);
	});
}

function playBeep() {
	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	const osc = audioCtx.createOscillator();
	const gain = audioCtx.createGain();

	osc.connect(gain);
	gain.connect(audioCtx.destination);

	osc.frequency.value = 220;
	gain.gain.value = 0.05;

	osc.start();
	osc.stop(audioCtx.currentTime + 0.1);
}

function render() {
	const container = document.getElementById('lyrics-display');
	container.innerHTML = '';

	const line = lines[currentLineIndex];
	if (!line) return;

	for (let i = 0; i < line.length; i++) {
		const span = document.createElement('span');
		span.textContent = line[i];

		if (i < currentCharIndex) {
			span.className = 'correct';
		} else if (i === currentCharIndex) {
			span.className = 'current';
		}

		container.appendChild(span);
	}

	if (currentCharIndex === line.length) {
		container.appendChild(
			Object.assign(document.createElement('span'), {
				className: 'cursor'
			})
		);
	}
}

async function promptChar() {
	if (!lines[currentLineIndex]) {
	return;
}

	const char = lines[currentLineIndex][currentCharIndex];
	const p =
		punctuationMap[char] ||
		(char === char.toUpperCase() && char !== char.toLowerCase()
			? `Capital ${char}`
			: char);

	document.getElementById('char-indicator').textContent = `Type: ${p}`;
	speak(p);
}

async function processKey(key) {
	if (gameState !== 'PLAYING') {
		return;
	}

	if (key === '\\') {
		finishGame();
		return;
	}

	const expected = lines[currentLineIndex][currentCharIndex];
	totalKeystrokes++;

	if (
		key.toLowerCase() === expected.toLowerCase() ||
		(expected === ' ' && key === ' ')
	) {
		currentCharIndex++;

		if (currentCharIndex >= lines[currentLineIndex].length) {
			render();

			const completedText = lines[currentLineIndex];
			currentLineIndex++;
			currentCharIndex = 0;

			await speak(`Phrase complete: ${completedText}`);

			if (currentLineIndex >= lines.length) {
				finishGame();
			} else {
				render();
				promptChar();
			}
		} else {
			render();
			promptChar();
		}
	} else {
		errors++;
		playBeep();
		promptChar();
	}
}

captureInput.addEventListener('input', (e) => {
	const val = captureInput.value;

	if (val.length > 0) {
		const char = val.slice(-1);
		captureInput.value = '';
		processKey(char);
	}
});

captureInput.addEventListener('keydown', (e) => {
	if (e.key === '\\') {
		e.preventDefault();
		processKey(e.key);
	}
});

function finishGame() {
	gameState = 'RESULTS';

	setScreenState('RESULTS');

	const resultsHeading = document.getElementById('resultsHeading');
	resultsHeading.focus();

	const mins = (Date.now() - startTime) / 60000;

	const correctKeystrokes = Math.max(0, totalKeystrokes - errors);

	const wpm = Math.round((correctKeystrokes / 5) / mins) || 0;
	const acc = Math.round((correctKeystrokes / Math.max(1, totalKeystrokes)) * 100) || 0;

	document.getElementById('wpm-val').textContent = `${wpm}`;
	document.getElementById('accuracy-val').textContent = `${acc}%`;
}
document
	.getElementById('startLessonButton')
	.addEventListener('click', startTypingLesson);
