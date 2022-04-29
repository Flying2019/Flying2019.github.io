"use strict";

import { alice_back, alice_init, alice_put, alice_score } from "./alice.js";

var mp = new Array(), ban = new Array();
var n = 7, End = false;
const Color = ["rgba(0,0,0,0)", "#008800", "#0000aa", "#cc8800"];
const char = ["\u00A0", "o", "x"];
const BanCellBackground = ["white", "#a0ffa0", "#ffa0a0", "#eeee77"];
const X = [-1, -1, -1, 0, 0, 1, 1, 1], Y = [-1, 0, 1, -1, 1, -1, 0, 1];

var hist = new Array();
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
    for (let i = 0; i < n; i++) mp[i] = new Array(n);
    for (let i = 0; i < n; i++) ban[i] = new Array(n);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) mp[i][j] = 0, ban[i][j] = 0;
    hist = new Array();
    alice_init(n);
}

function print() {
    const main = document.getElementById('main');
    main.textContent = '';
    for (let i = 0; i < n; i++) {
        let p = document.createElement('div');
        for (let j = 0; j < n; j++) {
            let cell = document.createElement('button');
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
            cell.innerText = char[mp[i][j]];
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
    document.getElementById('main').setAttribute('disabled', '');
    document.getElementById('restart').removeAttribute('disabled');
    document.getElementById('auto').setAttribute('disabled', '');
    document.getElementById('back').setAttribute('disabled', '');
    document.getElementById('tests').setAttribute('disabled', '');
    End = true;
}

var bob_put = function (mp) { return alice_put(2, mp); };

function Alice() {
    var p = alice_put(1, mp);
    if (p[0] == -1) { end(2); return; }
    else mp[p[0]][p[1]] = 1, hist.push(p);
    update_ban_cell();
    if (check_end()) end(1);
}

function Bob() {
    var p = bob_put(mp);
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
    document.getElementById('restart').setAttribute('disabled', '');
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

function Auto() {
    while (!End) {
        Bob();
        if (End) break;
        Alice();
        update_ban_cell();
        print();
    }
}
var win_cnt;
function test_one(times, Times, callback) {
    if (times == Times) {
        callback();
        return;
    }
    init();
    for (var i = 0; i <= 1000; i++) {
        var p = alice_put(1, mp);
        if (p[0] == -1) { win_cnt++; break; }
        else mp[p[0]][p[1]] = 1;
        update_ban_cell();
        p = bob_put(mp);
        if (p[0] == -1) break;
        else {
            if (ban[p[0]][p[1]] >> 1 & 1 || mp[p[0]][p[1]] == 2) break;
            mp[p[0]][p[1]] = 2;
            update_ban_cell();
        }
    }
    document.getElementById('test').innerHTML = "Running  " + Math.round(times / (Times / 100)) + "% ...";
    setTimeout(() => { test_one(times + 1, Times, callback); }, 0);
}
function Test() {
    start();
    document.getElementById('back').setAttribute('disabled', '');
    document.getElementById('tests').setAttribute('disabled', '');
    document.getElementById('auto').setAttribute('disabled', '');
    document.getElementById('select').setAttribute('disabled', '');
    document.getElementById('main').style.visibility = 'hidden';
    document.getElementById('select').style.visibility = 'hidden';
    win_cnt = 0;
    let Times = Math.round(50000 / (n * n));
    End = true;
    test_one(0, Times, () => {
        document.getElementById('restart').removeAttribute('disabled');
        document.getElementById('select').style.visibility = 'visible';
        document.getElementById('test').innerHTML = "rate:  " + Math.round(win_cnt / (Times / 100) * 10) / 10 + "%";
    });
}

function Init() {
    document.getElementById('back').addEventListener('click', () => { Back(); });
    document.getElementById('auto').addEventListener('click', () => { Auto(); });
    document.getElementById('tests').addEventListener('click', () => { Test(); });
    document.getElementById('restart').addEventListener('click', () => { start(); });
    document.getElementById('type').addEventListener('change', () => { start(); });
    start();
}

window.onload = Init();