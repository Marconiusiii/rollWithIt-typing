let lyricsText = ``;

let lines = [];
let currentLineIndex = 0;
let currentCharIndex = 0;

let gameState = 'MENU';
let typingMode = 'guided';
let sentenceSpeechMode = 'errors';
let contentMode = 'original';

let totalKeystrokes = 0;
let errors = 0;

let typingStartTime = null;
let totalTypingTime = 0;

const activatorInput = document.getElementById('keyboard-activator');
const captureSurface = document.getElementById('keyboard-capture');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isSpeaking = false;

let speakChain = Promise.resolve();

const punctuationMap = {
	"'": "apostrophe",
	",": "comma",
	".": "period",
	"-": "hyphen",
	"!": "exclamation mark",
	"?": "question mark",
	" ": "space"
};

function queueSpeak(text) {
	speakChain = speakChain.then(() => speak(text));
	return speakChain;
}

function resetSpeakQueue() {
	speakChain = Promise.resolve();
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

function speak(text) {
	return new Promise((resolve) => {
		if (isSpeaking) {
			window.speechSynthesis.cancel();
		}

		isSpeaking = true;

		const utterance = new SpeechSynthesisUtterance(text);
		const voices = window.speechSynthesis.getVoices();
		const voice = voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0];

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

function getSpokenChar(char) {
	return (
		punctuationMap[char] ||
		(char === char.toUpperCase() && char !== char.toLowerCase()
			? `Capital ${char}`
			: char)
	);
}

function speakChar(char) {
	return speak(getSpokenChar(char));
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
	if (!line) {
		return;
	}

	for (let i = 0; i < line.length; i++) {
		const span = document.createElement('span');
		span.textContent = line[i] === ' ' ? '\u00A0' : line[i];

		if (i < currentCharIndex) {
			span.className = 'correct';
		} else if (i === currentCharIndex) {
			span.className = 'current';
		}

		container.appendChild(span);
	}
}

function isWordEnd(line, index) {
	if (!line) {
		return false;
	}

	if (index <= 0) {
		return false;
	}

	if (index >= line.length) {
		return line[line.length - 1] !== ' ';
	}

	return line[index - 1] !== ' ' && line[index] === ' ';
}

function getLastWord(line, endIndex) {
	const part = line.slice(0, endIndex).trim();
	if (!part) {
		return '';
	}

	const words = part.split(/\s+/);
	return words[words.length - 1] || '';
}

async function speakLineOnce() {
	const line = lines[currentLineIndex];
	if (!line) {
		return;
	}

	const indicator = document.getElementById('char-indicator');
	if (indicator) {
		indicator.textContent = 'Type the phrase';
	}

	resetSpeakQueue();
	await speak(line);
}

async function promptChar() {
	if (!lines[currentLineIndex]) {
		return;
	}

	const char = lines[currentLineIndex][currentCharIndex];
	const spoken = getSpokenChar(char);

	const indicator = document.getElementById('char-indicator');
	if (indicator) {
		indicator.textContent = `Type: ${spoken}`;
	}

	resetSpeakQueue();
	await speak(spoken);
}

const contentModeOriginal = document.getElementById('contentModeOriginal');
const contentModeCustom = document.getElementById('contentModeCustom');
const customContentFieldset = document.getElementById('customContentFieldset');

if (contentModeOriginal && contentModeCustom && customContentFieldset) {

	contentModeOriginal.addEventListener('change', () => {
		if (contentModeOriginal.checked) {
			contentMode = 'original';
			customContentFieldset.disabled = true;
		}
	});

	contentModeCustom.addEventListener('change', () => {
		if (contentModeCustom.checked) {
			contentMode = 'custom';
			customContentFieldset.disabled = false;
		}
	});
}
const customContentInput = document.getElementById('customContentInput');
const MAX_CUSTOM_LINES = 40;

function enforceLineLimit(textarea) {
	if (!textarea) {
		return;
	}

	const raw = textarea.value.replace(/\r\n?/g, '\n');
	const lines = raw.split('\n');

	if (lines.length <= MAX_CUSTOM_LINES) {
		return;
	}

	textarea.value = lines.slice(0, MAX_CUSTOM_LINES).join('\n');
}

if (customContentInput) {
	customContentInput.addEventListener('input', () => {
		if (customContentInput) {
	customContentInput.addEventListener('input', () => {
		enforceLineLimit(customContentInput);
		clearCustomContentError();
	});
}

		enforceLineLimit(customContentInput);
	});
}

function clearCustomContentError() {
	const input = document.getElementById('customContentInput');
	const error = document.getElementById('customContentError');

	if (input) {
		input.classList.remove('has-error');
	}

	if (error) {
		error.classList.add('hidden');
	}
}

function showCustomContentError() {
	const input = document.getElementById('customContentInput');
	const error = document.getElementById('customContentError');

	if (input) {
		input.classList.add('has-error');
		input.focus();
	}

	if (error) {
		error.classList.remove('hidden');
	}
}


function sanitizeText(rawText) {
	if (!rawText) {
		return '';
	}

	let text = rawText;

	text = text.replace(/<[^>]*>/g, '');
	text = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
	text = text.replace(/\r\n?/g, '\n');

	return text.trim();
}

function buildLinesFromText(text) {
	if (!text) {
		return [];
	}

	let lines = [];

	if (text.includes('\n')) {
		lines = text.split('\n');
	} else {
		lines = text.split(/(?<=[.!?])\s+/);
	}

	lines = lines
		.map(line => line.trim())
		.filter(line => line.length > 0);

	return lines.slice(0, 40);
}

function startTypingLesson() {
	if (contentMode === 'custom') {
	const customInput = document.getElementById('customContentInput');
	const rawText = customInput ? customInput.value : '';

	const cleanText = sanitizeText(rawText);
	const customLines = buildLinesFromText(cleanText);

	if (customLines.length === 0) {
		speak('No usable custom content was provided.');
		return;
	}

	lyricsText = customLines.join('\n');
}

	if (!lyricsText.trim()) {
		speak('No typing lesson content is available yet.');
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

async function handleLineDone(lineDoneText) {
	if (typingMode === 'sentence') {
		await speakChain;
		await speak('Phrase complete');
	} else {
		resetSpeakQueue();
		await speak(`Phrase complete: ${lineDoneText}`);
	}

	if (currentLineIndex >= lines.length) {
		finishGame();
		return;
	}

	render();

	if (typingMode === 'guided') {
		promptChar();
	} else {
		speakLineOnce();
	}
}

async function handleCharacterInput(char) {
	if (gameState !== 'PLAYING') {
		return;
	}

	if (char === '\\') {
		finishGame();
		return;
	}

	const line = lines[currentLineIndex];
	const expected = line?.[currentCharIndex];

	if (expected === undefined) {
		return;
	}

	const matches =
		(char.toLowerCase() === expected.toLowerCase()) ||
		(expected === ' ' && char === ' ');

	totalKeystrokes++;

	if (!matches) {
		errors++;
		playBeep();

		if (typingMode === 'guided') {
			promptChar();
		} else {
			resetSpeakQueue();
			await speakChar(expected);
		}

		return;
	}

	if (currentCharIndex === 0 && typingStartTime === null) {
		typingStartTime = Date.now();
	}

	currentCharIndex++;

	if (typingMode === 'sentence') {
		if (sentenceSpeechMode === 'characters' || sentenceSpeechMode === 'both') {
			queueSpeak(getSpokenChar(char));
		}

		if (sentenceSpeechMode === 'words' || sentenceSpeechMode === 'both') {
			if (isWordEnd(line, currentCharIndex)) {
				const lastWord = getLastWord(line, currentCharIndex);
				if (lastWord) {
					queueSpeak(lastWord);
				}
			}
		}
	}

	if (currentCharIndex >= line.length) {
		if (typingStartTime !== null) {
			totalTypingTime += Date.now() - typingStartTime;
			typingStartTime = null;
		}

		const lineDoneText = line;

		currentLineIndex++;
		currentCharIndex = 0;

		await handleLineDone(lineDoneText);
		return;
	}

	render();

	if (typingMode === 'guided') {
		promptChar();
	}
}

function handleBeforeInput(e) {
	if (gameState !== 'PLAYING') {
		return;
	}

	if (typeof e.data === 'string' && e.data.length > 0) {
		e.preventDefault();

		for (const ch of e.data) {
			handleCharacterInput(ch);
		}
	}
}

function handleKeyDown(e) {
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
}

function updateSentenceSpeechMode() {
	const sentenceSpeechChars = document.getElementById('sentenceSpeechChars');
	const sentenceSpeechWords = document.getElementById('sentenceSpeechWords');
	const sentenceSpeechBoth = document.getElementById('sentenceSpeechBoth');
	const sentenceSpeechErrors = document.getElementById('sentenceSpeechErrors');

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

function updateSentenceOpts() {
	const sentenceSpeechOptions = document.getElementById('sentenceSpeechOptions');
	const optionsHint = document.getElementById('sentenceOptionsHint');

	if (!sentenceSpeechOptions) {
		return;
	}

	const enable = typingMode === 'sentence';
	sentenceSpeechOptions.disabled = !enable;

	if (optionsHint) {
		if (enable) {
			optionsHint.textContent = '';
		} else if (!optionsHint.textContent) {
			optionsHint.textContent = 'These options are available when Sentence-first mode is selected.';
		}
	}
}

function initTypingSettings() {
	const typingModeGuided = document.getElementById('typingModeGuided');
	const typingModeSentence = document.getElementById('typingModeSentence');

	if (typingModeGuided) {
		typingModeGuided.addEventListener('change', () => {
			if (typingModeGuided.checked) {
				typingMode = 'guided';
				updateSentenceOpts();
			}
		});
	}

	if (typingModeSentence) {
		typingModeSentence.addEventListener('change', () => {
			if (typingModeSentence.checked) {
				typingMode = 'sentence';
				updateSentenceOpts();
			}
		});
	}

	const sentenceSpeechChars = document.getElementById('sentenceSpeechChars');
	const sentenceSpeechWords = document.getElementById('sentenceSpeechWords');
	const sentenceSpeechBoth = document.getElementById('sentenceSpeechBoth');
	const sentenceSpeechErrors = document.getElementById('sentenceSpeechErrors');

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

	updateSentenceSpeechMode();
	updateSentenceOpts();
}

function finishGame() {
	gameState = 'RESULTS';
	setScreenState('RESULTS');

	const resultsHeading = document.getElementById('resultsHeading');
	if (resultsHeading) {
		resultsHeading.focus();
	}

	const wpmLabel = document.getElementById('wpmLabel');
	const accLabel = document.getElementById('accuracyLabel');
	if (contentMode === 'original') {
		if (wpmLabel) {
			wpmLabel.textContent = "Commitments per Minute: ";
		}
		if (accLabel) {
			accLabel.textContent = "AccuRickcy: ";
		}
	} else {
			wpmLabel.textContent = "WPM: ";
			accLabel.textContent = "Accuracy: ";
		}
	const correctKeystrokes = Math.max(0, totalKeystrokes - errors);

	let wpm = 0;

	if (totalTypingTime > 0 && correctKeystrokes > 0) {
		const mins = totalTypingTime / 60000;
		wpm = Math.round((correctKeystrokes / 5) / mins);
	}

	const acc = Math.round(
		(correctKeystrokes / Math.max(1, totalKeystrokes)) * 100
	) || 0;

	const wpmVal = document.getElementById('wpm-val');
	const accVal = document.getElementById('accuracy-val');

	if (wpmVal) {
		wpmVal.textContent = `${wpm}`;
	}

	if (accVal) {
		accVal.textContent = `${acc}%`;
	}

	const wpmNote = document.getElementById('wpmNote');

	if (wpmNote) {
		if (totalTypingTime === 0 || correctKeystrokes === 0) {
			wpmNote.textContent = 'Never gonna give you a speed score. You didn’t type long enough for us to measure it.';
			wpmNote.classList.remove('hidden');
		} else {
			wpmNote.textContent = '';
			wpmNote.classList.add('hidden');
		}
	}
}

const closeResultsButton = document.getElementById('closeResultsButton');

if (closeResultsButton) {
	closeResultsButton.addEventListener('click', () => {
		if (gameState !== 'RESULTS') {
			return;
		}

		gameState = 'MENU';
		setScreenState('MENU');
		startLessonButton.focus();
	});
}


function startBtnHandler() {
	if (contentMode === 'custom') {
	const input = document.getElementById('customContentInput');
	const rawText = input ? input.value : '';

	const cleanText = sanitizeText(rawText);
	const customLines = buildLinesFromText(cleanText);

	if (customLines.length === 0) {
		showCustomContentError();
		return;
	}

	lyricsText = customLines.join('\n');
} else {
	clearCustomContentError();
}

startTypingLesson();

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
}

function exitBtnHandler() {
	if (gameState === 'PLAYING') {
		finishGame();
	}
}

function initFooterYear() {
	const yearEl = document.getElementById('copyrightYear');
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}
}

function initInputHooks() {
	if (captureSurface) {
		captureSurface.setAttribute('tabindex', '-1');
	}

	if (!activatorInput) {
		return;
	}

	activatorInput.addEventListener('beforeinput', handleBeforeInput);
	activatorInput.addEventListener('keydown', handleKeyDown);
}

function initButtons() {
	const startLessonButton = document.getElementById('startLessonButton');
	const exitLessonButton = document.getElementById('exitLessonButton');

	if (startLessonButton) {
		startLessonButton.addEventListener('click', startBtnHandler);
	}

	if (exitLessonButton) {
		exitLessonButton.addEventListener('click', exitBtnHandler);
	}
}

function init() {
	initTypingSettings();
	initInputHooks();
	initButtons();
	initFooterYear();
}

init();
