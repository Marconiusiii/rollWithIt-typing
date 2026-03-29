export function computeCorrectKeystrokes(totalKeystrokes, errors) {
	return Math.max(0, totalKeystrokes - errors);
}

export function computeAccuracyPercent(totalKeystrokes, errors) {
	const correctKeystrokes = computeCorrectKeystrokes(totalKeystrokes, errors);
	return Math.round((correctKeystrokes / Math.max(1, totalKeystrokes)) * 100) || 0;
}

export function computeWpm(totalTypingTime, totalKeystrokes, errors, { trainingMode = false } = {}) {
	if (trainingMode) {
		return null;
	}

	const correctKeystrokes = computeCorrectKeystrokes(totalKeystrokes, errors);

	if (totalTypingTime > 0 && correctKeystrokes > 0) {
		const mins = totalTypingTime / 60000;
		return Math.round((correctKeystrokes / 5) / mins);
	}

	return 0;
}

export function accumulateElapsedTime(totalTypingTime, typingStartTime, now = Date.now()) {
	if (typingStartTime === null) {
		return totalTypingTime;
	}

	return totalTypingTime + (now - typingStartTime);
}

export function shouldPauseForPrompt(typingMode) {
	return typingMode === 'guided' || typingMode === 'word';
}

export function pauseTimingForPrompt({ typingMode, accumulateElapsedTime, totalTypingTime, typingStartTime, now = Date.now() }) {
	if (!shouldPauseForPrompt(typingMode)) {
		return {
			totalTypingTime,
			typingStartTime
		};
	}

	return {
		totalTypingTime: accumulateElapsedTime(totalTypingTime, typingStartTime, now),
		typingStartTime: null
	};
}
