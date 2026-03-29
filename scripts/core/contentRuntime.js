export function populateTypingTrainingSelect({ typingTrainingSelect, typingTrainingSets }) {
	if (!typingTrainingSelect) {
		return;
	}

	typingTrainingSelect.innerHTML = '';

	Object.values(typingTrainingSets).forEach(layout => {
		const optgroup = document.createElement('optgroup');
		optgroup.label = layout.name;

		Object.values(layout.rows).forEach(row => {
			const option = document.createElement('option');
			option.value = row.id;
			option.textContent = row.name;
			optgroup.appendChild(option);
		});

		typingTrainingSelect.appendChild(optgroup);
	});
}

export function populateContentSetSelect({ contentSetSelect, typingContentSets }) {
	if (!contentSetSelect) {
		return;
	}

	contentSetSelect.innerHTML = '';

	const nonCodeSets = [];
	const codeSets = [];

	for (const set of typingContentSets) {
		if (set.type === 'code') {
			codeSets.push(set);
		} else {
			nonCodeSets.push(set);
		}
	}

	for (const set of nonCodeSets) {
		const option = document.createElement('option');
		option.value = set.id;
		option.textContent = set.title;
		contentSetSelect.appendChild(option);
	}

	if (codeSets.length > 0) {
		const codingGroup = document.createElement('optgroup');
		codingGroup.label = 'Coding';

		for (const set of codeSets) {
			const option = document.createElement('option');
			option.value = set.id;
			option.textContent = set.title;
			codingGroup.appendChild(option);
		}

		contentSetSelect.appendChild(codingGroup);
	}
}

export function getRandomContentSet(typingContentSets) {
	const eligibleSets = typingContentSets.filter(set => set.type !== 'code');

	if (eligibleSets.length === 0) {
		return null;
	}

	const index = Math.floor(Math.random() * eligibleSets.length);
	return eligibleSets[index];
}

export function getSelectedContentSet({ contentSetSelect, typingContentSets }) {
	if (!contentSetSelect) {
		return null;
	}

	return typingContentSets.find(set => set.id === contentSetSelect.value) || null;
}

export function buildLessonPayload({
	contentMode,
	typingContentSets,
	contentSetSelect,
	typingTrainingSelect,
	sanitizeText,
	buildLinesFromText,
	findTypingTrainingRowById,
	buildTrainingLessonText,
	customContentInput
}) {
	if (contentMode === 'original') {
		const set = getRandomContentSet(typingContentSets);
		if (!set) {
			return { error: 'No typing content sets are available.' };
		}

		return {
			lyricsText: set.lines.join('\n'),
			activeContentTitle: set.title,
			usesCodingShortcuts: set.type === 'code'
		};
	}

	if (contentMode === 'set') {
		const set = getSelectedContentSet({ contentSetSelect, typingContentSets });
		if (!set) {
			return { error: null };
		}

		return {
			lyricsText: set.lines.join('\n'),
			activeContentTitle: set.title,
			usesCodingShortcuts: set.type === 'code'
		};
	}

	if (contentMode === 'custom') {
		const rawText = customContentInput ? customContentInput.value : '';
		const cleanText = sanitizeText(rawText);
		const customLines = buildLinesFromText(cleanText);

		if (customLines.length === 0) {
			return { validationError: 'customContentEmpty' };
		}

		return {
			lyricsText: customLines.join('\n'),
			activeContentTitle: 'Custom Typing',
			usesCodingShortcuts: false
		};
	}

	if (contentMode === 'training') {
		const rowId = typingTrainingSelect ? typingTrainingSelect.value : '';
		const found = findTypingTrainingRowById(rowId);

		if (!found || !found.row) {
			return { error: 'No typing training set is selected.' };
		}

		return {
			lyricsText: buildTrainingLessonText(found.row),
			activeContentTitle: `${found.layout.name} - ${found.row.name}`,
			usesCodingShortcuts: true
		};
	}

	return { error: 'No typing content mode is selected.' };
}
