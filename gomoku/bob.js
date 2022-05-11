var _20 = new Array(15), _30 = new Array(15);
const W0 = 500;
const X = [1, -1, 0, 1], Y = [0, 1, 1, 1];
var score = new Array(), ban = new Array();

function bob_rand(x) { return Math.floor(Math.random() * x); }
function inside(n, x, y) { return x >= 0 && x < n && y >= 0 && y < n; }
function get_score(c1, c2) {
    if (c1 && c2) return 0;
    let res = 0;
    if (c1 > 0) res += _20[c1], res += W0;
    if (c2 > 0) res -= _30[c2], res -= W0;
    return res;
}
function bob_test(player, mp, x, y) {
    let n = mp.length;
    let other = 3 - player;
    let res = 0;
    for (let op = 0; op < 4; op++)
        for (let i = -3; i <= 0; i++) if (inside(n, x + X[op] * i, y + Y[op] * i) && inside(n, x + X[op] * (i + 3), y + Y[op] * (i + 3))) {
            let c1 = 0, c2 = 0;
            for (let j = 0; j < 4; j++) {
                let v = mp[x + X[op] * (i + j)][y + Y[op] * (i + j)];
                if (v == player) c1++;
                else if (v == other) c2++;
            }
            if (c1 == 4) return undefined;
            res += get_score(c1, c2);
        }
    return res;
}

function bob_init(n0) {
    // console.log(n0);
    score = new Array(n0);
    for (let i = 0; i < n0; i++) score[i] = new Array();
    for (let i = 0; i < n0; i++) ban[i] = new Array();
    for (let i = 0; i < n0; i++)
        for (let j = 0; j < n0; j++) ban[i][j] = false;
    _20 = new Array(13), _30 = new Array(13);
    _20[0] = _30[0] = 1;
    for (let i = 1; i <= 12; i++) _20[i] = _20[i - 1] * 20;
    for (let i = 1; i <= 12; i++) _30[i] = _30[i - 1] * 30;
    console.log(ban);
}

function bob_score(player, mp, x, y) {
    let v1 = bob_test(player, mp, x, y);
    mp[x][y] = player;
    let v2 = bob_test(player, mp, x, y);
    mp[x][y] = 0;
    if (v2 == undefined) return undefined;
    return v2 - v1;
}
const Min_cnt = 12, All_Times = 100000;

function dfs_put(player, mp, depth) {
    let n = mp.length;
    let mn = 1e9;
    if (depth == 1) {
        let Cnt = 100, emp = 0;
        for (let i = 0; i < n; i++)
            for (let j = 0; j < n; j++) if (!mp[i][j] && !ban[i][j]) ++emp;
        Cnt = Math.min(Cnt, Math.round(All_Times / Math.pow(emp, 3)));
        let prep = new Array();
        if (Cnt < Min_cnt) {
            for (let i = 0; i < n; i++)
                for (let j = 0; j < n; j++) if (!mp[i][j] && !ban[i][j]) {
                    let sc = bob_score(player, mp, i, j);
                    if (sc != undefined) {
                        if (sc < mn) mn = sc, prep = new Array();
                        if (sc == mn) prep.push([i, j]);
                    }
                }
            Cnt = 5;
        }
        else {
            for (let i = 0; i < n; i++)
                for (let j = 0; j < n; j++) if (!mp[i][j] && !ban[i][j]) prep.push([i, j]);
        }
        if (prep.length == 1) {
            score[prep[0][0]][prep[0][1]] = 1;
            return prep[0];
        }
        let best = [[-1, -1]], vl = -1;
        for (let v of prep) {
            mp[v[0]][v[1]] = player;
            let win = 0;
            for (let k = 0; k < Cnt; k++) {
                win += !dfs_put(3 - player, mp, depth + 1);
            }
            mp[v[0]][v[1]] = 0;
            score[v[0]][v[1]] = win / Cnt;
            if (win > vl) vl = win, best = new Array();
            if (win == vl) best.push(v);
        }
        return best[bob_rand(best.length)];
    }
    let prep = new Array();
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) if (!mp[i][j]) {
            let sc = bob_score(player, mp, i, j);
            if (sc != undefined) {
                if (sc < mn) mn = sc, prep = new Array();
                if (sc == mn) prep.push([i, j]);
            }
        }
    if (prep.length == 0) return 0;
    let v = prep[bob_rand(prep.length)];
    mp[v[0]][v[1]] = player;
    let win = !dfs_put(3 - player, mp, depth + 1);
    mp[v[0]][v[1]] = 0;
    return win;
}

function bob_put(mp, hist) {
    let n = mp.length;
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) if (!mp[i][j]) {
            mp[i][j] = 2;
            if (bob_test(2, mp, i, j) == undefined) ban[i][j] = true;
            mp[i][j] = 0;
        }
        else ban[i][j] = false;
    let p = dfs_put(2, mp, 1);
    // console.log(p);
    return p;
}

function score_update(mp, scr) {
    let n = mp.length;
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) score[i][j] = undefined;
    let p = bob_put(mp);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
            if (!mp[i][j] && score[i][j] != undefined) {
                scr[i][j] = Math.round(score[i][j] * 100);
            }
            else scr[i][j] = undefined;
        }
    if (p[0] != -1) scr[p[0]][p[1]] = -scr[p[0]][p[1]];
}

setBobPut(bob_put, bob_init, score_update);