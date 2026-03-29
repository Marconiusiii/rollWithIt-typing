export function renderTypingDisplay({ container, line, typingMode, currentCharIndex, getWordRevealEnd }) {
	container.innerHTML = '';

	if (!line) {
		return;
	}

	if (typingMode === 'sentence') {
		container.textContent = line;
		return;
	}

	if (typingMode === 'word') {
		const revealUntil = getWordRevealEnd(line, currentCharIndex);

		for (let i = 0; i < revealUntil; i++) {
			const span = document.createElement('span');
			span.textContent = line[i] === ' ' ? '\u00A0' : line[i];

			if (i < currentCharIndex) {
				span.className = 'correct';
			} else if (i === currentCharIndex) {
				span.className = line[i] === ' ' ? 'current-space' : 'current';
			}

			container.appendChild(span);
		}

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

export async function speakCurrentWordPrompt({ line, currentCharIndex, getCurrentWord, resetSpeakQueue, speak }) {
	if (!line) {
		return;
	}

	const word = getCurrentWord(line, currentCharIndex);
	if (!word) {
		return;
	}

	resetSpeakQueue();
	await speak(word);
}

export async function promptWord({ line, currentCharIndex, isAtWordBoundary, pauseTypingTimer, speakCurrentWordPrompt }) {
	if (!line) {
		return;
	}

	if (isAtWordBoundary(line, currentCharIndex)) {
		pauseTypingTimer();
		await speakCurrentWordPrompt();
	}
}

export async function speakLinePrompt({ line, cancelSpeechIfSpeaking, resetSpeakQueue, waitForSpeechReset, speak }) {
	if (!line) {
		return;
	}

	cancelSpeechIfSpeaking();
	resetSpeakQueue();
	await waitForSpeechReset();
	await speak(line);
}

export async function promptCharacter({ line, currentCharIndex, resetSpeakQueue, getSpokenChar, speak, speakAllPunctuation, speakPunctuation, expandPunctuationForSpeech }) {
	if (!line) {
		return;
	}

	const char = line[currentCharIndex];
	resetSpeakQueue();
	let spoken = getSpokenChar(char);

	if (speakAllPunctuation || speakPunctuation) {
		spoken = expandPunctuationForSpeech(spoken);
	}

	await speak(spoken);
}
