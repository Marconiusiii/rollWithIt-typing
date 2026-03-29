export function applyPunctuationMode({
	text,
	punctuationMode,
	expandSomePunctuationForSpeech,
	expandAllPunctuationForSpeech
}) {
	if (punctuationMode === 'all') {
		return expandAllPunctuationForSpeech(text);
	}

	if (punctuationMode === 'some') {
		return expandSomePunctuationForSpeech(text);
	}

	return text;
}

export function loadVoicesOnce({ speechSynthesis, setCachedVoices, populateVoiceSelect }) {
	if (!speechSynthesis) {
		return;
	}

	const voices = speechSynthesis.getVoices();
	if (voices.length > 0) {
		setCachedVoices(voices);
		populateVoiceSelect();
	}
}

export function queueCharSpeech({ char, getCharSpeechBuffer, setCharSpeechBuffer, getCharSpeechFramePending, setCharSpeechFramePending, queueSpeak }) {
	setCharSpeechBuffer(getCharSpeechBuffer() + char);

	if (getCharSpeechFramePending()) {
		return;
	}

	setCharSpeechFramePending(true);

	requestAnimationFrame(() => {
		setCharSpeechFramePending(false);

		if (!getCharSpeechBuffer()) {
			return;
		}

		const toSpeak = getCharSpeechBuffer();
		setCharSpeechBuffer('');
		queueSpeak(toSpeak);
	});
}

export function hardResetSpeechSynthesis({ speechSynthesis, setIsSpeaking, resetSpeakChain, getSpeechRateFromPercent, getSpeechVolumeFromPercent, selectedVoiceRatePercent, selectedVoiceVolumePercent, selectedVoiceName, resolveCurrentVoiceByName }) {
	if (!speechSynthesis) {
		return;
	}

	try {
		speechSynthesis.cancel();
	} catch (e) {}

	setIsSpeaking(false);
	resetSpeakChain();

	try {
		const kick = new SpeechSynthesisUtterance(' ');
		kick.volume = 0;
		speechSynthesis.speak(kick);
		speechSynthesis.cancel();
	} catch (e) {}

	setTimeout(() => {
		try {
			const confirm = new SpeechSynthesisUtterance('Speech reset.');
			confirm.rate = getSpeechRateFromPercent(selectedVoiceRatePercent);
			confirm.volume = getSpeechVolumeFromPercent(selectedVoiceVolumePercent);

			const voice = selectedVoiceName
				? resolveCurrentVoiceByName(selectedVoiceName)
				: null;

			if (voice) {
				confirm.voice = voice;
			}

			speechSynthesis.speak(confirm);
		} catch (e) {}
	}, 100);
}

export function speakCharCutover({ spokenChar, cancelSpeechIfSpeaking, resetSpeakQueue, speak }) {
	cancelSpeechIfSpeaking();
	resetSpeakQueue();
	speak(spokenChar);
}

export function speak({ speechSynthesis, text, setIsSpeaking, punctuationMode, expandSomePunctuationForSpeech, expandAllPunctuationForSpeech, getSpeechRateFromPercent, getSpeechVolumeFromPercent, selectedVoiceRatePercent, selectedVoiceVolumePercent, selectedVoiceName, resolveCurrentVoiceByName, cachedVoices }) {
	return new Promise((resolve) => {
		setIsSpeaking(true);

		const textToSpeak = applyPunctuationMode({
			text,
			punctuationMode,
			expandSomePunctuationForSpeech,
			expandAllPunctuationForSpeech
		});

		const utterance = new SpeechSynthesisUtterance(textToSpeak);
		utterance.rate = getSpeechRateFromPercent(selectedVoiceRatePercent);
		utterance.volume = getSpeechVolumeFromPercent(selectedVoiceVolumePercent);

		let voice = null;
		if (selectedVoiceName) {
			voice = resolveCurrentVoiceByName(selectedVoiceName);
		}

		if (!voice) {
			voice = cachedVoices.find(v => v.lang && v.lang.startsWith('en')) || cachedVoices[0] || null;
		}

		if (voice) {
			utterance.voice = voice;
		}

		utterance.onend = () => {
			setIsSpeaking(false);
			resolve();
		};

		utterance.onerror = () => {
			setIsSpeaking(false);
			resolve();
		};

		speechSynthesis.speak(utterance);
	});
}

export function speakRemainingLine({ lines, currentLineIndex, currentCharIndex, getRemainingLineText, cancelSpeechIfSpeaking, resetSpeakQueue, speak }) {
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

export function speakExpectedWord({ lines, currentLineIndex, currentCharIndex, getExpectedWord, cancelSpeechIfSpeaking, resetSpeakQueue, speak }) {
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

export function replayExpectedChar({ lines, currentLineIndex, currentCharIndex, getSpokenChar, speakCharCutover }) {
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
