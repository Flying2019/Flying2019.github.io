var _20 = new Array(15), _30 = new Array(15);
const W0 = 300;
const X = [1, -1, 0, 1], Y = [0, 1, 1, 1];
var score = new Array();

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
    for (let i = 0; i < n0; i++) score[i] = new Array(n0);
    _20 = new Array(13), _30 = new Array(13);
    _20[0] = _30[0] = 1;
    for (let i = 1; i <= 12; i++) _20[i] = _20[i - 1] * 20;
    for (let i = 1; i <= 12; i++) _30[i] = _30[i - 1] * 30;
}

function bob_score(player, mp, x, y) {
    let v1 = bob_test(player, mp, x, y);
    mp[x][y] = player;
    let v2 = bob_test(player, mp, x, y);
    mp[x][y] = 0;
    if (v2 == undefined) return undefined;
    return v2 - v1;
}
const Approx = [undefined, 4, 2.5, 1.0, 1.0];
const Min_Approx = 1.2;
function dfs_put(player, mp, depth) {
    let n = mp.length;
    let mn = 1e17;
    let prep = new Array(), p0 = [-1, -1];
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) if (!mp[i][j]) {
            let sc = bob_score(player, mp, i, j);
            if (sc != undefined) {
                prep.push([[i, j], sc]);
                if (sc < mn) mn = sc, p0 = [i, j];
            }
        }
    // console.log(depth, prep.length);
    if (prep.length == 0) return [[-1, -1], mn];
    if (depth == 4) {
        return p0;
    }
    let p = [-1, -1], vl = 1e17;
    let tmp = new Array();
    for (let v of prep)
        if (v[1] <= mn * Approx[depth]) tmp.push(v);
    prep = tmp;
    for (let i = 1; i < prep.length; i++) {
        let v = bob_rand(i + 1);
        let t = prep[v]; prep[v] = prep[i]; prep[i] = t;
    }
    let c = 0;
    for (let v of prep) {
        if (v[1] > mn * Min_Approx) {
            if (c >= 10) continue;
            ++c;
        }
        mp[v[0][0]][v[0][1]] = player;
        let w = dfs_put(3 - player, mp, depth + 1);
        if (v[1] - w[1] < vl) vl = v[1] - w[1], p = v[0];
        mp[v[0][0]][v[0][1]] = 0;
        if (depth == 1)
            score[v[0][0]][v[0][1]] = v[1] - w[1];
    };
    return [p, vl];
}

function bob_put(mp, hist) {
    let p = dfs_put(2, mp, 1);
    // console.log(p[0]);
    return p[0];
}

function score_update(mp, scr) {
    let n = mp.length;
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) score[i][j] = undefined;
    let p = dfs_put(2, mp, 1);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
            if (!mp[i][j] && score[i][j] != undefined) {
                scr[i][j] = Math.round(score[i][j] / 100);
            }
            else scr[i][j] = undefined;
        }
}

setBobPut(bob_put, bob_init, score_update);