"use strict";

var mp=new Array(),ban=new Array();
var n=7,End=false,Seed=new Array(),S0=0;
const Color=["rgba(0,0,0,0)","#008800","#0000aa","#cc8800"];
const char=["&nbsp;","o","x"];
const BanCellBackground=["white","#a0ffa0","#ffa0a0 !important","#eeee77 !important"];
const X=[-1,-1,-1,0,0,1,1,1],Y=[-1,0,1,-1,1,-1,0,1];

var hist=new Array();

function Rand(x)
{
    let p=Seed[S0]%x;
    S0++;
    return p;
}

//Alice

var _20=new Array(15),_30=new Array(15);

function alice_init()
{
    _20=new Array(15),_30=new Array(15);
    _20[0]=_30[0]=1;
    for(let i=1;i<=12;i++) _20[i]=_20[i-1]*20;
    for(let i=1;i<=12;i++) _30[i]=_30[i-1]*30;
}
function alice_score(player,mp)
{
    let other=3-player;
    let res=0;
    for(let i=0;i<n;i++)
        for(let j=0;j+3<n;j++)
        {
            let c1=0,c2=0;
            for(let k=0;k<4;k++) c1+=(mp[i][j+k]==player);
            for(let k=0;k<4;k++) c2+=(mp[i][j+k]==other);
            if(c1 && c2) continue;
            if(c1==4) return undefined;
            if(c1>0) res+=_20[c1],res+=500;
            if(c2>0) res-=_30[c2],res-=500;
        }
    for(let i=0;i+3<n;i++)
        for(let j=0;j<n;j++)
        {
            let c1=0,c2=0;
            for(let k=0;k<4;k++) c1+=(mp[i+k][j]==player);
            for(let k=0;k<4;k++) c2+=(mp[i+k][j]==other);
            if(c1 && c2) continue;
            if(c1==4) return undefined;
            if(c1>0) res+=_20[c1],res+=500;
            if(c2>0) res-=_30[c2],res-=500;
        }
    for(let i=0;i+3<n;i++)
        for(let j=0;j+3<n;j++)
        {
            let c1=0,c2=0;
            for(let k=0;k<4;k++) c1+=(mp[i+k][j+k]==player);
            for(let k=0;k<4;k++) c2+=(mp[i+k][j+k]==other);
            if(c1 && c2) continue;
            if(c1==4) return undefined;
            if(c1>0) res+=_20[c1],res+=500;
            if(c2>0) res-=_30[c2],res-=500;
        }
    for(let i=0;i+3<n;i++)
        for(let j=3;j<n;j++)
        {
            let c1=0,c2=0;
            for(let k=0;k<4;k++) c1+=(mp[i+k][j-k]==player);
            for(let k=0;k<4;k++) c2+=(mp[i+k][j-k]==other);
            if(c1 && c2) continue;
            if(c1==4) return undefined;
            if(c1>0) res+=_20[c1],res+=500;
            if(c2>0) res-=_30[c2],res-=500;
        }
    return res;
}
function alice_put(player,mp)
{
    let mx=1e17;
    var prep=new Array();
    for(let i=0;i<n;i++)
        for(let j=0;j<n;j++) if(!mp[i][j])
        {
            mp[i][j]=player;
            let sc=alice_score(player,mp);
            if(sc!=undefined)
            {
                if(sc<mx) mx=sc,prep=new Array();
                if(sc==mx) prep.push([i,j]);
            }
            mp[i][j]=0;
        }
    // console.log(player,prep);
    if(prep.length==0) return [-1,-1];
    let p=prep[Rand(prep.length)];
    return p;
}

//Check

function update_ban_cell()
{
    for(let i=0;i<n;i++)
        for(let j=0;j<n;j++) ban[i][j]=0;
    for(let player=1;player<=2;player++)
    {
        for(let i=0;i<n;i++)
            for(let j=0;j<n;j++)
            {
                for(let op=0;op<8;op++) if(i+X[op]*3>=0 && i+X[op]*3<n && j+Y[op]*3>=0 && j+Y[op]*3<n)
                {
                    let c=0;
                    for(let k=0;k<4;k++) if(mp[i+X[op]*k][j+Y[op]*k]==player) c+=1;
                    else if(mp[i+X[op]*k][j+Y[op]*k]==3-player){c=0;break;}
                    if(c==3)
                    {
                        for(let k=0;k<4;k++) if(!mp[i+X[op]*k][j+Y[op]*k])
                            ban[i+X[op]*k][j+Y[op]*k]|=1<<(player-1);
                    }
                }
            }
    }
}

