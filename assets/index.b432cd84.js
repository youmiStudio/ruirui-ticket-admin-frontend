var S=(t,e,o)=>new Promise((s,n)=>{var d=u=>{try{a(o.next(u))}catch(p){n(p)}},i=u=>{try{a(o.throw(u))}catch(p){n(p)}},a=u=>u.done?s(u.value):Promise.resolve(u.value).then(d,i);a((o=o.apply(t,e)).next())});import{e5 as oe,r as Ke,aF as we,d as le,a6 as Y,af as U,bj as ue,ad as ce,a8 as W,c as K,e6 as ee,e7 as Se,e8 as xe,e9 as Ae,aV as Te,ea as Be,w,am as fe,eb as Me,be as ye,ae as Ie,a2 as Le,bg as L,a_ as se,b9 as de,h as D,i as j,j as re,n as F,l as te,as as Oe,ac as x,s as M,q as H,k as ne,at as $e,al as Ne,aB as ke,az as pe,o as ze,aj as qe,bC as Fe,aX as I,bQ as je,aP as Pe,a4 as Re,ag as He,au as Ue,bL as Z,bM as We,bN as Ye,bO as Qe,bP as Xe}from"./index.f2f4e5af.js";const P="$treeNodeId",ge=function(t,e){!e||e[P]||Object.defineProperty(e,P,{value:t.id,enumerable:!1,configurable:!1,writable:!1})},he=function(t,e){return t?e[t]:e[P]},ae=(t,e,o)=>{const s=t.value.currentNode;o();const n=t.value.currentNode;s!==n&&e("current-change",n?n.data:null,n)},ie=t=>{let e=!0,o=!0,s=!0;for(let n=0,d=t.length;n<d;n++){const i=t[n];(i.checked!==!0||i.indeterminate)&&(e=!1,i.disabled||(s=!1)),(i.checked!==!1||i.indeterminate)&&(o=!1)}return{all:e,none:o,allWithoutDisable:s,half:!e&&!o}},J=function(t){if(t.childNodes.length===0||t.loading)return;const{all:e,none:o,half:s}=ie(t.childNodes);e?(t.checked=!0,t.indeterminate=!1):s?(t.checked=!1,t.indeterminate=!0):o&&(t.checked=!1,t.indeterminate=!1);const n=t.parent;!n||n.level===0||t.store.checkStrictly||J(n)},G=function(t,e){const o=t.store.props,s=t.data||{},n=o[e];if(typeof n=="function")return n(s,t);if(typeof n=="string")return s[n];if(typeof n=="undefined"){const d=s[e];return d===void 0?"":d}};let Ge=0;class O{constructor(e){this.id=Ge++,this.text=null,this.checked=!1,this.indeterminate=!1,this.data=null,this.expanded=!1,this.parent=null,this.visible=!0,this.isCurrent=!1,this.canFocus=!1;for(const o in e)oe(e,o)&&(this[o]=e[o]);this.level=0,this.loaded=!1,this.childNodes=[],this.loading=!1,this.parent&&(this.level=this.parent.level+1)}initialize(){const e=this.store;if(!e)throw new Error("[Node]store is required!");e.registerNode(this);const o=e.props;if(o&&typeof o.isLeaf!="undefined"){const d=G(this,"isLeaf");typeof d=="boolean"&&(this.isLeafByUser=d)}if(e.lazy!==!0&&this.data?(this.setData(this.data),e.defaultExpandAll&&(this.expanded=!0,this.canFocus=!0)):this.level>0&&e.lazy&&e.defaultExpandAll&&this.expand(),Array.isArray(this.data)||ge(this,this.data),!this.data)return;const s=e.defaultExpandedKeys,n=e.key;n&&s&&s.includes(this.key)&&this.expand(null,e.autoExpandParent),n&&e.currentNodeKey!==void 0&&this.key===e.currentNodeKey&&(e.currentNode=this,e.currentNode.isCurrent=!0),e.lazy&&e._initDefaultCheckedNode(this),this.updateLeafState(),this.parent&&(this.level===1||this.parent.expanded===!0)&&(this.canFocus=!0)}setData(e){Array.isArray(e)||ge(this,e),this.data=e,this.childNodes=[];let o;this.level===0&&Array.isArray(this.data)?o=this.data:o=G(this,"children")||[];for(let s=0,n=o.length;s<n;s++)this.insertChild({data:o[s]})}get label(){return G(this,"label")}get key(){const e=this.store.key;return this.data?this.data[e]:null}get disabled(){return G(this,"disabled")}get nextSibling(){const e=this.parent;if(e){const o=e.childNodes.indexOf(this);if(o>-1)return e.childNodes[o+1]}return null}get previousSibling(){const e=this.parent;if(e){const o=e.childNodes.indexOf(this);if(o>-1)return o>0?e.childNodes[o-1]:null}return null}contains(e,o=!0){return(this.childNodes||[]).some(s=>s===e||o&&s.contains(e))}remove(){const e=this.parent;e&&e.removeChild(this)}insertChild(e,o,s){if(!e)throw new Error("InsertChild error: child is required.");if(!(e instanceof O)){if(!s){const n=this.getChildren(!0);n.includes(e.data)||(typeof o=="undefined"||o<0?n.push(e.data):n.splice(o,0,e.data))}Object.assign(e,{parent:this,store:this.store}),e=Ke(new O(e)),e instanceof O&&e.initialize()}e.level=this.level+1,typeof o=="undefined"||o<0?this.childNodes.push(e):this.childNodes.splice(o,0,e),this.updateLeafState()}insertBefore(e,o){let s;o&&(s=this.childNodes.indexOf(o)),this.insertChild(e,s)}insertAfter(e,o){let s;o&&(s=this.childNodes.indexOf(o),s!==-1&&(s+=1)),this.insertChild(e,s)}removeChild(e){const o=this.getChildren()||[],s=o.indexOf(e.data);s>-1&&o.splice(s,1);const n=this.childNodes.indexOf(e);n>-1&&(this.store&&this.store.deregisterNode(e),e.parent=null,this.childNodes.splice(n,1)),this.updateLeafState()}removeChildByData(e){let o=null;for(let s=0;s<this.childNodes.length;s++)if(this.childNodes[s].data===e){o=this.childNodes[s];break}o&&this.removeChild(o)}expand(e,o){const s=()=>{if(o){let n=this.parent;for(;n.level>0;)n.expanded=!0,n=n.parent}this.expanded=!0,e&&e(),this.childNodes.forEach(n=>{n.canFocus=!0})};this.shouldLoadData()?this.loadData(n=>{Array.isArray(n)&&(this.checked?this.setChecked(!0,!0):this.store.checkStrictly||J(this),s())}):s()}doCreateChildren(e,o={}){e.forEach(s=>{this.insertChild(Object.assign({data:s},o),void 0,!0)})}collapse(){this.expanded=!1,this.childNodes.forEach(e=>{e.canFocus=!1})}shouldLoadData(){return this.store.lazy===!0&&this.store.load&&!this.loaded}updateLeafState(){if(this.store.lazy===!0&&this.loaded!==!0&&typeof this.isLeafByUser!="undefined"){this.isLeaf=this.isLeafByUser;return}const e=this.childNodes;if(!this.store.lazy||this.store.lazy===!0&&this.loaded===!0){this.isLeaf=!e||e.length===0;return}this.isLeaf=!1}setChecked(e,o,s,n){if(this.indeterminate=e==="half",this.checked=e===!0,this.store.checkStrictly)return;if(!(this.shouldLoadData()&&!this.store.checkDescendants)){const{all:i,allWithoutDisable:a}=ie(this.childNodes);!this.isLeaf&&!i&&a&&(this.checked=!1,e=!1);const u=()=>{if(o){const p=this.childNodes;for(let r=0,g=p.length;r<g;r++){const N=p[r];n=n||e!==!1;const C=N.disabled?N.checked:n;N.setChecked(C,o,!0,n)}const{half:f,all:c}=ie(p);c||(this.checked=c,this.indeterminate=f)}};if(this.shouldLoadData()){this.loadData(()=>{u(),J(this)},{checked:e!==!1});return}else u()}const d=this.parent;!d||d.level===0||s||J(d)}getChildren(e=!1){if(this.level===0)return this.data;const o=this.data;if(!o)return null;const s=this.store.props;let n="children";return s&&(n=s.children||"children"),o[n]===void 0&&(o[n]=null),e&&!o[n]&&(o[n]=[]),o[n]}updateChildren(){const e=this.getChildren()||[],o=this.childNodes.map(d=>d.data),s={},n=[];e.forEach((d,i)=>{const a=d[P];!!a&&o.findIndex(p=>p[P]===a)>=0?s[a]={index:i,data:d}:n.push({index:i,data:d})}),this.store.lazy||o.forEach(d=>{s[d[P]]||this.removeChildByData(d)}),n.forEach(({index:d,data:i})=>{this.insertChild({data:i},d)}),this.updateLeafState()}loadData(e,o={}){if(this.store.lazy===!0&&this.store.load&&!this.loaded&&(!this.loading||Object.keys(o).length)){this.loading=!0;const s=n=>{this.childNodes=[],this.doCreateChildren(n,o),this.loaded=!0,this.loading=!1,this.updateLeafState(),e&&e.call(this,n)};this.store.load(this,s)}else e&&e.call(this)}}class Je{constructor(e){this.currentNode=null,this.currentNodeKey=null;for(const o in e)oe(e,o)&&(this[o]=e[o]);this.nodesMap={}}initialize(){if(this.root=new O({data:this.data,store:this}),this.root.initialize(),this.lazy&&this.load){const e=this.load;e(this.root,o=>{this.root.doCreateChildren(o),this._initDefaultCheckedNodes()})}else this._initDefaultCheckedNodes()}filter(e){const o=this.filterNodeMethod,s=this.lazy,n=function(d){const i=d.root?d.root.childNodes:d.childNodes;if(i.forEach(a=>{a.visible=o.call(a,e,a.data,a),n(a)}),!d.visible&&i.length){let a=!0;a=!i.some(u=>u.visible),d.root?d.root.visible=a===!1:d.visible=a===!1}!e||d.visible&&!d.isLeaf&&!s&&d.expand()};n(this)}setData(e){e!==this.root.data?(this.root.setData(e),this._initDefaultCheckedNodes()):this.root.updateChildren()}getNode(e){if(e instanceof O)return e;const o=we(e)?he(this.key,e):e;return this.nodesMap[o]||null}insertBefore(e,o){const s=this.getNode(o);s.parent.insertBefore({data:e},s)}insertAfter(e,o){const s=this.getNode(o);s.parent.insertAfter({data:e},s)}remove(e){const o=this.getNode(e);o&&o.parent&&(o===this.currentNode&&(this.currentNode=null),o.parent.removeChild(o))}append(e,o){const s=o?this.getNode(o):this.root;s&&s.insertChild({data:e})}_initDefaultCheckedNodes(){const e=this.defaultCheckedKeys||[],o=this.nodesMap;e.forEach(s=>{const n=o[s];n&&n.setChecked(!0,!this.checkStrictly)})}_initDefaultCheckedNode(e){(this.defaultCheckedKeys||[]).includes(e.key)&&e.setChecked(!0,!this.checkStrictly)}setDefaultCheckedKey(e){e!==this.defaultCheckedKeys&&(this.defaultCheckedKeys=e,this._initDefaultCheckedNodes())}registerNode(e){const o=this.key;!e||!e.data||(o?e.key!==void 0&&(this.nodesMap[e.key]=e):this.nodesMap[e.id]=e)}deregisterNode(e){!this.key||!e||!e.data||(e.childNodes.forEach(s=>{this.deregisterNode(s)}),delete this.nodesMap[e.key])}getCheckedNodes(e=!1,o=!1){const s=[],n=function(d){(d.root?d.root.childNodes:d.childNodes).forEach(a=>{(a.checked||o&&a.indeterminate)&&(!e||e&&a.isLeaf)&&s.push(a.data),n(a)})};return n(this),s}getCheckedKeys(e=!1){return this.getCheckedNodes(e).map(o=>(o||{})[this.key])}getHalfCheckedNodes(){const e=[],o=function(s){(s.root?s.root.childNodes:s.childNodes).forEach(d=>{d.indeterminate&&e.push(d.data),o(d)})};return o(this),e}getHalfCheckedKeys(){return this.getHalfCheckedNodes().map(e=>(e||{})[this.key])}_getAllNodes(){const e=[],o=this.nodesMap;for(const s in o)oe(o,s)&&e.push(o[s]);return e}updateChildren(e,o){const s=this.nodesMap[e];if(!s)return;const n=s.childNodes;for(let d=n.length-1;d>=0;d--){const i=n[d];this.remove(i.data)}for(let d=0,i=o.length;d<i;d++){const a=o[d];this.append(a,s.data)}}_setCheckedKeys(e,o=!1,s){const n=this._getAllNodes().sort((a,u)=>u.level-a.level),d=Object.create(null),i=Object.keys(s);n.forEach(a=>a.setChecked(!1,!1));for(let a=0,u=n.length;a<u;a++){const p=n[a],f=p.data[e].toString();if(!i.includes(f)){p.checked&&!d[f]&&p.setChecked(!1,!1);continue}let r=p.parent;for(;r&&r.level>0;)d[r.data[e]]=!0,r=r.parent;if(p.isLeaf||this.checkStrictly){p.setChecked(!0,!1);continue}if(p.setChecked(!0,!0),o){p.setChecked(!1,!1);const g=function(N){N.childNodes.forEach(v=>{v.isLeaf||v.setChecked(!1,!1),g(v)})};g(p)}}}setCheckedNodes(e,o=!1){const s=this.key,n={};e.forEach(d=>{n[(d||{})[s]]=!0}),this._setCheckedKeys(s,o,n)}setCheckedKeys(e,o=!1){this.defaultCheckedKeys=e;const s=this.key,n={};e.forEach(d=>{n[d]=!0}),this._setCheckedKeys(s,o,n)}setDefaultExpandedKeys(e){e=e||[],this.defaultExpandedKeys=e,e.forEach(o=>{const s=this.getNode(o);s&&s.expand(null,this.autoExpandParent)})}setChecked(e,o,s){const n=this.getNode(e);n&&n.setChecked(!!o,s)}getCurrentNode(){return this.currentNode}setCurrentNode(e){const o=this.currentNode;o&&(o.isCurrent=!1),this.currentNode=e,this.currentNode.isCurrent=!0}setUserCurrentNode(e,o=!0){const s=e[this.key],n=this.nodesMap[s];this.setCurrentNode(n),o&&this.currentNode.level>1&&this.currentNode.parent.expand(null,!0)}setCurrentNodeKey(e,o=!0){if(e==null){this.currentNode&&(this.currentNode.isCurrent=!1),this.currentNode=null;return}const s=this.getNode(e);s&&(this.setCurrentNode(s),o&&this.currentNode.level>1&&this.currentNode.parent.expand(null,!0))}}const Ve=le({name:"ElTreeNodeContent",props:{node:{type:Object,required:!0},renderContent:Function},setup(t){const e=Y("tree"),o=U("NodeInstance"),s=U("RootTree");return()=>{const n=t.node,{data:d,store:i}=n;return t.renderContent?t.renderContent(ue,{_self:o,node:n,data:d,store:i}):s.ctx.slots.default?s.ctx.slots.default({node:n,data:d}):ue("span",{class:e.be("node","label")},[n.label])}}});var Ze=ce(Ve,[["__file","/home/runner/work/element-plus/element-plus/packages/components/tree/src/tree-node-content.vue"]]);function Ce(t){const e=U("TreeNodeMap",null),o={treeNodeExpand:s=>{t.node!==s&&t.node.collapse()},children:[]};return e&&e.children.push(o),W("TreeNodeMap",o),{broadcastExpanded:s=>{if(!!t.accordion)for(const n of o.children)n.treeNodeExpand(s)}}}const ve=Symbol("dragEvents");function _e({props:t,ctx:e,el$:o,dropIndicator$:s,store:n}){const d=Y("tree"),i=K({showDropIndicator:!1,draggingNode:null,dropNode:null,allowDrop:!0,dropType:null});return W(ve,{treeNodeDragStart:({event:f,treeNode:c})=>{if(typeof t.allowDrag=="function"&&!t.allowDrag(c.node))return f.preventDefault(),!1;f.dataTransfer.effectAllowed="move";try{f.dataTransfer.setData("text/plain","")}catch(r){}i.value.draggingNode=c,e.emit("node-drag-start",c.node,f)},treeNodeDragOver:({event:f,treeNode:c})=>{const r=c,g=i.value.dropNode;g&&g!==r&&ee(g.$el,d.is("drop-inner"));const N=i.value.draggingNode;if(!N||!r)return;let C=!0,v=!0,b=!0,B=!0;typeof t.allowDrop=="function"&&(C=t.allowDrop(N.node,r.node,"prev"),B=v=t.allowDrop(N.node,r.node,"inner"),b=t.allowDrop(N.node,r.node,"next")),f.dataTransfer.dropEffect=v||C||b?"move":"none",(C||v||b)&&g!==r&&(g&&e.emit("node-drag-leave",N.node,g.node,f),e.emit("node-drag-enter",N.node,r.node,f)),(C||v||b)&&(i.value.dropNode=r),r.node.nextSibling===N.node&&(b=!1),r.node.previousSibling===N.node&&(C=!1),r.node.contains(N.node,!1)&&(v=!1),(N.node===r.node||N.node.contains(r.node))&&(C=!1,v=!1,b=!1);const A=r.$el.getBoundingClientRect(),$=o.value.getBoundingClientRect();let E;const Q=C?v?.25:b?.45:1:-1,X=b?v?.75:C?.55:0:1;let z=-9999;const h=f.clientY-A.top;h<A.height*Q?E="before":h>A.height*X?E="after":v?E="inner":E="none";const k=r.$el.querySelector(`.${d.be("node","expand-icon")}`).getBoundingClientRect(),m=s.value;E==="before"?z=k.top-$.top:E==="after"&&(z=k.bottom-$.top),m.style.top=`${z}px`,m.style.left=`${k.right-$.left}px`,E==="inner"?Se(r.$el,d.is("drop-inner")):ee(r.$el,d.is("drop-inner")),i.value.showDropIndicator=E==="before"||E==="after",i.value.allowDrop=i.value.showDropIndicator||B,i.value.dropType=E,e.emit("node-drag-over",N.node,r.node,f)},treeNodeDragEnd:f=>{const{draggingNode:c,dropType:r,dropNode:g}=i.value;if(f.preventDefault(),f.dataTransfer.dropEffect="move",c&&g){const N={data:c.node.data};r!=="none"&&c.node.remove(),r==="before"?g.node.parent.insertBefore(N,g.node):r==="after"?g.node.parent.insertAfter(N,g.node):r==="inner"&&g.node.insertChild(N),r!=="none"&&n.value.registerNode(N),ee(g.$el,d.is("drop-inner")),e.emit("node-drag-end",c.node,g.node,r,f),r!=="none"&&e.emit("node-drop",c.node,g.node,r,f)}c&&!g&&e.emit("node-drag-end",c.node,null,r,f),i.value.showDropIndicator=!1,i.value.draggingNode=null,i.value.dropNode=null,i.value.allowDrop=!0}}),{dragState:i}}const et=le({name:"ElTreeNode",components:{ElCollapseTransition:xe,ElCheckbox:Ae,NodeContent:Ze,ElIcon:Te,Loading:Be},props:{node:{type:O,default:()=>({})},props:{type:Object,default:()=>({})},accordion:Boolean,renderContent:Function,renderAfterExpand:Boolean,showCheckbox:{type:Boolean,default:!1}},emits:["node-expand"],setup(t,e){const o=Y("tree"),{broadcastExpanded:s}=Ce(t),n=U("RootTree"),d=K(!1),i=K(!1),a=K(null),u=K(null),p=K(null),f=U(ve),c=ye();W("NodeInstance",c),t.node.expanded&&(d.value=!0,i.value=!0);const r=n.props.children||"children";w(()=>{const h=t.node.data[r];return h&&[...h]},()=>{t.node.updateChildren()}),w(()=>t.node.indeterminate,h=>{C(t.node.checked,h)}),w(()=>t.node.checked,h=>{C(h,t.node.indeterminate)}),w(()=>t.node.expanded,h=>{fe(()=>d.value=h),h&&(i.value=!0)});const g=h=>he(n.props.nodeKey,h.data),N=h=>{const k=t.props.class;if(!k)return{};let m;if(Ie(k)){const{data:_}=h;m=k(_,h)}else m=k;return Le(m)?{[m]:!0}:m},C=(h,k)=>{(a.value!==h||u.value!==k)&&n.ctx.emit("check-change",t.node.data,h,k),a.value=h,u.value=k},v=h=>{ae(n.store,n.ctx.emit,()=>n.store.value.setCurrentNode(t.node)),n.currentNode.value=t.node,n.props.expandOnClickNode&&B(),n.props.checkOnClickNode&&!t.node.disabled&&A(null,{target:{checked:!t.node.checked}}),n.ctx.emit("node-click",t.node.data,t.node,c,h)},b=h=>{n.instance.vnode.props.onNodeContextmenu&&(h.stopPropagation(),h.preventDefault()),n.ctx.emit("node-contextmenu",h,t.node.data,t.node,c)},B=()=>{t.node.isLeaf||(d.value?(n.ctx.emit("node-collapse",t.node.data,t.node,c),t.node.collapse()):(t.node.expand(),e.emit("node-expand",t.node.data,t.node,c)))},A=(h,k)=>{t.node.setChecked(k.target.checked,!n.props.checkStrictly),fe(()=>{const m=n.store.value;n.ctx.emit("check",t.node.data,{checkedNodes:m.getCheckedNodes(),checkedKeys:m.getCheckedKeys(),halfCheckedNodes:m.getHalfCheckedNodes(),halfCheckedKeys:m.getHalfCheckedKeys()})})};return{ns:o,node$:p,tree:n,expanded:d,childNodeRendered:i,oldChecked:a,oldIndeterminate:u,getNodeKey:g,getNodeClass:N,handleSelectChange:C,handleClick:v,handleContextMenu:b,handleExpandIconClick:B,handleCheckChange:A,handleChildNodeExpand:(h,k,m)=>{s(k),n.ctx.emit("node-expand",h,k,m)},handleDragStart:h=>{!n.props.draggable||f.treeNodeDragStart({event:h,treeNode:t})},handleDragOver:h=>{h.preventDefault(),n.props.draggable&&f.treeNodeDragOver({event:h,treeNode:{$el:p.value,node:t.node}})},handleDrop:h=>{h.preventDefault()},handleDragEnd:h=>{!n.props.draggable||f.treeNodeDragEnd(h)},CaretRight:Me}}}),tt=["aria-expanded","aria-disabled","aria-checked","draggable","data-key"],nt=["aria-expanded"];function ot(t,e,o,s,n,d){const i=L("el-icon"),a=L("el-checkbox"),u=L("loading"),p=L("node-content"),f=L("el-tree-node"),c=L("el-collapse-transition");return se((D(),j("div",{ref:"node$",class:x([t.ns.b("node"),t.ns.is("expanded",t.expanded),t.ns.is("current",t.node.isCurrent),t.ns.is("hidden",!t.node.visible),t.ns.is("focusable",!t.node.disabled),t.ns.is("checked",!t.node.disabled&&t.node.checked),t.getNodeClass(t.node)]),role:"treeitem",tabindex:"-1","aria-expanded":t.expanded,"aria-disabled":t.node.disabled,"aria-checked":t.node.checked,draggable:t.tree.props.draggable,"data-key":t.getNodeKey(t.node),onClick:e[1]||(e[1]=M((...r)=>t.handleClick&&t.handleClick(...r),["stop"])),onContextmenu:e[2]||(e[2]=(...r)=>t.handleContextMenu&&t.handleContextMenu(...r)),onDragstart:e[3]||(e[3]=M((...r)=>t.handleDragStart&&t.handleDragStart(...r),["stop"])),onDragover:e[4]||(e[4]=M((...r)=>t.handleDragOver&&t.handleDragOver(...r),["stop"])),onDragend:e[5]||(e[5]=M((...r)=>t.handleDragEnd&&t.handleDragEnd(...r),["stop"])),onDrop:e[6]||(e[6]=M((...r)=>t.handleDrop&&t.handleDrop(...r),["stop"]))},[re("div",{class:x(t.ns.be("node","content")),style:$e({paddingLeft:(t.node.level-1)*t.tree.props.indent+"px"})},[t.tree.props.icon||t.CaretRight?(D(),F(i,{key:0,class:x([t.ns.be("node","expand-icon"),t.ns.is("leaf",t.node.isLeaf),{expanded:!t.node.isLeaf&&t.expanded}]),onClick:M(t.handleExpandIconClick,["stop"])},{default:te(()=>[(D(),F(Oe(t.tree.props.icon||t.CaretRight)))]),_:1},8,["class","onClick"])):H("v-if",!0),t.showCheckbox?(D(),F(a,{key:1,"model-value":t.node.checked,indeterminate:t.node.indeterminate,disabled:!!t.node.disabled,onClick:e[0]||(e[0]=M(()=>{},["stop"])),onChange:t.handleCheckChange},null,8,["model-value","indeterminate","disabled","onChange"])):H("v-if",!0),t.node.loading?(D(),F(i,{key:2,class:x([t.ns.be("node","loading-icon"),t.ns.is("loading")])},{default:te(()=>[ne(u)]),_:1},8,["class"])):H("v-if",!0),ne(p,{node:t.node,"render-content":t.renderContent},null,8,["node","render-content"])],6),ne(c,null,{default:te(()=>[!t.renderAfterExpand||t.childNodeRendered?se((D(),j("div",{key:0,class:x(t.ns.be("node","children")),role:"group","aria-expanded":t.expanded},[(D(!0),j(Ne,null,ke(t.node.childNodes,r=>(D(),F(f,{key:t.getNodeKey(r),"render-content":t.renderContent,"render-after-expand":t.renderAfterExpand,"show-checkbox":t.showCheckbox,node:r,accordion:t.accordion,props:t.props,onNodeExpand:t.handleChildNodeExpand},null,8,["render-content","render-after-expand","show-checkbox","node","accordion","props","onNodeExpand"]))),128))],10,nt)),[[de,t.expanded]]):H("v-if",!0)]),_:1})],42,tt)),[[de,t.node.visible]])}var st=ce(et,[["render",ot],["__file","/home/runner/work/element-plus/element-plus/packages/components/tree/src/tree-node.vue"]]);function dt({el$:t},e){const o=Y("tree"),s=pe([]),n=pe([]);ze(()=>{i()}),qe(()=>{s.value=Array.from(t.value.querySelectorAll("[role=treeitem]")),n.value=Array.from(t.value.querySelectorAll("input[type=checkbox]"))}),w(n,a=>{a.forEach(u=>{u.setAttribute("tabindex","-1")})}),Fe(t,"keydown",a=>{const u=a.target;if(!u.className.includes(o.b("node")))return;const p=a.code;s.value=Array.from(t.value.querySelectorAll(`.${o.is("focusable")}[role=treeitem]`));const f=s.value.indexOf(u);let c;if([I.up,I.down].includes(p)){if(a.preventDefault(),p===I.up){c=f===-1?0:f!==0?f-1:s.value.length-1;const g=c;for(;!e.value.getNode(s.value[c].dataset.key).canFocus;){if(c--,c===g){c=-1;break}c<0&&(c=s.value.length-1)}}else{c=f===-1?0:f<s.value.length-1?f+1:0;const g=c;for(;!e.value.getNode(s.value[c].dataset.key).canFocus;){if(c++,c===g){c=-1;break}c>=s.value.length&&(c=0)}}c!==-1&&s.value[c].focus()}[I.left,I.right].includes(p)&&(a.preventDefault(),u.click());const r=u.querySelector('[type="checkbox"]');[I.enter,I.space].includes(p)&&r&&(a.preventDefault(),r.click())});const i=()=>{var a;s.value=Array.from(t.value.querySelectorAll(`.${o.is("focusable")}[role=treeitem]`)),n.value=Array.from(t.value.querySelectorAll("input[type=checkbox]"));const u=t.value.querySelectorAll(`.${o.is("checked")}[role=treeitem]`);if(u.length){u[0].setAttribute("tabindex","0");return}(a=s.value[0])==null||a.setAttribute("tabindex","0")}}const rt=le({name:"ElTree",components:{ElTreeNode:st},props:{data:{type:Array,default:()=>[]},emptyText:{type:String},renderAfterExpand:{type:Boolean,default:!0},nodeKey:String,checkStrictly:Boolean,defaultExpandAll:Boolean,expandOnClickNode:{type:Boolean,default:!0},checkOnClickNode:Boolean,checkDescendants:{type:Boolean,default:!1},autoExpandParent:{type:Boolean,default:!0},defaultCheckedKeys:Array,defaultExpandedKeys:Array,currentNodeKey:[String,Number],renderContent:Function,showCheckbox:{type:Boolean,default:!1},draggable:{type:Boolean,default:!1},allowDrag:Function,allowDrop:Function,props:{type:Object,default:()=>({children:"children",label:"label",disabled:"disabled"})},lazy:{type:Boolean,default:!1},highlightCurrent:Boolean,load:Function,filterNodeMethod:Function,accordion:Boolean,indent:{type:Number,default:18},icon:{type:je}},emits:["check-change","current-change","node-click","node-contextmenu","node-collapse","node-expand","check","node-drag-start","node-drag-end","node-drop","node-drag-leave","node-drag-enter","node-drag-over"],setup(t,e){const{t:o}=Pe(),s=Y("tree"),n=K(new Je({key:t.nodeKey,data:t.data,lazy:t.lazy,props:t.props,load:t.load,currentNodeKey:t.currentNodeKey,checkStrictly:t.checkStrictly,checkDescendants:t.checkDescendants,defaultCheckedKeys:t.defaultCheckedKeys,defaultExpandedKeys:t.defaultExpandedKeys,autoExpandParent:t.autoExpandParent,defaultExpandAll:t.defaultExpandAll,filterNodeMethod:t.filterNodeMethod}));n.value.initialize();const d=K(n.value.root),i=K(null),a=K(null),u=K(null),{broadcastExpanded:p}=Ce(t),{dragState:f}=_e({props:t,ctx:e,el$:a,dropIndicator$:u,store:n});dt({el$:a},n);const c=Re(()=>{const{childNodes:l}=d.value;return!l||l.length===0||l.every(({visible:y})=>!y)});w(()=>t.currentNodeKey,l=>{n.value.setCurrentNodeKey(l)}),w(()=>t.defaultCheckedKeys,l=>{n.value.setDefaultCheckedKey(l)}),w(()=>t.defaultExpandedKeys,l=>{n.value.setDefaultExpandedKeys(l)}),w(()=>t.data,l=>{n.value.setData(l)},{deep:!0}),w(()=>t.checkStrictly,l=>{n.value.checkStrictly=l});const r=l=>{if(!t.filterNodeMethod)throw new Error("[Tree] filterNodeMethod is required when filter");n.value.filter(l)},g=l=>he(t.nodeKey,l.data),N=l=>{if(!t.nodeKey)throw new Error("[Tree] nodeKey is required in getNodePath");const y=n.value.getNode(l);if(!y)return[];const q=[y.data];let R=y.parent;for(;R&&R!==d.value;)q.push(R.data),R=R.parent;return q.reverse()},C=(l,y)=>n.value.getCheckedNodes(l,y),v=l=>n.value.getCheckedKeys(l),b=()=>{const l=n.value.getCurrentNode();return l?l.data:null},B=()=>{if(!t.nodeKey)throw new Error("[Tree] nodeKey is required in getCurrentKey");const l=b();return l?l[t.nodeKey]:null},A=(l,y)=>{if(!t.nodeKey)throw new Error("[Tree] nodeKey is required in setCheckedNodes");n.value.setCheckedNodes(l,y)},$=(l,y)=>{if(!t.nodeKey)throw new Error("[Tree] nodeKey is required in setCheckedKeys");n.value.setCheckedKeys(l,y)},E=(l,y,q)=>{n.value.setChecked(l,y,q)},Q=()=>n.value.getHalfCheckedNodes(),X=()=>n.value.getHalfCheckedKeys(),z=(l,y=!0)=>{if(!t.nodeKey)throw new Error("[Tree] nodeKey is required in setCurrentNode");ae(n,e.emit,()=>n.value.setUserCurrentNode(l,y))},h=(l,y=!0)=>{if(!t.nodeKey)throw new Error("[Tree] nodeKey is required in setCurrentKey");ae(n,e.emit,()=>n.value.setCurrentNodeKey(l,y))},k=l=>n.value.getNode(l),m=l=>{n.value.remove(l)},_=(l,y)=>{n.value.append(l,y)},me=(l,y)=>{n.value.insertBefore(l,y)},be=(l,y)=>{n.value.insertAfter(l,y)},Ee=(l,y,q)=>{p(y),e.emit("node-expand",l,y,q)},De=(l,y)=>{if(!t.nodeKey)throw new Error("[Tree] nodeKey is required in updateKeyChild");n.value.updateChildren(l,y)};return W("RootTree",{ctx:e,props:t,store:n,root:d,currentNode:i,instance:ye()}),W(He,void 0),{ns:s,store:n,root:d,currentNode:i,dragState:f,el$:a,dropIndicator$:u,isEmpty:c,filter:r,getNodeKey:g,getNodePath:N,getCheckedNodes:C,getCheckedKeys:v,getCurrentNode:b,getCurrentKey:B,setCheckedNodes:A,setCheckedKeys:$,setChecked:E,getHalfCheckedNodes:Q,getHalfCheckedKeys:X,setCurrentNode:z,setCurrentKey:h,t:o,getNode:k,remove:m,append:_,insertBefore:me,insertAfter:be,handleNodeExpand:Ee,updateKeyChildren:De}}});function at(t,e,o,s,n,d){var i;const a=L("el-tree-node");return D(),j("div",{ref:"el$",class:x([t.ns.b(),t.ns.is("dragging",!!t.dragState.draggingNode),t.ns.is("drop-not-allow",!t.dragState.allowDrop),t.ns.is("drop-inner",t.dragState.dropType==="inner"),{[t.ns.m("highlight-current")]:t.highlightCurrent}]),role:"tree"},[(D(!0),j(Ne,null,ke(t.root.childNodes,u=>(D(),F(a,{key:t.getNodeKey(u),node:u,props:t.props,accordion:t.accordion,"render-after-expand":t.renderAfterExpand,"show-checkbox":t.showCheckbox,"render-content":t.renderContent,onNodeExpand:t.handleNodeExpand},null,8,["node","props","accordion","render-after-expand","show-checkbox","render-content","onNodeExpand"]))),128)),t.isEmpty?(D(),j("div",{key:0,class:x(t.ns.e("empty-block"))},[re("span",{class:x(t.ns.e("empty-text"))},Ue((i=t.emptyText)!=null?i:t.t("el.tree.emptyText")),3)],2)):H("v-if",!0),se(re("div",{ref:"dropIndicator$",class:x(t.ns.e("drop-indicator"))},null,2),[[de,t.dragState.showDropIndicator]])],2)}var V=ce(rt,[["render",at],["__file","/home/runner/work/element-plus/element-plus/packages/components/tree/src/tree.vue"]]);V.install=t=>{t.component(V.name,V)};const it=V,ht=it;const T="/admin/menu",ut=()=>S(void 0,null,function*(){return Z({url:T+"/treeSelect"})}),ft=t=>S(void 0,null,function*(){return Z({url:T+"/roleMenuTreeSelect/"+t})}),pt=t=>S(void 0,null,function*(){return Z({url:T+"/list",params:t})}),gt=t=>S(void 0,null,function*(){return Z({url:T+"/"+t})}),yt=t=>S(void 0,null,function*(){return We({url:T,data:t})}),Nt=t=>S(void 0,null,function*(){return Ye({url:T+"/"+t})}),kt=t=>S(void 0,null,function*(){return Qe({url:T,data:t})}),Ct=t=>S(void 0,null,function*(){return Xe(T+"/export",t,`Role_${new Date().getTime()}.xlsx`)});export{ht as E,it as _,yt as a,Ct as b,ut as c,ft as d,kt as e,gt as g,pt as m,Nt as r};
