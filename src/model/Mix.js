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
    get length_seconds() {
        return this._length_seconds;
    }

    set length_seconds(value){
        this._length_seconds = value;
    }
    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    constructor(title, title_wav, numSongs, tempo, id, progress, length=0, length_seconds="") {
        this.title = title;
        this._title_wav = title_wav
        this.numSongs = numSongs;
        this.tempo = tempo;
        this.id = id;
        this.progress = progress;
        if (length > 0) {
            this._length = length
        } else {
            this._length = 0
        }
        if (length_seconds) {
            this._length_seconds = length_seconds
        }
        else {
            this._length_seconds = "00:00"
        }
        this._title_mp3 = "";
        this._url = "";
        this._title_mp3 = "";
    }
}