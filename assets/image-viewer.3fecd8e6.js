var ze=Object.defineProperty,Le=Object.defineProperties;var Ce=Object.getOwnPropertyDescriptors;var fe=Object.getOwnPropertySymbols;var Ee=Object.prototype.hasOwnProperty,Oe=Object.prototype.propertyIsEnumerable;var ve=(s,l,a)=>l in s?ze(s,l,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[l]=a,j=(s,l)=>{for(var a in l||(l={}))Ee.call(l,a)&&ve(s,a,l[a]);if(fe)for(var a of fe(l))Oe.call(l,a)&&ve(s,a,l[a]);return s},U=(s,l)=>Le(s,Ce(l));var me=(s,l,a)=>new Promise((o,v)=>{var y=d=>{try{R(a.next(d))}catch(m){v(m)}},i=d=>{try{R(a.throw(d))}catch(m){v(m)}},R=d=>d.done?o(d.value):Promise.resolve(d.value).then(y,i);R((a=a.apply(s,l)).next())});import{bq as M,Q as Se,aY as xe,Z as ge,a0 as oe,aE as be,aA as de,d as ee,br as pe,bs as Ne,bt as Te,aP as we,a6 as ye,bu as Re,c as k,bv as Ae,az as $e,a4 as _,w as re,am as he,o as ke,h as I,n as ie,k as c,l as E,j as w,ac as f,m as t,at as ue,s as Be,q as z,aV as N,bw as Ve,i as T,al as ce,bb as Me,bc as Ye,bx as Xe,by as De,as as Fe,bz as He,bA as Pe,aB as We,a_ as je,b9 as Ze,ab as J,b2 as qe,bB as Ge,ad as _e,bC as Y,aX as V,bD as Ke,aw as Ie,b5 as Qe,bE as Ue,aW as Je,au as et,bF as tt,a2 as at,bG as nt,aH as st}from"./index.f2f4e5af.js";const lt=(s,l)=>{if(!M||!s||!l)return!1;const a=s.getBoundingClientRect();let o;return l instanceof Element?o=l.getBoundingClientRect():o={top:0,right:window.innerWidth,bottom:window.innerHeight,left:0},a.top<o.bottom&&a.bottom>o.top&&a.right>o.left&&a.left<o.right};var ot="Expected a function";function le(s,l,a){var o=!0,v=!0;if(typeof s!="function")throw new TypeError(ot);return Se(a)&&(o="leading"in a?!!a.leading:o,v="trailing"in a?!!a.trailing:v),xe(s,l,{leading:o,maxWait:l,trailing:v})}const rt=ge({urlList:{type:oe(Array),default:()=>be([])},zIndex:{type:Number},initialIndex:{type:Number,default:0},infinite:{type:Boolean,default:!0},hideOnClickModal:{type:Boolean,default:!1},teleported:{type:Boolean,default:!1},closeOnPressEscape:{type:Boolean,default:!0},zoomRate:{type:Number,default:1.2}}),it={close:()=>!0,switch:s=>de(s)},ut=["src"],ct=ee({name:"ElImageViewer"}),dt=ee(U(j({},ct),{props:rt,emits:it,setup(s,{expose:l,emit:a}){const o=s,v={CONTAIN:{name:"contain",icon:pe(Ne)},ORIGINAL:{name:"original",icon:pe(Te)}},{t:y}=we(),i=ye("image-viewer"),{nextZIndex:R}=Re(),d=k(),m=k([]),L=Ae(),C=k(!0),p=k(o.initialIndex),g=$e(v.CONTAIN),u=k({scale:1,deg:0,offsetX:0,offsetY:0,enableTransition:!1}),X=_(()=>{const{urlList:e}=o;return e.length<=1}),A=_(()=>p.value===0),Z=_(()=>p.value===o.urlList.length-1),te=_(()=>o.urlList[p.value]),D=_(()=>{const{scale:e,deg:n,offsetX:r,offsetY:b,enableTransition:S}=u.value;let h=r/e,x=b/e;switch(n%360){case 90:case-270:[h,x]=[x,-h];break;case 180:case-180:[h,x]=[-h,-x];break;case 270:case-90:[h,x]=[-x,h];break}const B={transform:`scale(${e}) rotate(${n}deg) translate(${h}px, ${x}px)`,transition:S?"transform .3s":""};return g.value.name===v.CONTAIN.name&&(B.maxWidth=B.maxHeight="100%"),B}),ae=_(()=>de(o.zIndex)?o.zIndex:R());function $(){ne(),a("close")}function F(){const e=le(r=>{switch(r.code){case V.esc:o.closeOnPressEscape&&$();break;case V.space:P();break;case V.left:K();break;case V.up:O("zoomIn");break;case V.right:Q();break;case V.down:O("zoomOut");break}}),n=le(r=>{const b=r.deltaY||r.deltaX;O(b<0?"zoomIn":"zoomOut",{zoomRate:o.zoomRate,enableTransition:!1})});L.run(()=>{Y(document,"keydown",e),Y(document,"wheel",n)})}function ne(){L.stop()}function se(){C.value=!1}function q(e){C.value=!1,e.target.alt=y("el.image.error")}function G(e){if(C.value||e.button!==0||!d.value)return;u.value.enableTransition=!1;const{offsetX:n,offsetY:r}=u.value,b=e.pageX,S=e.pageY,h=le(B=>{u.value=U(j({},u.value),{offsetX:n+B.pageX-b,offsetY:r+B.pageY-S})}),x=Y(document,"mousemove",h);Y(document,"mouseup",()=>{x()}),e.preventDefault()}function H(){u.value={scale:1,deg:0,offsetX:0,offsetY:0,enableTransition:!1}}function P(){if(C.value)return;const e=Ke(v),n=Object.values(v),r=g.value.name,S=(n.findIndex(h=>h.name===r)+1)%e.length;g.value=v[e[S]],H()}function W(e){const n=o.urlList.length;p.value=(e+n)%n}function K(){A.value&&!o.infinite||W(p.value-1)}function Q(){Z.value&&!o.infinite||W(p.value+1)}function O(e,n={}){if(C.value)return;const{zoomRate:r,rotateDeg:b,enableTransition:S}=j({zoomRate:o.zoomRate,rotateDeg:90,enableTransition:!0},n);switch(e){case"zoomOut":u.value.scale>.2&&(u.value.scale=Number.parseFloat((u.value.scale/r).toFixed(3)));break;case"zoomIn":u.value.scale<7&&(u.value.scale=Number.parseFloat((u.value.scale*r).toFixed(3)));break;case"clockwise":u.value.deg+=b;break;case"anticlockwise":u.value.deg-=b;break}u.value.enableTransition=S}return re(te,()=>{he(()=>{const e=m.value[0];e!=null&&e.complete||(C.value=!0)})}),re(p,e=>{H(),a("switch",e)}),ke(()=>{var e,n;F(),(n=(e=d.value)==null?void 0:e.focus)==null||n.call(e)}),l({setActiveItem:W}),(e,n)=>(I(),ie(Ge,{to:"body",disabled:!e.teleported},[c(qe,{name:"viewer-fade",appear:""},{default:E(()=>[w("div",{ref_key:"wrapper",ref:d,tabindex:-1,class:f(t(i).e("wrapper")),style:ue({zIndex:t(ae)})},[w("div",{class:f(t(i).e("mask")),onClick:n[0]||(n[0]=Be(r=>e.hideOnClickModal&&$(),["self"]))},null,2),z(" CLOSE "),w("span",{class:f([t(i).e("btn"),t(i).e("close")]),onClick:$},[c(t(N),null,{default:E(()=>[c(t(Ve))]),_:1})],2),z(" ARROW "),t(X)?z("v-if",!0):(I(),T(ce,{key:0},[w("span",{class:f([t(i).e("btn"),t(i).e("prev"),t(i).is("disabled",!e.infinite&&t(A))]),onClick:K},[c(t(N),null,{default:E(()=>[c(t(Me))]),_:1})],2),w("span",{class:f([t(i).e("btn"),t(i).e("next"),t(i).is("disabled",!e.infinite&&t(Z))]),onClick:Q},[c(t(N),null,{default:E(()=>[c(t(Ye))]),_:1})],2)],64)),z(" ACTIONS "),w("div",{class:f([t(i).e("btn"),t(i).e("actions")])},[w("div",{class:f(t(i).e("actions__inner"))},[c(t(N),{onClick:n[1]||(n[1]=r=>O("zoomOut"))},{default:E(()=>[c(t(Xe))]),_:1}),c(t(N),{onClick:n[2]||(n[2]=r=>O("zoomIn"))},{default:E(()=>[c(t(De))]),_:1}),w("i",{class:f(t(i).e("actions__divider"))},null,2),c(t(N),{onClick:P},{default:E(()=>[(I(),ie(Fe(t(g).icon)))]),_:1}),w("i",{class:f(t(i).e("actions__divider"))},null,2),c(t(N),{onClick:n[3]||(n[3]=r=>O("anticlockwise"))},{default:E(()=>[c(t(He))]),_:1}),c(t(N),{onClick:n[4]||(n[4]=r=>O("clockwise"))},{default:E(()=>[c(t(Pe))]),_:1})],2)],2),z(" CANVAS "),w("div",{class:f(t(i).e("canvas"))},[(I(!0),T(ce,null,We(e.urlList,(r,b)=>je((I(),T("img",{ref_for:!0,ref:S=>m.value[b]=S,key:r,src:r,style:ue(t(D)),class:f(t(i).e("img")),onLoad:se,onError:q,onMousedown:G},null,46,ut)),[[Ze,b===p.value]])),128))],2),J(e.$slots,"default")],6)]),_:3})],8,["disabled"]))}}));var ft=_e(dt,[["__file","/home/runner/work/element-plus/element-plus/packages/components/image-viewer/src/image-viewer.vue"]]);const vt=Ie(ft),mt=ge({hideOnClickModal:{type:Boolean,default:!1},src:{type:String,default:""},fit:{type:String,values:["","contain","cover","fill","none","scale-down"],default:""},loading:{type:String,values:["eager","lazy"]},lazy:{type:Boolean,default:!1},scrollContainer:{type:oe([String,Object])},previewSrcList:{type:oe(Array),default:()=>be([])},previewTeleported:{type:Boolean,default:!1},zIndex:{type:Number},initialIndex:{type:Number,default:0},infinite:{type:Boolean,default:!0},closeOnPressEscape:{type:Boolean,default:!0},zoomRate:{type:Number,default:1.2}}),pt={load:s=>s instanceof Event,error:s=>s instanceof Event,switch:s=>de(s),close:()=>!0,show:()=>!0},gt=["src","loading"],bt={key:0},wt=ee({name:"ElImage",inheritAttrs:!1}),yt=ee(U(j({},wt),{props:mt,emits:pt,setup(s,{emit:l}){const a=s;let o="";const{t:v}=we(),y=ye("image"),i=Qe(),R=Ue(),d=k(),m=k(!1),L=k(!0),C=k(!1),p=k(),g=k(),u=M&&"loading"in HTMLImageElement.prototype;let X,A;const Z=_(()=>i.style),te=_(()=>{const{fit:e}=a;return M&&e?{objectFit:e}:{}}),D=_(()=>{const{previewSrcList:e}=a;return Array.isArray(e)&&e.length>0}),ae=_(()=>{const{previewSrcList:e,initialIndex:n}=a;let r=n;return n>e.length-1&&(r=0),r}),$=_(()=>a.loading==="eager"?!1:!u&&a.loading==="lazy"||a.lazy),F=()=>{!M||(L.value=!0,m.value=!1,d.value=a.src)};function ne(e){L.value=!1,m.value=!1,l("load",e)}function se(e){L.value=!1,m.value=!0,l("error",e)}function q(){lt(p.value,g.value)&&(F(),P())}const G=st(q,200);function H(){return me(this,null,function*(){var e;if(!M)return;yield he();const{scrollContainer:n}=a;tt(n)?g.value=n:at(n)&&n!==""?g.value=(e=document.querySelector(n))!=null?e:void 0:p.value&&(g.value=nt(p.value)),g.value&&(X=Y(g,"scroll",G),setTimeout(()=>q(),100))})}function P(){!M||!g.value||!G||(X==null||X(),g.value=void 0)}function W(e){if(!!e.ctrlKey){if(e.deltaY<0)return e.preventDefault(),!1;if(e.deltaY>0)return e.preventDefault(),!1}}function K(){!D.value||(A=Y("wheel",W,{passive:!1}),o=document.body.style.overflow,document.body.style.overflow="hidden",C.value=!0,l("show"))}function Q(){A==null||A(),document.body.style.overflow=o,C.value=!1,l("close")}function O(e){l("switch",e)}return re(()=>a.src,()=>{$.value?(L.value=!0,m.value=!1,P(),H()):F()}),ke(()=>{$.value?H():F()}),(e,n)=>(I(),T("div",{ref_key:"container",ref:p,class:f([t(y).b(),e.$attrs.class]),style:ue(t(Z))},[d.value!==void 0&&!m.value?(I(),T("img",Je({key:0},t(R),{src:d.value,loading:e.loading,style:t(te),class:[t(y).e("inner"),t(D)&&t(y).e("preview"),L.value&&t(y).is("loading")],onClick:K,onLoad:ne,onError:se}),null,16,gt)):z("v-if",!0),L.value||m.value?(I(),T("div",{key:1,class:f(t(y).e("wrapper"))},[L.value?J(e.$slots,"placeholder",{key:0},()=>[w("div",{class:f(t(y).e("placeholder"))},null,2)]):m.value?J(e.$slots,"error",{key:1},()=>[w("div",{class:f(t(y).e("error"))},et(t(v)("el.image.error")),3)]):z("v-if",!0)],2)):z("v-if",!0),t(D)?(I(),T(ce,{key:2},[C.value?(I(),ie(t(vt),{key:0,"z-index":e.zIndex,"initial-index":t(ae),infinite:e.infinite,"zoom-rate":e.zoomRate,"url-list":e.previewSrcList,"hide-on-click-modal":e.hideOnClickModal,teleported:e.previewTeleported,"close-on-press-escape":e.closeOnPressEscape,onClose:Q,onSwitch:O},{default:E(()=>[e.$slots.viewer?(I(),T("div",bt,[J(e.$slots,"viewer")])):z("v-if",!0)]),_:3},8,["z-index","initial-index","infinite","zoom-rate","url-list","hide-on-click-modal","teleported","close-on-press-escape"])):z("v-if",!0)],64)):z("v-if",!0)],6))}}));var ht=_e(yt,[["__file","/home/runner/work/element-plus/element-plus/packages/components/image/src/image.vue"]]);const It=Ie(ht);export{It as E};
