"use strict";
let Three=4,Two=1,Max_value=9,Times=4,Typ=0,Extra=0;
let Num=Three*3+Two*2;
let a=new Array(),answer=new Array();
const None="white",Choose="#88dd88",Red="#dd8888",Gray="#dddddd",Blue="#9991ed",Yellow="yellow";
const Back=8;
const Space=32;
const Tab=9;
const Enter=13;
const alpha=0.3;

//随机一副牌

function rand(x){return Math.floor(Math.random()*x);}

function rand_hand()
{
    let ans=new Array(),c=new Array();
    for(let i=1;i<=Max_value;i++) c[i]=0;
    for(let i=0;i<Three;i++)
    {
        if(Math.random()<alpha)
        {
            let x=rand(Max_value)+1;
            // console.log('pong '+x);
            while(c[x]+3>Times) x=rand(Max_value)+1;
            c[x]+=3;
        }
        else
        {
            let x=rand(Max_value-2)+1;
            // console.log('shun '+x);
            while(c[x]>=Times || c[x+1]>=Times || c[x+2]>=Times) x=rand(Max_value-2)+1;
            c[x]++,c[x+1]++,c[x+2]++;
        }
    }
    for(let i=0;i<Two;i++)
    {
        let x=rand(Max_value)+1;
        while(c[x]+2>Times) x=rand(Max_value)+1;
        c[x]+=2;
    }
    if(Extra)
    {
        let x=rand(Max_value)+1;
        while(!c[x]) x=rand(Max_value)+1;
        c[x]--;
    }
    for(let i=1;i<=Max_value;i++)
        for(let k=0;k<c[i];k++) ans.push(i);
    let res=new Array();
    if(Extra)
    {
        Rong(res,ans);
        for(let v of res) ans.push(v);
    }
    console.log(ans);
    return ans;
}


//模板选择部分

let pre=0,Win=false,Step;

function start()
{
    var x=document.getElementById("type").value;
    if(x==pre) return;
    if(x=="ex"){alert("未完待续");return;}
    if(x==0)
    {
        Typ=0,Extra=0;
        restart();
        pre=x;
    }
    else if(x==1)
    {
        Typ=0,Extra=1;
        restart();
        pre=x;
    }
}

//判断部分

function cmp(s,t){return parseInt(s)-parseInt(t);}

function check(a,n=Num)
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
            // console.log(i+" "+j+" "+x1+" "+x2+" "+c);
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

function Rong(ans,b=a)
{
    for(let i=0;i<Num;i++) if(b[i]<=0 || b[i]>Max_value) return false;
    b.push(1);
    for(let i=1;i<=Max_value;i++)
    {
        b[Num]=i;
        if(check(b,Num+1)) ans.push(i);
    }
    b.pop();
    if(ans.length==0) return false;
    return true;
}

function winning()
{
    bef+="<font color=red><p>You Win!</p><p id=\"step\"></p></font><input type=\"button\" class=\"gradual-button\" value=\"重试一次\" onclick=\"restart();\">";
    document.getElementById('main').innerHTML=bef;
    document.getElementById('step').innerHTML="Step: "+Step;
    Win=true;
}

function End()
{
    let hav=new Array(),now=new Array(),vis=new Array();
    for(let v=1;v<=Max_value;v++) vis[v]=0;
    if(Typ==0)
    {
        if(Extra)
        {
            let rong=new Array();
            Rong(rong);
            if(rong.length==0) return false;
            ++Step;
            let ans=new Array(),res=new Array();
            ans.push("Rong: "),res.push(None);
            for(let v=0;v<rong.length;v++)
                ans.push(rong[v]),res.push(Red);

            for(let v=0;v<Num;v++) now.push(a[v]);
            for(let v=0;v<rong.length;v++) now.push(rong[v]);
            console.log(now);

            let right=true;
            for(let i=0;i<now.length;i++)
                if(now[i]==answer[i]) hav[i]=1;
                else hav[i]=0,right=false;
            for(let i=0;i<answer.length;i++)
                if(hav[i]==0) vis[answer[i]]++;
            for(let i=0;i<now.length;i++)
                if(hav[i]==0 && vis[now[i]]>0) vis[now[i]]--,hav[i]=2;
            
            for(let v=0;v<Num;v++) if(hav[v]==1) col[v]=Yellow;
            else if(hav[v]==2) col[v]=Blue;
            for(let v=0;v<rong.length;v++) if(hav[v+Num]==1) res[v+1]=Yellow;
            else if(hav[v+Num]==2) res[v+1]=Blue;

            let str=generator(ans.length,ans,res),u=generator();
            bef+=u+str;
            if(right) winning();
            else init();
        }
        else
        {
            let rong=check(a);
            if(!rong) return;
            ++Step;
            let right=true;
            for(let i=0;i<Num;i++) col[i]=Gray;
            for(let i=0;i<Num;i++)
                if(a[i]==answer[i]) hav[i]=1;
                else hav[i]=0,right=false;
            for(let i=0;i<Num;i++)
                if(hav[i]==0) vis[answer[i]]++;
            for(let i=0;i<Num;i++)
                if(hav[i]==0 && vis[a[i]]>0) vis[a[i]]--,hav[i]=2;
            for(let v=0;v<Num;v++) if(hav[v]==1) col[v]=Yellow;
            else if(hav[v]==2) col[v]=Blue;
            console.log(hav);
            bef+=generator();
            if(right) winning();
            else init();
        }
    }
}

//表格生成部分

function generator(n=Num,la=a,cl=col)
{
    // let str="<table border=\"1\" cellspacing=\"10\"><tr>";
    // for(let i=0;i<n;i++)
    //     str+="<td><a id=\"a"+i+"\" style=\"background-color: "+cl[i]+"; border-color: "+cl[i]+";\">"+(la[i]==0?"*":la[i])+"</a></td>";
    // str+="</tr></table>"
    let str="<div border=\"1\" cellspacing=\"10\" style=\"margin-bottom: 30px\"><tr>";
    for(let i=0;i<n;i++)
        str+="<font id=\"a"+i+"\" style=\"background-color: "+cl[i]+"; padding:12px; font-size:30px; font-family: consola\">"+(la[i]==0?"*":la[i])+"</font>";
    str+="</div>"
    return str;
}

//交互部分

let col=new Array();
let bef="";
let opt=new Array();
let now_choose=0;
function restart()
{
    Win=false;
    bef="";
    Step=0;
    col=new Array();
    opt=new Array();
    now_choose=0;
    Num=Three*3+Two*2-Extra;
    a=new Array();
    init();
    answer=rand_hand();
}

function load()
{
    if(Win) return;
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
        // console.log(a);
        a.sort(cmp);
        reload();
        End();
    }
    else return;
    reload();
}

window.onload = restart();