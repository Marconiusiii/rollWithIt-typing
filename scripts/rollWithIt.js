const typingContentSets = [
	{
		id: 'classic-lit',
		title: 'Classic Literature',
		lines: [
			'Call me Ishmael, and mind your commas.',
			'It was the best of times, it was typed well.',
			'All happy families type alike.',
			'The page was blank, and waiting patiently.',
			'Some truths are universally acknowledged.',
			'Beware the jabber of careless fingers.',
			'Time slipped quietly between the words.',
			'The story began with a single letter.',
			'A sentence marched forward, steady and sure.',
			'The final line rested at last.'
		]
	},
	{
		id: 'shakespeare',
		title: 'Shakespearean Rhythm',
		lines: [
			'To type, or not to type, that is typed.',
			'Words, words, words, all marching on.',
			'The play is typed upon this stage.',
			'Fair letters dance upon the screen.',
			'Once more unto the keyboard, friends.',
			'The prompt speaks, and you respond.',
			'A pause, a breath, a comma lands.',
			'The line completes, the cursor waits.',
			'All the world’s a typing test.',
			'Exit, pursued by accuracy.'
		]
	},
	{
		id: 'poetry',
		title: 'Poetry and Meter',
		lines: [
			'The line begins with quiet grace.',
			'Each letter falls into its place.',
			'The rhythm taps beneath your hands.',
			'A pause between the words feels right.',
			'Short lines can still carry weight.',
			'The cursor blinks like measured time.',
			'The stanza waits for no delay.',
			'Breath in, type on, then let go.',
			'The poem listens as you type.',
			'Silence follows the final word.'
		]
	},
	{
		id: 'mystery',
		title: 'Mystery and Suspense',
		lines: [
			'The letter appeared without warning.',
			'A shadow crept between the keys.',
			'Something was missing from the line.',
			'The cursor blinked, impatient now.',
			'A clue hid in plain sight.',
			'Each word narrowed the search.',
			'The sentence ended too soon.',
			'Footsteps echoed in the margins.',
			'The truth revealed itself slowly.',
			'Case closed with a final keystroke.'
		]
	},
	{
		id: 'fantasy',
		title: 'Fantasy and Myth',
		lines: [
			'The scroll unfurled before your eyes.',
			'Ancient words shimmered on the page.',
			'A spell was typed with careful care.',
			'The dragon paused to read.',
			'Each rune required steady hands.',
			'The quest advanced line by line.',
			'Magic lives in punctuation.',
			'The hero hesitated, then typed.',
			'The prophecy reached its end.',
			'The tale slept until typed again.'
		]
	},
	{
		id: 'science-fiction',
		title: 'Science Fiction',
		lines: [
			'The console hummed softly.',
			'Coordinates scrolled across the screen.',
			'A signal blinked in binary rhythm.',
			'The future typed itself forward.',
			'Errors could alter the timeline.',
			'The system waited for input.',
			'A pause, then confirmation.',
			'Data flowed line by line.',
			'The mission logged successfully.',
			'End transmission.'
		]
	},
	{
		id: 'philosophy',
		title: 'Philosophy',
		lines: [
			'I think, therefore I type.',
			'Each word questions the next.',
			'Meaning forms between letters.',
			'The pause matters as much as text.',
			'Truth rarely arrives instantly.',
			'Thought unfolds one line at a time.',
			'Doubt lingers near the cursor.',
			'The sentence resolves itself.',
			'Understanding types slowly.',
			'Reflection ends with a period.'
		]
	},
	{
		id: 'childrens-lit',
		title: 'Children’s Literature',
		lines: [
			'The mouse ran across the keys.',
			'A small letter made a big sound.',
			'The page smiled back gently.',
			'Words hopped like playful frogs.',
			'The story liked being typed.',
			'Each line felt like a rhyme.',
			'The cursor blinked cheerfully.',
			'The sentence waved hello.',
			'Almost time to say goodbye.',
			'The book closed softly.'
		]
	},
	{
		id: 'writing-about-writing',
		title: 'Writing About Writing',
		lines: [
			'The sentence waits to be written.',
			'Fingers hover, then begin.',
			'A typo tries to sneak in.',
			'Accuracy pulls it back.',
			'The line grows more confident.',
			'Punctuation finds its place.',
			'The rhythm feels familiar.',
			'Editing happens in real time.',
			'The paragraph feels complete.',
			'The writer pauses.'
		]
	},
	{
		id: 'meta',
		title: 'Meta Typing',
		lines: [
			'This line knows it is a line.',
			'The words are aware of you.',
			'Typing reveals the secret.',
			'Each letter waits its turn.',
			'The sentence enjoys attention.',
			'A mistake almost escaped.',
			'The cursor judges silently.',
			'You and the text agree.',
			'The final line approaches.',
			'The story ends… for now.'
		]
	},
	{
		id: 'coding-fundamentals',
		title: 'Coding Fundamentals',
		type: 'code',
		lines: [
			`const count = 0;`,
			`let totalScore = count + 5;`,
			`if (totalScore > 10) return;`,
			`function add(a, b) { return a + b; }`,
			`for (let i = 0; i < 5; i++) {}`,
			`while (isRunning) { checkState(); }`,
			`const name = "Ada";`,
			`console.log("Hello, world");`,
			`array.map(item => item.id);`,
			`export default startGame;`
		]
	},
	{
		id: 'web-basics',
		title: 'Web Basics',
		type: 'code',
		lines: [
			`<button type="button">Click me</button>`,
			`document.querySelector("#app");`,
			`element.addEventListener("click", start);`,
			`const heading = document.createElement("h1");`,
			`input.value = "";`,
			`form.submit();`,
			`window.location.href = "/home";`,
			`console.log(event.target);`,
			`button.disabled = true;`,
			`main.appendChild(section);`
		]
	},
	{
		id: 'svg-basics',
		title: 'SVG Basics',
		type: 'code',
		lines: [
			`<svg viewBox="0 0 100 100">`,
			`<circle cx="50" cy="50" r="40" />`,
			`<rect x="10" y="10" width="80" height="80" />`,
			`<line x1="0" y1="0" x2="100" y2="100" />`,
			`<path d="M10 10 L90 10" />`,
			`<text x="50" y="50">Hello</text>`,
			`fill="none"`,
			`stroke="black"`,
			`stroke-width="2"`,
			`</svg>`
		]
	}

];

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
let errorKeys = new Set();
const progressStatus = document.getElementById('progressStatus');

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