function check_end()
{
    for(let i=0;i<n;i++)
        for(let j=0;j<n;j++)
            if(mp[i][j]==0 && !(ban[i][j]>>1&1)) return false;
    return true;
}

function init()
{
    n=document.getElementById("type").value;
    End=false;
    mp=new Array(n);
    ban=new Array(n);
    for(let i=0;i<n;i++) mp[i]=new Array(n);
    for(let i=0;i<n;i++) ban[i]=new Array(n);
    for(let i=0;i<n;i++) 
        for(let j=0;j<n;j++) mp[i][j]=0,ban[i][j]=0;
    hist=new Array();
    Seed=new Array();
    for(let i=0;i<200;i++) Seed[i]=Math.floor(Math.random()*1e8);
    S0=0;
}

function print()
{
    let str=`<celltable style="float: center; font-size: 30px; line-height: 1.12em;"><tr>`;
    for(let i=0;i<n;i++)
    {
        let p=`<div>`;
        for(let j=0;j<n;j++)
        {
            p+=`<cell onclick='Click(`+i+`,`+j+`);' style="color: `+Color[i==hist[hist.length-1][0] && j==hist[hist.length-1][1]?3:mp[i][j]]+";";
            if(ban[i][j]) p+="background-color: "+BanCellBackground[ban[i][j]];
            else if(mp[i][j]) p+="background-color: white !important;";
            p+=`">`+char[mp[i][j]]+`</cell>`;
        }
        p+="</div>";
        str+=p;
    }
    str+=`</celltable>`;
    document.getElementById('main').innerHTML=str;
}

function end(winner_player)
{
    let str=winner_player==1?`<strong style="font-size: 14px; color: red;">Alice Win</strong>`:`<strong style="font-size: 14px; color: green;">Bob Win</strong>`;
    update_ban_cell();
    print();
    document.getElementById('end').innerHTML=str;
    document.getElementById('restart').style.visibility='visible';
    End=true;
}

var bob_put=function (mp){return alice_put(2,mp);};

function Alice()
{
    var p=alice_put(1,mp);
    if(p[0]==-1){end(2);return;}
    else mp[p[0]][p[1]]=1,hist.push(p);
    update_ban_cell();
    if(check_end()) end(1);
}

function Bob()
{
    var p=bob_put(mp);
    if(p[0]==-1){end(1);return;}
    else mp[p[0]][p[1]]=2,hist.push(p);
    update_ban_cell();
}

function Click(x,y)
{
    if(mp[x][y] || ban[x][y]>>1&1 || End) return;
    hist.push([x,y]);
    mp[x][y]=2;
    Alice();
    print();
}

function start()
{
    document.getElementById('restart').style.visibility='hidden';
    document.getElementById('test').innerHTML="";
    document.getElementById('end').innerHTML="";
    init();
    Alice();
    print();
}

function Back()
{
    if(End || hist.length<2) return;
    for(let i=0;i<=1;i++)
    {
        let p=hist[hist.length-1];
        mp[p[0]][p[1]]=0;
        hist.pop();
    }
    S0--;
    update_ban_cell();
    print();
}

function Auto()
{
    while(!End)
    {
        Bob();
        if(End) break;
        Alice();
        update_ban_cell();
        print();
    }
}

function Test()
{
    document.getElementById('back').style.visibility='hidden';
    document.getElementById('auto').style.visibility='hidden';
    let win_cnt=0,Times=n<=9?200:100;
    for(let T=1;T<=Times;T++)
    {
        init();
        End=true;
        for(var i=0;i<=1000;i++)
        {
            var p=alice_put(1,mp);
            if(p[0]==-1){win_cnt++;break;}
            else mp[p[0]][p[1]]=1;
            update_ban_cell();
            p=bob_put(mp);
            if(p[0]==-1) break;
            else
            {
                if(ban[p[0]][p[1]]>>1&1 || mp[p[0]][p[1]]==2) break;
                mp[p[0]][p[1]]=2;
                update_ban_cell();
            }
        }
    }
    console.log(win_cnt);
    document.getElementById('restart').style.visibility='visible';
    document.getElementById('test').innerHTML="rate:  "+(win_cnt/(Times/100))+"%";
    End=true;
    document.getElementById('back').style.visibility='visible';
    document.getElementById('auto').style.visibility='visible';
}

window.onload = alice_init();
window.onload = start();