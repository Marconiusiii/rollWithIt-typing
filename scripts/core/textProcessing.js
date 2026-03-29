export const MAX_CUSTOM_LINES = 40;

export function sanitizeText(rawText) {
	if (!rawText) {
		return '';
	}

	let text = rawText;
	text = text.replace(/<[^>]*>/g, '');
	text = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
	text = text.replace(/\r\n?/g, '\n');

	return text.trim();
}

export function buildLinesFromText(text, maxLines = MAX_CUSTOM_LINES) {
	if (!text) {
		return [];
	}

	let linesArr = [];

	if (text.includes('\n')) {
		linesArr = text.split('\n');
	} else {
		linesArr = text.split(/(?<=[.!?])\s+/);
	}

	linesArr = linesArr
		.map(line => line.trim())
		.filter(line => line.length > 0);

	return linesArr.slice(0, maxLines);
}

export function enforceLineLimitValue(rawValue, maxLines = MAX_CUSTOM_LINES) {
	const raw = rawValue.replace(/\r\n?/g, '\n');
	const linesArr = raw.split('\n');

	if (linesArr.length <= maxLines) {
		return rawValue;
	}

	return linesArr.slice(0, maxLines).join('\n');
}
