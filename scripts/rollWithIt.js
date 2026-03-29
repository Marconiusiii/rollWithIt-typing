// Roll With It Typing Tutor by Chancey Fleet and Marco Salsiccia

import * as Metrics from './core/metrics.mjs';
import * as TextProcessing from './core/textProcessing.mjs';
import * as WordMode from './core/wordMode.mjs';
import * as Training from './core/training.mjs';
import { loadAppSettings, saveAppSetting } from './core/settings.mjs';
import * as SpeechRuntime from './core/speechRuntime.mjs';
import * as SfxRuntime from './core/sfxRuntime.mjs';
import * as ModeRuntime from './core/modeRuntime.mjs';

const typingContentSets = globalThis.typingContentSets || [];
const typingTrainingSets = globalThis.typingTrainingSets || {};
const persistedSettings = loadAppSettings(globalThis.localStorage);

let lyricsText = ``;

const isChrome =
	navigator.vendor === 'Google Inc.' &&
	/Chrome/.test(navigator.userAgent) &&
	!/Edg/.test(navigator.userAgent);

let lines = [];
let currentLineIndex = 0;
let currentCharIndex = 0;

let gameState = 'MENU';
let typingMode = persistedSettings.typingMode;
let sentenceSpeechMode = persistedSettings.sentenceSpeechMode;
let contentMode = persistedSettings.contentMode;
let selectedVoiceName = persistedSettings.selectedVoiceName || null;
let selectedVoiceRatePercent = persistedSettings.selectedVoiceRatePercent;
let selectedVoiceVolumePercent = persistedSettings.selectedVoiceVolumePercent;
let activeContentTitle = '';
let speakPunctuation = false;
let shouldSpeakInitialPrompt = true;
let charSpeechBuffer = '';
let charSpeechFramePending = false;
let selectedContentSetId = persistedSettings.selectedContentSetId;
let selectedTrainingRowId = persistedSettings.selectedTrainingRowId;

const contentModeRadios = document.querySelectorAll('input[name="contentMode"]');

const contentSetFieldset = document.getElementById('contentSetFieldset');
const customContentFieldset = document.getElementById('customContentFieldset');
const typingTrainingFieldset = document.getElementById('typingTrainingFieldset');
const contentSetSelect = document.getElementById('contentSetSelect');

const typingTrainingSelect = document.getElementById('typingTrainingSelect');


function chromeSpeechIsBusy() {
	if (!isChrome || !window.speechSynthesis) {
		return false;
	}

	return window.speechSynthesis.speaking || window.speechSynthesis.pending;
}

let speakAllPunctuation = persistedSettings.speakAllPunctuation;
let soundEffectsEnabled = persistedSettings.soundEffectsEnabled;
let lastErrorCharIndexSpoken = null;

let totalKeystrokes = 0;
let errors = 0;
let errorKeys = new Set();

let typingStartTime = null;
let totalTypingTime = 0;

const MAX_CUSTOM_LINES = TextProcessing.MAX_CUSTOM_LINES;

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
	"/": "slash",
	"\\": "backslash",
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

function populateTypingTrainingSelect() {
	if (!typingTrainingSelect) {
		return;
	}

	typingTrainingSelect.innerHTML = '';

	Object.values(typingTrainingSets).forEach(layout => {
		const optgroup = document.createElement('optgroup');
		optgroup.label = layout.name;

		Object.values(layout.rows).forEach(row => {
			const option = document.createElement('option');
			option.value = row.id;
			option.textContent = row.name;
			optgroup.appendChild(option);
		});

		typingTrainingSelect.appendChild(optgroup);
	});
}

