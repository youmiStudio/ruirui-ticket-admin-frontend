var x=Object.defineProperty,J=Object.defineProperties;var X=Object.getOwnPropertyDescriptors;var w=Object.getOwnPropertySymbols;var Y=Object.prototype.hasOwnProperty,ee=Object.prototype.propertyIsEnumerable;var N=(o,n,a)=>n in o?x(o,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):o[n]=a,v=(o,n)=>{for(var a in n||(n={}))Y.call(n,a)&&N(o,a,n[a]);if(w)for(var a of w(n))ee.call(n,a)&&N(o,a,n[a]);return o},g=(o,n)=>J(o,X(n));import{Z as R,aO as P,c0 as I,a2 as z,aA as C,a3 as F,c1 as ae,c as k,af as oe,a4 as y,a5 as le,c2 as se,d as S,a6 as _,h as G,i as V,j as E,a_ as D,c3 as A,m as e,aD as T,ac as b,ab as $,t as K,au as M,s as L,ad as h,am as U,at as ne,ao as te,aQ as re,c4 as ie,o as de,a8 as ue,r as pe,a9 as ce,w as me,a7 as be,aw as fe,ax as j}from"./index.f2f4e5af.js";const O=R({size:P,disabled:Boolean,label:{type:[String,Number,Boolean],default:""}}),ve=R(g(v({},O),{modelValue:{type:[String,Number,Boolean],default:""},name:{type:String,default:""},border:Boolean})),q={[I]:o=>z(o)||C(o)||F(o),[ae]:o=>z(o)||C(o)||F(o)},H=Symbol("radioGroupKey"),Q=(o,n)=>{const a=k(),s=oe(H,void 0),u=y(()=>!!s),m=y({get(){return u.value?s.modelValue:o.modelValue},set(d){u.value?s.changeEvent(d):n&&n(I,d),a.value.checked=o.modelValue===o.label}}),i=le(y(()=>s==null?void 0:s.size)),p=se(y(()=>s==null?void 0:s.disabled)),t=k(!1),c=y(()=>p.value||u.value&&m.value!==o.label?-1:0);return{radioRef:a,isGroup:u,radioGroup:s,focus:t,size:i,disabled:p,tabIndex:c,modelValue:m}},ge=["value","name","disabled"],ye=S({name:"ElRadio"}),Ee=S(g(v({},ye),{props:ve,emits:q,setup(o,{emit:n}){const a=o,s=_("radio"),{radioRef:u,radioGroup:m,focus:i,size:p,disabled:t,modelValue:c}=Q(a,n);function d(){U(()=>n("change",c.value))}return(l,r)=>{var f;return G(),V("label",{class:b([e(s).b(),e(s).is("disabled",e(t)),e(s).is("focus",e(i)),e(s).is("bordered",l.border),e(s).is("checked",e(c)===l.label),e(s).m(e(p))])},[E("span",{class:b([e(s).e("input"),e(s).is("disabled",e(t)),e(s).is("checked",e(c)===l.label)])},[D(E("input",{ref_key:"radioRef",ref:u,"onUpdate:modelValue":r[0]||(r[0]=B=>T(c)?c.value=B:null),class:b(e(s).e("original")),value:l.label,name:l.name||((f=e(m))==null?void 0:f.name),disabled:e(t),type:"radio",onFocus:r[1]||(r[1]=B=>i.value=!0),onBlur:r[2]||(r[2]=B=>i.value=!1),onChange:d},null,42,ge),[[A,e(c)]]),E("span",{class:b(e(s).e("inner"))},null,2)],2),E("span",{class:b(e(s).e("label")),onKeydown:r[3]||(r[3]=L(()=>{},["stop"]))},[$(l.$slots,"default",{},()=>[K(M(l.label),1)])],34)],2)}}}));var Se=h(Ee,[["__file","/home/runner/work/element-plus/element-plus/packages/components/radio/src/radio.vue"]]);const Re=R(g(v({},O),{name:{type:String,default:""}})),Be=["value","name","disabled"],ke=S({name:"ElRadioButton"}),Ie=S(g(v({},ke),{props:Re,setup(o){const n=o,a=_("radio"),{radioRef:s,focus:u,size:m,disabled:i,modelValue:p,radioGroup:t}=Q(n),c=y(()=>({backgroundColor:(t==null?void 0:t.fill)||"",borderColor:(t==null?void 0:t.fill)||"",boxShadow:t!=null&&t.fill?`-1px 0 0 0 ${t.fill}`:"",color:(t==null?void 0:t.textColor)||""}));return(d,l)=>{var r;return G(),V("label",{class:b([e(a).b("button"),e(a).is("active",e(p)===d.label),e(a).is("disabled",e(i)),e(a).is("focus",e(u)),e(a).bm("button",e(m))])},[D(E("input",{ref_key:"radioRef",ref:s,"onUpdate:modelValue":l[0]||(l[0]=f=>T(p)?p.value=f:null),class:b(e(a).be("button","original-radio")),value:d.label,type:"radio",name:d.name||((r=e(t))==null?void 0:r.name),disabled:e(i),onFocus:l[1]||(l[1]=f=>u.value=!0),onBlur:l[2]||(l[2]=f=>u.value=!1)},null,42,Be),[[A,e(p)]]),E("span",{class:b(e(a).be("button","inner")),style:ne(e(p)===d.label?e(c):{}),onKeydown:l[3]||(l[3]=L(()=>{},["stop"]))},[$(d.$slots,"default",{},()=>[K(M(d.label),1)])],38)],2)}}}));var W=h(Ie,[["__file","/home/runner/work/element-plus/element-plus/packages/components/radio/src/radio-button.vue"]]);const _e=R({id:{type:String,default:void 0},size:P,disabled:Boolean,modelValue:{type:[String,Number,Boolean],default:""},fill:{type:String,default:""},label:{type:String,default:void 0},textColor:{type:String,default:""},name:{type:String,default:void 0},validateEvent:{type:Boolean,default:!0}}),Ge=q,Ve=["id","aria-label","aria-labelledby"],$e=S({name:"ElRadioGroup"}),he=S(g(v({},$e),{props:_e,emits:Ge,setup(o,{emit:n}){const a=o,s=_("radio"),u=te(),m=k(),{formItem:i}=re(),{inputId:p,isLabeledByFormItem:t}=ie(a,{formItemContext:i}),c=l=>{n(I,l),U(()=>n("change",l))};de(()=>{const l=m.value.querySelectorAll("[type=radio]"),r=l[0];!Array.from(l).some(f=>f.checked)&&r&&(r.tabIndex=0)});const d=y(()=>a.name||u.value);return ue(H,pe(g(v({},ce(a)),{changeEvent:c,name:d}))),me(()=>a.modelValue,()=>{a.validateEvent&&(i==null||i.validate("change").catch(l=>be()))}),(l,r)=>(G(),V("div",{id:e(p),ref_key:"radioGroupRef",ref:m,class:b(e(s).b("group")),role:"radiogroup","aria-label":e(t)?void 0:l.label||"radio-group","aria-labelledby":e(t)?e(i).labelId:void 0},[$(l.$slots,"default")],10,Ve))}}));var Z=h(he,[["__file","/home/runner/work/element-plus/element-plus/packages/components/radio/src/radio-group.vue"]]);const ze=fe(Se,{RadioButton:W,RadioGroup:Z}),Ce=j(Z);j(W);export{ze as E,Ce as a};
