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


function save(str,val){localStorage.setItem(str,val);}
function erase(str){localStorage.removeItem(str);location.reload();}
function load(str){return localStorage.getItem(str);}
function loadBackgroundColor(list)
{
    if(load('color')!=undefined)
    {
        var s=load('color');
        var cssRule=document.styleSheets[0].cssRules;
        for(var i=0;i<cssRule.length;i++)
        {
            for(let j of list)
            if(String(cssRule[i].selectorText).indexOf(j)!=-1)
            {cssRule[i].style.background=s;break;}
        }
    }
}
function changeBackgroundColor(id,list)
{
    let s=document.getElementById(id).value;
    s='#'+s;
    var cssRule=document.styleSheets[0].cssRules;
    for(var i=0;i<cssRule.length;i++)
    {
        for(let j of list)
        if(String(cssRule[i].selectorText).indexOf(j)!=-1)
        {cssRule[i].style.background=s;break;}
    }
    save('color',s);
}
window.onload = loadBackgroundColor(['.header','.footer']);