function updateContentModeUIFromRadios() {
	let selectedMode = null;

	contentModeRadios.forEach(radio => {
		if (radio.checked) {
			selectedMode = radio.value;
		}
	});

	if (!selectedMode) {
		return;
	}

	// Default: disable everything
	if (contentSetFieldset) {
		contentSetFieldset.disabled = true;
	}
	if (customContentFieldset) {
		customContentFieldset.disabled = true;
	}
	if (typingTrainingFieldset) {
		typingTrainingFieldset.disabled = true;
	}

	// Enable only the active mode
	if (selectedMode === 'set' && contentSetFieldset) {
		contentSetFieldset.disabled = false;
	}

	if (selectedMode === 'custom' && customContentFieldset) {
		customContentFieldset.disabled = false;
	}

	if (selectedMode === 'training' && typingTrainingFieldset) {
		typingTrainingFieldset.disabled = false;
	}
}

contentModeRadios.forEach(radio => {
	radio.addEventListener('change', () => {
		updateContentModeUIFromRadios();
	});
});


function resolveCurrentVoiceByName(name) {
	if (!name || !window.speechSynthesis) {
		return null;
	}

	const voices = window.speechSynthesis.getVoices();
	return voices.find(v => v.name === name) || null;
}

function getRemainingLineText(line, charIndex) {
	if (!line || charIndex >= line.length) {
		return '';
	}

	return line.slice(charIndex);
}

function getSpeechRateFromPercent(percent) {
	const minRate = 0.6;
	const maxRate = 2.5;

	const clampedPercent = Math.max(0, Math.min(100, percent));
	return minRate + (clampedPercent / 100) * (maxRate - minRate);
}

