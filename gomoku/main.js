"use strict";

var mp=new Array(),ban=new Array();
var n=7,End=false,Seed=new Array(),S0=0;
const Color=["rgba(0,0,0,0)","#000000","#000000"];
const char=["*","●","○"],BanCellBackground="#ffc0c0";
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
function alice_score()
{
    let res=0;
    for(let i=0;i<n;i++)
        for(let j=0;j+3<n;j++)
        {
            let c1=0,c2=0;
            for(let k=0;k<4;k++) c1+=(mp[i][j+k]==1);
            for(let k=0;k<4;k++) c2+=(mp[i][j+k]==2);
            if(c1 && c2) continue;
            if(c1==4) return undefined;
            if(c1>0) res+=_20[c1],res+=500;
            if(c2>0) res-=_30[c2],res-=500;
        }
    for(let i=0;i+3<n;i++)
        for(let j=0;j<n;j++)
        {
            let c1=0,c2=0;
            for(let k=0;k<4;k++) c1+=(mp[i+k][j]==1);
            for(let k=0;k<4;k++) c2+=(mp[i+k][j]==2);
            if(c1 && c2) continue;
            if(c1==4) return undefined;
            if(c1>0) res+=_20[c1],res+=500;
            if(c2>0) res-=_30[c2],res-=500;
        }
    for(let i=0;i+3<n;i++)
        for(let j=0;j+3<n;j++)
        {
            let c1=0,c2=0;
            for(let k=0;k<4;k++) c1+=(mp[i+k][j+k]==1);
            for(let k=0;k<4;k++) c2+=(mp[i+k][j+k]==2);
            if(c1 && c2) continue;
            if(c1==4) return undefined;
            if(c1>0) res+=_20[c1],res+=500;
            if(c2>0) res-=_30[c2],res-=500;
        }
    for(let i=0;i+3<n;i++)
        for(let j=3;j<n;j++)
        {
            let c1=0,c2=0;
            for(let k=0;k<4;k++) c1+=(mp[i+k][j-k]==1);
            for(let k=0;k<4;k++) c2+=(mp[i+k][j-k]==2);
            if(c1 && c2) continue;
            if(c1==4) return undefined;
            if(c1>0) res+=_20[c1],res+=500;
            if(c2>0) res-=_30[c2],res-=500;
        }
    return res;
}
function alice_put()
{
    let mx=1e17;
    var prep=new Array();
    for(let i=0;i<n;i++)
        for(let j=0;j<n;j++) if(!mp[i][j])
        {
            mp[i][j]=1;
            let sc=alice_score();
            if(sc!=undefined)
            {
                if(sc<mx) mx=sc,prep=new Array();
                if(sc==mx) prep.push([i,j]);
            }
            mp[i][j]=0;
        }
    if(prep.length==0) return [-1,-1];
    let p=prep[Rand(prep.length)];
    return p;
}

//Check

function update_ban_cell()
{
    for(let i=0;i<n;i++)
        for(let j=0;j<n;j++) ban[i][j]=false;
    for(let i=0;i<n;i++)
        for(let j=0;j<n;j++)
        {
            for(let op=0;op<8;op++) if(i+X[op]*3>=0 && i+X[op]*3<n && j+Y[op]*3>=0 && j+Y[op]*3<n)
            {
                let c=0;
                for(let k=0;k<4;k++) if(mp[i+X[op]*k][j+Y[op]*k]==2) c+=1;
                else if(mp[i+X[op]*k][j+Y[op]*k]==1){c=0;break;}
                if(c==3)
                {
                    for(let k=0;k<4;k++) if(!mp[i+X[op]*k][j+Y[op]*k])
                        ban[i+X[op]*k][j+Y[op]*k]=true;
                }
            }
        }
}

function check_end()
{
    for(let i=0;i<n;i++)
        for(let j=0;j<n;j++)
            if(mp[i][j]==0 && !ban[i][j]) return false;
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
        for(let j=0;j<n;j++) mp[i][j]=0,ban[i][j]=false;
}

function print()
{
    let str="";
    for(let i=0;i<n;i++)
    {
        let p=`<div cellspacing="10" style="font-size: 30px; line-height: 1.25em;">`;
        for(let j=0;j<n;j++)
        {
            p+=`<cell onclick='Click(`+i+`,`+j+`);' style="color: `+Color[mp[i][j]]+";";
            if(ban[i][j]) p+="background-color: "+BanCellBackground+"!important;";
            else if(mp[i][j]) p+="background-color: white !important;";
            p+=`">`+char[mp[i][j]]+`</cell>`;
        }
        p+="</div>";
        str+=p;
    }
    document.getElementById('main').innerHTML=str;
}

function end(winner)
{
    let str=`<cell id="end" onclick="start()" style="background-color: white !important"><strong style="font-size: 14px; color: red">`+winner+` Win</strong></cell>`;
    document.getElementById('end').innerHTML=str;
    End=true;
}

function Alice()
{
    let p=alice_put();
    if(p[0]==-1){end("Bob");return;}
    else mp[p[0]][p[1]]=1,hist.push(p);
    update_ban_cell();
    if(check_end()) end("Alice");
}

function Click(x,y)
{
    if(mp[x][y] || ban[x][y] || End) return;
    hist.push([x,y]);
    mp[x][y]=2;
    Alice();
    print();
}

function start()
{
    document.getElementById('end').innerHTML="";
    Seed=new Array();
    for(let i=0;i<200;i++) Seed[i]=Math.floor(Math.random()*1e8);
    S0++;
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
    print();
}

window.onload = alice_init();
window.onload = start();