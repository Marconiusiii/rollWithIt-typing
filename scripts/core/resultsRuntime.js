export function applyResultsScreen({
	document,
	contentMode,
	activeContentTitle,
	totalTypingTime,
	totalKeystrokes,
	errors,
	errorKeys,
	errorKeysToString,
	computeCorrectKeystrokes,
	computeWpm,
	computeAccuracyPercent
}) {
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

	const correctKeystrokes = computeCorrectKeystrokes(totalKeystrokes, errors);
	const wpm = computeWpm(totalTypingTime, totalKeystrokes, errors, {
		trainingMode: contentMode === 'training'
	});
	const accuracyPercent = computeAccuracyPercent(totalKeystrokes, errors);

	const wpmVal = document.getElementById('wpm-val');
	const accVal = document.getElementById('accuracy-val');
	const errVal = document.getElementById('err-val');
	const desertLabel = document.getElementById('desertLabel');
	const desertVal = document.getElementById('desert-val');
	const wpmNote = document.getElementById('wpmNote');

	if (wpmVal) {
		wpmVal.textContent = contentMode === 'training'
			? 'Not calculated in Training Mode.'
			: `${wpm}`;
	}

	if (accVal) {
		accVal.textContent = `${accuracyPercent}%`;
	}

	if (errVal) {
		errVal.textContent = `${errors}`;
	}

	if (desertLabel && desertVal) {
		if (errorKeys.size === 0) {
			desertLabel.textContent = 'No keys deserted you this time!';
			desertVal.textContent = '';
		} else {
			desertLabel.textContent = "Practice these keys so they don't desert you again: ";
			desertVal.textContent = errorKeysToString();
		}
	}

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