function getSpeechVolumeFromPercent(percent) {
	const clampedPercent = Math.max(0, Math.min(100, percent));
	return clampedPercent / 100;
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
	utterance.volume = getSpeechVolumeFromPercent(selectedVoiceVolumePercent);

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
	if (!contentSetSelect) {
		return;
	}

	contentSetSelect.innerHTML = '';

	const nonCodeSets = [];
	const codeSets = [];

	for (const set of typingContentSets) {
		if (set.type === 'code') {
			codeSets.push(set);
		} else {
			nonCodeSets.push(set);
		}
	}

	for (const set of nonCodeSets) {
		const option = document.createElement('option');
		option.value = set.id;
		option.textContent = set.title;
		contentSetSelect.appendChild(option);
	}

	if (codeSets.length > 0) {
		const codingGroup = document.createElement('optgroup');
		codingGroup.label = 'Coding';

		for (const set of codeSets) {
			const option = document.createElement('option');
			option.value = set.id;
			option.textContent = set.title;
			codingGroup.appendChild(option);
		}

		contentSetSelect.appendChild(codingGroup);
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
	SpeechRuntime.loadVoicesOnce({
		speechSynthesis: window.speechSynthesis,
		setCachedVoices: (voices) => {
			cachedVoices = voices;
		},
		populateVoiceSelect
	});
}

function queueCharSpeech(char) {
	SpeechRuntime.queueCharSpeech({
		char,
		getCharSpeechBuffer: () => charSpeechBuffer,
		setCharSpeechBuffer: (value) => {
			charSpeechBuffer = value;
		},
		getCharSpeechFramePending: () => charSpeechFramePending,
		setCharSpeechFramePending: (value) => {
			charSpeechFramePending = value;
		},
		queueSpeak
	});
}
function hardResetSpeechSynthesis() {
	SpeechRuntime.hardResetSpeechSynthesis({
		speechSynthesis: window.speechSynthesis,
		setIsSpeaking: (value) => {
			isSpeaking = value;
		},
		resetSpeakChain: () => {
			speakChain = Promise.resolve();
		},
		getSpeechRateFromPercent,
		getSpeechVolumeFromPercent,
		selectedVoiceRatePercent,
		selectedVoiceVolumePercent,
		selectedVoiceName,
		resolveCurrentVoiceByName
	});
}

function speakCharCutover(spokenChar) {
	SpeechRuntime.speakCharCutover({
		spokenChar,
		cancelSpeechIfSpeaking,
		resetSpeakQueue,
		speak
	});
}

function speak(text) {
	return SpeechRuntime.speak({
		speechSynthesis: window.speechSynthesis,
		text,
		setIsSpeaking: (value) => {
			isSpeaking = value;
		},
		speakAllPunctuation,
		speakPunctuation,
		expandPunctuationForSpeech,
		getSpeechRateFromPercent,
		getSpeechVolumeFromPercent,
		selectedVoiceRatePercent,
		selectedVoiceVolumePercent,
		selectedVoiceName,
		resolveCurrentVoiceByName,
		cachedVoices
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

function speakRemainingLine() {
	SpeechRuntime.speakRemainingLine({
		lines,
		currentLineIndex,
		currentCharIndex,
		getRemainingLineText,
		cancelSpeechIfSpeaking,
		resetSpeakQueue,
		speak
	});
}

function speakExpectedWord() {
	SpeechRuntime.speakExpectedWord({
		lines,
		currentLineIndex,
		currentCharIndex,
		getExpectedWord,
		cancelSpeechIfSpeaking,
		resetSpeakQueue,
		speak
	});
}

function replayExpectedChar() {
	SpeechRuntime.replayExpectedChar({
		lines,
		currentLineIndex,
		currentCharIndex,
		getSpokenChar,
		speakCharCutover
	});
}

function playTypewriterBell() {
	SfxRuntime.playTypewriterBell({ audioCtx, soundEffectsEnabled });
}

function playIntroRickStinger() {
	SfxRuntime.playIntroRickStinger({ audioCtx, soundEffectsEnabled });
}

function playFinalRickChordProgression() {
	SfxRuntime.playFinalRickChordProgression({ audioCtx, soundEffectsEnabled });
}

function playBeep() {
	SfxRuntime.playBeep({ audioCtx, soundEffectsEnabled });
}

function render() {
	const container = document.getElementById('lyrics-display');
	const line = lines[currentLineIndex];
	ModeRuntime.renderTypingDisplay({
		container,
		line,
		typingMode,
		currentCharIndex,
		getWordRevealEnd: WordMode.getWordRevealEnd
	});
}

function getCurrentWordRange(line, charIndex) {
	return WordMode.getCurrentWordRange(line, charIndex);
}

function getCurrentWord(line, charIndex) {
	return WordMode.getCurrentWord(line, charIndex);
}

function isAtWordBoundary(line, charIndex) {
	return WordMode.isAtWordBoundary(line, charIndex);
}

async function speakCurrentWord() {
	const line = lines[currentLineIndex];
	await ModeRuntime.speakCurrentWordPrompt({
		line,
		currentCharIndex,
		getCurrentWord,
		resetSpeakQueue,
		speak
	});
}

function pauseTypingTimer() {
	totalTypingTime = Metrics.accumulateElapsedTime(totalTypingTime, typingStartTime);
	typingStartTime = null;
}

async function promptWord() {
	const line = lines[currentLineIndex];
	await ModeRuntime.promptWord({
		line,
		currentCharIndex,
		isAtWordBoundary,
		pauseTypingTimer,
		speakCurrentWordPrompt: speakCurrentWord
	});
}

function isWordEnd(line, index) {
	return WordMode.isWordEnd(line, index);
}

function getExpectedWord(line, charIndex) {
	return WordMode.getExpectedWord(line, charIndex);
}

function getLastWord(line, endIndex) {
	return WordMode.getLastWord(line, endIndex);
}

async function speakLineOnce() {
	const line = lines[currentLineIndex];
	await ModeRuntime.speakLinePrompt({
		line,
		cancelSpeechIfSpeaking,
		resetSpeakQueue,
		waitForSpeechReset,
		speak
	});
}

async function promptChar() {
	const line = lines[currentLineIndex];
	await ModeRuntime.promptCharacter({
		line,
		currentCharIndex,
		resetSpeakQueue,
		getSpokenChar,
		speak,
		speakAllPunctuation,
		speakPunctuation,
		expandPunctuationForSpeech
	});
}

function sanitizeText(rawText) {
	return TextProcessing.sanitizeText(rawText);
}

function buildLinesFromText(text) {
	return TextProcessing.buildLinesFromText(text, MAX_CUSTOM_LINES);
}

function enforceLineLimit(textarea) {
	if (!textarea) {
		return;
	}

	textarea.value = TextProcessing.enforceLineLimitValue(
		textarea.value,
		MAX_CUSTOM_LINES
	);
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

function getStartAnnouncementText() {
	if (contentMode === 'custom') {
		return 'Starting Custom Lesson';
	}

	if (activeContentTitle) {
		return `Starting ${activeContentTitle} Lesson`;
	}

	return 'Starting Lesson';
}

async function startTypingLesson() {
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
	playIntroRickStinger();

	if (shouldSpeakInitialPrompt) {
		cancelSpeechIfSpeaking();
		resetSpeakQueue();
		await waitForSpeechReset();
		await speak(getStartAnnouncementText());

		if (typingMode === 'guided') {
			await promptChar();
		} else if (typingMode === 'word') {
			await promptWord();
		} else {
			await speakLineOnce();
		}
	}
}

async function handleLineDone() {
	const isFinalLine = currentLineIndex >= lines.length;

	if (!isFinalLine) {
		if (contentMode !== 'training') {
			playTypewriterBell();
		}
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
	} else if (typingMode === 'word') {
		await promptWord();
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

	if (typingStartTime === null) {
		typingStartTime = Date.now();
	}

if (!matches) {
	errors++;
	errorKeys.add(expected);
	playBeep();

	if (lastErrorCharIndexSpoken !== currentCharIndex) {
		lastErrorCharIndexSpoken = currentCharIndex;

		if (typingMode === 'guided') {
			promptChar();
		} else if (typingMode === 'word') {
			speakCharCutover(`${getSpokenChar(expected)} `);
		} else {
			speakCharCutover(`${getSpokenChar(expected)} `);
		}
	}

	return;
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
		totalTypingTime = Metrics.accumulateElapsedTime(totalTypingTime, typingStartTime);
		typingStartTime = null;

		currentLineIndex++;
		updateProgressStatus();
		currentCharIndex = 0;

		await handleLineDone();
		return;
	}

	render();

	if (typingMode === 'guided') {
		promptChar();
	} else if (typingMode === 'word') {
		promptWord();
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

	const useCodingShortcuts =
		contentMode === 'training' ||
		(contentMode === 'set' && speakPunctuation === true);

	// Ctrl + Shift + R : reset speech (Chrome only)
if (isChrome && e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
	e.preventDefault();
	hardResetSpeechSynthesis();
	return;
}

	if (useCodingShortcuts) {
		// Ctrl + Backquote: repeat line
		if (e.ctrlKey && !e.shiftKey && e.code === 'Backquote') {
			e.preventDefault();
			speakLineOnce();
			return;
		}

		// Ctrl + Shift + Backquote: replay expected character
		if (e.ctrlKey && e.shiftKey && e.code === 'Backquote') {
			e.preventDefault();
			replayExpectedChar();
			return;
		}

		// Ctrl + Shift + Backslash: speak expected word
		if (e.ctrlKey && e.shiftKey && e.code === 'Backslash') {
			e.preventDefault();
			speakExpectedWord();
			return;
		}

		// Ctrl + Shift + Slash: speak remaining line
		if (e.ctrlKey && e.shiftKey && e.code === 'Slash') {
			e.preventDefault();
			speakRemainingLine();
			return;
		}

		// Ctrl + Backslash: exit lesson
		if (e.ctrlKey && !e.shiftKey && e.code === 'Backslash') {
			e.preventDefault();
			finishGame();
			return;
		}
	} else {
		if (e.key === '|') {
			e.preventDefault();
			speakExpectedWord();
			return;
		}

		if (e.key === '?') {
			e.preventDefault();
			speakRemainingLine();
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
	}

	if (e.ctrlKey || e.metaKey || e.altKey) {
		return;
	}

	if (e.key.length === 1) {
		e.preventDefault();
		queueCharacterInput(e.key);
	}
}

function finishGame() {
	totalTypingTime = Metrics.accumulateElapsedTime(totalTypingTime, typingStartTime);
	typingStartTime = null;

	gameState = 'RESULTS';
	setScreenState('RESULTS');

	if (contentMode === 'training') {
		document.title = 'Training Results - Roll With It';
	} else if (activeContentTitle) {
		document.title = `${activeContentTitle} Typing Results - Roll With It`;
	} else {
		document.title = 'Typing Results - Roll With It';
	}

	const resultsHeading = document.getElementById('resultsHeading');

	if (resultsHeading) {
		if (contentMode === 'training') {
			resultsHeading.textContent = 'Training Results';
		} else if (activeContentTitle) {
			resultsHeading.textContent = `${activeContentTitle} Results`;
		} else {
			resultsHeading.textContent = 'Typing Results';
		}
		resultsHeading.focus();
	}

	let desertLabel = document.getElementById('desertLabel');
	const correctKeystrokes = Metrics.computeCorrectKeystrokes(totalKeystrokes, errors);
	const wpm = Metrics.computeWpm(
		totalTypingTime,
		totalKeystrokes,
		errors,
		{ trainingMode: contentMode === 'training' }
	);
	const acc = Metrics.computeAccuracyPercent(totalKeystrokes, errors);

	const wpmVal = document.getElementById('wpm-val');
	const accVal = document.getElementById('accuracy-val');
	const errVal = document.getElementById('err-val');
	const desertVal = document.getElementById('desert-val');

	if (wpmVal) {
		if (contentMode === 'training') {
			wpmVal.textContent = 'Not calculated in Training Mode.';
		} else {
			wpmVal.textContent = `${wpm}`;
		}
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
		if (contentMode === 'training') {
			wpmNote.textContent = '';
			wpmNote.classList.add('hidden');
		} else if (totalTypingTime === 0 || correctKeystrokes === 0) {
			wpmNote.textContent = 'Never gonna give you a speed score. You didn’t type long enough for us to measure it.';
			wpmNote.classList.remove('hidden');
		} else {
			wpmNote.textContent = '';
			wpmNote.classList.add('hidden');
		}
	}
}

function getRandomContentSet() {
	const eligibleSets = typingContentSets.filter(set => set.type !== 'code');

	if (eligibleSets.length === 0) {
		return null;
	}

	const index = Math.floor(Math.random() * eligibleSets.length);
	return eligibleSets[index];
}

function getSelectedContentSet() {
	const select = document.getElementById('contentSetSelect');
	if (!select) {
		return null;
	}

	return typingContentSets.find(set => set.id === select.value) || null;
}

function shuffleArray(arr) {
	return Training.shuffleArray(arr);
}

function findTypingTrainingRowById(rowId) {
	return Training.findTypingTrainingRowById(typingTrainingSets, rowId);
}

function buildTrainingLessonText(rowDef) {
	return Training.buildTrainingLessonText(rowDef);
}

function startBtnHandler() {
	unlockSpeechSynthesis();

	if (gameState !== 'MENU') {
		return;
	}

	if (contentMode === 'original') {
		const set = getRandomContentSet();
		if (!set) {
			speak('No typing content sets are available.');
			return;
		}

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

	if (contentMode === 'training') {
		const rowId = typingTrainingSelect ? typingTrainingSelect.value : '';
		const found = findTypingTrainingRowById(rowId);

		if (!found || !found.row) {
			speak('No typing training set is selected.');
			return;
		}

		lyricsText = buildTrainingLessonText(found.row);
		activeContentTitle = `${found.layout.name} - ${found.row.name}`;
		speakPunctuation = true;
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

	void startTypingLesson();
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
		punctToggle.addEventListener('change', () => {
			speakAllPunctuation = punctToggle.checked;
			saveAppSetting(localStorage, 'speakAllPunctuation', speakAllPunctuation);
		});
	}
	const voiceSelect = document.getElementById('voiceSelect');

	if (voiceSelect) {
		voiceSelect.addEventListener('change', () => {
			selectedVoiceName = voiceSelect.value;
			saveAppSetting(localStorage, 'selectedVoiceName', selectedVoiceName);
		});
	}

const voiceRateNumber = document.getElementById('voiceRateNumber');
const voiceVolumeNumber = document.getElementById('voiceVolumeNumber');
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

		saveAppSetting(
			localStorage,
			'selectedVoiceRatePercent',
			selectedVoiceRatePercent
		);
	});
}

if (voiceVolumeNumber) {
	voiceVolumeNumber.value = selectedVoiceVolumePercent;

	voiceVolumeNumber.addEventListener('input', () => {
		let value = parseInt(voiceVolumeNumber.value, 10);

		if (isNaN(value)) {
			return;
		}

		value = Math.max(0, Math.min(100, value));
		selectedVoiceVolumePercent = value;

		saveAppSetting(
			localStorage,
			'selectedVoiceVolumePercent',
			selectedVoiceVolumePercent
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
		soundEffectsToggle.checked = soundEffectsEnabled;

		soundEffectsToggle.addEventListener('change', () => {
			soundEffectsEnabled = soundEffectsToggle.checked;
			saveAppSetting(localStorage, 'soundEffectsEnabled', soundEffectsEnabled);
		});
	}

	const contentModeOriginal = document.getElementById('contentModeOriginal');
	const contentModeSet = document.getElementById('contentModeSet');
	const contentModeTraining = document.getElementById('contentModeTraining');
	const contentModeCustom = document.getElementById('contentModeCustom');

	const contentSetFieldset = document.getElementById('contentSetFieldset');
	const customContentFieldset = document.getElementById('customContentFieldset');
	const typingTrainingFieldset = document.getElementById('typingTrainingFieldset');

	const typingModeGuided = document.getElementById('typingModeGuided');
	const typingModeWord = document.getElementById('typingModeWord');
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
			saveAppSetting(localStorage, 'sentenceSpeechMode', sentenceSpeechMode);
			return;
		}
		if (sentenceSpeechWords?.checked) {
			sentenceSpeechMode = 'words';
			saveAppSetting(localStorage, 'sentenceSpeechMode', sentenceSpeechMode);
			return;
		}
		if (sentenceSpeechBoth?.checked) {
			sentenceSpeechMode = 'both';
			saveAppSetting(localStorage, 'sentenceSpeechMode', sentenceSpeechMode);
			return;
		}
		sentenceSpeechMode = 'errors';
		saveAppSetting(localStorage, 'sentenceSpeechMode', sentenceSpeechMode);
	}

	sentenceSpeechErrors?.addEventListener('change', syncSentenceSpeechModeFromUI);
	sentenceSpeechCharacters?.addEventListener('change', syncSentenceSpeechModeFromUI);
	sentenceSpeechWords?.addEventListener('change', syncSentenceSpeechModeFromUI);
	sentenceSpeechBoth?.addEventListener('change', syncSentenceSpeechModeFromUI);

	populateContentSetSelect();

	if (contentSetSelect && selectedContentSetId) {
		contentSetSelect.value = selectedContentSetId;
	}

	if (typingTrainingSelect && selectedTrainingRowId) {
		typingTrainingSelect.value = selectedTrainingRowId;
	}

	if (typingModeGuided) {
		typingModeGuided.checked = typingMode === 'guided';
	}

	if (typingModeWord) {
		typingModeWord.checked = typingMode === 'word';
	}

	if (typingModeSentence) {
		typingModeSentence.checked = typingMode === 'sentence';
	}

	if (sentenceSpeechErrors) {
		sentenceSpeechErrors.checked = sentenceSpeechMode === 'errors';
	}

	if (sentenceSpeechCharacters) {
		sentenceSpeechCharacters.checked = sentenceSpeechMode === 'characters';
	}

	if (sentenceSpeechWords) {
		sentenceSpeechWords.checked = sentenceSpeechMode === 'words';
	}

	if (sentenceSpeechBoth) {
		sentenceSpeechBoth.checked = sentenceSpeechMode === 'both';
	}

	if (punctToggle) {
		punctToggle.checked = speakAllPunctuation;
	}

	if (contentModeOriginal) {
		contentModeOriginal.checked = contentMode === 'original';
	}

	if (contentModeSet) {
		contentModeSet.checked = contentMode === 'set';
	}

	if (contentModeTraining) {
		contentModeTraining.checked = contentMode === 'training';
	}

	if (contentModeCustom) {
		contentModeCustom.checked = contentMode === 'custom';
	}

	if (typingModeGuided) {
		typingModeGuided.addEventListener('change', () => {
			if (typingModeGuided.checked) {
				typingMode = 'guided';
				saveAppSetting(localStorage, 'typingMode', typingMode);

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
				saveAppSetting(localStorage, 'typingMode', typingMode);

				if (container) {
					container.setAttribute('role', 'text');
				}

				if (sentenceSpeechOptions) {
					sentenceSpeechOptions.disabled = false;
				}
			}
		});
	}

	if (typingModeWord) {
		typingModeWord.addEventListener('change', () => {
			if (typingModeWord.checked) {
				typingMode = 'word';
				saveAppSetting(localStorage, 'typingMode', typingMode);

				if (container) {
					container.removeAttribute('role');
				}

				if (sentenceSpeechOptions) {
					sentenceSpeechOptions.disabled = true;
				}
			}
		});
	}

	if (contentModeOriginal) {
		contentModeOriginal.addEventListener('change', () => {
			if (contentModeOriginal.checked) {
				contentMode = 'original';
				saveAppSetting(localStorage, 'contentMode', contentMode);
				contentSetFieldset.disabled = true;
				customContentFieldset.disabled = true;
			}
		});
	}

	if (contentModeSet) {
		contentModeSet.addEventListener('change', () => {
			if (contentModeSet.checked) {
				contentMode = 'set';
				saveAppSetting(localStorage, 'contentMode', contentMode);
				contentSetFieldset.disabled = false;
				customContentFieldset.disabled = true;
			}
		});
	}

	if (contentModeTraining) {
		contentModeTraining.addEventListener('change', () => {
			if (contentModeTraining.checked) {
				contentMode = 'training';
				saveAppSetting(localStorage, 'contentMode', contentMode);
				contentSetFieldset.disabled = true;
				customContentFieldset.disabled = true;
				if (typingTrainingFieldset) {
					typingTrainingFieldset.disabled = false;
				}
			}
		});
	}

	if (contentModeCustom) {
		contentModeCustom.addEventListener('change', () => {
			if (contentModeCustom.checked) {
				contentMode = 'custom';
				saveAppSetting(localStorage, 'contentMode', contentMode);
				contentSetFieldset.disabled = true;
				customContentFieldset.disabled = false;
			}
		});
	}

	if (contentSetSelect) {
		contentSetSelect.addEventListener('change', () => {
			selectedContentSetId = contentSetSelect.value;
			saveAppSetting(localStorage, 'selectedContentSetId', selectedContentSetId);
		});
	}

	if (typingTrainingSelect) {
		typingTrainingSelect.addEventListener('change', () => {
			selectedTrainingRowId = typingTrainingSelect.value;
			saveAppSetting(localStorage, 'selectedTrainingRowId', selectedTrainingRowId);
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

	if (contentModeTraining && contentModeTraining.checked) {
		contentMode = 'training';
		contentSetFieldset.disabled = true;
		customContentFieldset.disabled = true;
		if (typingTrainingFieldset) {
			typingTrainingFieldset.disabled = false;
		}
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

	if (typingModeWord && typingModeWord.checked) {
		typingMode = 'word';

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
	loadVoicesOnce();
	window.speechSynthesis.onvoiceschanged = loadVoicesOnce;

	populateTypingTrainingSelect();
	updateContentModeUIFromRadios();

	initTypingSettings();
	initInputHooks();
	initButtons();
	initFooterYear();
}

init();
