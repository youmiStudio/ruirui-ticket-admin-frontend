import{d as U,c as h,o as z,h as A,i as I,k as e,l as t,j as c,m as l,bW as F,bY as E,s as N,t as L,x as r,g as P,bp as W,E as Y}from"./index.f2f4e5af.js";import{E as q,a as G}from"./col.f1267745.js";import{E as H,a as J}from"./form-item.24d4e3f5.js";import{E as O}from"./card.2dd1dae5.js";import{T as B}from"./index.f4ef202d.js";import{g as Q,a as S,b as X,d as Z,e as ee,f as ae}from"./index.cc7b76a2.js";import"./empty.ab6a681e.js";const te={class:"app-container"},le={class:"card-header"},oe=c("span",null,"\u7F13\u5B58\u5217\u8868",-1),ue={class:"flex align-center justify-center"},ne={class:"card-header"},ce=c("span",null,"\u952E\u540D\u5217\u8868",-1),se={class:"flex align-center justify-center"},ie={class:"card-header"},re=c("span",null,"\u7F13\u5B58\u5185\u5BB9",-1),ge=U({__name:"list",setup(de){const v=h([]),m=h([]),d=h(""),n=h({cacheKey:"",cacheName:"",cacheValue:"",remark:""});z(()=>{p()});function p(){Q().then(a=>{a.data&&(v.value=a.data)})}function f(){m.value=[],ae(d.value).then(a=>{a.data&&(m.value=a.data)})}function w(a){d.value=a.cacheName,f()}function x(a){S(d.value,a).then(o=>{o.data&&(n.value=o.data)})}function b(a){return a.cacheName.replace(":","")}function k(a){return a.replace(d.value,"")}function V(){p(),r.success("\u5237\u65B0\u7F13\u5B58\u5217\u8868\u6210\u529F")}function D(a){X(a.cacheName).then(o=>{o.code===200&&(r.success(`\u6E05\u7406\u7F13\u5B58\u540D\u79F0[${a.cacheName}]\u6210\u529F`),p())})}function K(){f(),r.success("\u5237\u65B0\u952E\u540D\u5217\u8868\u6210\u529F")}function R(a){Z(a).then(o=>{o.code===200&&(r.success(`\u6E05\u7406\u7F13\u5B58\u952E\u540D[${a}]\u6210\u529F`),f())})}function T(){ee().then(a=>{a.code===200&&r.success("\u6E05\u7406\u5168\u90E8\u7F13\u5B58\u6210\u529F")})}return(a,o)=>{const s=P,i=W,_=O,y=q,C=Y,g=H,$=J,j=G;return A(),I("div",te,[e(j,{gutter:10},{default:t(()=>[e(y,{span:8},{default:t(()=>[e(_,{style:{height:"calc(100vh - 105px)"}},{header:t(()=>[c("div",le,[oe,e(s,{class:"button",text:"",type:"primary",style:{float:"right",padding:"3px 0",height:"auto"},icon:l(F),onClick:V},null,8,["icon"])])]),default:t(()=>[e(B,{"show-index":"","highlight-current-row":"","data-value":l(v),"has-pagination":!1,"select-type":!1,onRowClick:w},{default:t(()=>[e(i,{label:"\u7F13\u5B58\u540D\u79F0",align:"center",prop:"cacheName","show-overflow-tooltip":!0,formatter:b}),e(i,{label:"\u5907\u6CE8",align:"center",prop:"remark","show-overflow-tooltip":!0}),e(i,{label:"\u64CD\u4F5C",align:"center",width:"60","class-name":"fixed-width"},{default:t(({row:u})=>[c("div",ue,[e(s,{size:"small",link:"",type:"primary",icon:l(E),onClick:N(M=>D(u),["stop"])},null,8,["icon","onClick"])])]),_:1})]),_:1},8,["data-value"])]),_:1})]),_:1}),e(y,{span:8},{default:t(()=>[e(_,{style:{height:"calc(100vh - 105px)"}},{header:t(()=>[c("div",ne,[ce,e(s,{class:"button",text:"",type:"primary",style:{float:"right",padding:"3px 0",height:"auto"},icon:l(F),onClick:K},null,8,["icon"])])]),default:t(()=>[e(B,{"show-index":"","highlight-current-row":"","data-value":l(m),"has-pagination":!1,"select-type":!1,onRowClick:x},{default:t(()=>[e(i,{label:"\u7F13\u5B58\u540D\u79F0",align:"center","show-overflow-tooltip":!0,formatter:k}),e(i,{label:"\u64CD\u4F5C",align:"center",width:"60","class-name":"fixed-width"},{default:t(({row:u})=>[c("div",se,[e(s,{size:"small",link:"",type:"primary",icon:l(E),onClick:N(M=>R(u),["stop"])},null,8,["icon","onClick"])])]),_:1})]),_:1},8,["data-value"])]),_:1})]),_:1}),e(y,{span:8},{default:t(()=>[e(_,{style:{height:"calc(100vh - 105px)"}},{header:t(()=>[c("div",ie,[re,e(s,{class:"button",text:"",type:"primary",style:{float:"right",padding:"3px 0",height:"auto"},icon:l(F),onClick:T},{default:t(()=>[L("\u6E05\u7406\u5168\u90E8")]),_:1},8,["icon"])])]),default:t(()=>[e($,{"label-position":"top",model:l(n)},{default:t(()=>[e(g,{label:"\u7F13\u5B58\u540D\u79F0:",prop:"cacheName"},{default:t(()=>[e(C,{modelValue:l(n).cacheName,"onUpdate:modelValue":o[0]||(o[0]=u=>l(n).cacheName=u),readonly:""},null,8,["modelValue"])]),_:1}),e(g,{label:"\u7F13\u5B58\u952E\u540D:",prop:"cacheKey"},{default:t(()=>[e(C,{modelValue:l(n).cacheKey,"onUpdate:modelValue":o[1]||(o[1]=u=>l(n).cacheKey=u),readonly:""},null,8,["modelValue"])]),_:1}),e(g,{label:"\u7F13\u5B58\u5185\u5BB9:",prop:"cacheValue"},{default:t(()=>[e(C,{modelValue:l(n).cacheValue,"onUpdate:modelValue":o[2]||(o[2]=u=>l(n).cacheValue=u),type:"textarea",rows:8,readonly:""},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1})]),_:1})]),_:1})])}}});export{ge as default};
