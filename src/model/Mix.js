export default class Mix {

    get title_mp3() {
        return this._title_mp3;
    }

    set title_mp3(value) {
        this._title_mp3 = value;
    }

    get title_wav() {
        return this._title_wav;
    }

    set title_wav(value) {
        this._title_wav = value;
    }

    get length() {
        return this._length;
    }

    set length(value){
        this._length = value;
    }

    constructor(title, title_wav, length, numSongs, tempo, id, progress) {
        this.title = title;
        this._title_wav = title_wav
        this.numSongs = numSongs;
        this.tempo = tempo;
        this.id = id;
        this.progress = progress;
        this._title_mp3 = "";
        this._length = "";

    }
}