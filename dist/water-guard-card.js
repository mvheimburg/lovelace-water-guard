/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$3=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$3&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$3=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$4=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$3)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$3?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$3,defineProperty:e$2,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$2,getOwnPropertySymbols:o$2,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$2=c$1?c$1.emptyScript:"",p$2=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$2:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$3(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$2(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$2(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$2?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$2=t=>t,s$1=t$1.trustedTypes,e$1=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$1=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o$1,r$1=`<${n}>`,l$1=document,c=()=>l$1.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m$1=/>/g,p$1=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l$1.createTreeWalker(l$1,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$1?e$1.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m$1:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p$1):void 0!==u[3]&&(c=p$1):c===p$1?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p$1:'"'===u[3]?$:g):c===$||c===g?c=p$1:c===_||c===m$1?c=v:(c=p$1,n=void 0);const x=c===p$1&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$1:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$1+x):s+o$1+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$1),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$1)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$1),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$1,t+1));)d.push({type:7,index:l}),t+=o$1.length-1;}l++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l$1).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l$1,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l$1.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$2(t).nextSibling;i$2(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;let i$1 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$1._$litElement$=true,i$1["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i$1});const o=s.litElementPolyfillSupport;o?.({LitElement:i$1});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r=o=>void 0===o.strings,m={},p=(o,t=m)=>o._$AH=t;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=e(class extends i{constructor(r$1){if(super(r$1),r$1.type!==t.PROPERTY&&r$1.type!==t.ATTRIBUTE&&r$1.type!==t.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!r(r$1))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(i,[t$1]){if(t$1===E||t$1===A)return t$1;const o=i.element,l=i.name;if(i.type===t.PROPERTY){if(t$1===o[l])return E}else if(i.type===t.BOOLEAN_ATTRIBUTE){if(!!t$1===o.hasAttribute(l))return E}else if(i.type===t.ATTRIBUTE&&o.getAttribute(l)===t$1+"")return E;return p(i),t$1}});

const colorSchemes = [
    "home-assistant",
    "bright",
    "warm",
    "mint",
    "sky",
    "lavender",
];
const en$1 = {
    label: "Color scheme",
    "home-assistant": "Home Assistant",
    bright: "Bright",
    warm: "Warm",
    mint: "Mint",
    sky: "Sky",
    lavender: "Lavender",
    invalid: "Choose a valid color_scheme: home-assistant, bright, warm, mint, sky or lavender.",
};
const nb$1 = {
    label: "Fargevalg",
    "home-assistant": "Home Assistant",
    bright: "Lys",
    warm: "Varm",
    mint: "Mint",
    sky: "Himmelblå",
    lavender: "Lavendel",
    invalid: "Velg en gyldig color_scheme: home-assistant, bright, warm, mint, sky eller lavender.",
};
function colorSchemeText(hass) {
    const language = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase()
        .replace(/_/g, "-")
        .split("-")[0];
    return ["nb", "no", "nn"].includes(language) ? nb$1 : en$1;
}
function applyColorScheme(host, value, hass) {
    const scheme = value === undefined ? "home-assistant" : value;
    if (typeof scheme !== "string" ||
        !colorSchemes.includes(scheme)) {
        throw new Error(colorSchemeText(hass).invalid);
    }
    if (scheme === "home-assistant")
        host.removeAttribute("data-color-scheme");
    else
        host.setAttribute("data-color-scheme", scheme);
}
function colorSchemeSelector(hass, value, change) {
    const text = colorSchemeText(hass);
    return b `<label
    style="display:flex;flex-direction:column;align-items:stretch;gap:6px;margin:12px 0;"
  >
    ${text.label}
    <select
      name="color_scheme"
      style="font:inherit;min-height:44px;width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--divider-color, #ccc);background:var(--card-background-color, #fff);color:var(--primary-text-color, #202b36);"
      .value=${l(String(value ?? "home-assistant"))}
      @change=${(event) => {
        event.stopPropagation();
        change(event.target.value);
    }}
    >
      ${colorSchemes.map((scheme) => b `<option value=${scheme} ?selected=${scheme === (value ?? "home-assistant")}>${text[scheme]}</option>`)}
    </select>
  </label>`;
}
/** Local overrides only: removing the attribute restores the dashboard theme. */
const colorSchemeStyles = i$4 `
  :host([data-color-scheme]) {
    color-scheme: light;
    --primary-text-color: #202b36;
    --secondary-text-color: #52606d;
    --disabled-text-color: #626d78;
    --text-primary-color: #fff;
    --success-color: #28723c;
    --warning-color: #8c6100;
    --error-color: #bd2635;
    --orange-color: #ab4b13;
    --info-color: #146a91;
    --primary-color: var(--scheme-accent);
    --accent-color: var(--scheme-accent);
    --card-background-color: var(--scheme-surface);
    --ha-card-background: var(--scheme-surface);
    --primary-background-color: var(--scheme-surface);
    --secondary-background-color: var(--scheme-secondary);
    --divider-color: var(--scheme-border);
    --ha-card-border-color: var(--scheme-border);
    --bubble-main-background-color: var(--scheme-surface);
    --bubble-secondary-background-color: var(--scheme-secondary);
    --bubble-icon-background-color: var(--scheme-secondary);
    --bubble-sub-button-background-color: var(--scheme-secondary);
    --bubble-accent-color: var(--scheme-accent);
    --bubble-border: 1px solid var(--scheme-border);
    --ha-card-box-shadow: 0 2px 8px rgb(32 43 54 / 0.06);
    --bubble-box-shadow: var(--ha-card-box-shadow);
    --input-fill-color: var(--scheme-secondary);
    --input-ink-color: var(--primary-text-color);
    --input-label-ink-color: var(--secondary-text-color);
    --mdc-theme-primary: var(--scheme-accent);
    --mdc-theme-surface: var(--scheme-surface);
    --mdc-theme-on-surface: var(--primary-text-color);
    --mdc-text-field-fill-color: var(--scheme-secondary);
    --mdc-text-field-ink-color: var(--primary-text-color);
  }
  :host([data-color-scheme="bright"]) {
    --scheme-surface: #ffffff;
    --scheme-secondary: #edf3fa;
    --scheme-accent: #2365a5;
    --scheme-border: #ccd9e7;
  }
  :host([data-color-scheme="warm"]) {
    --scheme-surface: #fffaf1;
    --scheme-secondary: #f4ead9;
    --scheme-accent: #885321;
    --scheme-border: #ddd0ba;
  }
  :host([data-color-scheme="mint"]) {
    --scheme-surface: #f2fbf5;
    --scheme-secondary: #dfefe5;
    --scheme-accent: #286c50;
    --scheme-border: #c1d9ca;
  }
  :host([data-color-scheme="sky"]) {
    --scheme-surface: #f1f8ff;
    --scheme-secondary: #dfeefa;
    --scheme-accent: #22638e;
    --scheme-border: #c2d8e9;
  }
  :host([data-color-scheme="lavender"]) {
    --scheme-surface: #faf5ff;
    --scheme-secondary: #ede3f6;
    --scheme-accent: #725095;
    --scheme-border: #d7c8e5;
  }
`;

function validateConfig(input) {
    if (!input || typeof input !== "object")
        throw new Error("Card configuration is required");
    const config = { appearance: "default", entity: "", ...input };
    if (typeof config.entity !== "string")
        throw new Error("entity must be a Water Guard Leak sensor");
    if (config.entity && !config.entity.startsWith("binary_sensor."))
        throw new Error("entity must be a Water Guard Leak sensor (binary_sensor)");
    if (!["default", "bubble"].includes(String(config.appearance)))
        throw new Error("appearance must be default or bubble");
    if (input.title !== undefined && typeof input.title !== "string")
        throw new Error("title must be text");
    return config;
}

const paths = {
    drop: w `<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"></path>
    <path d="M9 14.5a3 3 0 0 0 3 3"></path>`,
    leak: w `<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"></path>
    <path d="M12 9v4M12 16.5h.01"></path>`,
    unknown: w `<circle cx="12" cy="12" r="9"></circle>
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.2M12 17h.01"></path>`,
    valve: w `<path d="M3 15h18M3 11h18"></path>
    <path d="M12 11V6M8.5 6h7"></path>`,
    cog: w `<circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path>`,
};
/** Stroke icons in currentColor; decorative, text beside them carries meaning. */
const icon = (name) => b `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${paths[name]}
  </svg>`;

const norwegian = (value) => /^(nb|nn|no)(-|$)/.test(value);
const normalize = (value) => (value ?? "").replace(/_/g, "-").toLowerCase();
/** Dictionary language: Bokmål for nb, no and nn (no Nynorsk dictionary), else English. */
function dictionary(hass) {
    return norwegian(normalize(hass?.language || hass?.locale?.language))
        ? "nb"
        : "en";
}
/**
 * Formatting locale, kept apart from the dictionary: en-GB keeps its
 * 24-hour clock even though its labels come from the English dictionary.
 */
function formatLocale(hass) {
    const value = normalize(hass?.locale?.language || hass?.language || "en");
    if (norwegian(value))
        return "nb-NO";
    try {
        return Intl.getCanonicalLocales(value)[0] ?? "en";
    }
    catch {
        return "en";
    }
}
const en = {
    title: "Water Guard",
    noLeak: "No leak",
    leak: "Leak",
    leakDetected: "Water leak",
    unavailable: "Unavailable",
    unavailableHelp: "Water Guard is not reporting right now. The override is disabled until it is back.",
    missing: "Water Guard sensor not found. Choose it in the card editor.",
    settings: "Water Guard settings",
    watching: "Watching {n} sensors",
    watchingOne: "Watching 1 sensor",
    sensors: "sensors",
    sensorsOne: "sensor",
    water: "Water",
    waterOn: "On",
    waterOff: "Off",
    waterMixed: "Partly off",
    waterUnknown: "Unknown",
    noValves: "Not controlled",
    alerts: "alerted on a leak",
    valveOpen: "Open",
    valveClosed: "Closed",
    valveMoving: "Moving",
    valveUnavailable: "Unavailable",
    detectedFor: "Detected for",
    since: "Since {time}",
    stillWet: "Still wet",
    dryNow: "Dry now",
    sensorUnavailable: "Unavailable",
    waterShut: "The water is shut off.",
    waterNotShut: "Not shut off: {valves}. Shut the water off by hand.",
    checkWater: "Check that the water is shut off.",
    notified: "Alerted",
    notReached: "Not reached",
    noApp: "no app",
    failed: "failed",
    sending: "sending…",
    noPeople: "No one is set up to be alerted.",
    override: "Override: open water",
    overrideTitle: "Open the water?",
    overrideValves: "Opens {valves} and clears the leak alert, also on everyone's phones.",
    overrideNoValves: "Clears the leak alert, also on everyone's phones. Water Guard controls no valves, so open the water where it was shut off.",
    overrideWet: "{sensors} still reports water. The override opens it anyway.",
    cancel: "Cancel",
    confirm: "Open the water",
    opening: "Opening the water…",
    changed: "The alert changed. Review it and try again.",
    overrideFailed: "Override failed",
    stillWetCalm: "{sensors} still reports water, but the alert was overridden.",
    cannotWatch: "Cannot watch: {sensors}.",
    valveFailed: "Did not open: {valves}. The leak alert stays.",
    legacy: "Update Water Guard to 0.2.0 or later to see its valves and people here.",
    entity: "Water Guard",
    selectEntity: "Select a Water Guard",
    entityHelp: "The Leak sensor of the Water Guard to show.",
    noGuards: "No Water Guard found. Add the integration first.",
    requiredEntity: "Select a Water Guard.",
    cardTitle: "Title",
    appearance: "Appearance",
    default: "Default",
    bubble: "Bubble",
};
const nb = {
    title: "Vannvakt",
    noLeak: "Ingen lekkasje",
    leak: "Lekkasje",
    leakDetected: "Vannlekkasje",
    unavailable: "Utilgjengelig",
    unavailableHelp: "Vannvakt rapporterer ikke akkurat nå. Overstyring er slått av til den er tilbake.",
    missing: "Fant ikke Vannvakt-sensoren. Velg den i kortredigeringen.",
    settings: "Innstillinger for Vannvakt",
    watching: "Overvåker {n} sensorer",
    watchingOne: "Overvåker 1 sensor",
    sensors: "sensorer",
    sensorsOne: "sensor",
    water: "Vann",
    waterOn: "På",
    waterOff: "Stengt",
    waterMixed: "Delvis stengt",
    waterUnknown: "Ukjent",
    noValves: "Styres ikke",
    alerts: "varsles ved lekkasje",
    valveOpen: "Åpen",
    valveClosed: "Stengt",
    valveMoving: "Beveger seg",
    valveUnavailable: "Utilgjengelig",
    detectedFor: "Oppdaget for",
    since: "Siden {time}",
    stillWet: "Fortsatt vått",
    dryNow: "Tørt nå",
    sensorUnavailable: "Utilgjengelig",
    waterShut: "Vannet er stengt.",
    waterNotShut: "Ikke stengt: {valves}. Steng vannet manuelt.",
    checkWater: "Kontroller at vannet er stengt.",
    notified: "Varslet",
    notReached: "Ikke nådd",
    noApp: "mangler appen",
    failed: "feilet",
    sending: "sender…",
    noPeople: "Ingen er satt opp til å bli varslet.",
    override: "Overstyr: åpne vannet",
    overrideTitle: "Åpne vannet?",
    overrideValves: "Åpner {valves} og fjerner lekkasjevarselet, også på alles telefoner.",
    overrideNoValves: "Fjerner lekkasjevarselet, også på alles telefoner. Vannvakt styrer ingen ventiler, så åpne vannet der det ble stengt.",
    overrideWet: "{sensors} melder fortsatt vann. Overstyringen åpner likevel.",
    cancel: "Avbryt",
    confirm: "Åpne vannet",
    opening: "Åpner vannet…",
    changed: "Varselet er endret. Se over og prøv igjen.",
    overrideFailed: "Overstyring mislyktes",
    stillWetCalm: "{sensors} melder fortsatt vann, men varselet er overstyrt.",
    cannotWatch: "Kan ikke overvåke: {sensors}.",
    valveFailed: "Åpnet ikke: {valves}. Lekkasjevarselet står.",
    legacy: "Oppdater Vannvakt til 0.2.0 eller nyere for å se ventiler og personer her.",
    entity: "Vannvakt",
    selectEntity: "Velg en Vannvakt",
    entityHelp: "Lekkasjesensoren til Vannvakten som skal vises.",
    noGuards: "Fant ingen Vannvakt. Legg til integrasjonen først.",
    requiredEntity: "Velg en Vannvakt.",
    cardTitle: "Tittel",
    appearance: "Utseende",
    default: "Standard",
    bubble: "Bubble",
};
const dictionaries = { en, nb };
function localize(hass, key, values = {}) {
    return dictionaries[dictionary(hass)][key].replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
}
/** "Kari, Ola og Per" / "Kari, Ola and Per". */
function list(hass, items) {
    return new Intl.ListFormat(dictionary(hass) === "nb" ? "nb-NO" : "en", {
        type: "conjunction",
    }).format(items);
}

const strings = (value) => Array.isArray(value)
    ? value.filter((item) => typeof item === "string")
    : [];
const unique = (...lists) => [...new Set(lists.flat())];
function moveResult(value) {
    if (!value || typeof value !== "object")
        return undefined;
    const result = value;
    const valves = result.valves && typeof result.valves === "object"
        ? Object.fromEntries(Object.entries(result.valves).filter((entry) => typeof entry[1] === "string"))
        : {};
    return {
        target: String(result.target ?? ""),
        reason: String(result.reason ?? ""),
        status: String(result.status ?? ""),
        valves,
        updated: typeof result.updated === "string" ? result.updated : undefined,
    };
}
/** Read a Water Guard Leak sensor. Missing or malformed attributes read as empty. */
function readGuard(state) {
    const attributes = state?.attributes ?? {};
    const fired = strings(attributes.sensors);
    const wet = strings(attributes.wet_sensors);
    const unavailableSensors = strings(attributes.unavailable_sensors);
    const notifiedValue = attributes.notified;
    const notified = notifiedValue && typeof notifiedValue === "object"
        ? Object.fromEntries(Object.entries(notifiedValue).filter((entry) => typeof entry[1] === "string"))
        : {};
    const result = moveResult(attributes.last_result);
    const legacy = !Array.isArray(attributes.leak_sensors);
    return {
        available: state?.state === "on" || state?.state === "off",
        alert: state?.state === "on",
        since: typeof attributes.since === "string" ? attributes.since : undefined,
        fired,
        wet,
        unavailableSensors,
        // Before 0.2.0 the configured lists are unknown; show what the alert reveals.
        watched: legacy
            ? unique(fired, wet, unavailableSensors)
            : strings(attributes.leak_sensors),
        valves: legacy
            ? Object.keys(result?.valves ?? {})
            : strings(attributes.valves),
        people: legacy ? Object.keys(notified) : strings(attributes.people),
        notified,
        result,
        legacy,
    };
}
/** Is this entity a Water Guard Leak sensor? Used by the editor and stub config. */
function isGuardSensor(state) {
    return (!!state &&
        state.entity_id.startsWith("binary_sensor.") &&
        "wet_sensors" in state.attributes &&
        "last_result" in state.attributes);
}
function guardSensors(states) {
    return Object.keys(states)
        .filter((id) => isGuardSensor(states[id]))
        .sort();
}
/** A valve entity's position; a switch that drives a valve is open when on. */
function valveStatus(state) {
    switch (state?.state) {
        case "open":
        case "on":
            return "open";
        case "closed":
        case "off":
            return "closed";
        case "opening":
        case "closing":
            return "moving";
        default:
            return "unavailable";
    }
}
function friendlyName(states, entityId) {
    const name = states[entityId]?.attributes.friendly_name;
    return typeof name === "string" && name.trim() ? name : entityId;
}

const styles = i$4 `
  :host {
    display: block;
    color: var(--primary-text-color, #1b1b1a);
    font-family: var(--paper-font-body1_-_font-family, system-ui);
    --wg-text: var(--primary-text-color, #1b1b1a);
    --wg-muted: var(--secondary-text-color, #5b5a55);
    --wg-ok: var(--success-color, #2e7d32);
    --wg-warn: var(--warning-color, #f59e0b);
    --wg-alarm: var(--error-color, #c62828);
    --wg-neutral: var(--disabled-text-color, #8a8984);
    --wg-water: var(--info-color, #0288d1);
  }
  * {
    box-sizing: border-box;
  }
  ha-card {
    --wg-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --wg-pill: var(--secondary-background-color, #f3f2ee);
    --wg-pill-radius: 20px;
    --wg-tile-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    background: var(--wg-surface);
    border: var(--ha-card-border-width, 1px) solid
      var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    border-radius: var(--ha-card-border-radius, 16px);
    box-shadow: var(--ha-card-box-shadow);
  }
  ha-card.bubble {
    --wg-surface: var(
      --bubble-main-background-color,
      var(--ha-card-background, var(--card-background-color, #fff))
    );
    --wg-pill: var(
      --bubble-secondary-background-color,
      var(--secondary-background-color, #f3f2ee)
    );
    --wg-pill-radius: var(--bubble-border-radius, 32px);
    --wg-tile-radius: var(--bubble-sub-button-border-radius, 22px);
    border: var(--bubble-border, none);
    border-radius: var(--bubble-border-radius, 32px);
    box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow));
  }
  .sev-ok {
    --sev: var(--wg-water);
  }
  .sev-attention {
    --sev: var(--wg-warn);
  }
  .sev-alarm {
    --sev: var(--wg-alarm);
  }
  .sev-unknown {
    --sev: var(--wg-neutral);
  }
  p {
    margin: 0;
    line-height: 1.45;
  }
  .head {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 64px;
    padding: 6px;
    border-radius: var(--wg-pill-radius);
    background: var(--wg-pill);
  }
  .icon {
    flex: 0 0 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: var(--bubble-icon-border-radius, 50%);
    color: color-mix(in srgb, var(--sev) 75%, var(--wg-text));
    background: color-mix(in srgb, var(--sev) 20%, transparent);
  }
  .icon svg {
    width: 26px;
    height: 26px;
  }
  .text {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .text strong {
    font-size: 1rem;
    overflow-wrap: anywhere;
  }
  .sub {
    font-size: 0.85rem;
    color: var(--wg-muted);
  }
  .status {
    flex: 0 0 auto;
    padding: 6px 11px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 700;
    background: color-mix(in srgb, var(--sev) 22%, transparent);
    color: color-mix(in srgb, var(--sev) 55%, var(--wg-text));
  }
  .settings {
    flex: 0 0 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: var(--wg-muted);
  }
  .settings svg {
    width: 20px;
    height: 20px;
  }
  .settings:hover {
    background: color-mix(in srgb, var(--wg-text) 6%, transparent);
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
    gap: 6px;
  }
  .tile {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 14px;
    border-radius: var(--wg-tile-radius);
    background: var(--wg-pill);
    min-width: 0;
  }
  .tile .value {
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }
  .tile .label {
    font-size: 0.78rem;
    color: var(--wg-muted);
  }
  .valves {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .valves li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px 8px 8px;
    border-radius: var(--wg-pill-radius);
    background: var(--wg-pill);
  }
  .valves .icon {
    flex-basis: 40px;
    height: 40px;
  }
  .valves .icon svg {
    width: 20px;
    height: 20px;
  }
  .valves .name {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .note {
    font-size: 0.88rem;
    padding: 12px 14px;
    border-radius: var(--wg-tile-radius);
    background: color-mix(in srgb, var(--sev) 16%, var(--wg-pill));
  }
  .alert {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border-radius: var(--wg-pill-radius);
    background: var(--wg-alarm);
    color: #fff;
  }
  .alert-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .alert-head .icon {
    color: var(--wg-alarm);
    background: #fff;
  }
  .alert-head strong {
    font-size: 1.4rem;
    font-weight: 800;
    line-height: 1.1;
  }
  .alert-head .sub {
    color: rgb(255 255 255 / 0.85);
  }
  .timer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 1.4rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .timer small {
    font-size: 0.7rem;
    font-weight: 500;
  }
  .fired {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .fired li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 14px;
    border-radius: var(--wg-tile-radius);
    background: rgb(0 0 0 / 0.2);
  }
  .fired strong {
    overflow-wrap: anywhere;
  }
  .badge {
    flex: 0 0 auto;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.2);
  }
  .badge.wet {
    background: #fff;
    color: var(--wg-alarm);
  }
  .alert p {
    font-size: 0.92rem;
  }
  .alert .strong {
    font-weight: 700;
  }
  button {
    font: inherit;
    cursor: pointer;
    border: 0;
    border-radius: 999px;
    padding: 10px 16px;
    min-height: 44px;
    color: inherit;
    background: var(--wg-pill, var(--secondary-background-color, #f3f2ee));
  }
  button:disabled {
    cursor: wait;
    opacity: 0.6;
  }
  button:focus-visible,
  a:focus-visible {
    outline: 3px solid var(--primary-color, #0277bd);
    outline-offset: 2px;
  }
  .alert button:focus-visible {
    outline-color: #fff;
  }
  .override {
    min-height: 56px;
    font-size: 1.05rem;
    font-weight: 800;
    background: #fff;
    color: var(--wg-alarm);
  }
  dialog {
    color: var(--primary-text-color, #1b1b1a);
    background: var(--card-background-color, #fff);
    border: 0;
    border-radius: 24px;
    padding: 24px;
    width: min(460px, calc(100vw - 24px));
    box-shadow: 0 16px 60px #0006;
  }
  dialog::backdrop {
    background: #0007;
  }
  dialog h2 {
    margin: 0 0 10px;
    font-size: 1.35rem;
  }
  dialog p + p,
  dialog p + .note {
    margin-top: 10px;
  }
  .actions {
    display: flex;
    gap: 8px;
    margin-top: 18px;
  }
  .actions button {
    flex: 1;
  }
  .actions .danger {
    font-weight: 800;
    background: var(--wg-alarm);
    color: #fff;
  }
  @media (max-width: 400px) {
    ha-card {
      padding: 10px;
    }
    dialog {
      padding: 18px;
    }
  }
  ${colorSchemeStyles}
`;

/** Card-only choices: which guard, the title and the appearance. */
class WaterGuardCardEditor extends i$1 {
    constructor() {
        super(...arguments);
        this.config = {};
    }
    set hass(value) {
        this.ha = value;
        this.requestUpdate();
    }
    setConfig(config) {
        this.config = { ...config };
        this.requestUpdate();
    }
    t(key) {
        return localize(this.ha, key);
    }
    change(key, value) {
        const config = { ...this.config };
        if (value === "" && key === "title")
            delete config.title;
        else
            config[key] = value;
        this.config = config;
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config },
            bubbles: true,
            composed: true,
        }));
        this.requestUpdate();
    }
    render() {
        const states = this.ha?.states ?? {};
        const entity = String(this.config.entity ?? "");
        const choices = guardSensors(states);
        if (entity && !choices.includes(entity))
            choices.unshift(entity);
        return b `
      ${colorSchemeSelector(this.ha, this.config.color_scheme, (scheme) => this.change("color_scheme", scheme))}
      <label>
        ${this.t("entity")}
        <select
          data-field="entity"
          .value=${entity}
          @change=${(event) => this.change("entity", event.target.value)}
        >
          <option value="" ?selected=${!entity}>
            ${this.t("selectEntity")}
          </option>
          ${choices.map((id) => b `<option value=${id} ?selected=${id === entity}>
                ${friendlyName(states, id)}
              </option>`)}
        </select>
        <small>${this.t("entityHelp")}</small>
        ${!choices.length
            ? b `<small class="error">${this.t("noGuards")}</small>`
            : !entity
                ? b `<small class="error">${this.t("requiredEntity")}</small>`
                : A}
      </label>
      <label>
        ${this.t("cardTitle")}
        <input
          data-field="title"
          .value=${String(this.config.title ?? "")}
          placeholder=${this.t("title")}
          @change=${(event) => this.change("title", event.target.value)}
        />
      </label>
      <label>
        ${this.t("appearance")}
        <select
          data-field="appearance"
          .value=${String(this.config.appearance ?? "default")}
          @change=${(event) => this.change("appearance", event.target.value)}
        >
          <option value="default">${this.t("default")}</option>
          <option value="bubble">${this.t("bubble")}</option>
        </select>
      </label>
    `;
    }
}
WaterGuardCardEditor.styles = i$4 `
    :host {
      display: block;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    select,
    input {
      font: inherit;
      min-height: 44px;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1b1b1a);
    }
    small {
      font-weight: 400;
      color: var(--secondary-text-color, #5b5a55);
    }
    .error {
      color: var(--error-color, #c62828);
    }
  `;
