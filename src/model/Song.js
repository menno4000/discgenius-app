export default class Song {
    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get length() {
        return this._length;
    }

    set length(value) {
        this._length = value;
    }

    get tempo() {
        return this._tempo;
    }

    set tempo(value) {
        this._tempo = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get title_wav() {
        return this._title_wav;
    }

    set title_wav(value) {
        this._title_wav = value;
    }

    get title_mp3() {
        return this._title_mp3;
    }

    set title_mp3(value) {
        this._title_mp3 = value;
    }
    constructor(title, title_wav, length, tempo, id) {
        this._title = title;
        this._title_wav = title_wav;
        this._length = length;
        this._tempo = tempo;
        this._id = id;
        this._title_mp3 = "";
    }
}