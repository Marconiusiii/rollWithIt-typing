const typingContentSets = [
	{
		id: 'classic-lit',
		title: 'Classic Literature',
		lines: [
			'Call me Ishmael, and mind your commas.',
			'It was the best of times, it was typed well.',
			'All happy families type alike.',
			'The page was blank, and waiting patiently.',
			'Some truths are universally acknowledged.',
			'Beware the jabber of careless fingers.',
			'Time slipped quietly between the words.',
			'The story began with a single letter.',
			'A sentence marched forward, steady and sure.',
			'The final line rested at last.'
		]
	},
	{
		id: 'shakespeare',
		title: 'Shakespearean Rhythm',
		lines: [
			'To type, or not to type, that is typed.',
			'Words, words, words, all marching on.',
			'The play is typed upon this stage.',
			'Fair letters dance upon the screen.',
			'Once more unto the keyboard, friends.',
			'The prompt speaks, and you respond.',
			'A pause, a breath, a comma lands.',
			'The line completes, the cursor waits.',
			'All the world’s a typing test.',
			'Exit, pursued by accuracy.'
		]
	},
	{
		id: 'poetry',
		title: 'Poetry and Meter',
		lines: [
			'The line begins with quiet grace.',
			'Each letter falls into its place.',
			'The rhythm taps beneath your hands.',
			'A pause between the words feels right.',
			'Short lines can still carry weight.',
			'The cursor blinks like measured time.',
			'The stanza waits for no delay.',
			'Breath in, type on, then let go.',
			'The poem listens as you type.',
			'Silence follows the final word.'
		]
	},
	{
		id: 'mystery',
		title: 'Mystery and Suspense',
		lines: [
			'The letter appeared without warning.',
			'A shadow crept between the keys.',
			'Something was missing from the line.',
			'The cursor blinked, impatient now.',
			'A clue hid in plain sight.',
			'Each word narrowed the search.',
			'The sentence ended too soon.',
			'Footsteps echoed in the margins.',
			'The truth revealed itself slowly.',
			'Case closed with a final keystroke.'
		]
	},
	{
		id: 'fantasy',
		title: 'Fantasy and Myth',
		lines: [
			'The scroll unfurled before your eyes.',
			'Ancient words shimmered on the page.',
			'A spell was typed with careful care.',
			'The dragon paused to read.',
			'Each rune required steady hands.',
			'The quest advanced line by line.',
			'Magic lives in punctuation.',
			'The hero hesitated, then typed.',
			'The prophecy reached its end.',
			'The tale slept until typed again.'
		]
	},
	{
		id: 'science-fiction',
		title: 'Science Fiction',
		lines: [
			'The console hummed softly.',
			'Coordinates scrolled across the screen.',
			'A signal blinked in binary rhythm.',
			'The future typed itself forward.',
			'Errors could alter the timeline.',
			'The system waited for input.',
			'A pause, then confirmation.',
			'Data flowed line by line.',
			'The mission logged successfully.',
			'End transmission.'
		]
	},
{
	id: "spyThriller",
	name: "Spy Thriller",
	lines: [
		"The message was hidden inside an ordinary postcard.",
		"She memorized the exit routes before sitting down.",
		"Every reflection in the glass felt like surveillance.",
		"The briefcase changed hands without a word being spoken.",
		"His phone vibrated once, then went silent at the worst moment.",
		"A coded phrase was repeated on the radio, calm and precise.",
		"She swapped jackets in the hallway and disappeared into the crowd.",
		"The safe house door was unlocked, which meant someone had been there.",
		"He copied the file, erased the trace, and left the lights unchanged.",
		"Trust was the most dangerous thing in the room."
	]
},
	{
		id: 'philosophy',
		title: 'Philosophy',
		lines: [
			'I think, therefore I type.',
			'Each word questions the next.',
			'Meaning forms between letters.',
			'The pause matters as much as text.',
			'Truth rarely arrives instantly.',
			'Thought unfolds one line at a time.',
			'Doubt lingers near the cursor.',
			'The sentence resolves itself.',
			'Understanding types slowly.',
			'Reflection ends with a period.'
		]
	},
	{
		id: 'childrens-lit',
		title: 'Children’s Literature',
		lines: [
			'The mouse ran across the keys.',
			'A small letter made a big sound.',
			'The page smiled back gently.',
			'Words hopped like playful frogs.',
			'The story liked being typed.',
			'Each line felt like a rhyme.',
			'The cursor blinked cheerfully.',
			'The sentence waved hello.',
			'Almost time to say goodbye.',
			'The book closed softly.'
		]
	},
	{
		id: 'writing-about-writing',
		title: 'Writing About Writing',
		lines: [
			'The sentence waits to be written.',
			'Fingers hover, then begin.',
			'A typo tries to sneak in.',
			'Accuracy pulls it back.',
			'The line grows more confident.',
			'Punctuation finds its place.',
			'The rhythm feels familiar.',
			'Editing happens in real time.',
			'The paragraph feels complete.',
			'The writer pauses.'
		]
	},
	{
		id: 'meta',
		title: 'Meta Typing',
		lines: [
			'This line knows it is a line.',
			'The words are aware of you.',
			'Typing reveals the secret.',
			'Each letter waits its turn.',
			'The sentence enjoys attention.',
			'A mistake almost escaped.',
			'The cursor judges silently.',
			'You and the text agree.',
			'The final line approaches.',
			'The story ends... for now.'
		]
	},
	{
		id: 'cats',
		title: 'Cat Typing Detected',
		lines: [
			'The cat watched the cursor blink.',
			'Soft paws crossed the keyboard.',
			'A tail flicked near the screen.',
			'The cat typed nothing on purpose.',
			'Whiskers twitched at every sound.',
			'A nap followed intense focus.',
			'The cat claimed the chair.',
			'Keys warmed under gentle paws.',
			'The screen reflected curious eyes.',
			'Typing paused for purring.'
		]
	},
	{
		id: 'dogs',
		title: 'Dogs',
		lines: [
			'The dog waited by the desk.',
			'A wagging tail hit the chair.',
			'Ears perked at every beep.',
			'The dog approved of progress.',
			'Typing stopped for a treat.',
			'Paws paced across the floor.',
			'The screen earned a curious sniff.',
			'The dog settled nearby.',
			'Keys clicked in steady rhythm.',
			'A nap followed good work.'
		]
	},
	{
		id: 'guide-dogs',
		title: 'Guide Dogs',
		lines: [
			'The guide dog rested calmly.',
			'Focus mattered at every step.',
			'Trust moved them forward together.',
			'The harness stayed gently still.',
			'Training turned care into skill.',
			'The path ahead felt familiar.',
			'Signals mattered more than words.',
			'The dog waited for direction.',
			'Movement followed quiet cues.',
			'The team paused, confident.'
		]
	},
	{
		id: 'art-puns',
		title: 'Art (may have Puns)',
		lines: [
			'The artist drew a blank on purpose.',
			'This sketch really paints a picture.',
			'I canvas believe how well this typed.',
			'That idea was framed perfectly.',
			'The brush stroked everyone the right way.',
			'Abstract thoughts made concrete lines.',
			'The gallery gave standing ovations.',
			'This sentence is a work in progress.',
			'The colors argued, then found balance.',
			'Art history repeats itself, stylishly.'
		]
	},
	{
		id: 'foodies',
		title: 'Typing for Foodies',
		lines: [
			'The menu reads like a love letter.',
			'Seasoning mattered more than speed.',
			'The sauce finally found balance.',
			'A perfect bite deserved a pause.',
			'Textures told the real story.',
			'The chef trusted simple ingredients.',
			'Plating turned dinner into art.',
			'Flavors lingered between words.',
			'A recipe evolved with practice.',
			'The last bite earned silence.'
		]
	},
	{
		id: 'food',
		title: 'Typing while Hungry',
		lines: [
			'Breakfast started the day gently.',
			'Soup warmed the room.',
			'Bread baked slowly.',
			'Lunch arrived right on time.',
			'Snacks disappeared quickly.',
			'Dinner brought everyone together.',
			'Leftovers waited patiently.',
			'Spices filled the air.',
			'Cooking felt familiar.',
			'The meal ended happily.'
		]
	},
{
	id: "travel",
	name: "Travel",
	lines: [
		"Airports are busy places full of announcements, luggage, and long lines.",
		"I checked my passport twice before leaving the house.",
		"The train arrived late, but the view from the window was worth the wait.",
		"A small cafe near the hotel served strong coffee and fresh bread.",
		"I asked for a late checkout and a quiet room away from the elevator.",
		"Before the day trip, I filled a bottle of water and packed sunscreen.",
		"The map showed three routes, so I chose the simplest one to navigate.",
		"I kept small bills for tips and saved receipts for the travel log.",
		"The museum opened at ten, and we arrived early to avoid the crowd.",
		"At the end of the day, I charged my phone and reviewed tomorrow's plan."
	]
},
{
	id: "gardening",
	name: "Gardening",
	lines: [
		"The soil was dark, loose, and ready for planting.",
		"Tomatoes grow best with steady water and full sun.",
		"I trimmed the dead branches to help the plant recover.",
		"Compost adds nutrients back into tired ground.",
		"I pulled weeds after the rain, when the roots were easier to remove.",
		"Mulch kept the moisture in and reduced heat stress on the seedlings.",
		"I planted basil near the tomatoes to save space and deter pests.",
		"The hose nozzle was set to a gentle spray to protect young leaves.",
		"I checked the undersides of leaves for aphids and tiny eggs.",
		"Gardening rewards attention, timing, and care."
	]
},
	{
		id: 'space',
		title: 'Space and Planets',
		lines: [
			'Planets drifted across the screen.',
			'Orbits followed silent rules.',
			'A comet passed without warning.',
			'Stars blinked like distant pixels.',
			'Gravity held everything together.',
			'The moon waited patiently.',
			'Mars glowed a dusty red.',
			'Saturn balanced fragile rings.',
			'Space stretched beyond sight.',
			'The universe typed quietly.'
		]
	},
{
	id: "biology",
	name: "Biology",
	lines: [
		"Cells divide through a carefully controlled process.",
		"DNA carries instructions for growth and repair.",
		"Enzymes speed up chemical reactions in living organisms.",
		"Plants convert sunlight into energy through photosynthesis.",
		"Proteins fold into shapes that determine how they function.",
		"Neurons send signals using electrical impulses and chemical messengers.",
		"Homeostasis keeps internal conditions stable despite external changes.",
		"Natural selection favors traits that improve survival and reproduction.",
		"Microbes can be helpful, harmful, or essential to an ecosystem.",
		"Biology explains how structure and function are connected."
	]
},
	{
		id: 'history',
		title: 'History',
		lines: [
			'History remembers small details.',
			'Stories survived careful writing.',
			'Time changed the meaning of words.',
			'Ink once carried every thought.',
			'Letters traveled long distances.',
			'Pages outlived their authors.',
			'Records shaped our memory.',
			'The past typed slowly.',
			'Voices echoed through time.',
			'The story continued forward.'
		]
	},
	{
		id: 'chemistry',
		title: 'Chemistry',
		lines: [
			'Atoms moved in steady patterns.',
			'Bonds formed with quiet force.',
			'Reactions required patience.',
			'Elements lined the table.',
			'Heat changed everything.',
			'Solutions mixed carefully.',
			'The formula balanced out.',
			'Measurements mattered deeply.',
			'Results surprised everyone.',
			'The experiment concluded.'
		]
	},
	{
		id: 'fun-and-games',
		title: 'Fun and Games',
		lines: [
			'The game began with a click.',
			'Rules were learned quickly.',
			'Focus sharpened with play.',
			'A mistake caused laughter.',
			'Timing mattered most.',
			'The challenge increased slowly.',
			'Victory felt satisfying.',
			'Defeat taught patience.',
			'Practice improved results.',
			'The game ended happily.'
		]
	},
	{
		id: 'rock-bands',
		title: 'Rock Bands',
		lines: [
			'The Beatles',
			'The Rolling Stones',
			'Pink Floyd',
			'Queen',
			'The Who',
			'Eagles',
			'The Beach Boys',
			'Abba',
			'Heart',
			'Steely Dan',
			'Led Zeppelin',
			'Bon Jovi',
			'Van Halen',
			'ZZ Top',
			'Negativland',
			'Foo Fighters',
			'Green Day',
			'Red Hot Chili Peppers',
			'Shinedown',
			'Nirvana'
		]
	},
	{
		id: 'musicians',
		title: 'Famous Musicians',
		lines: [
			'John Lennon',
			'Paul McCartney',
			'Ringo Starr',
			'George Harrison',
			'Les Paul',
			'Bob Dylan',
			'Madonna',
			'Kate Bush',
			'Michael Jackson',
			'David Bowie',
			'Taylor Swift',
			'Rihanna',
			'Beyonce',
			'Lady Gaga',
			'Imogen Heap',
			'Beth Gibbons',
			'Ariana Grande',
			'Michelle Branch',
			'Trent Reznor',
			'Kurt Cobain'
		]
	},
	{
		id: 'coding-fundamentals',
		title: 'Coding Fundamentals',
		type: 'code',
		lines: [
			`const count = 0;`,
			`let totalScore = count + 5;`,
			`if (totalScore > 10) return;`,
			`function add(a, b) { return a + b; }`,
			`for (let i = 0; i < 5; i++) {}`,
			`while (isRunning) { checkState(); }`,
			`const name = "Ada";`,
			`console.log("Hello, world");`,
			`array.map(item => item.id);`,
			`export default startGame;`
		]
	},
	{
		id: 'python-fundamentals',
		title: 'Python Fundamentals',
		type: 'code',
		lines: [
			'print("Hello, world")',
			'x = 10',
			'y = x + 5',
			'if x > 5:',
			'for i in range(5):',
			'def add(a, b):',
			'return a + b',
			'mylist = [1, 2, 3]',
			'myDictionary = {"a": 1, "b": 2}',
			'result = add(x, y)'
		]
	},
	{
		id: 'web-basics',
		title: 'Web Basics',
		type: 'code',
		lines: [
			`<button type="button">Click me</button>`,
			`document.querySelector("#app");`,
			`element.addEventListener("click", start);`,
			`const heading = document.createElement("h1");`,
			`input.value = "";`,
			`form.submit();`,
			`window.location.href = "/home";`,
			`console.log(event.target);`,
			`button.disabled = true;`,
			`main.appendChild(section);`
		]
	},
	{
		id: 'svg-basics',
		title: 'SVG Basics',
		type: 'code',
		lines: [
			`<svg viewBox="0 0 100 100">`,
			`<circle cx="50" cy="50" r="40" />`,
			`<rect x="10" y="10" width="80" height="80" />`,
			`<line x1="0" y1="0" x2="100" y2="100" />`,
			`<path d="M10 10 L90 10" />`,
			`<text x="50" y="50">Hello</text>`,
			`fill="none"`,
			`stroke="black"`,
			`stroke-width="2"`,
			`</svg>`
		]
	}
];