/* =========================
	Global state
========================= */

let lyricsText = `We're no strangers to love
You know the rules and so do I
A full commitment's what I'm thinkin' of
You wouldn't get this from any other guy
I just wanna tell you how I'm feeling
Gotta make you understand
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you`;

let lines = [];
let currentLineIndex = 0;
let currentCharIndex = 0;

let gameState = 'MENU';
let typingMode = 'guided';
let sentenceSpeechMode = 'errors';

let totalKeystrokes = 0;
let errors = 0;

let typingStartTime = null;
let totalTypingTime = 0;

let isSpeaking = false;

const activatorInput = document.getElementById('keyboard-activator');
const captureSurface = document.getElementById('keyboard-capture');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/* =========================
	Speech helpers
========================= */

const punctuationMap = {
	"'": "apostrophe",
	",": "comma",
	".": "period",
	"-": "hyphen",
	"!": "exclamation mark",
	"?": "question mark",
	" ": "space"
};

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

function speakTypedCharacter(char) {
	const spoken =
		punctuationMap[char] ||
		(char === char.toUpperCase() && char !== char.toLowerCase()
			? `Capital ${char}`
			: char);

	speak(spoken);
}

async function speakLineOnce() {
	const line = lines[currentLineIndex];
	if (!line) {
		return;
	}

	await speak(line);
}

/* =========================
	Audio feedback
========================= */

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

/* =========================
	State management
========================= */

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

/* =========================
	Rendering
========================= */

function render() {
	const container = document.getElementById('lyrics-display');
	container.innerHTML = '';

	const line = lines[currentLineIndex];
	if (!line) {
		return;
	}

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

/* =========================
	Word boundary detection
========================= */

function isWordBoundary(line, index) {
	if (index <= 0 || index > line.length) {
		return false;
	}

	const prevChar = line[index - 1];
	const nextChar = line[index] || ' ';

	return prevChar !== ' ' && nextChar === ' ';
}

/* =========================
	Game start
========================= */

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

	if (typingMode === 'guided') {
		promptChar();
	} else {
		speakLineOnce();
	}
}

/* =========================
	Guided prompt
========================= */

async function promptChar() {
	if (!lines[currentLineIndex]) {
		return;
	}

	const char = lines[currentLineIndex][currentCharIndex];
	speakTypedCharacter(char);
}

/* =========================
	Input handling
========================= */

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

		if (typingMode === 'sentence') {
			const line = lines[currentLineIndex];

			if (
				sentenceSpeechMode === 'characters' ||
				sentenceSpeechMode === 'both'
			) {
				speakTypedCharacter(char);
			}

			if (
				(sentenceSpeechMode === 'words' ||
					sentenceSpeechMode === 'both') &&
				isWordBoundary(line, currentCharIndex)
			) {
				const words = line.slice(0, currentCharIndex).trim().split(/\s+/);
				const lastWord = words[words.length - 1];
				if (lastWord) {
					speak(lastWord);
				}
			}
		}

		if (currentCharIndex >= lines[currentLineIndex].length) {

			if (typingStartTime !== null) {
				totalTypingTime += Date.now() - typingStartTime;
				typingStartTime = null;
			}

			render();

			const completedText = lines[currentLineIndex];
			currentLineIndex++;
			currentCharIndex = 0;

			if (typingMode === 'sentence') {
				await speak("Phrase complete!");
			} else {
				await speak(`Phrase complete: ${completedText}`);
			}

			if (currentLineIndex >= lines.length) {
				finishGame();
			} else {
				render();

				if (typingMode === 'guided') {
					promptChar();
				} else {
					speakLineOnce();
				}
			}
		} else {
			render();

			if (typingMode === 'guided') {
				promptChar();
			}
		}
	} else {
		totalKeystrokes++;
		errors++;
		playBeep();

		if (typingMode === 'guided') {
			promptChar();
		} else {
			speakTypedCharacter(expected);
		}
	}
}

/* =========================
	Keyboard capture
========================= */

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

/* =========================
	Typing mode settings
========================= */

const typingModeGuided = document.getElementById('typingModeGuided');
const typingModeSentence = document.getElementById('typingModeSentence');
const sentenceSpeechOptions = document.getElementById('sentenceSpeechOptions');

if (typingModeGuided && typingModeSentence && sentenceSpeechOptions) {

	typingModeGuided.addEventListener('change', () => {
		if (typingModeGuided.checked) {
			typingMode = 'guided';
			sentenceSpeechOptions.disabled = true;
		}
	});

	typingModeSentence.addEventListener('change', () => {
		if (typingModeSentence.checked) {
			typingMode = 'sentence';
			sentenceSpeechOptions.disabled = false;
		}
	});
}

/* =========================
	Sentence speech settings
========================= */

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

/* =========================
	Results
========================= */

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

/* =========================
	Buttons
========================= */

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
		} catch {
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

/* =========================
	Footer year
========================= */

const yearEl = document.getElementById('copyrightYear');

if (yearEl) {
	yearEl.textContent = new Date().getFullYear();
}
