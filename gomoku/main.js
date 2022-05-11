"use strict";

import { alice_back, alice_init, alice_put, alice_score } from "./alice.js";

let mp = new Array(), ban = new Array();
let n = 7, End = false;
const Color = ["gray", "#008800", "#0000aa", "#cc8800"];
const char = ["\u00A0", "○", "●"];
const BanCellBackground = ["white", "#a0ffa0", "#ffa0a0", "#eeee77"];
const X = [-1, -1, -1, 0, 0, 1, 1, 1], Y = [-1, 0, 1, -1, 1, -1, 0, 1];
let bob_put = function (mp, hist) { return alice_put(2, mp); };
let bob_init = function (n0) { };

let hist = new Array();
let scr = new Array();
let scr_print = false;
let scr_update = undefined;
let Stop = false;
let on_test = false, on_Auto = false;
//Check

function update_ban_cell() {
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) ban[i][j] = 0;
    for (let player = 1; player <= 2; player++) {
        for (let i = 0; i < n; i++)
            for (let j = 0; j < n; j++) {
                for (let op = 0; op < 8; op++) if (i + X[op] * 3 >= 0 && i + X[op] * 3 < n && j + Y[op] * 3 >= 0 && j + Y[op] * 3 < n) {
                    let c = 0;
                    for (let k = 0; k < 4; k++) if (mp[i + X[op] * k][j + Y[op] * k] == player) c += 1;
                    else if (mp[i + X[op] * k][j + Y[op] * k] == 3 - player) { c = 0; break; }
                    if (c == 3) {
                        for (let k = 0; k < 4; k++) if (!mp[i + X[op] * k][j + Y[op] * k])
                            ban[i + X[op] * k][j + Y[op] * k] |= 1 << (player - 1);
                    }
                }
            }
    }
}

function check_end() {
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
            if (mp[i][j] == 0 && !(ban[i][j] >> 1 & 1)) return false;
    return true;
}

function init() {
    n = document.getElementById("type").value;
    End = false;
    mp = new Array(n);
    ban = new Array(n);
    scr = new Array(n);
    for (let i = 0; i < n; i++) scr[i] = new Array(n);
    for (let i = 0; i < n; i++) mp[i] = new Array(n);
    for (let i = 0; i < n; i++) ban[i] = new Array(n);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) mp[i][j] = 0, ban[i][j] = 0;
    hist = new Array();
    alice_init(n);
    // console.log(n);
    bob_init(n);
}

function print() {
    if (on_test == false && scr_update != undefined && scr_print == true)
        scr_update(mp, scr);
    const main = document.getElementById('main');
    main.textContent = '';
    for (let i = 0; i < n; i++) {
        let p = document.createElement('div');
        for (let j = 0; j < n; j++) {
            let cell = document.createElement('button');
            cell.style.height = '50px';
            cell.style.width = '50px';
            cell.classList.add('clickcell');
            cell.addEventListener('click', () => {
                Click(i, j);
            });
            cell.style.color = Color[i == hist[hist.length - 1][0] && j == hist[hist.length - 1][1] ? 3 : mp[i][j]];
            if (ban[i][j]) {
                cell.style.backgroundColor = BanCellBackground[ban[i][j]];
                if (ban[i][j] >> 1 & 1) cell.setAttribute('disabled', '');
            }
            else if (mp[i][j]) {
                cell.style.backgroundColor = "white";
                cell.setAttribute('disabled', '');
            }
            if (scr_print && !mp[i][j] && !(ban[i][j] >> 1 & 1) && scr[i][j] != undefined) {
                if (!(ban[i][j] & 1)) {
                    if (scr[i][j] < 0) cell.style.backgroundColor = "rgb(164 243 85)";
                    else cell.style.backgroundColor = "orange";
                }
                if (scr[i][j] < 0) cell.innerText = -scr[i][j];
                else cell.innerText = scr[i][j];
                if (cell.innerText == 100) cell.innerText = "+";
            }
            else cell.innerText = char[mp[i][j]];
            p.appendChild(cell);
        }
        document.getElementById('main').appendChild(p);
    }
    if (hist.length < 2) document.getElementById('back').setAttribute('disabled', '');
    if (hist.length > 1 && !End) document.getElementById('back').removeAttribute('disabled');
}

function end(winner_player) {
    let str = winner_player == 1 ? `<strong style="font-size: 14px; color: red;">Alice Win</strong>` : `<strong style="font-size: 14px; color: green;">Bob Win</strong>`;
    update_ban_cell();
    print();
    document.getElementById('end').innerHTML = str;
    document.getElementById('step').setAttribute('disabled', '');
    document.getElementById('main').setAttribute('disabled', '');
    document.getElementById('restart').removeAttribute('disabled');
    document.getElementById('auto').setAttribute('disabled', '');
    document.getElementById('back').setAttribute('disabled', '');
    document.getElementById('tests').setAttribute('disabled', '');
    End = true;
}

function setBobPut(new_bob_put, new_bob_init, new_scr_update) {
    bob_init = new_bob_init;
    new_bob_init(n);
    bob_put = new_bob_put;
    scr_update = new_scr_update;
}
globalThis.setBobPut = setBobPut;

function Alice() {
    let p = alice_put(1, mp);
    if (p[0] == -1) { end(2); return; }
    else mp[p[0]][p[1]] = 1, hist.push(p);
    update_ban_cell();
    if (check_end()) end(1);
}

function Bob() {
    let p = bob_put(mp, hist);
    if (p[0] == -1) { end(1); return; }
    else mp[p[0]][p[1]] = 2, hist.push(p);
    update_ban_cell();
}

