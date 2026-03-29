export function updateProgressStatus({ progressStatus, lines, currentLineIndex }) {
	if (!progressStatus || !lines || lines.length === 0) {
		return;
	}

	const completed = currentLineIndex;
	const total = lines.length;
	progressStatus.textContent = `${completed} out of ${total} lines complete`;
}

export function getStartAnnouncementText({ contentMode, activeContentTitle }) {
	if (contentMode === 'custom') {
		return 'Starting Custom Lesson';
	}

	if (activeContentTitle) {
		return `Starting ${activeContentTitle} Lesson`;
	}

	return 'Starting Lesson';
}

export function pauseTypingTimer({ accumulateElapsedTime, totalTypingTime, typingStartTime }) {
	return {
		totalTypingTime: accumulateElapsedTime(totalTypingTime, typingStartTime),
		typingStartTime: null
	};
}

export async function handleLineDone({
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
}) {
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
