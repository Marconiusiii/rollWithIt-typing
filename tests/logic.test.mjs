import test from 'node:test';
import assert from 'node:assert/strict';

import {
	computeCorrectKeystrokes,
	computeAccuracyPercent,
	computeWpm,
	accumulateElapsedTime
} from '../scripts/core/metrics.js';
import {
	MAX_CUSTOM_LINES,
	sanitizeText,
	buildLinesFromText,
	enforceLineLimitValue
} from '../scripts/core/textProcessing.js';
import {
	getCurrentWordRange,
	getCurrentWord,
	getWordRevealEnd,
	isAtWordBoundary,
	isWordEnd,
	getExpectedWord,
	getLastWord
} from '../scripts/core/wordMode.js';
import {
	shuffleArray,
	findTypingTrainingRowById,
	buildTrainingLessonText
} from '../scripts/core/training.js';
import { loadAppSettings } from '../scripts/core/settings.js';

test('metrics helpers compute correct values', () => {
	assert.equal(computeCorrectKeystrokes(50, 5), 45);
	assert.equal(computeAccuracyPercent(50, 5), 90);
	assert.equal(computeWpm(60000, 50, 0), 10);
	assert.equal(computeWpm(0, 50, 0), 0);
	assert.equal(computeWpm(60000, 50, 0, { trainingMode: true }), null);
	assert.equal(accumulateElapsedTime(1000, 2000, 3500), 2500);
});

test('text processing sanitizes and splits content safely', () => {
	assert.equal(sanitizeText('<b>Hello</b>\r\nWorld\u200B'), 'Hello\nWorld');
	assert.deepEqual(buildLinesFromText('One. Two? Three!'), ['One.', 'Two?', 'Three!']);
	assert.equal(
		enforceLineLimitValue('1\n2\n3', 2),
		'1\n2'
	);
	const manyLines = Array.from({ length: MAX_CUSTOM_LINES + 2 }, (_, i) => String(i)).join('\n');
	assert.equal(buildLinesFromText(manyLines).length, MAX_CUSTOM_LINES);
});

test('word mode helpers track reveal and boundaries', () => {
	assert.deepEqual(getCurrentWordRange('hello world', 0), { start: 0, end: 5 });
	assert.deepEqual(getCurrentWordRange('hello world', 5), { start: 6, end: 11 });
	assert.equal(getCurrentWord('hello world', 6), 'world');
	assert.equal(getWordRevealEnd('hello world', 0), 5);
	assert.equal(getWordRevealEnd('hello world', 5), 6);
	assert.equal(isAtWordBoundary('hello world', 0), true);
	assert.equal(isAtWordBoundary('hello world', 6), true);
	assert.equal(isWordEnd('hello world', 5), true);
	assert.equal(getExpectedWord('hello world', 7), 'world');
	assert.equal(getLastWord('hello world', 11), 'world');
});

test('training helpers find rows and build lessons', () => {
	const trainingSets = {
		qwerty: {
			name: 'QWERTY',
			rows: {
				home: {
					id: 'home',
					keys: ['a', 's', 'd']
				},
				random: {
					id: 'random',
					mode: 'random',
					keys: ['x', 'y', 'z']
				}
			}
		}
	};

	assert.equal(findTypingTrainingRowById(trainingSets, 'home').row.id, 'home');
	assert.equal(buildTrainingLessonText(trainingSets.qwerty.rows.home), 'a\ns\nd');
	assert.equal(buildTrainingLessonText(trainingSets.qwerty.rows.random, () => 0), 'y\nz\nx');
	assert.deepEqual(shuffleArray(['a', 'b', 'c'], () => 0), ['b', 'c', 'a']);
});

test('settings loader applies defaults and stored values', () => {
	const storage = new Map([
		['typingMode', 'word'],
		['preferredVoiceRatePercent', '42'],
		['preferredVoiceVolumePercent', '65'],
		['soundEffectsEnabled', 'false']
	]);
	const fakeStorage = {
		getItem(key) {
			return storage.has(key) ? storage.get(key) : null;
		}
	};

	const settings = loadAppSettings(fakeStorage);
	assert.equal(settings.typingMode, 'word');
	assert.equal(settings.selectedVoiceRatePercent, 42);
	assert.equal(settings.selectedVoiceVolumePercent, 65);
	assert.equal(settings.soundEffectsEnabled, false);
	assert.equal(settings.sentenceSpeechMode, 'errors');
});
