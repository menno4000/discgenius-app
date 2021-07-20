import Song from "@/model/Song";
import Mix from "@/model/Mix";

let username_stub = "Test User";

let songs_stub = [
    new Song("Song 1", "Song 1.wav",'06:01', 361, 130, "s1"),
    new Song("Song 2", "Song 2.wav",'06:22',382, 134, "s2"),
    new Song("Song 3", "Song 3.wav",'05:04',304, 127, "s3"),
];
let mix1 = new Mix("Mix 1", "Mix 1.wav",2, 130, "m1", 100, 1000, "16:40")
let mixes_stub = [
    mix1,
    new Mix("Mix 2", "Mix 2.wav", 3, 120, "m2", 55),
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