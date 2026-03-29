export function getIntroRickStingerDurationMs() {
	const tempo = 114;
	const beat = 60 / tempo;
	const sixteenth = beat / 4;

	return Math.ceil((4 * sixteenth + 0.08) * 1000);
}

export function playTypewriterBell({ audioCtx, soundEffectsEnabled }) {
	if (!soundEffectsEnabled) {
		return;
	}

	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	const now = audioCtx.currentTime;

	const strikeOsc = audioCtx.createOscillator();
	const bodyOsc = audioCtx.createOscillator();
	const bassOsc = audioCtx.createOscillator();

	const strikeGain = audioCtx.createGain();
	const bodyGain = audioCtx.createGain();
	const bassGain = audioCtx.createGain();

	strikeOsc.type = 'triangle';
	bodyOsc.type = 'sine';
	bassOsc.type = 'sine';

	strikeOsc.frequency.setValueAtTime(1800, now);
	bodyOsc.frequency.setValueAtTime(720, now);
	bassOsc.frequency.setValueAtTime(160, now);

	strikeOsc.detune.setValueAtTime(6, now);
	bodyOsc.detune.setValueAtTime(-4, now);

	strikeGain.gain.setValueAtTime(0, now);
	strikeGain.gain.linearRampToValueAtTime(0.15, now + 0.005);
	strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

	bodyGain.gain.setValueAtTime(0, now);
	bodyGain.gain.linearRampToValueAtTime(0.22, now + 0.02);
	bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

	bassGain.gain.setValueAtTime(0, now);
	bassGain.gain.linearRampToValueAtTime(0.12, now + 0.03);
	bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

	strikeOsc.connect(strikeGain);
	bodyOsc.connect(bodyGain);
	bassOsc.connect(bassGain);

	strikeGain.connect(audioCtx.destination);
	bodyGain.connect(audioCtx.destination);
	bassGain.connect(audioCtx.destination);

	strikeOsc.start(now);
	bodyOsc.start(now);
	bassOsc.start(now);

	strikeOsc.stop(now + 0.3);
	bodyOsc.stop(now + 1.0);
	bassOsc.stop(now + 0.6);
}

export function playIntroRickStinger({ audioCtx, soundEffectsEnabled }) {
	if (!soundEffectsEnabled) {
		return;
	}

	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	const now = audioCtx.currentTime;
	const tempo = 114;
	const beat = 60 / tempo;
	const sixteenth = beat / 4;

	const introNotes = [261.63, 349.23, 392.0, 523.25];

	introNotes.forEach((freq, index) => {
		const startTime = now + index * sixteenth;
		const osc = audioCtx.createOscillator();
		const gain = audioCtx.createGain();

		osc.type = index === introNotes.length - 1 ? 'sawtooth' : 'triangle';
		osc.frequency.setValueAtTime(freq, startTime);

		gain.gain.setValueAtTime(0, startTime);
		gain.gain.linearRampToValueAtTime(0.12, startTime + 0.01);
		gain.gain.exponentialRampToValueAtTime(0.001, startTime + sixteenth * 0.95);

		osc.connect(gain);
		gain.connect(audioCtx.destination);

		osc.start(startTime);
		osc.stop(startTime + sixteenth);
	});
}

