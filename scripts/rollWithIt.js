const apiKey = "";
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

// --- GAME START (New explicit entry point) ---
function startTypingLesson() {
	if (gameState !== 'MENU') {
		return;
	}

	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	lines = lyricsText.split('\n').filter(l => l.trim());
	gameState = 'PLAYING';
	startTime = Date.now();

	const gameScreen = document.getElementById('game-screen');
	gameScreen.classList.remove('hidden');

	captureInput.focus();
	render();
	promptChar();
}

// --- Gemini API (For Generative tasks only) ---
async function callGemini(prompt, systemInstruction = "") {
	const payload = {
		contents: [{ parts: [{ text: prompt }] }],
		systemInstruction: systemInstruction
			? { parts: [{ text: systemInstruction }] }
			: undefined
	};

	try {
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			}
		);

		const data = await response.json();
		return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
	} catch (e) {
		return "";
	}
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

async function finishGame() {
	gameState = 'RESULTS';

	const mins = (Date.now() - startTime) / 60000;
	const wpm = Math.round(((totalKeystrokes - errors) / 5) / mins) || 0;
	const acc =
		Math.round(
			((totalKeystrokes - errors) / Math.max(1, totalKeystrokes)) * 100
		) || 0;

	document.getElementById('game-screen').classList.add('hidden');
	document.getElementById('results-screen').classList.remove('hidden');

	document.getElementById('wpm-val').textContent = `${wpm}`;
	document.getElementById('accuracy-val').textContent = `${acc}%`;

	const review = await callGemini(
		`Speed: ${wpm}, Acc: ${acc}%. Give 2 sentences of encouragement.`,
		"Friendly typing coach."
	);

	document.getElementById('ai-feedback-text').textContent = review;
	speak(review);
}

// Wire Start Typing Lesson button
document
	.getElementById('startLessonButton')
	.addEventListener('click', startTypingLesson);

// Populate voices list for iOS
window.speechSynthesis.onvoiceschanged = () => {
	window.speechSynthesis.getVoices();
};
