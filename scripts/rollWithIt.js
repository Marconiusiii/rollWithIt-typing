let lyricsText = ``;

let lines = [];
let currentLineIndex = 0;
let currentCharIndex = 0;
let gameState = 'MENU';
let totalKeystrokes = 0;
let errors = 0;

let typingStartTime = null;
let totalTypingTime = 0;

let typingMode = 'guided';
let sentenceSpeechMode = 'errors';

const activatorInput = document.getElementById('keyboard-activator');
const captureSurface = document.getElementById('keyboard-capture');

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

function setScreenState(targetState) {
	const appHeader = document.querySelector('.app-header');
	const gameScreen = document.getElementById('game-screen');
	const resultsScreen = document.getElementById('results-screen');
	const footer = document.getElementById('footer');

	if (targetState === 'MENU') {
		document.title = 'Roll with It Typing';

		appHeader.classList.remove('hidden');
		appHeader.removeAttribute('inert');

		gameScreen.classList.add('hidden');
		gameScreen.setAttribute('inert', '');

		resultsScreen.classList.add('hidden');
		resultsScreen.setAttribute('inert', '');

		footer.classList.remove('hidden');
		footer.removeAttribute('inert');
	}

	if (targetState === 'PLAYING') {
		document.title = 'Roll with It Typing';

		appHeader.classList.add('hidden');
		appHeader.setAttribute('inert', '');

		gameScreen.classList.remove('hidden');
		gameScreen.removeAttribute('inert');

		resultsScreen.classList.add('hidden');
		resultsScreen.setAttribute('inert', '');

		footer.classList.add('hidden');
		footer.setAttribute('inert', '');
	}

	if (targetState === 'RESULTS') {
		document.title = 'Roll with It Typing Results';

		appHeader.classList.add('hidden');
		appHeader.setAttribute('inert', '');

		gameScreen.classList.add('hidden');
		gameScreen.setAttribute('inert', '');

		resultsScreen.classList.remove('hidden');
		resultsScreen.removeAttribute('inert');

		footer.classList.add('hidden');
		footer.setAttribute('inert', '');
	}
}

