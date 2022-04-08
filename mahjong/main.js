"use strict";
const Three=4,Two=1;
const Num=Three*3+Two*2-1,Max_value=13,Times=8;
let a=new Array();
const None="white",Choose="#88dd88",Red="#dd8888",Gray="#dddddd";
const Back=8;
const Space=32;
const Tab=9;
const Enter=13;

//判断部分

function cmp(s,t){return parseInt(s)-parseInt(t);}

function check(n=Num)
{
    let cnt=new Array();
    for(let i=1;i<=Max_value;i++) cnt[i]=0;
    for(let i=0;i<n;i++) cnt[a[i]]++;
    for(let i=0;i<n;i++) if(cnt[i]>Times) return false;
    let f=new Array(),g=new Array();
    function init(f,g){for(let i=0;i<=Three;i++)
        {
            f[i]=new Array();
            for(let j=0;j<=Two;j++)
            {
                f[i][j]=new Array();
                for(let x1=0;x1<=Times;x1++)
                {
                    f[i][j][x1]=new Array();
                    for(let x2=0;x2<=Times;x2++) f[i][j][x1][x2]=(g===undefined?false:g[i][j][x1][x2]);
                }
            }
        }
    };
    init(f);
    f[0][0][0][0]=true;
    // console.log(0+" "+0+" "+0+" "+0);
    for(let t=1;t<=Max_value;t++)
    {
        init(g,f);init(f);
        let c=cnt[t];
        // console.log(c);
        for(let i=0;i<=Three;i++)
        for(let j=0;j<=Two;j++)
        for(let x1=0;x1<=Times;x1++)
        for(let x2=0;x2<=Times;x2++)
        if(g[i][j][x1][x2])
        {
            console.log(i+" "+j+" "+x1+" "+x2+" "+c);
            for(let tw=0;tw<=Times/2 && j+tw<=Two && tw*2<=c;tw++)
                for(let ex=0;ex<=Times/3 && i+x1+ex<=Three && tw*2+ex*3<=c;ex++)
                {
                    let v=c-ex*3-tw*2;
                    if(v<0) break;
                    if(x1>x2 || x1>v) continue;
                    f[i+x1+ex][j+tw][x2-x1][v-x1]=true;
                }
        }
    }
    return f[Three][Two][0][0];
}

function Rong()
{
    var ans=new Array(),res=new Array;
    for(let i=0;i<Num;i++) if(a[i]<=0 || a[i]>Max_value) return false;
    a.push(1);
    ans.push("Rong: "),res.push(None);
    for(let i=1;i<=Max_value;i++)
    {
        a[Num]=i;
        if(check(Num+1)) ans.push(i),res.push(Red);
    }
    a.pop();
    if(ans.length==1) return false;
    console.log(res);
    let str=generator(ans.length,ans,res);
    bef+=generator()+str;
    init();
    return true;
}

//表格生成部分

function generator(n=Num,la=a,cl=col)
{
    // let str="<table border=\"1\" cellspacing=\"10\"><tr>";
    // for(let i=0;i<n;i++)
    //     str+="<td><a id=\"a"+i+"\" style=\"background-color: "+cl[i]+"; border-color: "+cl[i]+";\">"+(la[i]==0?"*":la[i])+"</a></td>";
    // str+="</tr></table>"
    let str="<div border=\"1\" cellspacing=\"10\"><tr>";
    for(let i=0;i<n;i++)
        str+="<font id=\"a"+i+"\" style=\"background-color: "+cl[i]+"; padding:12px; border-down: 10px; font-size:30px\">"+(la[i]==0?"*":la[i])+"</font>";
    str+="</div>"
    return str;
}

//交互部分

let col=new Array();
let bef="";
let opt=new Array();
let now_choose=0;
function load()
{
    let str=bef+generator();
    document.getElementById('main').innerHTML=str;
}
function reload()
{
    for(let i=0;i<Num;i++) col[i]=None;
    if(now_choose==Num) for(let i=0;i<Num;i++) col[i]=Gray;
    else col[now_choose]=Choose;
    load();
}
function init()
{
    for(let i=0;i<Num;i++) a[i]=0,col[i]=None;
    now_choose=0;
    opt=new Array();
    reload();
}

document.onkeydown = function(event){undefined
    var e=event || window.event || arguments.callee.caller.arguments[0];
    var p=e.which;
    // console.log(p);
    if(p>=49 && p<=57)
    {
        let v=p-48;
        if(v>Max_value) return;
        if(now_choose===Num) return;
        opt.push(1);
        a[now_choose]=a[now_choose]*10+v;
        now_choose++;
    }
    else if(p>=65 && p<=90)
    {
        let v=p-65+10;
        if(v>Max_value) return;
        if(now_choose===Num) return;
        opt.push(1);
        a[now_choose]=a[now_choose]*100+v;
        now_choose++;
    }
    else if(p===Back)
    {
        var q=undefined;
        q=opt.pop();
        if(q===undefined) return;
        else if(q===1) now_choose--,a[now_choose]=0;
        else if(q===2) a[now_choose]=Math.floor(a[now_choose]/10);
        else if(q===3) a[now_choose]=Math.floor(a[now_choose]/100);
        else if(q===4) now_choose--;
    }
    else if(p===Space || p===Tab)
    {
        if(now_choose===Num) return;
        opt.push(4);
        now_choose++;
    }
    else if(p===Enter)
    {
        if(now_choose<Num) return;
        console.log(a);
        let b=new Array();
        for(let i=0;i<Num;i++) b[i]=a[i];
        a.sort(cmp);
        reload();
        Rong();
    }
    else return;
    reload();
}

window.onload = init();