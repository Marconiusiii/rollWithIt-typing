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
let totalKeystrokes = 0;
let errors = 0;

let typingStartTime = null;
let totalTypingTime = 0;

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

/* --- GAME START --- */

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

	currentLineIndex = 0;
	currentCharIndex = 0;
	totalKeystrokes = 0;
	errors = 0;
	typingStartTime = null;
	totalTypingTime = 0;

	gameState = 'PLAYING';

	setScreenState('PLAYING');

	captureInput.focus();
	render();
	promptChar();
}

/* --- SPEECH --- */

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

/* --- RENDERING --- */

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
	const spoken =
		punctuationMap[char] ||
		(char === char.toUpperCase() && char !== char.toLowerCase()
			? `Capital ${char}`
			: char);

	document.getElementById('char-indicator').textContent = `Type: ${spoken}`;
	speak(spoken);
}

/* --- INPUT HANDLING --- */

async function processKey(key) {
	if (gameState !== 'PLAYING') {
		return;
	}

	if (key === '\\') {
		finishGame();
		return;
	}

	const expected = lines[currentLineIndex][currentCharIndex];

	if (key.toLowerCase() === expected.toLowerCase() || (expected === ' ' && key === ' ')) {

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

/* --- RESULTS --- */

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

	const wpmNote = document.getElementById('wpmNote');

	if (totalTypingTime === 0 || correctKeystrokes === 0) {
		wpmNote.textContent =
			'Never gonna give you a Commitment score. You didn’t type long enough for us to measure it.';
			wpmNote.classList.remove('hidden');
		} else {
			wpmNote.textContent = '';
			wpmNote.classList.add('hidden');
	}

	const acc = Math.round(
		(correctKeystrokes / Math.max(1, totalKeystrokes)) * 100
	) || 0;

	document.getElementById('wpm-val').textContent = `${wpm}`;
	document.getElementById('accuracy-val').textContent = `${acc}%`;
}

/* --- BUTTON WIRING --- */

document
	.getElementById('startLessonButton')
	.addEventListener('click', startTypingLesson);

document
	.getElementById('exitLessonButton')
	.addEventListener('click', () => {
		if (gameState === 'PLAYING') {
			finishGame();
		}
	});

/* --- FOOTER YEAR --- */

const yearEl = document.getElementById('copyrightYear');

if (yearEl) {
	yearEl.textContent = new Date().getFullYear();
}
