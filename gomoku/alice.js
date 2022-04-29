var S0 = 0, Seed = new Array(), _20 = new Array(15), _30 = new Array(15);
const W0 = 500;
const X = [1, -1, 0, 1], Y = [0, 1, 1, 1];

export function alice_rand(x) {
    let p = Seed[S0] % x;
    S0++;
    return p;
}

function inside(n, x, y) { return x >= 0 && x < n && y >= 0 && y < n; }
function get_score(c1, c2) {
    if (c1 && c2) return 0;
    let res = 0;
    if (c1 > 0) res += _20[c1], res += W0;
    if (c2 > 0) res -= _30[c2], res -= W0;
    return res;
}
function alice_test(player, mp, x, y) {
    let n = mp.length;
    let other = 3 - player;
    let res = 0;
    let p=new Array();
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

export function alice_init(n0) {
    _20 = new Array(13), _30 = new Array(13);
    Seed = new Array(n0 * n0 * 2);
    S0 = 0;
    _20[0] = _30[0] = 1;
    for (let i = 1; i <= 12; i++) _20[i] = _20[i - 1] * 20;
    for (let i = 1; i <= 12; i++) _30[i] = _30[i - 1] * 30;
    for (let i = 0; i < n0 * n0 * 2; i++) Seed[i] = Math.floor(Math.random() * 1e8);
}

export function alice_score(player, mp, x, y) {
    let v1 = alice_test(player, mp, x, y);
    mp[x][y] = player;
    let v2 = alice_test(player, mp, x, y);
    mp[x][y] = 0;
    if (v2 == undefined) return undefined;
    return v2 - v1;
}
export function alice_put(player, mp) {
    let n = mp.length;
    let mx = 1e17;
    var prep = new Array();
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) if (!mp[i][j]) {
            let sc = alice_score(player, mp, i, j);
            if (sc != undefined) {
                if (sc < mx) mx = sc, prep = new Array();
                if (sc == mx) prep.push([i, j]);
            }
        }
    // console.log(player,prep);
    if (prep.length == 0) return [-1, -1];
    let p = prep[alice_rand(prep.length)];
    return p;
}
export function alice_back() {
    S0--;
}