const MAX_CUSTOM_LINES = 40;

function updateProgressStatus() {
	if (!progressStatus || !lines || lines.length === 0) {
		return;
	}

	const completed = currentLineIndex;
	const total = lines.length;

	progressStatus.textContent = `${completed} out of ${total} lines complete`;
}


function expandPunctuationForSpeech(text) {
	if (!speakPunctuation) {
		return text;
	}

	return text
		.replace(/</g, ' less than ')
		.replace(/>/g, ' greater than ')
		.replace(/{/g, ' open brace ')
		.replace(/}/g, ' close brace ')
		.replace(/\(/g, ' open parenthesis ')
		.replace(/\)/g, ' close parenthesis ')
		.replace(/;/g, ' semicolon ')
		.replace(/,/g, ' comma ')
		.replace(/\./g, ' period ');
}



function queueSpeak(text) {
	speakChain = speakChain.then(() => speak(text));
	return speakChain;
}

function resetSpeakQueue() {
	speakChain = Promise.resolve();
}

function errorKeysToString() {
	return Array.from(errorKeys).join(', ');
}


function populateContentSetSelect() {
	const select = document.getElementById('contentSetSelect');
	if (!select) {
		return;
	}

	select.innerHTML = '';

	typingContentSets.forEach((set) => {
		const option = document.createElement('option');
		option.value = set.id;
		option.textContent = set.title;
		select.appendChild(option);
	});
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

	resetSpeakQueue();
	await speak(expandPunctuationForSpeech(line));
}

