export function getCurrentWordRange(line, charIndex) {
	if (!line) {
		return null;
	}

	if (charIndex >= line.length) {
		return {
			start: line.length,
			end: line.length
		};
	}

	let start = charIndex;

	if (line[charIndex] === ' ') {
		start = charIndex + 1;

		while (start < line.length && line[start] === ' ') {
			start++;
		}

		let end = start;

		while (end < line.length && line[end] !== ' ') {
			end++;
		}

		return {
			start,
			end
		};
	}

	while (start > 0 && line[start - 1] !== ' ') {
		start--;
	}

	let end = charIndex;

	while (end < line.length && line[end] !== ' ') {
		end++;
	}

	return {
		start,
		end
	};
}

export function getCurrentWord(line, charIndex) {
	const range = getCurrentWordRange(line, charIndex);
	if (!range || range.start >= range.end) {
		return '';
	}

	return line.slice(range.start, range.end);
}

export function getWordRevealEnd(line, charIndex) {
	if (!line) {
		return 0;
	}

	const currentWord = getCurrentWordRange(line, charIndex);
	return line[charIndex] === ' '
		? charIndex + 1
		: (currentWord ? currentWord.end : line.length);
}

export function isAtWordBoundary(line, charIndex) {
	if (!line || charIndex >= line.length) {
		return false;
	}

	if (line[charIndex] === ' ') {
		return false;
	}

	return charIndex === 0 || line[charIndex - 1] === ' ';
}

export function isWordEnd(line, index) {
	if (!line) {
		return false;
	}

	if (index <= 0) {
		return false;
	}

	if (index >= line.length) {
		return line[line.length - 1] !== ' ';
	}

	return line[index - 1] !== ' ' && line[index] === ' ';
}

export function getExpectedWord(line, charIndex) {
	if (!line || charIndex >= line.length) {
		return '';
	}

	let start = charIndex;
	let end = charIndex;

	while (start > 0 && line[start - 1] !== ' ') {
		start--;
	}

	while (end < line.length && line[end] !== ' ') {
		end++;
	}

	return line.slice(start, end).trim();
}

export function getLastWord(line, endIndex) {
	const part = line.slice(0, endIndex).trim();
	if (!part) {
		return '';
	}

	const words = part.split(/\s+/);
	return words[words.length - 1] || '';
}
