'use strict';

class Tokens {
	constructor() {
		this.ARTIST = 'ar'  // Lyrics artist, (Luis Fonsi)
		this.ALBUM = 'al'  // Album where the song is from (Vida)
		this.TITLE = 'ti'  // Lyrics (song) title (Despacito)
		this.AUTHOR = 'au'  // Creator of the Songtext / Lyricist (Luis Fonsi)
		this.LENGTH = 'length'  // How long the song is (3:47)
		// Creator of the LRC file (Name of the person who created the Lyrics file, like, -> Musixmatch)
		this.BY = 'by'
		this.PLAYER = 're'  // The player or editor that created the LRC file
		this.VERSION = 've'  // Version of LRC file

		this.S_BRACKET_O = '['
		this.S_BRACKET_C = ']'
		this.COLON = ':'

		this.all_ = [this.ARTIST, this.ALBUM, this.TITLE, this.AUTHOR, this.LENGTH, this.BY, this.PLAYER,
				this.VERSION, this.S_BRACKET_O, this.S_BRACKET_C, this.COLON]

		this.tags = {
			'ar': 'ARTIST',
			'al': 'ALBUM',
			'ti': 'TITLE',
			'au': 'AUTHOR',
			'length': 'LENGTH',
			'by': 'BY',
			're': 'PLAYER',
			've': 'VERSION',
		}		
	}
}

class Parser {
    constructor(file_content) {
        this.content = file_content;
        this.tag_elements = {};
        this.lyrics = {};
		this.tokens = new Tokens();
    }

    parse() {
        let c = this.content.split(this.tokens.S_BRACKET_C)
        for (let i of this.tokens.all_) {
            for (let j of c) {
                if (j.trim().startsWith(`${this.tokens.S_BRACKET_O}${i}`)) {
                    this.tag_elements[this.tokens.tags[j.replace(this.tokens.S_BRACKET_O, '').split(this.tokens.COLON)[0]]] = j.replace(this.tokens.S_BRACKET_O, '').split(this.tokens.COLON).splice(1, j.length).join(this.tokens.COLON).trim()
                    if (c.indexOf(j) > -1) {
                        c.splice(c.indexOf(j), 1);
                    }
                }
            }
        }

        let temp_time = null;
        for (let i of c) {
            let t = i.split(this.tokens.S_BRACKET_O)
            if (i.startsWith(this.tokens.S_BRACKET_O)) {
                temp_time = t[1]
            } else if (temp_time != null) {
                this.lyrics[temp_time] = t[0]
                try { temp_time = t[1] } catch { }
            }
        }

        return [this.tag_elements, this.lyrics];
    }
}


const parser = new Parser(`[au:Name of the author][ve:1.0.1][0:0:0]lyrics here....`);
const elements = parser.parse();
console.log(elements[0], elements[1]);