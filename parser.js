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


// Example
const parser = new Parser(`[ar:Lil Nas X ]
[ti:Montero ]
[length:02:17.77]
[re:www.megalobiz.com/lrc/maker]
[ve:v1.2.3]
[00:07.09]I caught it bad yesterday
[00:09.34]You hit with me with a call to your place
[00:11.59]Ain't been out in a while anyway
[00:13.84]Was hoping I could catch you throwin' smiles at my face
[00:16.59]Romantic talking? You don't even have to try
[00:19.84]You're cute enough to fuck with me tonight
[00:22.34]Lookin' at the table all I see is weed and white
[00:25.09]Baby you livin' the life but nigga you ain't living right
[00:28.34]Cocaine and drinking with your friends
[00:30.58]You live in the dark, boy, I cannot pretend
[00:33.59]I'm not fazed, only here to sin
[00:36.09]If Eve ain't in your garden, you know that you can
[00:38.59]Call me when you want
[00:40.09]Call me when you need
[00:41.34]Call me in the morning
[00:42.84]I'll be on the way
[00:44.34]Call me when you want
[00:45.36]Call me when you need
[00:46.84]Call me out by your name
[00:48.08]I'll be on the way, like
[00:49.60]I wanna sell what you're buying
[01:00.19]I wanna feel on your ass in Hawaii
[01:03.18]I want that jet lag from fuckin' and flyin'
[01:05.93]Shoot a child in your mouth while I'm ridin'
[01:08.69]Oh, oh... Why me?
[01:10.93]A sign of the times every time that I speak
[01:13.68]A dime and a nine, it was mine every week
[01:16.19]What a time, an incline, God was shining on me
[01:18.93]Now I can't leave
[01:21.43]And now I'm actin' hella elite
[01:23.18]Never want the niggas that's in my league
[01:25.95]I want to fuck the ones I envy (I envy)
[01:28.68]Cocaine and drinking with your friends
[01:32.70]You live in the dark, boy, I cannot pretend
[01:34.93]I'm not fazed, only here to sin
[01:37.93]If Eve ain't in your garden, you know that you can
[01:40.44]Call me when you want
[01:42.93]Call me when you need
[01:44.43]Call me in the morning
[01:47.18]I'll be on the way
[01:47.93]Call me when you want
[01:48.68]Call me when you need
[01:49.68]Call me out by your name
[01:50.93]I'll be on the way, like
[01:52.43]Call me by your name
[01:53.93]Tell me you love me in private
[01:57.68]Call me by your name
[01:59.18]I do not care if you're lying`);

const elements = parser.parse();
console.log(elements[0], elements[1]);