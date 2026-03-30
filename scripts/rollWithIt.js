// Roll With It Typing Tutor by Chancey Fleet and Marco Salsiccia

import * as Metrics from './core/metrics.js';
import * as TextProcessing from './core/textProcessing.js';
import * as WordMode from './core/wordMode.js';
import * as Training from './core/training.js';
import { loadAppSettings, saveAppSetting } from './core/settings.js';
import * as SpeechRuntime from './core/speechRuntime.js';
import * as SpeechHelpersRuntime from './core/speechHelpersRuntime.js';
import * as SfxRuntime from './core/sfxRuntime.js';
import * as ModeRuntime from './core/modeRuntime.js';
import * as GameplayRuntime from './core/gameplayRuntime.js';
import * as ContentRuntime from './core/contentRuntime.js';
import * as CustomContentRuntime from './core/customContentRuntime.js';
import * as LessonRuntime from './core/lessonRuntime.js';
import { applyResultsScreen } from './core/resultsRuntime.js';
import { runInitialLessonPrompt, setScreenState } from './core/lifecycleRuntime.js';
import { initInputHooks } from './core/inputRuntime.js';
import { initButtons, initFooterYear } from './core/uiRuntime.js';
import {
	applyPersistedSettingsToUI,
	applyTypingModeUIState,
	syncSentenceSpeechModeFromUI,
	updateContentModeUIFromRadios
} from './core/settingsRuntime.js';

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
let lessonUsesCodingShortcuts = false;
let punctuationMode = persistedSettings.punctuationMode;
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

let soundEffectsEnabled = persistedSettings.soundEffectsEnabled;
let lastErrorCharIndexSpoken = null;

let totalKeystrokes = 0;
let errors = 0;
let errorKeys = new Set();
let errorWords = new Set();

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
	ContentRuntime.populateTypingTrainingSelect({
		typingTrainingSelect,
		typingTrainingSets
	});
}

