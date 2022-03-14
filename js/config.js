if (!window.NexT) window.NexT = {};

(function() {
  const className = 'next-config';

  const staticConfig = {};
  let variableConfig = {};

  const parse = text => JSON.parse(text || '{}');

  const update = name => {
    const targetEle = document.querySelector(`.${className}[data-name="${name}"]`);
    if (!targetEle) return;
    const parsedConfig = parse(targetEle.text);
    if (name === 'main') {
      Object.assign(staticConfig, parsedConfig);
    } else {
      variableConfig[name] = parsedConfig;
    }
  };

  update('main');

  window.CONFIG = new Proxy({}, {
    get(overrideConfig, name) {
      let existing;
      if (name in staticConfig) {
        existing = staticConfig[name];
      } else {
        if (!(name in variableConfig)) update(name);
        existing = variableConfig[name];
      }

      // For unset override and mixable existing
      if (!(name in overrideConfig) && typeof existing === 'object') {
        // Get ready to mix.
        overrideConfig[name] = {};
      }

      if (name in overrideConfig) {
        const override = overrideConfig[name];

        // When mixable
        if (typeof override === 'object' && typeof existing === 'object') {
          // Mix, proxy changes to the override.
          return new Proxy({ ...existing, ...override }, {
            set(target, prop, value) {
              target[prop] = value;
              override[prop] = value;
              return true;
            }
          });
        }

        return override;
      }

      // Only when not mixable and override hasn't been set.
      return existing;
    }
  });

  document.addEventListener('pjax:success', () => {
    variableConfig = {};
  });
})();

// Custom Javascript

var Backgroundlist=[/^main$/,/underline/,/^body$/];
var Themelist=[/^.header$/,/^.footer$/];
var Contentlist=[/.post-body/,/.post-title/,/button/];
var Slidelist=[/^.sidebar$/];
var alltype=['bcolor','tcolor','color','slidecolor']

function save(str,val){localStorage.setItem(str,val);}
function erase(str){localStorage.removeItem(str);location.reload();}
function eraseall()
{
  for(let v of alltype)
    localStorage.removeItem(v);
  location.reload();
}
function load(str){return localStorage.getItem(str);}
function loadBackgroundColor(str,list)
{
  if(load(str)!=undefined)
  {
    let s=load(str);
    let cssRule=document.styleSheets[0].cssRules;
    for(let i=0;i<cssRule.length;i++)
    {
      for(let j of list)
      if(j.test(String(cssRule[i].selectorText)))
      {cssRule[i].style.background=s;break;}
    }
  }
}
function loadContentColor(str,list)
{
  if(load(str)!=undefined)
  {
    let s=load(str);
    let cssRule=document.styleSheets[0].cssRules;
    for(let i=0;i<cssRule.length;i++)
    {
      for(let j of list)
      if(j.test(String(cssRule[i].selectorText)))
      {cssRule[i].style.color=s;break;}
    }
  }
}
function changeBackgroundColor(id)
{
  let s=document.getElementById(id).value;
  s='#'+s;
  save('bcolor',s);
  loadBackgroundColor('bcolor',Backgroundlist);
}
function changeContentColor(id)
{
  let s=document.getElementById(id).value;
  s='#'+s;
  save('color',s);
  loadContentColor('color',Contentlist);
}
function changeThemeColor(id)
{
  let s=document.getElementById(id).value;
  s='#'+s;
  save('tcolor',s);
  loadBackgroundColor('tcolor',Themelist);
}
function changeSlideColor(id)
{
  let s=document.getElementById(id).value;
  s='#'+s;
  save('slidecolor',s);
  loadBackgroundColor('slidecolor',Slidelist);
}
function no_background()
{
  document.styleSheets[0].addRule('.main-inner','opacity: 1.0');
}
window.onload = loadBackgroundColor('bcolor',Backgroundlist);
window.onload = loadContentColor('color',Contentlist);
window.onload = loadBackgroundColor('tcolor',Themelist);
window.onload = loadBackgroundColor('slidecolor',Slidelist);
window.onload = no_background();

function get_funval(val_list)
{
  for(let i=1;i<val_list.length;i++)
  {
    let q=val_list[i].split('=');
    if(q.length!=2) continue;
    if(q[0]==='funval') return q[1];
  }
  return 'nothing';
}

(function(){
  let s=window.location.href;
  let val_list=s.split('?');
  fun_val=get_funval(val_list)
  if(fun_val!=="nothing") window.location.href=window.location.origin+'/'+fun_val;
})(document);