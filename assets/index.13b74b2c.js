var E=Object.defineProperty,V=Object.defineProperties;var I=Object.getOwnPropertyDescriptors;var v=Object.getOwnPropertySymbols;var Y=Object.prototype.hasOwnProperty,M=Object.prototype.propertyIsEnumerable;var m=(o,a,t)=>a in o?E(o,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[a]=t,_=(o,a)=>{for(var t in a||(a={}))Y.call(a,t)&&m(o,t,a[t]);if(v)for(var t of v(a))M.call(a,t)&&m(o,t,a[t]);return o},y=(o,a)=>V(o,I(a));import{d as P,c as C,a4 as q,o as A,h as r,i as f,al as N,aB as b,ac as j,m as k,j as x,au as z,n as F,aD as L,q as O,_ as R}from"./index.f2f4e5af.js";import{E as S}from"./date-picker.24382570.js";const U={class:"date-picker"},$=["onClick"],w={class:"date-picker-item__inner"},G=P({__name:"index",props:{data:{type:Array,required:!0}},emits:["click"],setup(o,{emit:a}){const t=o,c=C(0),l=C(),d=q(()=>[...t.data].map((e,n)=>(e.id=n,_({},e))));A(()=>{d.value.forEach(n=>{n.default&&!c.value&&n.id&&u(n.id)});const e=d.value.find(n=>n.id===c.value);e&&p(e)});function u(e){c.value=e}function p(e){a("click",e)}function D(e){c.value!==e.id&&e.type==="text"&&(u(e.id),p(e))}function h(e,n){u(e.id),p(y(_({},e),{pickDate:n}))}return(e,n)=>{const g=S;return r(),f("div",U,[(r(!0),f(N,null,b(k(d),(s,B)=>(r(),f("div",{class:j(["date-picker-item",{active:k(c)===s.id}]),key:B,onClick:i=>D(s)},[x("div",w,[x("span",null,z(s.label),1),s.type==="date"?(r(),F(g,{key:0,modelValue:k(l),"onUpdate:modelValue":n[0]||(n[0]=i=>L(l)?l.value=i:null),type:"date","value-format":"YYYY-MM-DD",onChange:i=>h(s,i)},null,8,["modelValue","onChange"])):O("",!0)])],10,$))),128))])}}});const Q=R(G,[["__scopeId","data-v-19489927"]]);export{Q as D};
