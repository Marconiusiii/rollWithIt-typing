export function initFooterYear(document) {
	const yearEl = document.getElementById('copyrightYear');
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}
}

export function initButtons({
	document,
	isChrome,
	startBtnHandler,
	exitBtnHandler,
	hardResetSpeechSynthesis,
	setMenuState
}) {
	const startLessonButton = document.getElementById('startLessonButton');
	const exitLessonButton = document.getElementById('exitLessonButton');
	const closeResultsButton = document.getElementById('closeResultsButton');
	const resetSpeechButton = document.getElementById('resetSpeechButton');

	if (resetSpeechButton) {
		if (isChrome) {
			resetSpeechButton.addEventListener('click', () => {
				hardResetSpeechSynthesis();
			});
		} else {
			resetSpeechButton.style.display = 'none';
		}
	}

	if (startLessonButton) {
		startLessonButton.addEventListener('click', startBtnHandler);
	}

	if (exitLessonButton) {
		exitLessonButton.addEventListener('click', exitBtnHandler);
	}

	if (closeResultsButton) {
		closeResultsButton.addEventListener('click', () => {
			setMenuState();
			document.getElementById('startLessonButton')?.focus();
		});
	}
}
