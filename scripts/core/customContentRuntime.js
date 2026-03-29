export function enforceLineLimit({ textarea, enforceLineLimitValue, maxCustomLines }) {
	if (!textarea) {
		return;
	}

	textarea.value = enforceLineLimitValue(textarea.value, maxCustomLines);
}

export function clearCustomContentError(document) {
	const input = document.getElementById('customContentInput');
	const error = document.getElementById('customContentError');

	if (input) {
		input.classList.remove('has-error');
	}

	if (error) {
		error.classList.add('hidden');
	}
}

export function showCustomContentError(document) {
	const input = document.getElementById('customContentInput');
	const error = document.getElementById('customContentError');

	if (input) {
		input.classList.add('has-error');
		input.focus();
	}

	if (error) {
		error.classList.remove('hidden');
	}
}
