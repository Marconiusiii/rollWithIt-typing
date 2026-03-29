export function updateContentModeUIFromRadios({
	contentModeRadios,
	contentSetFieldset,
	customContentFieldset,
	typingTrainingFieldset
}) {
	let selectedMode = null;

	contentModeRadios.forEach(radio => {
		if (radio.checked) {
			selectedMode = radio.value;
		}
	});

	if (!selectedMode) {
		return;
	}

	if (contentSetFieldset) {
		contentSetFieldset.disabled = true;
	}
	if (customContentFieldset) {
		customContentFieldset.disabled = true;
	}
	if (typingTrainingFieldset) {
		typingTrainingFieldset.disabled = true;
	}

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

export function syncSentenceSpeechModeFromUI({
	sentenceSpeechCharacters,
	sentenceSpeechWords,
	sentenceSpeechBoth,
	setSentenceSpeechMode,
	saveSetting
}) {
	if (sentenceSpeechCharacters?.checked) {
		setSentenceSpeechMode('characters');
		saveSetting('sentenceSpeechMode', 'characters');
		return;
	}

	if (sentenceSpeechWords?.checked) {
		setSentenceSpeechMode('words');
		saveSetting('sentenceSpeechMode', 'words');
		return;
	}

	if (sentenceSpeechBoth?.checked) {
		setSentenceSpeechMode('both');
		saveSetting('sentenceSpeechMode', 'both');
		return;
	}

	setSentenceSpeechMode('errors');
	saveSetting('sentenceSpeechMode', 'errors');
}

export function applyPersistedSettingsToUI({
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
	punctuationModeNone,
	punctuationModeSome,
	punctuationModeAll,
	punctuationMode,
	contentModeOriginal,
	contentModeSet,
	contentModeTraining,
	contentModeCustom,
	contentMode,
	container,
	sentenceSpeechOptions
}) {
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

	if (punctuationModeNone) {
		punctuationModeNone.checked = punctuationMode === 'none';
	}
	if (punctuationModeSome) {
		punctuationModeSome.checked = punctuationMode === 'some';
	}
	if (punctuationModeAll) {
		punctuationModeAll.checked = punctuationMode === 'all';
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

	applyTypingModeUIState({ typingMode, container, sentenceSpeechOptions });
}

export function applyTypingModeUIState({ typingMode, container, sentenceSpeechOptions }) {
	if (typingMode === 'sentence') {
		if (container) {
			container.setAttribute('role', 'text');
		}
		if (sentenceSpeechOptions) {
			sentenceSpeechOptions.disabled = false;
		}
		return;
	}

	if (container) {
		container.removeAttribute('role');
	}
	if (sentenceSpeechOptions) {
		sentenceSpeechOptions.disabled = true;
	}
}
