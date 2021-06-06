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
    constructor(title, length, tempo, id) {
        this._title = title;
        this._length = length;
        this._tempo = tempo;
        this._id = id;
    }
}