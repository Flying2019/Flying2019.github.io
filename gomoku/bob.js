function my_bob_put(mp)
{
    if(mp[0][0] && !mp[n-1][n-1]) return [n-1,n-1];
    if(!mp[0][0] && mp[n-1][n-1]) return [0,0];
    if(mp[0][n-1] && !mp[n-1][0]) return [n-1,0];
    if(!mp[0][n-1] && mp[n-1][0]) return [0,n-1];
    let mx=1e17;
    var prep=new Array();
    for(let i=0;i<n;i++)
        for(let j=0;j<n;j++) if(!mp[i][j])
        {
            mp[i][j]=2;
            let sc=alice_score(2,mp);
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