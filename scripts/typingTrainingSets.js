const typingTrainingSets = {
	qwerty: {
		id: "qwerty",
		name: "QWERTY",
		rows: {
			numberRow: {
				id: "qwertyNumberRow",
				name: "Number Row",
				keys: [
					"`","1","2","3","4","5","6","7","8","9","0","-","="
				]
			},
			row1: {
				id: "qwertyRow1",
				name: "Top Letter Row",
				keys: [
					"q","w","e","r","t","y","u","i","o","p","[","]","\\"
				]
			},
			row2: {
				id: "qwertyRow2",
				name: "Home Row",
				keys: [
					"a","s","d","f","g","h","j","k","l",";","'"
				]
			},
			row3: {
				id: "qwertyRow3",
				name: "Bottom Letter Row",
				keys: [
					"z","x","c","v","b","n","m",",",".","/"
				]
			},
			punctuationRow: {
				id: "qwertyPunctuation",
				name: "Shifted Punctuation",
				keys: [
					"~", "!","@","#","$","%","^","&","*","(",")","_","+",
					"{","}","|",
					":","\"",
					"<",">","?"
				]
			},
			randomAllLetters: {
				id: "qwertyRandomLetters",
				name: "Random Letters",
				mode: "random",
				keys: [
					"q","w","e","r","t","y","u","i","o","p",
					"a","s","d","f","g","h","j","k","l",
					"z","x","c","v","b","n","m"
				]
			},
			randomLettersNumbers: {
				id: "qwertyRandomLettersNumbers",
				name: "Random Letters and Numbers",
				mode: "random",
				keys: [
					"q","w","e","r","t","y","u","i","o","p",
					"a","s","d","f","g","h","j","k","l",
					"z","x","c","v","b","n","m",
					"1","2","3","4","5","6","7","8","9","0"
				]
			},
			randomAllKeys: {
				id: "qwertyRandomAllKeys",
				name: "Random Letters, Numbers, and Punctuation",
				mode: "random",
				keys: [
					"q","w","e","r","t","y","u","i","o","p",
					"a","s","d","f","g","h","j","k","l",
					"z","x","c","v","b","n","m",
					"1","2","3","4","5","6","7","8","9","0",
					"-","=","[","]","\\",";","'","`",",",".","/",
					"!","@","#","$","%","^","&","*","(",")","_","+",
					"{","}","|",":","\"","<",">","?"
				]
			}
		}
	},

	dvorak: {
		id: "dvorak",
		name: "Dvorak",
		rows: {
			numberRow: {
				id: "dvorakNumberRow",
				name: "Number Row",
				keys: [
					"1","2","3","4","5","6","7","8","9","0","[","]","`"
				]
			},
			row1: {
				id: "dvorakRow1",
				name: "Top Letter Row",
				keys: [
					"' ",",",".","p","y","f","g","c","r","l","/","=","\\"
				]
			},
			row2: {
				id: "dvorakRow2",
				name: "Home Row",
				keys: [
					"a","o","e","u","i","d","h","t","n","s","-"
				]
			},
			row3: {
				id: "dvorakRow3",
				name: "Bottom Letter Row",
				keys: [
					";","q","j","k","x","b","m","w","v","z"
				]
			},
			randomAllLetters: {
				id: "dvorakRandomLetters",
				name: "Random Letters",
				mode: "random",
				keys: [
					"a","o","e","u","i","d","h","t","n","s",
					"p","y","f","g","c","r","l",
					"q","j","k","x","b","m","w","v","z"
				]
			},
			randomLettersNumbers: {
				id: "dvorakRandomLettersNumbers",
				name: "Random Letters and Numbers",
				mode: "random",
				keys: [
					"a","o","e","u","i","d","h","t","n","s",
					"p","y","f","g","c","r","l",
					"q","j","k","x","b","m","w","v","z",
					"1","2","3","4","5","6","7","8","9","0"
				]
			},
			randomAllKeys: {
				id: "dvorakRandomAllKeys",
				name: "Random Letters, Numbers, and Punctuation",
				mode: "random",
				keys: [
					"a","o","e","u","i","d","h","t","n","s",
					"p","y","f","g","c","r","l",
					"q","j","k","x","b","m","w","v","z",
					"1","2","3","4","5","6","7","8","9","0",
					"[","]","-","=","\\","'",";",",",".","/",
					"!","@","#","$","%","^","&","*","(",")","_","+",
					"{","}","|",":","\"","<",">","?"
				]
			}
		}
	}
};
