# Roll With It Typing

Roll With It Typing is an accessible, browser-based typing practice experience designed to work equally well for screen reader users and sighted users.

The project began as a playful typing experiment and has evolved into a fully usable typing tutor framework with multiple input modes, configurable content, and strong accessibility foundations.

This repository represents the non-joke, extensible version of the project. The original joke-based implementation is preserved separately in its own branch and the working joke version can be found here: [Original Roll With It Typing](https://marconius.com/fun/rollWithIt/)

## Version

Current release: 1.4.1
## Features

- Multiple typing modes
	- Guided mode with character-by-character prompts
	- Sentence mode with free typing and error feedback
- Configurable speech verbosity for sentence mode
	- Characters
	- Words
	- Characters and words
	- Errors only
- All Punctuation Spoken toggle
- Sound Effects toggle
- Multiple content sources
	- Built-in typing sets
	- Randomized set selection
	- User-selected set selection
	- Custom pasted content
- Accessible progress tracking
	- Line-based progress readout
	- Clear results summary
- Detailed results metrics
	- Accurate Words per Minute Calculation
	- Accuracy Percentage
	- Error key reporting
- Keyboard-first interaction
- Screen reader–friendly semantics
## Accessibility

Accessibility is a core design goal, not an afterthought.

Key accessibility considerations include:

- Clear separation between visual rendering and accessibility semantics
- Sentence mode presents content as a single atomic text node for screen readers
- Guided mode preserves per-character feedback without forcing per-character navigation
- Inert is used to prevent focus from moving into inactive sections
- Programmatic focus management for state changes
- No automatic announcements that interrupt typing flow

The project is designed to meet WCAG 2.2 Level AA expectations for keyboard and screen reader users.

## Typing Sets

The project includes a growing collection of built-in typing sets covering topics such as:

- Literature
- Poetry
- Coding, Python, and web development
- SVG and markup
- Art and design
- Animals
- Science
- History
- Food
- Fun and games

Typing sets are defined in JavaScript and automatically populate the set selection menu. Adding new sets does not require HTML changes.

## Custom Content

Users may paste or type their own content to create custom typing lessons.

- Content is sanitized before use
- Content is broken into individual lines
- Lessons are capped at 40 lines
- Settings persist across lessons until the page is refreshed

This makes the project suitable for informal teaching, practice, or experimentation.

## Project Structure

- index.html  
	Main document structure and accessible layout
- rollStyle.css  
	All visual styling
- rollWithIt.js  
	Application logic, typing engine, speech handling, and state management

The project is framework-free and runs entirely in the browser.

## Branches

- main  
	Current, extensible, accessibility-first implementation
- rickRoll-original  
	Original joke-based typing experience preserved for reference

## Roadmap

Planned future enhancements include:

- Additional typing sets and difficulty tiers
- Importing typing sets from files
- Optional per-set speech behavior overrides
- Creating custom sets built around missed letters

## License

License information to be added.

## Credits

Created by Chancey fleet and maintained by Marco Salsiccia.

Built with a focus on accessibility, usability, and careful iteration.