customElements.define("water-guard-card-editor", WaterGuardCardEditor);

const VALVE_LABEL = {
    open: "valveOpen",
    closed: "valveClosed",
    moving: "valveMoving",
    unavailable: "valveUnavailable",
};
/**
 * Shows one Water Guard: a calm status, the latched leak alert, and the
 * override. Water Guard owns the alert; the card only calls its override.
 */
class WaterGuardCard extends i$1 {
    constructor() {
        super(...arguments);
        this.pending = false;
        this.error = "";
    }
    static getConfigElement() {
        return document.createElement("water-guard-card-editor");
    }
    static getStubConfig(hass) {
        return { entity: hass ? (guardSensors(hass.states)[0] ?? "") : "" };
    }
    setConfig(config) {
        const next = validateConfig(config);
        applyColorScheme(this, config.color_scheme, this.ha);
        if (next.entity !== this.config?.entity) {
            // A different guard: nothing from the previous one may linger.
            this.error = "";
            this.confirming = undefined;
            this.closeDialog();
        }
        this.config = next;
        this.requestUpdate();
    }
    set hass(value) {
        this.ha = value;
        this.requestUpdate();
    }
    get hass() {
        return this.ha;
    }
    getCardSize() {
        return 4;
    }
    connectedCallback() {
        super.connectedCallback();
        this.timer = setInterval(() => this.requestUpdate(), 15000);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this.timer);
        this.closeDialog();
    }
    t(key, values) {
        return localize(this.ha, key, values);
    }
    names(ids) {
        return list(this.ha, ids.map((id) => friendlyName(this.ha?.states ?? {}, id)));
    }
    get guard() {
        return readGuard(this.config && this.ha?.states[this.config.entity]);
    }
    duration(since) {
        const start = Date.parse(since ?? "");
        if (!Number.isFinite(start))
            return undefined;
        const minutes = Math.max(0, Math.floor((Date.now() - start) / 60000));
        const unit = (value, name) => new Intl.NumberFormat(formatLocale(this.ha), {
            style: "unit",
            unit: name,
            unitDisplay: "short",
        }).format(value);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days)
            return `${unit(days, "day")} ${unit(hours % 24, "hour")}`;
        if (hours)
            return `${unit(hours, "hour")} ${unit(minutes % 60, "minute")}`;
        return unit(minutes, "minute");
    }
    /** A time today, or a date and time; honours HA's 12/24-hour preference. */
    time(since) {
        const date = new Date(since ?? "");
        if (Number.isNaN(date.getTime()))
            return undefined;
        const format = this.ha?.locale?.time_format;
        const hour12 = format === "12" ? true : format === "24" ? false : undefined;
        const today = date.toDateString() === new Date().toDateString();
        return new Intl.DateTimeFormat(formatLocale(this.ha), {
            ...(today ? {} : { dateStyle: "medium" }),
            timeStyle: "short",
            hour12,
        }).format(date);
    }
    valves(guard) {
        return guard.valves.map((id) => ({
            id,
            status: valveStatus(this.ha?.states[id]),
        }));
    }
    waterValue(guard) {
        const statuses = this.valves(guard).map((valve) => valve.status);
        if (!statuses.length)
            return this.t("noValves");
        if (statuses.every((status) => status === "open"))
            return this.t("waterOn");
        if (statuses.every((status) => status === "closed"))
            return this.t("waterOff");
        if (statuses.some((status) => status === "unavailable"))
            return this.t("waterUnknown");
        return this.t("waterMixed");
    }
    failedOverride(guard) {
        const result = guard.result;
        if (result?.reason !== "override" || result.status !== "failed")
            return [];
        return Object.entries(result.valves)
            .filter(([, status]) => status !== "open")
            .map(([id]) => id);
    }
    get running() {
        return this.pending || this.guard.result?.status === "running";
    }
    snapshot(guard) {
        return JSON.stringify([this.config?.entity, guard.since, guard.fired]);
    }
    closeDialog() {
        this.shadowRoot?.querySelector("#confirm")?.close();
    }
    async ask() {
        const guard = this.guard;
        if (this.running || !guard.alert)
            return;
        this.confirming = this.snapshot(guard);
        this.error = "";
        this.requestUpdate();
        await this.updateComplete;
        this.shadowRoot.querySelector("#confirm").showModal();
    }
    cancel() {
        this.confirming = undefined;
        this.closeDialog();
        this.requestUpdate();
    }
    async execute() {
        const guard = this.guard;
        const entity = this.config?.entity;
        if (this.pending || !entity)
            return;
        if (!guard.alert || this.confirming !== this.snapshot(guard)) {
            this.error = this.t("changed");
            this.cancel();
            return;
        }
        this.confirming = undefined;
        this.closeDialog();
        this.pending = true;
        this.requestUpdate();
        try {
            if (!this.ha?.callService)
                throw new Error("Home Assistant service API unavailable");
            // Water Guard reports the outcome in its state; the call only asks.
            await this.ha.callService("water_guard", "override", {}, { entity_id: entity }, false);
        }
        catch (error) {
            if (this.config?.entity === entity)
                this.error =
                    error instanceof Error
                        ? error.message
                        : typeof error === "object" && error && "message" in error
                            ? String(error.message)
                            : String(error);
        }
        finally {
            this.pending = false;
            this.requestUpdate();
        }
    }
    renderCalm(guard) {
        const valves = this.valves(guard);
        return b `
      ${guard.wet.length
            ? b `<p class="note sev-attention" role="status">
              ${this.t("stillWetCalm", { sensors: this.names(guard.wet) })}
            </p>`
            : A}
      ${guard.unavailableSensors.length
            ? b `<p class="note sev-attention">
              ${this.t("cannotWatch", {
                sensors: this.names(guard.unavailableSensors),
            })}
            </p>`
            : A}
      <div class="tiles">
        <div class="tile">
          <span class="value">${guard.watched.length}</span>
          <span class="label"
            >${this.t(guard.watched.length === 1 ? "sensorsOne" : "sensors")}</span
          >
        </div>
        <div class="tile">
          <span class="value">${this.waterValue(guard)}</span>
          <span class="label">${this.t("water")}</span>
        </div>
        ${guard.legacy
            ? A
            : b `<div class="tile">
                <span class="value">${guard.people.length}</span>
                <span class="label">${this.t("alerts")}</span>
              </div>`}
      </div>
      ${valves.length ? this.renderValves(valves) : A}
      ${guard.legacy
            ? b `<p class="note sev-unknown">${this.t("legacy")}</p>`
            : A}
    `;
    }
    renderValves(valves) {
        return b `<ul class="valves">
      ${valves.map((valve) => b `<li
            class="sev-${valve.status === "open"
            ? "ok"
            : valve.status === "closed"
                ? "attention"
                : "unknown"}"
          >
            <span class="icon">${icon("valve")}</span>
            <span class="name">${friendlyName(this.ha.states, valve.id)}</span>
            <span class="status">${this.t(VALVE_LABEL[valve.status])}</span>
          </li>`)}
    </ul>`;
    }
    renderPeople(guard) {
        if (!guard.people.length && !Object.keys(guard.notified).length)
            return b `<p>${this.t("noPeople")}</p>`;
        const sent = Object.entries(guard.notified)
            .filter(([, status]) => status === "sent")
            .map(([id]) => id);
        const missed = Object.entries(guard.notified).filter(([, status]) => status !== "sent");
        const waiting = guard.people.filter((id) => !(id in guard.notified));
        const name = (id) => friendlyName(this.ha.states, id);
        return b `
      ${sent.length
            ? b `<p>
              <span class="strong">${this.t("notified")}:</span>
              ${this.names(sent)}
            </p>`
            : A}
      ${missed.length
            ? b `<p>
              <span class="strong">${this.t("notReached")}:</span>
              ${list(this.ha, missed.map(([id, status]) => `${name(id)} (${this.t(status === "no_app" ? "noApp" : "failed")})`))}
            </p>`
            : A}
      ${waiting.length
            ? b `<p>${this.names(waiting)}: ${this.t("sending")}</p>`
            : A}
    `;
    }
    renderAlert(guard) {
        const valves = this.valves(guard);
        const open = valves.filter((valve) => valve.status !== "closed");
        const failed = this.failedOverride(guard);
        const since = this.time(guard.since);
        return b `<section class="alert" aria-label=${this.t("leakDetected")}>
      <div class="alert-head">
        <span class="icon sev-alarm">${icon("leak")}</span>
        <span class="text">
          <strong>${this.t("leakDetected")}</strong>
          ${since
            ? b `<span class="sub"
                  >${this.t("since", { time: since })}</span
                >`
            : A}
        </span>
        <span class="timer"
          ><small>${this.t("detectedFor")}</small>${this.duration(guard.since) ?? "–"}</span
        >
      </div>
      <ul class="fired">
        ${guard.fired.map((id) => {
            const wet = guard.wet.includes(id);
            const gone = guard.unavailableSensors.includes(id);
            return b `<li>
            <strong>${friendlyName(this.ha.states, id)}</strong>
            <span class="badge ${wet ? "wet" : ""}"
              >${this.t(wet ? "stillWet" : gone ? "sensorUnavailable" : "dryNow")}</span
            >
          </li>`;
        })}
      </ul>
      <p class="strong">
        ${!valves.length
            ? this.t("checkWater")
            : open.length
                ? this.t("waterNotShut", {
                    valves: this.names(open.map((v) => v.id)),
                })
                : this.t("waterShut")}
      </p>
      ${failed.length
            ? b `<p class="strong" role="alert">
              ${this.t("valveFailed", { valves: this.names(failed) })}
            </p>`
            : A}
      ${this.renderPeople(guard)}
      <button
        class="override"
        data-override
        ?disabled=${this.running}
        @click=${this.ask}
      >
        ${this.t(this.running ? "opening" : "override")}
      </button>
    </section>`;
    }
    renderConfirm(guard) {
        return b `<dialog
      id="confirm"
      aria-labelledby="confirm-title"
      @cancel=${() => (this.confirming = undefined)}
    >
      <h2 id="confirm-title">${this.t("overrideTitle")}</h2>
      <p>
        ${guard.valves.length
            ? this.t("overrideValves", { valves: this.names(guard.valves) })
            : this.t("overrideNoValves")}
      </p>
      ${guard.wet.length
            ? b `<p class="note sev-attention">
              ${this.t("overrideWet", { sensors: this.names(guard.wet) })}
            </p>`
            : A}
      <div class="actions">
        <button data-cancel @click=${this.cancel}>${this.t("cancel")}</button>
        <button data-confirm class="danger" @click=${this.execute}>
          ${this.t("confirm")}
        </button>
      </div>
    </dialog>`;
    }
    render() {
        if (!this.config)
            return A;
        const state = this.config.entity
            ? this.ha?.states[this.config.entity]
            : undefined;
        const guard = this.guard;
        const severity = !guard.available
            ? "unknown"
            : guard.alert
                ? "alarm"
                : guard.wet.length || guard.unavailableSensors.length
                    ? "attention"
                    : "ok";
        const sub = !guard.available
            ? ""
            : guard.alert
                ? ""
                : this.t(guard.watched.length === 1 ? "watchingOne" : "watching", {
                    n: guard.watched.length,
                });
        return b `<ha-card class=${this.config.appearance}>
        <div class="head sev-${severity}">
          <span class="icon"
            >${icon(!guard.available ? "unknown" : guard.alert ? "leak" : "drop")}</span
          >
          <span class="text">
            <strong>${this.config.title ?? this.t("title")}</strong>
            ${sub ? b `<span class="sub">${sub}</span>` : A}
          </span>
          <span class="status"
            >${this.t(!guard.available
            ? "unavailable"
            : guard.alert
                ? "leak"
                : "noLeak")}</span
          >
          <a
            class="settings"
            href="/config/integrations/integration/water_guard"
            aria-label=${this.t("settings")}
            title=${this.t("settings")}
            >${icon("cog")}</a
          >
        </div>
        ${!state
            ? b `<p class="note sev-unknown" role="alert">
                ${this.t("missing")}
              </p>`
            : !guard.available
                ? b `<p class="note sev-unknown" role="status">
                  ${this.t("unavailableHelp")}
                </p>`
                : guard.alert
                    ? this.renderAlert(guard)
                    : this.renderCalm(guard)}
        ${this.error
            ? b `<p class="note sev-alarm" role="alert">
                ${this.t("overrideFailed")}: ${this.error}
              </p>`
            : A}
      </ha-card>
      ${this.renderConfirm(guard)}`;
    }
}
WaterGuardCard.styles = styles;
customElements.define("water-guard-card", WaterGuardCard);
// Card-picker metadata has no hass context, so it stays English.
const registry = window;
registry.customCards ?? (registry.customCards = []);
registry.customCards.push({
    type: "water-guard-card",
    name: "Water Guard",
    description: "Leak alert and water override for Water Guard",
    preview: true,
    documentationURL: "https://github.com/mvheimburg/lovelace-water-guard",
});

export { WaterGuardCard };
//# sourceMappingURL=water-guard-card.js.map
