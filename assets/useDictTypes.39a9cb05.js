var n=(t,s,e)=>new Promise((c,a)=>{var i=r=>{try{y(e.next(r))}catch(l){a(l)}},u=r=>{try{y(e.throw(r))}catch(l){a(l)}},y=r=>r.done?c(r.value):Promise.resolve(r.value).then(i,u);y((e=e.apply(t,s)).next())});import{bL as o,bM as f,bN as g,bO as D,bP as m,r as h}from"./index.f2f4e5af.js";const v=()=>n(void 0,null,function*(){return o({url:"/system/dict/type/optionSelect",params:{}})}),T=t=>n(void 0,null,function*(){return o({url:"/system/dict/data/type/"+t,params:{}})}),w=t=>n(void 0,null,function*(){return o({url:"/system/dict/type/list",params:t})}),L=t=>n(void 0,null,function*(){return o({url:"/system/dict/type/"+t})}),O=t=>n(void 0,null,function*(){return f({url:"/system/dict/type/",data:t})}),j=t=>n(void 0,null,function*(){return g({url:"/system/dict/type/"+t})}),M=t=>n(void 0,null,function*(){return D({url:"/system/dict/type/",data:t})}),P=t=>n(void 0,null,function*(){return m("/system/dict/type/export",t,`dict_${new Date().getTime()}.xlsx`)}),d=h({type:{}});function b(t){return new Promise((s,e)=>{x(t)||T(t).then(c=>{const{data:a}=c;a.length>0?s(a):e("DictType not match")})})}function S(t){let s=[];for(let e=0;e<t.length;e++){const c=t[e],a=c.dictLabel,i=c.dictValue;s.push({label:a,value:i,raw:c})}return s}function x(t){let s=Object.keys(d.type);return typeof t=="string"?s.includes(t):t instanceof Array?t.some(e=>s.includes(e)):!1}function p(t){b(t).then(s=>{const e=S(s);d.type[t]=e})}function V(t){const c=[{handle:()=>{t.forEach(i=>{p(i)})},support:()=>t instanceof Array},{handle:()=>{p(t)},support:()=>typeof t=="string"}];for(let a=0;a<c.length;a++){const i=c[a];!i.support()||i.handle()}return d}export{L as a,O as b,P as c,w as d,M as e,v as g,j as r,V as u};
