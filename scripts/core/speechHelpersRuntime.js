export function speakRemainingLineShortcut({
	lines,
	currentLineIndex,
	currentCharIndex,
	getRemainingLineText,
	cancelSpeechIfSpeaking,
	resetSpeakQueue,
	speak
}) {
	const line = lines[currentLineIndex];
	if (!line) {
		return;
	}

	const remaining = getRemainingLineText(line, currentCharIndex);
	if (!remaining.trim()) {
		return;
	}

	cancelSpeechIfSpeaking();
	resetSpeakQueue();
	speak(remaining);
}

export function speakExpectedWordShortcut({
	lines,
	currentLineIndex,
	currentCharIndex,
	getExpectedWord,
	cancelSpeechIfSpeaking,
	resetSpeakQueue,
	speak
}) {
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

export function replayExpectedCharShortcut({
	lines,
	currentLineIndex,
	currentCharIndex,
	getSpokenChar,
	speakCharCutover
}) {
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
