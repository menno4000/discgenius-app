import Song from "@/model/Song";
import Mix from "@/model/Mix";

let username_stub = "Test User";

let songs_stub = [
    new Song("Song 1", 361, 130, "s1"),
    new Song("Song 2", 382, 134, "s2"),
    new Song("Song 3", 304, 127, "s3"),
];
let mixes_stub = [
    new Mix("Mix 1", 702, 2, 130, "m1", 100),
    new Mix("Mix 2", 1240, 3, 120, "m2", 55),
];
// let available_mixes = [mixes_stub[0]]

 const stubState = {
    currentProgress: 0,
    songs: songs_stub,
    mixes: mixes_stub
}

export const getDefaultState = () => {
    return {
        currentProgress: 0,
        songs: songs_stub,
        mixes: mixes_stub,
        token: '',
        user: {}
    };
};