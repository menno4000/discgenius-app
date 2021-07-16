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

    get length_seconds() {
        return this._length_seconds;
    }

    set length_seconds(value) {
        this._length_seconds = value;
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


    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }
    
    constructor(title, title_wav, length, length_seconds, tempo, id, url) {
        this._title = title;
        this._title_wav = title_wav;
        this._length = length;
        this._length_seconds = length_seconds;
        this._tempo = tempo;
        this._id = id;
        this._url = "";
        this._title_mp3 = "";
    }
}