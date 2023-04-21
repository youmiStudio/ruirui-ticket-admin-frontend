var P=Object.defineProperty,A=Object.defineProperties;var B=Object.getOwnPropertyDescriptors;var _=Object.getOwnPropertySymbols;var L=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable;var h=(a,t,s)=>t in a?P(a,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[t]=s,d=(a,t)=>{for(var s in t||(t={}))L.call(t,s)&&h(a,s,t[s]);if(_)for(var s of _(t))D.call(t,s)&&h(a,s,t[s]);return a},y=(a,t)=>A(a,B(t));import{Z as $,d as f,a6 as v,a4 as n,a8 as F,h as j,n as N,l as x,ab as C,ac as E,m as p,at as O,as as R,ad as S,aw as k,a0 as u,aE as c,af as I,aA as w,aF as J}from"./index.f2f4e5af.js";const K=Symbol("rowContextKey"),T=["start","center","end","space-around","space-between","space-evenly"],Z=["top","middle","bottom"],q=$({tag:{type:String,default:"div"},gutter:{type:Number,default:0},justify:{type:String,values:T,default:"start"},align:{type:String,values:Z,default:"top"}}),G=f({name:"ElRow"}),H=f(y(d({},G),{props:q,setup(a){const t=a,s=v("row"),o=n(()=>t.gutter);F(K,{gutter:o});const i=n(()=>{const e={};return t.gutter&&(e.marginRight=e.marginLeft=`-${t.gutter/2}px`),e}),m=n(()=>[s.b(),s.is(`justify-${t.justify}`,t.justify!=="start"),s.is(`align-${t.align}`,t.align!=="top")]);return(e,b)=>(j(),N(R(e.tag),{class:E(p(m)),style:O(p(i))},{default:x(()=>[C(e.$slots,"default")]),_:3},8,["class","style"]))}}));var M=S(H,[["__file","/home/runner/work/element-plus/element-plus/packages/components/row/src/row.vue"]]);const tt=k(M),Q=$({tag:{type:String,default:"div"},span:{type:Number,default:24},offset:{type:Number,default:0},pull:{type:Number,default:0},push:{type:Number,default:0},xs:{type:u([Number,Object]),default:()=>c({})},sm:{type:u([Number,Object]),default:()=>c({})},md:{type:u([Number,Object]),default:()=>c({})},lg:{type:u([Number,Object]),default:()=>c({})},xl:{type:u([Number,Object]),default:()=>c({})}}),U=f({name:"ElCol"}),V=f(y(d({},U),{props:Q,setup(a){const t=a,{gutter:s}=I(K,{gutter:n(()=>0)}),o=v("col"),i=n(()=>{const e={};return s.value&&(e.paddingLeft=e.paddingRight=`${s.value/2}px`),e}),m=n(()=>{const e=[];return["span","offset","pull","push"].forEach(l=>{const r=t[l];w(r)&&(l==="span"?e.push(o.b(`${t[l]}`)):r>0&&e.push(o.b(`${l}-${t[l]}`)))}),["xs","sm","md","lg","xl"].forEach(l=>{w(t[l])?e.push(o.b(`${l}-${t[l]}`)):J(t[l])&&Object.entries(t[l]).forEach(([r,g])=>{e.push(r!=="span"?o.b(`${l}-${r}-${g}`):o.b(`${l}-${g}`))})}),s.value&&e.push(o.is("guttered")),[o.b(),e]});return(e,b)=>(j(),N(R(e.tag),{class:E(p(m)),style:O(p(i))},{default:x(()=>[C(e.$slots,"default")]),_:3},8,["class","style"]))}}));var W=S(V,[["__file","/home/runner/work/element-plus/element-plus/packages/components/col/src/col.vue"]]);const et=k(W);export{et as E,tt as a};
