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

    set length(value) {
        this._length = value;
    }

    get length_seconds() {
        return this._length_seconds;
    }

    set length_seconds(value) {
        this._length_seconds = value;
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    get song_list() {
        return this._song_list;
    }

    set song_list(value) {
        this._song_list = value;
    }

    get transition_points() {
        return this._transition_points;
    }

    set transition_points(value) {
        this._transition_points = value;
    }

    get scenario_list() {
        return this._scenario_list;
    }

    set scenario_list(value) {
        this._scenario_list = value;
    }


    constructor(title, title_wav, numSongs, tempo, id, progress, progressPercent, length, length_seconds) {
        this.title = title;
        this._title_wav = title_wav
        this.numSongs = numSongs;
        this.tempo = tempo;
        this.id = id;
        this.progress = progress;
        this.progressPercent = progressPercent;
        if (length && length_seconds) {
            this._length = length;
            this._length_seconds = length_seconds;
        } else {
            this._length = "tbd."
            this._length_seconds = "tbd."
        }
        this._title_mp3 = "";
        this._url = "";
        this._title_mp3 = "";
        this._song_list = [];
        this._scenario_list = [];
        this._transition_points = [];
    }
}