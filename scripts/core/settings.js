export const APP_SETTINGS_DEFAULTS = {
	typingMode: 'guided',
	sentenceSpeechMode: 'errors',
	contentMode: 'original',
	selectedVoiceName: '',
	selectedVoiceRatePercent: 30,
	selectedVoiceVolumePercent: 100,
	punctuationMode: 'none',
	soundEffectsEnabled: true,
	selectedContentSetId: '',
	selectedTrainingRowId: ''
};

const STORAGE_KEYS = {
	typingMode: 'typingMode',
	sentenceSpeechMode: 'sentenceSpeechMode',
	contentMode: 'contentMode',
	selectedVoiceName: 'preferredVoice',
	selectedVoiceRatePercent: 'preferredVoiceRatePercent',
	selectedVoiceVolumePercent: 'preferredVoiceVolumePercent',
	punctuationMode: 'punctuationMode',
	speakAllPunctuation: 'speakAllPunctuation',
	soundEffectsEnabled: 'soundEffectsEnabled',
	selectedContentSetId: 'selectedContentSetId',
	selectedTrainingRowId: 'selectedTrainingRowId'
};

function parsePercent(value, fallback) {
	const parsed = parseInt(value, 10);
	if (Number.isNaN(parsed)) {
		return fallback;
	}

	return Math.max(0, Math.min(100, parsed));
}

function parseBoolean(value, fallback) {
	if (value === null || value === undefined) {
		return fallback;
	}

	if (value === 'true') {
		return true;
	}

	if (value === 'false') {
		return false;
	}

	return fallback;
}

function parsePunctuationMode(value, fallback) {
	if (value === 'none' || value === 'some' || value === 'all') {
		return value;
	}

	return fallback;
}

export function loadAppSettings(storage) {
	if (!storage) {
		return { ...APP_SETTINGS_DEFAULTS };
	}

	const storedPunctuationMode = storage.getItem(STORAGE_KEYS.punctuationMode);
	const legacySpeakAllPunctuation = parseBoolean(
		storage.getItem(STORAGE_KEYS.speakAllPunctuation),
		null
	);

	let punctuationMode = parsePunctuationMode(
		storedPunctuationMode,
		APP_SETTINGS_DEFAULTS.punctuationMode
	);

	if (!storedPunctuationMode && legacySpeakAllPunctuation !== null) {
		punctuationMode = legacySpeakAllPunctuation ? 'all' : 'none';
	}

	return {
		typingMode: storage.getItem(STORAGE_KEYS.typingMode) || APP_SETTINGS_DEFAULTS.typingMode,
		sentenceSpeechMode: storage.getItem(STORAGE_KEYS.sentenceSpeechMode) || APP_SETTINGS_DEFAULTS.sentenceSpeechMode,
		contentMode: storage.getItem(STORAGE_KEYS.contentMode) || APP_SETTINGS_DEFAULTS.contentMode,
		selectedVoiceName: storage.getItem(STORAGE_KEYS.selectedVoiceName) || APP_SETTINGS_DEFAULTS.selectedVoiceName,
		selectedVoiceRatePercent: parsePercent(storage.getItem(STORAGE_KEYS.selectedVoiceRatePercent), APP_SETTINGS_DEFAULTS.selectedVoiceRatePercent),
		selectedVoiceVolumePercent: parsePercent(storage.getItem(STORAGE_KEYS.selectedVoiceVolumePercent), APP_SETTINGS_DEFAULTS.selectedVoiceVolumePercent),
		punctuationMode,
		soundEffectsEnabled: parseBoolean(storage.getItem(STORAGE_KEYS.soundEffectsEnabled), APP_SETTINGS_DEFAULTS.soundEffectsEnabled),
		selectedContentSetId: storage.getItem(STORAGE_KEYS.selectedContentSetId) || APP_SETTINGS_DEFAULTS.selectedContentSetId,
		selectedTrainingRowId: storage.getItem(STORAGE_KEYS.selectedTrainingRowId) || APP_SETTINGS_DEFAULTS.selectedTrainingRowId
	};
}

export function saveAppSetting(storage, key, value) {
	if (!storage || !(key in STORAGE_KEYS)) {
		return;
	}

	storage.setItem(STORAGE_KEYS[key], String(value));
}
