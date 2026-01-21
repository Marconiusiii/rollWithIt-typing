// Roll With It Typing Tutor by Chancey Fleet and Marco Salsiccia

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
			'The story ends... for now.'
		]
	},
	{
		id: 'cats',
		title: 'Cat Typing Detected',
		lines: [
			'The cat watched the cursor blink.',
			'Soft paws crossed the keyboard.',
			'A tail flicked near the screen.',
			'The cat typed nothing on purpose.',
			'Whiskers twitched at every sound.',
			'A nap followed intense focus.',
			'The cat claimed the chair.',
			'Keys warmed under gentle paws.',
			'The screen reflected curious eyes.',
			'Typing paused for purring.'
		]
	},
	{
		id: 'dogs',
		title: 'Dogs',
		lines: [
			'The dog waited by the desk.',
			'A wagging tail hit the chair.',
			'Ears perked at every beep.',
			'The dog approved of progress.',
			'Typing stopped for a treat.',
			'Paws paced across the floor.',
			'The screen earned a curious sniff.',
			'The dog settled nearby.',
			'Keys clicked in steady rhythm.',
			'A nap followed good work.'
		]
	},
	{
		id: 'guide-dogs',
		title: 'Guide Dogs',
		lines: [
			'The guide dog rested calmly.',
			'Focus mattered at every step.',
			'Trust moved them forward together.',
			'The harness stayed gently still.',
			'Training turned care into skill.',
			'The path ahead felt familiar.',
			'Signals mattered more than words.',
			'The dog waited for direction.',
			'Movement followed quiet cues.',
			'The team paused, confident.'
		]
	},
	{
		id: 'art-puns',
		title: 'Art (may have Puns)',
		lines: [
			'The artist drew a blank on purpose.',
			'This sketch really paints a picture.',
			'I canvas believe how well this typed.',
			'That idea was framed perfectly.',
			'The brush stroked everyone the right way.',
			'Abstract thoughts made concrete lines.',
			'The gallery gave standing ovations.',
			'This sentence is a work in progress.',
			'The colors argued, then found balance.',
			'Art history repeats itself, stylishly.'
		]
	},
	{
		id: 'foodies',
		title: 'Typing for Foodies',
		lines: [
			'The menu reads like a love letter.',
			'Seasoning mattered more than speed.',
			'The sauce finally found balance.',
			'A perfect bite deserved a pause.',
			'Textures told the real story.',
			'The chef trusted simple ingredients.',
			'Plating turned dinner into art.',
			'Flavors lingered between words.',
			'A recipe evolved with practice.',
			'The last bite earned silence.'
		]
	},
	{
		id: 'food',
		title: 'Typing while Hungry',
		lines: [
			'Breakfast started the day gently.',
			'Soup warmed the room.',
			'Bread baked slowly.',
			'Lunch arrived right on time.',
			'Snacks disappeared quickly.',
			'Dinner brought everyone together.',
			'Leftovers waited patiently.',
			'Spices filled the air.',
			'Cooking felt familiar.',
			'The meal ended happily.'
		]
	},
	{
		id: 'space',
		title: 'Space and Planets',
		lines: [
			'Planets drifted across the screen.',
			'Orbits followed silent rules.',
			'A comet passed without warning.',
			'Stars blinked like distant pixels.',
			'Gravity held everything together.',
			'The moon waited patiently.',
			'Mars glowed a dusty red.',
			'Saturn balanced fragile rings.',
			'Space stretched beyond sight.',
			'The universe typed quietly.'
		]
	},
	{
		id: 'history',
		title: 'History',
		lines: [
			'History remembers small details.',
			'Stories survived careful writing.',
			'Time changed the meaning of words.',
			'Ink once carried every thought.',
			'Letters traveled long distances.',
			'Pages outlived their authors.',
			'Records shaped our memory.',
			'The past typed slowly.',
			'Voices echoed through time.',
			'The story continued forward.'
		]
	},
	{
		id: 'chemistry',
		title: 'Chemistry',
		lines: [
			'Atoms moved in steady patterns.',
			'Bonds formed with quiet force.',
			'Reactions required patience.',
			'Elements lined the table.',
			'Heat changed everything.',
			'Solutions mixed carefully.',
			'The formula balanced out.',
			'Measurements mattered deeply.',
			'Results surprised everyone.',
			'The experiment concluded.'
		]
	},
	{
		id: 'fun-and-games',
		title: 'Fun and Games',
		lines: [
			'The game began with a click.',
			'Rules were learned quickly.',
			'Focus sharpened with play.',
			'A mistake caused laughter.',
			'Timing mattered most.',
			'The challenge increased slowly.',
			'Victory felt satisfying.',
			'Defeat taught patience.',
			'Practice improved results.',
			'The game ended happily.'
		]
	},
	{
		id: 'rock-bands',
		title: 'Rock Bands',
		lines: [
			'The Beatles',
			'The Rolling Stones',
			'Pink Floyd',
			'Queen',
			'The Who',
			'Eagles',
			'The Beach Boys',
			'Abba',
			'Heart',
			'Steely Dan',
			'Led Zeppelin',
			'Bon Jovi',
			'Van Halen',
			'ZZ Top',
			'Negativland',
			'Foo Fighters',
			'Green Day',
			'Red Hot Chili Peppers',
			'Shinedown',
			'Nirvana'
		]
	},
	{
		id: 'musicians',
		title: 'Famous Musicians',
		lines: [
			'John Lennon',
			'Paul McCartney',
			'Ringo Starr',
			'George Harrison',
			'Les Paul',
			'Bob Dylan',
			'Madonna',
			'Kate Bush',
			'Michael Jackson',
			'David Bowie',
			'Taylor Swift',
			'Rihanna',
			'Beyonce',
			'Lady Gaga',
			'Imogen Heap',
			'Beth Gibbons',
			'Ariana Grande',
			'Michelle Branch',
			'Trent Reznor',
			'Kurt Cobain'
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
		id: 'python-fundamentals',
		title: 'Python Fundamentals',
		type: 'code',
		lines: [
			'print("Hello, world")',
			'x = 10',
			'y = x + 5',
			'if x > 5:',
			'for i in range(5):',
			'def add(a, b):',
			'return a + b',
			'mylist = [1, 2, 3]',
			'myDictionary = {"a": 1, "b": 2}',
			'result = add(x, y)'
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

//App States

let lyricsText = '';

const isChrome =
	navigator.vendor === 'Google Inc.' &&
	/Chrome/.test(navigator.userAgent) &&
	!/Edg/.test(navigator.userAgent);

let lines = [];
let currentLineIndex = 0;
let currentCharIndex = 0;

let gameState = 'MENU';
let typingMode = 'guided';
let sentenceSpeechMode = 'errors';
let contentMode = 'original';
let selectedVoiceName = null;
let selectedVoiceRatePercent = 30;
let activeContentTitle = '';
let speakPunctuation = false;
let shouldSpeakInitialPrompt = true;
let charSpeechBuffer = '';
let charSpeechFramePending = false;

function chromeSpeechIsBusy() {
	if (!isChrome || !window.speechSynthesis) {
		return false;
	}

	return window.speechSynthesis.speaking || window.speechSynthesis.pending;
}

let speakAllPunctuation = false;
let soundEffectsEnabled = true;
let lastErrorCharIndexSpoken = null;

let totalKeystrokes = 0;
let errors = 0;
let errorKeys = new Set();

let typingStartTime = null;
let totalTypingTime = 0;

const MAX_CUSTOM_LINES = 40;

const progressStatus = document.getElementById('progressStatus');

const activatorInput = document.getElementById('keyboard-activator');
const captureSurface = document.getElementById('keyboard-capture');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let isSpeaking = false;
let cachedVoices = [];
let speakChain = Promise.resolve();
let inputChain = Promise.resolve();

function queueCharacterInput(char) {
	inputChain = inputChain.then(() => handleCharacterInput(char));
	return inputChain;
}

const punctuationMap = {
	"'": "apostrophe",
	",": "comma",
	".": "period",
	"-": "hyphen",
	"!": "exclamation mark",
	"?": "question mark",
	" ": "space"
};

function getSystemLanguagePrefix() {
	const lang = navigator.language || navigator.userLanguage;
	if (!lang) {
		return null;
	}

	return lang.split('-')[0].toLowerCase();
}

function populateVoiceSelect() {
	const select = document.getElementById('voiceSelect');
	if (!select || !window.speechSynthesis) {
		return;
	}

	const voices = window.speechSynthesis.getVoices();
	const systemLang = getSystemLanguagePrefix();

	select.innerHTML = '';

	const defaultOption = document.createElement('option');
	defaultOption.value = '';
	defaultOption.textContent = 'System default';
	select.appendChild(defaultOption);

	let filteredVoices = voices;

	if (systemLang) {
		const systemLangVoices = voices.filter(v =>
			typeof v.lang === 'string' &&
			v.lang.toLowerCase().startsWith(systemLang)
		);

		// Only apply filter if it yields something
		if (systemLangVoices.length > 0) {
			filteredVoices = systemLangVoices;
		}
	}

	filteredVoices.forEach(voice => {
		const option = document.createElement('option');
		option.value = voice.name;
		option.textContent = `${voice.name} (${voice.lang})`;
		select.appendChild(option);
	});

	if (selectedVoiceName) {
		select.value = selectedVoiceName;
	}
}

function resolveCurrentVoiceByName(name) {
	if (!name || !window.speechSynthesis) {
		return null;
	}

	const voices = window.speechSynthesis.getVoices();
	return voices.find(v => v.name === name) || null;
}


function getSpeechRateFromPercent(percent) {
	const minRate = 0.6;
	const maxRate = 2.5;

	const clampedPercent = Math.max(0, Math.min(100, percent));
	return minRate + (clampedPercent / 100) * (maxRate - minRate);
}

function updateProgressStatus() {
	if (!progressStatus || !lines || lines.length === 0) {
		return;
	}

	const completed = currentLineIndex;
	const total = lines.length;

	progressStatus.textContent = `${completed} out of ${total} lines complete`;
}
function waitForSpeechReset() {
	return new Promise(resolve => setTimeout(resolve, 50));
}

function expandPunctuationForSpeech(text) {
	return text
		.replace(/“|”/g, ' quote ')
		.replace(/"/g, ' quote ')
		.replace(/’/g, ' apostrophe ')
		.replace(/'/g, ' apostrophe ')
		.replace(/</g, ' less than ')
		.replace(/>/g, ' greater than ')
		.replace(/{/g, ' left brace ')
		.replace(/}/g, ' right brace ')
		.replace(/\[/g, ' left bracket ')
		.replace(/\]/g, ' right bracket ')
		.replace(/\@/g, ' at ')
		.replace(/\#/g, ' number sign ')
		.replace(/\(/g, ' left parenthesis ')
		.replace(/\)/g, ' right parenthesis ')
		.replace(/;/g, ' semicolon ')
		.replace(/:/g, ' colon ')
		.replace(/,/g, ' comma ')
		.replace(/\./g, ' period ')
		.replace(/\?/g, ' question mark ')
		.replace(/!/g, ' exclamation mark ')
		.replace(/-/g, ' hyphen ');
}

function unlockSpeechSynthesis() {
	if (!window.speechSynthesis) {
		return;
	}

	const utterance = new SpeechSynthesisUtterance(' ');
	utterance.rate = getSpeechRateFromPercent(selectedVoiceRatePercent);

	utterance.volume = 0;

	window.speechSynthesis.speak(utterance);
}

function queueSpeak(text) {
	speakChain = speakChain.then(() => speak(text));
	return speakChain;
}

function resetSpeakQueue() {
	speakChain = Promise.resolve();
}

function cancelSpeechIfSpeaking() {
	if (window.speechSynthesis && isSpeaking) {
		window.speechSynthesis.cancel();
	}
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

function loadVoicesOnce() {
	if (!window.speechSynthesis) {
		return;
	}

	const voices = window.speechSynthesis.getVoices();
	if (voices.length > 0) {
		cachedVoices = voices;
		populateVoiceSelect();
	}
}

function queueCharSpeech(char) {
	charSpeechBuffer += char;

	if (charSpeechFramePending) {
		return;
	}

	charSpeechFramePending = true;

	requestAnimationFrame(() => {
		charSpeechFramePending = false;

		if (!charSpeechBuffer) {
			return;
		}

		const toSpeak = charSpeechBuffer;
		charSpeechBuffer = '';

		queueSpeak(toSpeak);
	});
}
function hardResetSpeechSynthesis() {
	if (!window.speechSynthesis) {
		return;
	}

	// Cancel anything currently happening
	try {
		window.speechSynthesis.cancel();
	} catch (e) {}

	// Clear internal JS state
	isSpeaking = false;
	speakChain = Promise.resolve();

	// Chrome-specific kick: enqueue and immediately cancel
	// This often reinitializes the engine without restart
	try {
		const kick = new SpeechSynthesisUtterance(' ');
		kick.volume = 0;
		window.speechSynthesis.speak(kick);
		window.speechSynthesis.cancel();
	} catch (e) {}

	// Optional audible confirmation for users
	// (only if speech is actually alive)
	setTimeout(() => {
		try {
			const confirm = new SpeechSynthesisUtterance('Speech reset.');
			confirm.rate = getSpeechRateFromPercent(selectedVoiceRatePercent);

			const voice = selectedVoiceName
				? resolveCurrentVoiceByName(selectedVoiceName)
				: null;

			if (voice) {
				confirm.voice = voice;
			}

			window.speechSynthesis.speak(confirm);
		} catch (e) {}
	}, 100);
}

function speakCharCutover(spokenChar) {
	cancelSpeechIfSpeaking();
	resetSpeakQueue();
	speak(spokenChar);
}

function speak(text) {
	return new Promise((resolve) => {
		isSpeaking = true;

		let textToSpeak = text;

		if (speakAllPunctuation || speakPunctuation) {
			textToSpeak = expandPunctuationForSpeech(textToSpeak);
		}

		const utterance = new SpeechSynthesisUtterance(textToSpeak);
utterance.rate = getSpeechRateFromPercent(selectedVoiceRatePercent);

let voice = null;

if (selectedVoiceName) {
	voice = resolveCurrentVoiceByName(selectedVoiceName);
}

if (voice) {
	utterance.voice = voice;
}
// If voice is null, do NOT set utterance.voice at all
// Chrome will safely fall back to system default
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

function speakExpectedWord() {
	const line = lines[currentLineIndex];
	if (!line) {
		return;
	}

	const word = getExpectedWord(line, currentCharIndex);
	if (!word) {
		return;
	}

	cancelSpeechIfSpeaking();
	resetSpeakQueue();
	speak(word);
}

function replayExpectedChar() {
	const line = lines[currentLineIndex];
	if (!line) {
		return;
	}

	const expected = line[currentCharIndex];
	if (typeof expected !== 'string') {
		return;
	}

	speakCharCutover(`${getSpokenChar(expected)} `);
}

function playTypewriterBell() {
	if (!soundEffectsEnabled) {
		return;
	}

	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	const now = audioCtx.currentTime;

	const strikeOsc = audioCtx.createOscillator();
	const bodyOsc = audioCtx.createOscillator();
	const bassOsc = audioCtx.createOscillator();

	const strikeGain = audioCtx.createGain();
	const bodyGain = audioCtx.createGain();
	const bassGain = audioCtx.createGain();

	strikeOsc.type = 'triangle';
	bodyOsc.type = 'sine';
	bassOsc.type = 'sine';

	strikeOsc.frequency.setValueAtTime(1800, now);
	bodyOsc.frequency.setValueAtTime(720, now);
	bassOsc.frequency.setValueAtTime(160, now);

	strikeOsc.detune.setValueAtTime(6, now);
	bodyOsc.detune.setValueAtTime(-4, now);

	strikeGain.gain.setValueAtTime(0, now);
	strikeGain.gain.linearRampToValueAtTime(0.15, now + 0.005);
	strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

	bodyGain.gain.setValueAtTime(0, now);
	bodyGain.gain.linearRampToValueAtTime(0.22, now + 0.02);
	bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

	bassGain.gain.setValueAtTime(0, now);
	bassGain.gain.linearRampToValueAtTime(0.12, now + 0.03);
	bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

	strikeOsc.connect(strikeGain);
	bodyOsc.connect(bodyGain);
	bassOsc.connect(bassGain);

	strikeGain.connect(audioCtx.destination);
	bodyGain.connect(audioCtx.destination);
	bassGain.connect(audioCtx.destination);

	strikeOsc.start(now);
	bodyOsc.start(now);
	bassOsc.start(now);

	strikeOsc.stop(now + 0.3);
	bodyOsc.stop(now + 1.0);
	bassOsc.stop(now + 0.6);
}

function playFinalRickChordProgression() {
	if (!soundEffectsEnabled) {
		return;
	}

	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	const now = audioCtx.currentTime;

	const tempo = 114;
	const beat = 60 / tempo;
	const sixteenth = beat / 4;

	const pickupNotes = [
		349.23,	// F4
		392.00,	// G4
		349.23,	// F4
		261.63	// C4
	];

	const bassNotes = [
		174.61,	// F3
		196.00,	// G3
		174.61,	// F3
		130.81	// C3
	];

	pickupNotes.forEach((freq, index) => {
		const startTime = now + index * sixteenth;

		const leadOsc = audioCtx.createOscillator();
		const leadGain = audioCtx.createGain();

		const bassOsc = audioCtx.createOscillator();
		const bassGain = audioCtx.createGain();

		leadOsc.type = 'sawtooth';
		bassOsc.type = 'triangle';

		if (index === 0) {
			leadOsc.frequency.setValueAtTime(freq * 0.985, startTime);
			leadOsc.frequency.linearRampToValueAtTime(freq, startTime + 0.03);
		} else {
			leadOsc.frequency.setValueAtTime(freq, startTime);
		}

		bassOsc.frequency.setValueAtTime(bassNotes[index], startTime);

		const leadPeak = index === 0 ? 0.1 : 0.07;

		leadGain.gain.setValueAtTime(0, startTime);
		leadGain.gain.linearRampToValueAtTime(leadPeak, startTime + 0.008);
		leadGain.gain.exponentialRampToValueAtTime(0.001, startTime + sixteenth * 0.85);

		bassGain.gain.setValueAtTime(0, startTime);
		bassGain.gain.linearRampToValueAtTime(0.14, startTime + 0.008);
		bassGain.gain.exponentialRampToValueAtTime(0.001, startTime + sixteenth * 0.6);

		leadOsc.connect(leadGain);
		bassOsc.connect(bassGain);

		leadGain.connect(audioCtx.destination);
		bassGain.connect(audioCtx.destination);

		leadOsc.start(startTime);
		bassOsc.start(startTime);

		leadOsc.stop(startTime + sixteenth);
		bassOsc.stop(startTime + sixteenth);
	});

	const finalStart = now + pickupNotes.length * sixteenth;

	const finalLeadOsc = audioCtx.createOscillator();
	const finalLeadGain = audioCtx.createGain();

	const finalBassOsc = audioCtx.createOscillator();
	const finalBassGain = audioCtx.createGain();

	const vibratoOsc = audioCtx.createOscillator();
	const vibratoGain = audioCtx.createGain();

	finalLeadOsc.type = 'sawtooth';
	finalBassOsc.type = 'triangle';

	finalLeadOsc.frequency.setValueAtTime(523.25, finalStart);	// C5
	finalBassOsc.frequency.setValueAtTime(130.81, finalStart);	// C3

	vibratoOsc.type = 'sine';
	vibratoOsc.frequency.setValueAtTime(6.2, finalStart);
	vibratoGain.gain.setValueAtTime(16, finalStart);

	vibratoOsc.connect(vibratoGain);
	vibratoGain.connect(finalLeadOsc.frequency);

	finalLeadGain.gain.setValueAtTime(0, finalStart);
	finalLeadGain.gain.linearRampToValueAtTime(0.15, finalStart + 0.03);
	finalLeadGain.gain.exponentialRampToValueAtTime(0.001, finalStart + beat * 2.2);

	finalBassGain.gain.setValueAtTime(0, finalStart);
	finalBassGain.gain.linearRampToValueAtTime(0.2, finalStart + 0.03);
	finalBassGain.gain.exponentialRampToValueAtTime(0.001, finalStart + beat * 2.2);

	finalLeadOsc.connect(finalLeadGain);
	finalBassOsc.connect(finalBassGain);

	finalLeadGain.connect(audioCtx.destination);
	finalBassGain.connect(audioCtx.destination);

	finalLeadOsc.start(finalStart);
	finalBassOsc.start(finalStart);
	vibratoOsc.start(finalStart);

	finalLeadOsc.stop(finalStart + beat * 2.3);
	finalBassOsc.stop(finalStart + beat * 2.3);
	vibratoOsc.stop(finalStart + beat * 2.3);
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

	if (typingMode === 'sentence') {
		container.textContent = line;
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

function getExpectedWord(line, charIndex) {
	if (!line || charIndex >= line.length) {
		return '';
	}

	let start = charIndex;
	let end = charIndex;

	while (start > 0 && line[start - 1] !== ' ') {
		start--;
	}

	while (end < line.length && line[end] !== ' ') {
		end++;
	}

	return line.slice(start, end).trim();
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
	cancelSpeechIfSpeaking();
	resetSpeakQueue();
	await waitForSpeechReset();
	await speak(line);
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

	if (shouldSpeakInitialPrompt) {
		if (typingMode === 'guided') {
			promptChar();
		} else {
			speakLineOnce();
		}
	}
}

async function handleLineDone(lineDoneText) {
	const isFinalLine = currentLineIndex >= lines.length;

	if (!isFinalLine) {
		playTypewriterBell();
	} else {
		playFinalRickChordProgression();
		setTimeout(() => {
			finishGame();
		}, 1500);
		return;
	}

	render();

	if (typingMode === 'guided') {
		await promptChar();
	} else {
		await speakLineOnce();
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

	if (lastErrorCharIndexSpoken !== currentCharIndex) {
		lastErrorCharIndexSpoken = currentCharIndex;

		if (typingMode === 'guided') {
			promptChar();
		} else {
			speakCharCutover(`${getSpokenChar(expected)} `);
		}
	}

	return;
}

	if (currentCharIndex === 0 && typingStartTime === null) {
		typingStartTime = Date.now();
	}

	currentCharIndex++;
	lastErrorCharIndexSpoken = null;

	if (typingMode === 'sentence') {
		if (sentenceSpeechMode === 'characters' || sentenceSpeechMode === 'both') {
			speakCharCutover(`${getSpokenChar(char)} `);
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
			queueCharacterInput(ch);
		}
	}
}

function handleKeyDown(e) {
	if (gameState !== 'PLAYING') {
		return;
	}
	// Ctrl + Shift + R : reset speech (Chrome only)
if (isChrome && e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
	e.preventDefault();
	hardResetSpeechSynthesis();
	return;
}
if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'w') {
	e.preventDefault();
	speakExpectedWord();
	return;
}

		if (e.key === '\\') {
		e.preventDefault();
		queueCharacterInput('\\');
		return;
	}

// Shift + backtick (~): replay expected character
if (e.key === '~') {
	e.preventDefault();
	replayExpectedChar();
	return;
}

	if (e.key === '`') {
		e.preventDefault();
		speakLineOnce();
		return;
	}

	if (e.key.length === 1) {
		e.preventDefault();
		queueCharacterInput(e.key);
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
	unlockSpeechSynthesis();


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
const resetSpeechButton = document.getElementById('resetSpeechButton');

if (resetSpeechButton) {
	if (isChrome) {
		resetSpeechButton.addEventListener('click', () => {
			hardResetSpeechSynthesis();
		});
	} else {
		// Hide in non-Chrome browsers
		resetSpeechButton.style.display = 'none';
	}
}

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
	const punctToggle = document.getElementById('punctToggle');
	if (punctToggle) {
		speakAllPunctuation = punctToggle.checked;
		punctToggle.addEventListener('change', () => {
			speakAllPunctuation = punctToggle.checked;
		});
	}
	const voiceSelect = document.getElementById('voiceSelect');

	if (voiceSelect) {
		voiceSelect.addEventListener('change', () => {
			selectedVoiceName = voiceSelect.value;
			localStorage.setItem('preferredVoice', selectedVoiceName);
		});
	}

const voiceRateNumber = document.getElementById('voiceRateNumber');
const playVoiceSampleBtn = document.getElementById('playVoiceSample');

if (voiceRateNumber) {
	voiceRateNumber.value = selectedVoiceRatePercent;

	voiceRateNumber.addEventListener('input', () => {
		let value = parseInt(voiceRateNumber.value, 10);

		if (isNaN(value)) {
			return;
		}

		value = Math.max(0, Math.min(100, value));
		selectedVoiceRatePercent = value;

		localStorage.setItem(
			'preferredVoiceRatePercent',
			selectedVoiceRatePercent
		);
	});
}

if (playVoiceSampleBtn) {
	playVoiceSampleBtn.addEventListener('click', () => {
		resetSpeakQueue();
		speak('Welcome to Roll With It Typing!');
	});
}

	const soundEffectsToggle = document.getElementById('soundEffectsToggle');

	if (soundEffectsToggle) {
		soundEffectsEnabled = soundEffectsToggle.checked;

		soundEffectsToggle.addEventListener('change', () => {
			soundEffectsEnabled = soundEffectsToggle.checked;
		});
	}

	const contentModeOriginal = document.getElementById('contentModeOriginal');
	const contentModeSet = document.getElementById('contentModeSet');
	const contentModeCustom = document.getElementById('contentModeCustom');

	const contentSetFieldset = document.getElementById('contentSetFieldset');
	const customContentFieldset = document.getElementById('customContentFieldset');

	const typingModeGuided = document.getElementById('typingModeGuided');
	const typingModeSentence = document.getElementById('typingModeSentence');
	const sentenceSpeechOptions = document.getElementById('sentenceSpeechOptions');

	const customContentInput = document.getElementById('customContentInput');
	const container = document.getElementById('lyrics-display');

	const sentenceSpeechErrors = document.getElementById('sentenceSpeechErrors');
	const sentenceSpeechCharacters = document.getElementById('sentenceSpeechChars');
	const sentenceSpeechWords = document.getElementById('sentenceSpeechWords');
	const sentenceSpeechBoth = document.getElementById('sentenceSpeechBoth');

	function syncSentenceSpeechModeFromUI() {
		if (sentenceSpeechCharacters?.checked) {
			sentenceSpeechMode = 'characters';
			return;
		}
		if (sentenceSpeechWords?.checked) {
			sentenceSpeechMode = 'words';
			return;
		}
		if (sentenceSpeechBoth?.checked) {
			sentenceSpeechMode = 'both';
			return;
		}
		sentenceSpeechMode = 'errors';
	}

	sentenceSpeechErrors?.addEventListener('change', syncSentenceSpeechModeFromUI);
	sentenceSpeechCharacters?.addEventListener('change', syncSentenceSpeechModeFromUI);
	sentenceSpeechWords?.addEventListener('change', syncSentenceSpeechModeFromUI);
	sentenceSpeechBoth?.addEventListener('change', syncSentenceSpeechModeFromUI);

	populateContentSetSelect();

	if (typingModeGuided) {
		typingModeGuided.addEventListener('change', () => {
			if (typingModeGuided.checked) {
				typingMode = 'guided';

				if (container) {
					container.removeAttribute('role');
				}

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

				if (container) {
					container.setAttribute('role', 'text');
				}

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

	if (customContentInput) {
		customContentInput.addEventListener('input', () => {
			enforceLineLimit(customContentInput);
			clearCustomContentError();
		});
	}

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

	if (typingModeSentence && typingModeSentence.checked) {
		typingMode = 'sentence';

		if (container) {
			container.setAttribute('role', 'text');
		}

		if (sentenceSpeechOptions) {
			sentenceSpeechOptions.disabled = false;
		}
	}

	if (typingModeGuided && typingModeGuided.checked) {
		typingMode = 'guided';

		if (container) {
			container.removeAttribute('role');
		}

		if (sentenceSpeechOptions) {
			sentenceSpeechOptions.disabled = true;
		}
	}

	syncSentenceSpeechModeFromUI();
}

function init() {
	selectedVoiceName = localStorage.getItem('preferredVoice');
	const savedRatePercent = localStorage.getItem('preferredVoiceRatePercent');
	if (savedRatePercent !== null) {
		selectedVoiceRatePercent = parseInt(savedRatePercent, 10);
	}
	loadVoicesOnce();
	window.speechSynthesis.onvoiceschanged = loadVoicesOnce;

	initTypingSettings();
	initInputHooks();
	initButtons();
	initFooterYear();
}

init();