function Click(x, y) {
    if (mp[x][y] || ban[x][y] >> 1 & 1 || End) return;
    hist.push([x, y]);
    mp[x][y] = 2;
    Alice();
    print();
}

function start() {
    document.getElementById('back').removeAttribute('disabled');
    document.getElementById('tests').removeAttribute('disabled');
    document.getElementById('auto').removeAttribute('disabled');
    document.getElementById('step').removeAttribute('disabled');
    if (scr_update == undefined)
        document.getElementById('score').setAttribute('disabled', '');
    else
        document.getElementById('score').removeAttribute('disabled');
    document.getElementById('main').style.visibility = 'visible';
    document.getElementById('test').innerHTML = "";
    document.getElementById('end').innerHTML = "";
    init();
    Alice();
    print();
}

function Back() {
    if (End || hist.length < 2) return;
    for (let i = 0; i <= 1; i++) {
        let p = hist[hist.length - 1];
        mp[p[0]][p[1]] = 0;
        hist.pop();
    }
    alice_back();
    update_ban_cell();
    print();
}

function Step() {
    Bob();
    if (End) return;
    Alice();
    update_ban_cell();
    print();
}

function Auto_play(player, callback) {
    if (End || Stop) {
        callback();
        return;
    }
    if (player == 1) Alice();
    else Bob();
    update_ban_cell();
    print();
    setTimeout(() => { Auto_play(3 - player, callback); }, 10);
}
function Auto() {
    if (on_Auto) { Stop = true; return; }
    Stop = false; on_Auto = true;
    document.getElementById('back').setAttribute('disabled', '');
    document.getElementById('step').setAttribute('disabled', '');
    document.getElementById('tests').setAttribute('disabled', '');
    document.getElementById('select').style.visibility = 'hidden';
    document.getElementById('restart').setAttribute('disabled', '');
    document.getElementById('auto').innerText = "Stop";
    Auto_play(1, () => {
        on_Auto = false;
        document.getElementById('auto').innerText = "Auto";
        if (!End) {
            document.getElementById('back').removeAttribute('disabled', '');
            document.getElementById('step').removeAttribute('disabled', '');
            document.getElementById('tests').removeAttribute('disabled', '');
        }
        document.getElementById('restart').removeAttribute('disabled');
        document.getElementById('select').style.visibility = 'visible';
    });
}

let win_cnt;
function test_one(times, Times, callback) {
    if (Stop || times > Times) {
        callback(times - 1);
        return;
    }
    init();
    for (let i = 0; i <= 1000; i++) {
        let p = alice_put(1, mp);
        if (p[0] == -1) { win_cnt++; break; }
        else mp[p[0]][p[1]] = 1;
        update_ban_cell();
        p = bob_put(mp, hist);
        if (p[0] == -1) break;
        else {
            if (ban[p[0]][p[1]] >> 1 & 1 || mp[p[0]][p[1]] == 2) break;
            mp[p[0]][p[1]] = 2;
            update_ban_cell();
        }
    }
    // console.log(win_cnt,times);
    document.getElementById('test').innerHTML = "Running  " + times + " ...";
    setTimeout(() => { test_one(times + 1, Times, callback); }, 0);
}
function Test() {
    if (on_test) { Stop = true; return; }
    Stop = false;
    start();
    document.getElementById('back').setAttribute('disabled', '');
    document.getElementById('auto').setAttribute('disabled', '');
    document.getElementById('step').setAttribute('disabled', '');
    document.getElementById('select').setAttribute('disabled', '');
    document.getElementById('restart').setAttribute('disabled', '');
    document.getElementById('score').setAttribute('disabled', '');
    document.getElementById('tests').innerText = "Stop";
    on_test = true;
    document.getElementById('main').style.visibility = 'hidden';
    document.getElementById('select').style.visibility = 'hidden';
    win_cnt = 0;
    End = true;
    test_one(1, 10000, (T) => {
        on_test = false;
        document.getElementById('tests').innerText = "Test";
        document.getElementById('restart').removeAttribute('disabled');
        document.getElementById('select').style.visibility = 'visible';
        document.getElementById('test').innerHTML = "rate:  " + Math.round(win_cnt / (T / 100) * 10) / 10 + "% ( " + win_cnt + " / " + T + " )";
    });
}
function flip_score() {
    scr_print = !scr_print;
    if (scr_print)
        document.getElementById('score').innerText = "Hide Score";
    else
        document.getElementById('score').innerText = "Show Score";
    update_ban_cell();
    print();
}

function upload() {
    let file = document.getElementById('filename').files[0];
    if (!!file) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (e) {
            console.log(e.target.result);
            import('data:text/javascript,' + e.target.result).then(() => {
                if (scr_update != undefined)
                    document.getElementById('filesource').innerText = "Load Successfully",
                        start();
            });
        }
    }
}

function Init() {
    document.getElementById('back').addEventListener('click', () => { Back(); });
    document.getElementById('auto').addEventListener('click', () => { Auto(); });
    document.getElementById('step').addEventListener('click', () => { Step(); });
    document.getElementById('tests').addEventListener('click', () => { Test(); });
    document.getElementById('restart').addEventListener('click', () => { start(); });
    document.getElementById('score').addEventListener('click', () => { flip_score(); });
    document.getElementById('filename').addEventListener('change', () => { upload(); });
    document.getElementById('type').addEventListener('change', () => { start(); });
    start();
    upload();
}

window.onload = Init();