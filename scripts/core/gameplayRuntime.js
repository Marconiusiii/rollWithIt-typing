export async function handleCharacterInput({
	char,
	gameState,
	finishGame,
	lines,
	currentLineIndex,
	currentCharIndex,
	setTotalKeystrokes,
	totalKeystrokes,
	setTypingStartTime,
	typingStartTime,
	setErrors,
	errors,
	errorKeys,
	playBeep,
	lastErrorCharIndexSpoken,
	setLastErrorCharIndexSpoken,
	typingMode,
	pauseTypingTimerForPrompt,
	promptChar,
	speakCharCutover,
	getSpokenChar,
	sentenceSpeechMode,
	isWordEnd,
	getLastWord,
	queueSpeak,
	accumulateElapsedTime,
	totalTypingTime,
	setTotalTypingTime,
	updateProgressStatus,
	setCurrentLineIndex,
	setCurrentCharIndex,
	handleLineDone,
	render,
	promptWord
}) {
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

	setTotalKeystrokes(totalKeystrokes + 1);

	if (typingStartTime === null) {
		setTypingStartTime(Date.now());
	}

	if (!matches) {
		setErrors(errors + 1);
		errorKeys.add(expected);
		playBeep();

		if (lastErrorCharIndexSpoken !== currentCharIndex) {
			setLastErrorCharIndexSpoken(currentCharIndex);

			if (typingMode === 'guided') {
				pauseTypingTimerForPrompt();
				promptChar();
			} else {
				speakCharCutover(`${getSpokenChar(expected)} `);
			}
		}

		return;
	}

	const nextCharIndex = currentCharIndex + 1;
	setCurrentCharIndex(nextCharIndex);
	setLastErrorCharIndexSpoken(null);

	if (typingMode === 'sentence') {
		if (sentenceSpeechMode === 'characters' || sentenceSpeechMode === 'both') {
			speakCharCutover(`${getSpokenChar(char)} `);
		}

		if (sentenceSpeechMode === 'words' || sentenceSpeechMode === 'both') {
			if (isWordEnd(line, nextCharIndex)) {
				const lastWord = getLastWord(line, nextCharIndex);
				if (lastWord) {
					queueSpeak(lastWord);
				}
			}
		}
	}

	if (nextCharIndex >= line.length) {
		setTotalTypingTime(accumulateElapsedTime(totalTypingTime, typingStartTime));
		setTypingStartTime(null);
		setCurrentLineIndex(currentLineIndex + 1);
		updateProgressStatus();
		setCurrentCharIndex(0);

		await handleLineDone();
		return;
	}

	render();

	if (typingMode === 'guided') {
		pauseTypingTimerForPrompt();
		promptChar();
	} else if (typingMode === 'word') {
		promptWord();
	}
}

export function handleBeforeInput({ e, gameState, queueCharacterInput }) {
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

export function handleKeyDown({
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
}) {
	if (gameState !== 'PLAYING') {
		return;
	}

	const useCodingShortcuts =
		contentMode === 'training' ||
		(contentMode === 'set' && lessonUsesCodingShortcuts === true);

	if (isChrome && e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
		e.preventDefault();
		hardResetSpeechSynthesis();
		return;
	}

	if (useCodingShortcuts) {
		if (e.ctrlKey && !e.shiftKey && e.code === 'Backquote') {
			e.preventDefault();
			speakLineOnce();
			return;
		}

		if (e.ctrlKey && e.shiftKey && e.code === 'Backquote') {
			e.preventDefault();
			replayExpectedChar();
			return;
		}

		if (e.ctrlKey && e.shiftKey && e.code === 'Backslash') {
			e.preventDefault();
			speakExpectedWord();
			return;
		}

		if (e.ctrlKey && e.shiftKey && e.code === 'Slash') {
			e.preventDefault();
			speakRemainingLine();
			return;
		}

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