async function promptChar() {
	const line = lines[currentLineIndex];
	if (!line) {
		return;
	}

	const char = line[currentCharIndex];
	resetSpeakQueue();
	await speak(getSpokenChar(char));
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

	let linesArr = [];

	if (text.includes('\n')) {
		linesArr = text.split('\n');
	} else {
		linesArr = text.split(/(?<=[.!?])\s+/);
	}

	linesArr = linesArr
		.map(line => line.trim())
		.filter(line => line.length > 0);

	return linesArr.slice(0, MAX_CUSTOM_LINES);
}

function enforceLineLimit(textarea) {
	if (!textarea) {
		return;
	}

	const raw = textarea.value.replace(/\r\n?/g, '\n');
	const linesArr = raw.split('\n');

	if (linesArr.length <= MAX_CUSTOM_LINES) {
		return;
	}

	textarea.value = linesArr.slice(0, MAX_CUSTOM_LINES).join('\n');
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

function startTypingLesson() {
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
	updateProgressStatus();


	totalKeystrokes = 0;
	errors = 0;
	errorKeys.clear();

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
		await speak(expandPunctuationForSpeech(`Phrase complete: ${lineDoneText}`));
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
		errorKeys.add(expected);
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
					queueSpeak(expandPunctuationForSpeech(lastWord));
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
		updateProgressStatus();
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

function finishGame() {
	gameState = 'RESULTS';
	setScreenState('RESULTS');
	if (activeContentTitle) {
	document.title = `${activeContentTitle} Typing Results - Roll With It`;
} else {
	document.title = 'Typing Results - Roll With It';
}

const resultsHeading = document.getElementById('resultsHeading');
if (resultsHeading) {
	if (activeContentTitle) {
		resultsHeading.textContent = `${activeContentTitle} Typing Results`;
	} else {
		resultsHeading.textContent = 'Typing Results';
	}
	resultsHeading.focus();
}
	let errLabel = document.getElementById('errLabel');
	let desertLabel = document.getElementById('desertLabel');
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
	const errVal = document.getElementById('err-val');
	const desertVal = document.getElementById('desert-val');

	if (wpmVal) {
		wpmVal.textContent = `${wpm}`;
	}
	if (accVal) {
		accVal.textContent = `${acc}%`;
	}
	if (errVal) {
		errVal.textContent = `${errors}`;
	}

	if (errorKeys.size === 0) {
		desertLabel.textContent = "No keys deserted you this time!";
		desertVal.textContent = '';
	} else {
		desertLabel.textContent = "Practice these keys so they don't desert you again: ";
		desertVal.textContent = errorKeysToString();
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

let activeContentTitle = '';
let speakPunctuation = false;


function getRandomContentSet() {
	const index = Math.floor(Math.random() * typingContentSets.length);
	return typingContentSets[index];
}

function getSelectedContentSet() {
	const select = document.getElementById('contentSetSelect');
	if (!select) {
		return null;
	}

	return typingContentSets.find(set => set.id === select.value) || null;
}

function startBtnHandler() {
	if (gameState !== 'MENU') {
		return;
	}

	if (contentMode === 'original') {
		const set = getRandomContentSet();
		lyricsText = set.lines.join('\n');
		activeContentTitle = set.title;
		speakPunctuation = set.type === 'code';
	}

	if (contentMode === 'set') {
		const set = getSelectedContentSet();
		if (!set) {
			return;
		}

		lyricsText = set.lines.join('\n');
		activeContentTitle = set.title;
		speakPunctuation = set.type === 'code';
	}

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
		activeContentTitle = 'Custom Typing';
		speakPunctuation = false;
	}

	gameState = 'PLAYING';
	setScreenState('PLAYING');
	if (activeContentTitle) {
		document.title = `${activeContentTitle} - Roll With It`;
	}


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
	const closeResultsButton = document.getElementById('closeResultsButton');

	if (startLessonButton) {
		startLessonButton.addEventListener('click', startBtnHandler);
	}

	if (exitLessonButton) {
		exitLessonButton.addEventListener('click', exitBtnHandler);
	}

	if (closeResultsButton) {
		closeResultsButton.addEventListener('click', () => {
			if (gameState !== 'RESULTS') {
				return;
			}

			gameState = 'MENU';
			setScreenState('MENU');
			document.getElementById('startLessonButton')?.focus();
		});
	}
}

function initTypingSettings() {
	const contentModeOriginal = document.getElementById('contentModeOriginal');
	const contentModeSet = document.getElementById('contentModeSet');
	const contentModeCustom = document.getElementById('contentModeCustom');

	const contentSetFieldset = document.getElementById('contentSetFieldset');
	const customContentFieldset = document.getElementById('customContentFieldset');

	const typingModeGuided = document.getElementById('typingModeGuided');
	const typingModeSentence = document.getElementById('typingModeSentence');
	const sentenceSpeechOptions = document.getElementById('sentenceSpeechOptions');
	const customContentInput = document.getElementById('customContentInput');

	populateContentSetSelect();

	if (typingModeGuided) {
		typingModeGuided.addEventListener('change', () => {
			if (typingModeGuided.checked) {
				typingMode = 'guided';

				if (sentenceSpeechOptions) {
					sentenceSpeechOptions.disabled = true;
				}
			}
		});
	}

	if (typingModeSentence) {
		typingModeSentence.addEventListener('change', () => {
			if (typingModeSentence.checked) {
				typingMode = 'sentence';

				if (sentenceSpeechOptions) {
					sentenceSpeechOptions.disabled = false;
				}
			}
		});
	}

if (contentModeOriginal) {
	contentModeOriginal.addEventListener('change', () => {
		if (contentModeOriginal.checked) {
			contentMode = 'original';
			contentSetFieldset.disabled = true;
			customContentFieldset.disabled = true;
		}
	});
}

if (contentModeSet) {
	contentModeSet.addEventListener('change', () => {
		if (contentModeSet.checked) {
			contentMode = 'set';
			contentSetFieldset.disabled = false;
			customContentFieldset.disabled = true;
		}
	});
}

if (contentModeCustom) {
	contentModeCustom.addEventListener('change', () => {
		if (contentModeCustom.checked) {
			contentMode = 'custom';
			contentSetFieldset.disabled = true;
			customContentFieldset.disabled = false;
		}
	});
}

/* Initial state sync */
if (contentModeSet && contentModeSet.checked) {
	contentMode = 'set';
	contentSetFieldset.disabled = false;
	customContentFieldset.disabled = true;
}

if (contentModeOriginal && contentModeOriginal.checked) {
	contentMode = 'original';
	contentSetFieldset.disabled = true;
	customContentFieldset.disabled = true;
}

if (contentModeCustom && contentModeCustom.checked) {
	contentMode = 'custom';
	contentSetFieldset.disabled = true;
	customContentFieldset.disabled = false;
}

if (customContentInput) {
	customContentInput.addEventListener('input', () => {
		enforceLineLimit(customContentInput);
		clearCustomContentError();
	});
}
if (typingModeSentence && typingModeSentence.checked) {
	typingMode = 'sentence';

	if (sentenceSpeechOptions) {
		sentenceSpeechOptions.disabled = false;
	}
}

if (typingModeGuided && typingModeGuided.checked) {
	typingMode = 'guided';

	if (sentenceSpeechOptions) {
		sentenceSpeechOptions.disabled = true;
	}
}

}


function init() {
	initTypingSettings();
	initInputHooks();
	initButtons();
	initFooterYear();
}

init();
