export function setScreenState({ document, targetState }) {
	const appHeader = document.querySelector('.app-header');
	const gameScreen = document.getElementById('game-screen');
	const resultsScreen = document.getElementById('results-screen');
	const footer = document.getElementById('footer');

	if (targetState === 'MENU') {
		document.title = 'Roll with It Typing';

		appHeader.classList.remove('hidden');
		appHeader.removeAttribute('inert');

		gameScreen.classList.add('hidden');
		gameScreen.setAttribute('inert', '');

		resultsScreen.classList.add('hidden');
		resultsScreen.setAttribute('inert', '');

		footer.classList.remove('hidden');
		footer.removeAttribute('inert');
	}

	if (targetState === 'PLAYING') {
		appHeader.classList.add('hidden');
		appHeader.setAttribute('inert', '');

		gameScreen.classList.remove('hidden');
		gameScreen.removeAttribute('inert');

		resultsScreen.classList.add('hidden');
		resultsScreen.setAttribute('inert', '');

		footer.classList.add('hidden');
		footer.setAttribute('inert', '');
	}

	if (targetState === 'RESULTS') {
		appHeader.classList.add('hidden');
		appHeader.setAttribute('inert', '');

		gameScreen.classList.add('hidden');
		gameScreen.setAttribute('inert', '');

		resultsScreen.classList.remove('hidden');
		resultsScreen.removeAttribute('inert');

		footer.classList.add('hidden');
		footer.setAttribute('inert', '');
	}
}

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runInitialLessonPrompt({
	shouldSpeakInitialPrompt,
	cancelSpeechIfSpeaking,
	resetSpeakQueue,
	waitForSpeechReset,
	speak,
	getStartAnnouncementText,
	playIntroStinger,
	introStingerDurationMs,
	typingMode,
	promptChar,
	promptWord,
	speakLineOnce
}) {
	if (!shouldSpeakInitialPrompt) {
		return;
	}

	cancelSpeechIfSpeaking();
	resetSpeakQueue();
	await waitForSpeechReset();
	await speak(getStartAnnouncementText());
	playIntroStinger();
	await wait(introStingerDurationMs);

	if (typingMode === 'guided') {
		await promptChar();
	} else if (typingMode === 'word') {
		await promptWord();
	} else {
		await speakLineOnce();
	}
}