export function playFinalRickChordProgression({ audioCtx, soundEffectsEnabled }) {
	if (!soundEffectsEnabled) {
		return;
	}

	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	const now = audioCtx.currentTime;
	const tempo = 114;
	const beat = 60 / tempo;
	const sixteenth = beat / 4;

	const pickupNotes = [349.23, 392.0, 349.23, 261.63];
	const bassNotes = [174.61, 196.0, 174.61, 130.81];

	pickupNotes.forEach((freq, index) => {
		const startTime = now + index * sixteenth;
		const leadOsc = audioCtx.createOscillator();
		const leadGain = audioCtx.createGain();
		const bassOsc = audioCtx.createOscillator();
		const bassGain = audioCtx.createGain();

		leadOsc.type = 'sawtooth';
		bassOsc.type = 'triangle';

		if (index === 0) {
			leadOsc.frequency.setValueAtTime(freq * 0.985, startTime);
			leadOsc.frequency.linearRampToValueAtTime(freq, startTime + 0.03);
		} else {
			leadOsc.frequency.setValueAtTime(freq, startTime);
		}

		bassOsc.frequency.setValueAtTime(bassNotes[index], startTime);

		const leadPeak = index === 0 ? 0.1 : 0.07;
		leadGain.gain.setValueAtTime(0, startTime);
		leadGain.gain.linearRampToValueAtTime(leadPeak, startTime + 0.008);
		leadGain.gain.exponentialRampToValueAtTime(0.001, startTime + sixteenth * 0.85);

		bassGain.gain.setValueAtTime(0, startTime);
		bassGain.gain.linearRampToValueAtTime(0.14, startTime + 0.008);
		bassGain.gain.exponentialRampToValueAtTime(0.001, startTime + sixteenth * 0.6);

		leadOsc.connect(leadGain);
		bassOsc.connect(bassGain);
		leadGain.connect(audioCtx.destination);
		bassGain.connect(audioCtx.destination);

		leadOsc.start(startTime);
		bassOsc.start(startTime);
		leadOsc.stop(startTime + sixteenth);
		bassOsc.stop(startTime + sixteenth);
	});

	const finalStart = now + pickupNotes.length * sixteenth;
	const finalLeadOsc = audioCtx.createOscillator();
	const finalLeadGain = audioCtx.createGain();
	const finalBassOsc = audioCtx.createOscillator();
	const finalBassGain = audioCtx.createGain();
	const vibratoOsc = audioCtx.createOscillator();
	const vibratoGain = audioCtx.createGain();

	finalLeadOsc.type = 'sawtooth';
	finalBassOsc.type = 'triangle';
	finalLeadOsc.frequency.setValueAtTime(523.25, finalStart);
	finalBassOsc.frequency.setValueAtTime(130.81, finalStart);
	vibratoOsc.type = 'sine';
	vibratoOsc.frequency.setValueAtTime(6.2, finalStart);
	vibratoGain.gain.setValueAtTime(16, finalStart);

	vibratoOsc.connect(vibratoGain);
	vibratoGain.connect(finalLeadOsc.frequency);

	finalLeadGain.gain.setValueAtTime(0, finalStart);
	finalLeadGain.gain.linearRampToValueAtTime(0.15, finalStart + 0.03);
	finalLeadGain.gain.exponentialRampToValueAtTime(0.001, finalStart + beat * 2.2);

	finalBassGain.gain.setValueAtTime(0, finalStart);
	finalBassGain.gain.linearRampToValueAtTime(0.2, finalStart + 0.03);
	finalBassGain.gain.exponentialRampToValueAtTime(0.001, finalStart + beat * 2.2);

	finalLeadOsc.connect(finalLeadGain);
	finalBassOsc.connect(finalBassGain);
	finalLeadGain.connect(audioCtx.destination);
	finalBassGain.connect(audioCtx.destination);

	finalLeadOsc.start(finalStart);
	finalBassOsc.start(finalStart);
	vibratoOsc.start(finalStart);
	finalLeadOsc.stop(finalStart + beat * 2.3);
	finalBassOsc.stop(finalStart + beat * 2.3);
	vibratoOsc.stop(finalStart + beat * 2.3);
}

export function playBeep({ audioCtx, soundEffectsEnabled }) {
	if (!soundEffectsEnabled) {
		return;
	}

	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}

	const osc = audioCtx.createOscillator();
	const gain = audioCtx.createGain();

	osc.connect(gain);
	gain.connect(audioCtx.destination);

	osc.frequency.value = 220;
	gain.gain.value = 0.05;

	osc.start();
	osc.stop(audioCtx.currentTime + 0.1);
}
