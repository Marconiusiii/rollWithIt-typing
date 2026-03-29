export function shuffleArray(arr, randomFn = Math.random) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(randomFn() * (i + 1));
		const tmp = arr[i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
	return arr;
}

export function findTypingTrainingRowById(trainingSets, rowId) {
	if (!rowId || typeof trainingSets !== 'object' || !trainingSets) {
		return null;
	}

	for (const layout of Object.values(trainingSets)) {
		if (!layout || !layout.rows) {
			continue;
		}

		for (const row of Object.values(layout.rows)) {
			if (row && row.id === rowId) {
				return { layout, row };
			}
		}
	}

	return null;
}

export function buildTrainingLessonText(rowDef, randomFn = Math.random) {
	if (!rowDef || !Array.isArray(rowDef.keys)) {
		return '';
	}

	const keys = rowDef.keys.slice();

	if (rowDef.mode === 'random') {
		shuffleArray(keys, randomFn);
	}

	return keys.join('\n');
}