contentModeRadios.forEach(radio => {
	radio.addEventListener('change', () => {
		updateContentModeUIFromRadios({
			contentModeRadios,
			contentSetFieldset,
			customContentFieldset,
			typingTrainingFieldset
		});
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
	LessonRuntime.updateProgressStatus({
		progressStatus,
		lines,
		currentLineIndex
	});
}
function waitForSpeechReset() {
	return new Promise(resolve => setTimeout(resolve, 50));
}

function expandSomePunctuationForSpeech(text) {
	return text
		.replace(/’/g, ' apostrophe ')
		.replace(/'/g, ' apostrophe ')
		.replace(/,/g, ' comma ')
		.replace(/\./g, ' period ')
		.replace(/\?/g, ' question mark ')
		.replace(/!/g, ' exclamation mark ')
		.replace(/:/g, ' colon ')
		.replace(/;/g, ' semicolon ')
		.replace(/\//g, ' slash ')
		.replace(/\\/g, ' backslash ')
		.replace(/-/g, ' hyphen ');
}

function expandAllPunctuationForSpeech(text) {
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
	ContentRuntime.populateContentSetSelect({
		contentSetSelect,
		typingContentSets
	});
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
		punctuationMode,
		expandSomePunctuationForSpeech,
		expandAllPunctuationForSpeech,
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
	SpeechHelpersRuntime.speakRemainingLineShortcut({
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
	SpeechHelpersRuntime.speakExpectedWordShortcut({
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
	SpeechHelpersRuntime.replayExpectedCharShortcut({
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
	const nextTimerState = LessonRuntime.pauseTypingTimerForPrompt({
		typingMode,
		pauseTimingForPrompt: ({ typingMode, totalTypingTime, typingStartTime }) =>
			Metrics.pauseTimingForPrompt({
				typingMode,
				accumulateElapsedTime: Metrics.accumulateElapsedTime,
				totalTypingTime,
				typingStartTime
			}),
		totalTypingTime,
		typingStartTime
	});

	totalTypingTime = nextTimerState.totalTypingTime;
	typingStartTime = nextTimerState.typingStartTime;
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
		punctuationMode,
		applyPunctuationMode: SpeechRuntime.applyPunctuationMode,
		expandSomePunctuationForSpeech,
		expandAllPunctuationForSpeech
	});
}

function sanitizeText(rawText) {
	return TextProcessing.sanitizeText(rawText);
}

function buildLinesFromText(text) {
	return TextProcessing.buildLinesFromText(text, MAX_CUSTOM_LINES);
}

function enforceLineLimit(textarea) {
	CustomContentRuntime.enforceLineLimit({
		textarea,
		enforceLineLimitValue: TextProcessing.enforceLineLimitValue,
		maxCustomLines: MAX_CUSTOM_LINES
	});
}

function clearCustomContentError() {
	CustomContentRuntime.clearCustomContentError(document);
}

function showCustomContentError() {
	CustomContentRuntime.showCustomContentError(document);
}

function getStartAnnouncementText() {
	return LessonRuntime.getStartAnnouncementText({
		contentMode,
		activeContentTitle
	});
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
	errorWords.clear();

	typingStartTime = null;
	totalTypingTime = 0;

	render();
	await runInitialLessonPrompt({
		shouldSpeakInitialPrompt,
		cancelSpeechIfSpeaking,
		resetSpeakQueue,
		waitForSpeechReset,
		speak,
		getStartAnnouncementText,
		playIntroStinger: playIntroRickStinger,
		introStingerDurationMs: SfxRuntime.getIntroRickStingerDurationMs(),
		typingMode,
		promptChar,
		promptWord,
		speakLineOnce
	});
}

async function handleLineDone() {
	await LessonRuntime.handleLineDone({
		currentLineIndex,
		lines,
		contentMode,
		playTypewriterBell,
		playFinalRickChordProgression,
		finishGame,
		render,
		typingMode,
		promptChar,
		promptWord,
		speakLineOnce
	});
}

async function handleCharacterInput(char) {
	await GameplayRuntime.handleCharacterInput({
		char,
		gameState,
		finishGame,
		lines,
		currentLineIndex,
		currentCharIndex,
		setTotalKeystrokes: (value) => {
			totalKeystrokes = value;
		},
		totalKeystrokes,
		setTypingStartTime: (value) => {
			typingStartTime = value;
		},
		typingStartTime,
		setErrors: (value) => {
			errors = value;
		},
		errors,
		errorKeys,
		errorWords,
		playBeep,
		lastErrorCharIndexSpoken,
		setLastErrorCharIndexSpoken: (value) => {
			lastErrorCharIndexSpoken = value;
		},
		typingMode,
		pauseTypingTimerForPrompt: pauseTypingTimer,
		promptChar,
		speakCharCutover,
		getSpokenChar,
		sentenceSpeechMode,
		isWordEnd,
		getLastWord,
		queueSpeak,
		accumulateElapsedTime: Metrics.accumulateElapsedTime,
		totalTypingTime,
		setTotalTypingTime: (value) => {
			totalTypingTime = value;
		},
		updateProgressStatus,
		setCurrentLineIndex: (value) => {
			currentLineIndex = value;
		},
		setCurrentCharIndex: (value) => {
			currentCharIndex = value;
		},
		handleLineDone,
		render,
		promptWord
	});
}

function handleBeforeInput(e) {
	GameplayRuntime.handleBeforeInput({ e, gameState, queueCharacterInput });
}

function handleKeyDown(e) {
	GameplayRuntime.handleKeyDown({
		e,
		gameState,
		contentMode,
		lessonUsesCodingShortcuts,
		isChrome,
		hardResetSpeechSynthesis,
		speakLineOnce,
		replayExpectedChar,
		speakExpectedWord,
		speakRemainingLine,
		finishGame,
		queueCharacterInput
	});
}

function finishGame() {
	totalTypingTime = Metrics.accumulateElapsedTime(totalTypingTime, typingStartTime);
	typingStartTime = null;

	gameState = 'RESULTS';
	setScreenState({ document, targetState: 'RESULTS' });
	applyResultsScreen({
		document,
		typingMode,
		contentMode,
		activeContentTitle,
		totalTypingTime,
		totalKeystrokes,
		errors,
		errorKeys,
		errorWords,
		errorKeysToString,
		computeCorrectKeystrokes: Metrics.computeCorrectKeystrokes,
		computeWpm: Metrics.computeWpm,
		computeAccuracyPercent: Metrics.computeAccuracyPercent
	});
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

	const customContentInput = document.getElementById('customContentInput');
	const lessonPayload = ContentRuntime.buildLessonPayload({
		contentMode,
		typingContentSets,
		contentSetSelect,
		typingTrainingSelect,
		sanitizeText,
		buildLinesFromText,
		findTypingTrainingRowById,
		buildTrainingLessonText,
		customContentInput
	});

	if (lessonPayload.validationError === 'customContentEmpty') {
		showCustomContentError();
		return;
	}

	if (lessonPayload.error) {
		speak(lessonPayload.error);
		return;
	}

	if (!lessonPayload.lyricsText) {
		return;
	}

	lyricsText = lessonPayload.lyricsText;
	activeContentTitle = lessonPayload.activeContentTitle;
	lessonUsesCodingShortcuts = lessonPayload.usesCodingShortcuts;

	gameState = 'PLAYING';
	setScreenState({ document, targetState: 'PLAYING' });

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

function initTypingSettings() {
	const punctModeNone = document.getElementById('punctModeNone');
	const punctModeSome = document.getElementById('punctModeSome');
	const punctModeAll = document.getElementById('punctModeAll');
	const voiceSelect = document.getElementById('voiceSelect');
	const voiceRateNumber = document.getElementById('voiceRateNumber');
	const voiceVolumeNumber = document.getElementById('voiceVolumeNumber');
	const playVoiceSampleBtn = document.getElementById('playVoiceSample');
	const soundEffectsToggle = document.getElementById('soundEffectsToggle');
	const contentModeOriginal = document.getElementById('contentModeOriginal');
	const contentModeSet = document.getElementById('contentModeSet');
	const contentModeTraining = document.getElementById('contentModeTraining');
	const contentModeCustom = document.getElementById('contentModeCustom');
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

	const syncPunctuationMode = () => {
		if (punctModeAll?.checked) {
			punctuationMode = 'all';
		} else if (punctModeSome?.checked) {
			punctuationMode = 'some';
		} else {
			punctuationMode = 'none';
		}

		saveAppSetting(localStorage, 'punctuationMode', punctuationMode);
	};

	punctModeNone?.addEventListener('change', syncPunctuationMode);
	punctModeSome?.addEventListener('change', syncPunctuationMode);
	punctModeAll?.addEventListener('change', syncPunctuationMode);

	if (voiceSelect) {
		voiceSelect.addEventListener('change', () => {
			selectedVoiceName = voiceSelect.value;
			saveAppSetting(localStorage, 'selectedVoiceName', selectedVoiceName);
		});
	}

	if (voiceRateNumber) {
		voiceRateNumber.value = selectedVoiceRatePercent;

		voiceRateNumber.addEventListener('input', () => {
			let value = parseInt(voiceRateNumber.value, 10);

			if (isNaN(value)) {
				return;
			}

			value = Math.max(0, Math.min(100, value));
			selectedVoiceRatePercent = value;
			saveAppSetting(localStorage, 'selectedVoiceRatePercent', selectedVoiceRatePercent);
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
			saveAppSetting(localStorage, 'selectedVoiceVolumePercent', selectedVoiceVolumePercent);
		});
	}

	if (playVoiceSampleBtn) {
		playVoiceSampleBtn.addEventListener('click', () => {
			resetSpeakQueue();
			speak('Welcome to Roll With It Typing!');
		});
	}

	if (soundEffectsToggle) {
		soundEffectsToggle.checked = soundEffectsEnabled;

		soundEffectsToggle.addEventListener('change', () => {
			soundEffectsEnabled = soundEffectsToggle.checked;
			saveAppSetting(localStorage, 'soundEffectsEnabled', soundEffectsEnabled);
		});
	}

	const syncSentenceSpeechMode = () => {
		syncSentenceSpeechModeFromUI({
			sentenceSpeechCharacters,
			sentenceSpeechWords,
			sentenceSpeechBoth,
			setSentenceSpeechMode: (value) => {
				sentenceSpeechMode = value;
			},
			saveSetting: (key, value) => {
				saveAppSetting(localStorage, key, value);
			}
		});
	};

	sentenceSpeechErrors?.addEventListener('change', syncSentenceSpeechMode);
	sentenceSpeechCharacters?.addEventListener('change', syncSentenceSpeechMode);
	sentenceSpeechWords?.addEventListener('change', syncSentenceSpeechMode);
	sentenceSpeechBoth?.addEventListener('change', syncSentenceSpeechMode);

	populateContentSetSelect();
	applyPersistedSettingsToUI({
		contentSetSelect,
		selectedContentSetId,
		typingTrainingSelect,
		selectedTrainingRowId,
		typingModeGuided,
		typingModeWord,
		typingModeSentence,
		typingMode,
		sentenceSpeechErrors,
		sentenceSpeechCharacters,
		sentenceSpeechWords,
		sentenceSpeechBoth,
		sentenceSpeechMode,
		punctuationModeNone: punctModeNone,
		punctuationModeSome: punctModeSome,
		punctuationModeAll: punctModeAll,
		punctuationMode,
		contentModeOriginal,
		contentModeSet,
		contentModeTraining,
		contentModeCustom,
		contentMode,
		container,
		sentenceSpeechOptions
	});

	if (typingModeGuided) {
		typingModeGuided.addEventListener('change', () => {
			if (typingModeGuided.checked) {
				typingMode = 'guided';
				saveAppSetting(localStorage, 'typingMode', typingMode);
				applyTypingModeUIState({ typingMode, container, sentenceSpeechOptions });
			}
		});
	}

	if (typingModeSentence) {
		typingModeSentence.addEventListener('change', () => {
			if (typingModeSentence.checked) {
				typingMode = 'sentence';
				saveAppSetting(localStorage, 'typingMode', typingMode);
				applyTypingModeUIState({ typingMode, container, sentenceSpeechOptions });
			}
		});
	}

	if (typingModeWord) {
		typingModeWord.addEventListener('change', () => {
			if (typingModeWord.checked) {
				typingMode = 'word';
				saveAppSetting(localStorage, 'typingMode', typingMode);
				applyTypingModeUIState({ typingMode, container, sentenceSpeechOptions });
			}
		});
	}

	if (contentModeOriginal) {
		contentModeOriginal.addEventListener('change', () => {
			if (contentModeOriginal.checked) {
				contentMode = 'original';
				saveAppSetting(localStorage, 'contentMode', contentMode);
				updateContentModeUIFromRadios({
					contentModeRadios,
					contentSetFieldset,
					customContentFieldset,
					typingTrainingFieldset
				});
			}
		});
	}

	if (contentModeSet) {
		contentModeSet.addEventListener('change', () => {
			if (contentModeSet.checked) {
				contentMode = 'set';
				saveAppSetting(localStorage, 'contentMode', contentMode);
				updateContentModeUIFromRadios({
					contentModeRadios,
					contentSetFieldset,
					customContentFieldset,
					typingTrainingFieldset
				});
			}
		});
	}

	if (contentModeTraining) {
		contentModeTraining.addEventListener('change', () => {
			if (contentModeTraining.checked) {
				contentMode = 'training';
				saveAppSetting(localStorage, 'contentMode', contentMode);
				updateContentModeUIFromRadios({
					contentModeRadios,
					contentSetFieldset,
					customContentFieldset,
					typingTrainingFieldset
				});
			}
		});
	}

	if (contentModeCustom) {
		contentModeCustom.addEventListener('change', () => {
			if (contentModeCustom.checked) {
				contentMode = 'custom';
				saveAppSetting(localStorage, 'contentMode', contentMode);
				updateContentModeUIFromRadios({
					contentModeRadios,
					contentSetFieldset,
					customContentFieldset,
					typingTrainingFieldset
				});
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

	updateContentModeUIFromRadios({
		contentModeRadios,
		contentSetFieldset,
		customContentFieldset,
		typingTrainingFieldset
	});
	applyTypingModeUIState({ typingMode, container, sentenceSpeechOptions });
	syncPunctuationMode();
	syncSentenceSpeechMode();
}

function init() {
	loadVoicesOnce();
	window.speechSynthesis.onvoiceschanged = loadVoicesOnce;

	populateTypingTrainingSelect();

	initTypingSettings();
	initInputHooks({
		captureSurface,
		activatorInput,
		handleBeforeInput,
		handleKeyDown
	});
	initButtons({
		document,
		isChrome,
		startBtnHandler,
		exitBtnHandler,
		hardResetSpeechSynthesis,
		setMenuState: () => {
			if (gameState !== 'RESULTS') {
				return;
			}

			gameState = 'MENU';
			setScreenState({ document, targetState: 'MENU' });
		}
	});
	initFooterYear(document);
}

init();