function speak(text) {
	return new Promise((resolve) => {
		if (isSpeaking) {
			window.speechSynthesis.cancel();
		}

		isSpeaking = true;

		const utterance = new SpeechSynthesisUtterance(text);
		const voices = window.speechSynthesis.getVoices();
		const voice = voices.find(v => v.lang.startsWith('en')) || voices[0];

		if (voice) {
			utterance.voice = voice;
		}

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

function startTypingLesson() {
	if (!lyricsText.trim()) {
		speak("No typing lesson content is available yet.");
		return;
	}

	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	lines = lyricsText.split(/\r?\n/).filter(l => l.trim().length > 0);

	currentLineIndex = 0;
	currentCharIndex = 0;
	totalKeystrokes = 0;
	errors = 0;
	typingStartTime = null;
	totalTypingTime = 0;

	render();
	promptChar();
}

function render() {
	const container = document.getElementById('lyrics-display');
	container.innerHTML = '';

	const line = lines[currentLineIndex];
	if (!line) return;

	for (let i = 0; i < line.length; i++) {
		const span = document.createElement('span');

		if (line[i] === ' ') {
			span.textContent = '\u00A0';
		} else {
			span.textContent = line[i];
		}

		if (i < currentCharIndex) {
			span.className = 'correct';
		} else if (i === currentCharIndex) {
			span.className = 'current';
		}

		container.appendChild(span);
	}

	if (currentCharIndex === line.length) {
		const cursor = document.createElement('span');
		cursor.className = 'cursor';
		container.appendChild(cursor);
	}
}

async function promptChar() {
	if (!lines[currentLineIndex]) {
		return;
	}

	const char = lines[currentLineIndex][currentCharIndex];
	const spoken =
		punctuationMap[char] ||
		(char === char.toUpperCase() && char !== char.toLowerCase()
			? `Capital ${char}`
			: char);

	document.getElementById('char-indicator').textContent = `Type: ${spoken}`;
	await speak(spoken);
}

async function handleCharacterInput(char) {
	if (gameState !== 'PLAYING') {
		return;
	}

	if (char === '\\') {
		finishGame();
		return;
	}

	const expected = lines[currentLineIndex]?.[currentCharIndex];
	if (expected === undefined) {
		return;
	}

	const matches =
		(char.toLowerCase() === expected.toLowerCase()) ||
		(expected === ' ' && char === ' ');

	if (matches) {
		if (currentCharIndex === 0 && typingStartTime === null) {
			typingStartTime = Date.now();
		}

		totalKeystrokes++;
		currentCharIndex++;

		if (currentCharIndex >= lines[currentLineIndex].length) {
			if (typingStartTime !== null) {
				totalTypingTime += Date.now() - typingStartTime;
				typingStartTime = null;
			}

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
		totalKeystrokes++;
		errors++;
		playBeep();
		promptChar();
	}
}

/*
	iOS on-screen keyboard:
	Use beforeinput and prevent edits, so no "delete haptic" loop.
*/
activatorInput.addEventListener('beforeinput', (e) => {
	if (gameState !== 'PLAYING') {
		return;
	}

	if (typeof e.data === 'string' && e.data.length > 0) {
		e.preventDefault();

		for (const ch of e.data) {
			handleCharacterInput(ch);
		}
	}
});

/*
	Hardware keyboards:
*/
activatorInput.addEventListener('keydown', (e) => {
	if (gameState !== 'PLAYING') {
		return;
	}

	if (e.key === '\\') {
		e.preventDefault();
		handleCharacterInput('\\');
		return;
	}

	if (e.key.length === 1) {
		e.preventDefault();
		handleCharacterInput(e.key);
	}
});

/*
	Do not allow the capture surface to become a VO focus trap.
	It exists as a structural hook only.
*/
if (captureSurface) {
	captureSurface.setAttribute('tabindex', '-1');
}

function finishGame() {
	gameState = 'RESULTS';
	setScreenState('RESULTS');

	const resultsHeading = document.getElementById('resultsHeading');
	resultsHeading.focus();

	const correctKeystrokes = Math.max(0, totalKeystrokes - errors);

	let wpm = 0;

	if (totalTypingTime > 0 && correctKeystrokes > 0) {
		const mins = totalTypingTime / 60000;
		wpm = Math.round((correctKeystrokes / 5) / mins);
	}

	const acc = Math.round(
		(correctKeystrokes / Math.max(1, totalKeystrokes)) * 100
	) || 0;

	document.getElementById('wpm-val').textContent = `${wpm}`;
	document.getElementById('accuracy-val').textContent = `${acc}%`;

	const wpmNote = document.getElementById('wpmNote');

	if (totalTypingTime === 0 || correctKeystrokes === 0) {
		wpmNote.textContent =
			'Never gonna give you a speed score. You didn’t type long enough for us to measure it.';
		wpmNote.classList.remove('hidden');
	} else {
		wpmNote.textContent = '';
		wpmNote.classList.add('hidden');
	}
}

const typingModeGuided = document.getElementById('typingModeGuided');
const typingModeSentence = document.getElementById('typingModeSentence');
const sentenceSpeechOptions = document.getElementById('sentenceSpeechOptions');

if (typingModeGuided && typingModeSentence && sentenceSpeechOptions) {

	typingModeGuided.addEventListener('change', () => {
		if (typingModeGuided.checked) {
			typingMode = 'guided';
			sentenceSpeechOptions.disabled = true;
			document.getElementById('sentenceOptionsHint').textContent = "These options are available when Sentence-first mode is selected.";
		}
	});

	typingModeSentence.addEventListener('change', () => {
		if (typingModeSentence.checked) {
			typingMode = 'sentence';
			sentenceSpeechOptions.disabled = false;
			document.getElementById('sentenceOptionsHint').textContent = "";
		}
	});
}

const sentenceSpeechChars = document.getElementById('sentenceSpeechChars');
const sentenceSpeechWords = document.getElementById('sentenceSpeechWords');
const sentenceSpeechBoth = document.getElementById('sentenceSpeechBoth');
const sentenceSpeechErrors = document.getElementById('sentenceSpeechErrors');

function updateSentenceSpeechMode() {
	if (sentenceSpeechChars && sentenceSpeechChars.checked) {
		sentenceSpeechMode = 'characters';
	}
	if (sentenceSpeechWords && sentenceSpeechWords.checked) {
		sentenceSpeechMode = 'words';
	}
	if (sentenceSpeechBoth && sentenceSpeechBoth.checked) {
		sentenceSpeechMode = 'both';
	}
	if (sentenceSpeechErrors && sentenceSpeechErrors.checked) {
		sentenceSpeechMode = 'errors';
	}
}

if (sentenceSpeechChars) {
	sentenceSpeechChars.addEventListener('change', updateSentenceSpeechMode);
}
if (sentenceSpeechWords) {
	sentenceSpeechWords.addEventListener('change', updateSentenceSpeechMode);
}
if (sentenceSpeechBoth) {
	sentenceSpeechBoth.addEventListener('change', updateSentenceSpeechMode);
}
if (sentenceSpeechErrors) {
	sentenceSpeechErrors.addEventListener('change', updateSentenceSpeechMode);
}


document
	.getElementById('startLessonButton')
	.addEventListener('click', () => {
		if (gameState !== 'MENU') {
			return;
		}

		gameState = 'PLAYING';
		setScreenState('PLAYING');

		try {
			activatorInput.focus({ preventScroll: true });
		} catch (err) {
			activatorInput.focus();
		}

		startTypingLesson();
	});

document
	.getElementById('exitLessonButton')
	.addEventListener('click', () => {
		if (gameState === 'PLAYING') {
			finishGame();
		}
	});

const yearEl = document.getElementById('copyrightYear');

if (yearEl) {
	yearEl.textContent = new Date().getFullYear();
}
