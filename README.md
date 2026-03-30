# Roll With It Typing

Roll With It Typing is an accessible, browser-based typing practice experience designed to work equally well for screen reader users and sighted users.

The project began as a playful typing experiment and has evolved into a full typing tutor with multiple input modes, configurable speech behavior, varied content, and strong accessibility foundations.

This repository represents the non-joke, extensible version of the project. The original joke-based implementation is preserved separately in its own branch, and the working joke version can be found here: [Original Roll With It Typing](https://marconius.com/fun/rollWithIt/)

## Version

Current release: 1.8.1

## Features

- Multiple typing modes
  - Guided mode with character-by-character prompts
  - Word mode with progressive word-by-word reveal and spoken word prompts
  - Sentence mode with free typing and error feedback
- Configurable sentence mode speech behavior
  - Characters
  - Words
  - Characters and words
  - Errors only
- Speech controls
  - Voice selection
  - Speech rate slider
  - Speech volume slider
  - Voice sample playback
- Punctuation speech modes
  - No punctuation
  - Some punctuation
  - All punctuation
- Sound effects toggle
- Multiple content sources
  - Random built-in set selection
  - User-selected set selection
  - Custom pasted content
  - Training mode drills
- Difficulty-grouped non-coding content
  - Beginner
  - Intermediate
  - Advanced
- Separate Coding content group for code-focused sets
- Accessible progress tracking and results
  - Line-based progress readout
  - WPM
  - Accuracy percentage
  - Error key reporting
  - Word-level mistake reporting in Word and Sentence mode
- Keyboard-first interaction
- Screen reader-friendly semantics

## Typing Modes

Each typing mode is designed to support a different style of practice.

- Guided mode
  - Speaks the next character to type
  - Best for highly supported, character-focused practice
- Word mode
  - Reveals each line one word at a time
  - Speaks the next word when it becomes active
  - Useful for building flow without revealing the whole sentence at once
- Sentence mode
  - Speaks the full line first
  - Leaves typing more open-ended and closer to traditional sentence practice

## WPM And Accuracy

The app uses mode-aware timing so Words Per Minute is measured fairly across the different input styles.

- Sentence mode measures continuous active typing time
- Word mode excludes spoken word-prompt time from WPM
- Guided mode excludes spoken character-prompt time from WPM
- Training mode does not calculate WPM

Accuracy remains based on attempted input versus errors across modes.

## Training Mode

Training Mode is designed for focused key-drill practice rather than full sentence typing.

Training Mode features include:

- Keyboard layout drills for both QWERTY and Dvorak
- Row-based practice sets, including:
  - Number row
  - Top letter row
  - Home row
  - Bottom letter row
  - Punctuation for QWERTY
- Randomized drills for:
  - Letters
  - Letters and numbers
  - Letters, numbers, and punctuation
- One character per line lesson flow so users practice discrete key targets without typing separator spaces
- Training-specific results behavior where WPM is not calculated, while accuracy and error tracking are still reported

## Accessibility

Accessibility is a core design goal, not an afterthought.

Key accessibility considerations include:

- Clear separation between visual rendering and accessibility semantics
- Sentence mode presents content as a single atomic text node for screen readers
- Guided mode preserves per-character feedback without forcing per-character navigation
- Word mode progressively reveals each line while keeping future words hidden until reached
- Inert is used to prevent focus from moving into inactive sections
- Programmatic focus management for state changes
- Screen-reader-friendly settings and content controls
- No decorative dependence on sight-only workflows

The project is designed to meet WCAG 2.2 Level AA expectations for keyboard and screen reader users.

## Typing Sets

The project includes a growing collection of built-in typing sets covering topics such as:

- Literature and poetry
- Disability rights and digital accessibility
- Food and drink
- Movies, television, and music
- Libraries, books, and museums
- Science, history, and technology
- Animals, games, and everyday life
- Coding, Python, web development, terminal use, and SVG

Typing sets are defined in JavaScript and automatically populate the set selection menu. Adding new sets does not require HTML changes.

## Content Organization

Built-in content is organized to make selection easier.

- Non-coding sets are grouped by difficulty:
  - Beginner
  - Intermediate
  - Advanced
- Coding sets remain in their own Coding group

This keeps general typing practice progressive while preserving quick access to code-oriented material.

## Custom Content

Users may paste or type their own content to create custom typing lessons.

- Content is sanitized before use
- Content is broken into individual lines
- Lessons are capped at 40 lines
- Settings persist across lessons until changed again

This makes the project suitable for informal teaching, practice, workshops, and experimentation.

## Project Structure

- index.html  
  Main document structure and accessible layout
- css/rollStyle.css  
  All visual styling
- scripts/rollWithIt.js  
  Main app coordinator and startup wiring
- scripts/core/  
  Smaller modules for metrics, settings, content, speech, sound effects, gameplay, results, and UI/runtime helpers

The project is framework-free and runs entirely in the browser.

## Branches

- main  
  Current, extensible, accessibility-first implementation
- rickRoll-original  
  Original joke-based typing experience preserved for reference

## Roadmap

Planned future enhancements include:

- Additional typing sets and curated difficulty expansion
- Importing typing sets from files
- Optional per-set speech behavior overrides
- Creating custom sets built around missed letters or words

## License

MIT. See `LICENSE`.

## Credits

Created by Chancey Fleet and maintained by Marco Salsiccia.

Built with a focus on accessibility, usability, and careful iteration.
