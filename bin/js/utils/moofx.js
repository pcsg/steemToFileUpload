/*
---
provides: moofx
version: 3.2.0
description: A CSS3-enabled javascript animation library
homepage: http://moofx.it
author: Valerio Proietti <@kamicane> (http://mad4milk.net)
license: MIT (http://mootools.net/license.txt)
includes: cubic-bezier by Arian Stolwijk (https://github.com/arian/cubic-bezier)
...
*/

(function(t){var n={},r=function(e){var i=n[e];if(!i){i=n[e]={};var o=i.exports={};t[e].call(o,r,i,o,window)}return i.exports};window.moofx=r("0")})({0:function(t,n){"use strict";var r=t("1"),e=t("2"),i="undefined"!=typeof document?t("4"):t("o");i.requestFrame=function(t){return e.request(t),this},i.cancelFrame=function(t){return e.cancel(t),this},i.color=r,n.exports=i},1:function(t,n){"use strict";var r={maroon:"#800000",red:"#ff0000",orange:"#ffA500",yellow:"#ffff00",olive:"#808000",purple:"#800080",fuchsia:"#ff00ff",white:"#ffffff",lime:"#00ff00",green:"#008000",navy:"#000080",blue:"#0000ff",aqua:"#00ffff",teal:"#008080",black:"#000000",silver:"#c0c0c0",gray:"#808080",transparent:"#0000"},e=function(t,n,r,e){return(null==e||""===e)&&(e=1),t=parseFloat(t),n=parseFloat(n),r=parseFloat(r),e=parseFloat(e),255>=t&&t>=0&&255>=n&&n>=0&&255>=r&&r>=0&&1>=e&&e>=0?[Math.round(t),Math.round(n),Math.round(r),e]:null},i=function(t){if(3===t.length&&(t+="f"),4===t.length){var n=t.charAt(0),r=t.charAt(1),e=t.charAt(2),i=t.charAt(3);t=n+n+r+r+e+e+i+i}6===t.length&&(t+="ff");for(var o=[],u=0,a=t.length;a>u;u+=2)o.push(parseInt(t.substr(u,2),16)/(6===u?255:1));return o},o=function(t,n,r){return 0>r&&(r+=1),r>1&&(r-=1),1/6>r?t+6*(n-t)*r:.5>r?n:2/3>r?t+6*(n-t)*(2/3-r):t},u=function(t,n,r,e){var i,u,a;if((null==e||""===e)&&(e=1),t=parseFloat(t)/360,n=parseFloat(n)/100,r=parseFloat(r)/100,e=parseFloat(e)/1,t>1||0>t||n>1||0>n||r>1||0>r||e>1||0>e)return null;if(0===n)i=u=a=r;else{var s=.5>r?r*(1+n):r+n-r*n,c=2*r-s;i=o(c,s,t+1/3),a=o(c,s,t),u=o(c,s,t-1/3)}return[255*i,255*a,255*u,e]},a=[];for(var s in r)a.push(s);var c="(?:#([a-f0-9]{3,8}))",l="\\s*([.\\d%]+)\\s*",f="(?:,\\s*([.\\d]+)\\s*)?",h="\\("+[l,l,l]+f+"\\)",p="(?:rgb)a?",v="(?:hsl)a?",m="("+a.join("|")+")",d=RegExp(c,"i"),g=RegExp(p+h,"i"),b=RegExp(v+h,"i"),y=function(t,n){if(null==t)return null;t=(t+"").replace(/\s+/,"");var o=r[t];if(o)return y(o,n);if(o=t.match(d))t=i(o[1]);else if(o=t.match(g))t=o.slice(1);else{if(!(o=t.match(b)))return null;t=u.apply(null,o.slice(1))}return t&&(t=e.apply(null,t))?n?t:(1===t[3]&&t.splice(3,1),"rgb"+(4===t.length?"a":"")+"("+t+")"):null};y.x=RegExp([m,c,p+h,v+h].join("|"),"gi"),n.exports=y},2:function(t,n,r,e){"use strict";var i=t("3"),o=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(t){return setTimeout(function(){t()},1e3/60)},u=[],a=function(t){for(var n=u.splice(0,u.length),r=0,e=n.length;e>r;r++)n[r](t||(t=+new Date))},s=function(t){var n=i(u,t);n>-1&&u.splice(n,1)},c=function(t){var n=u.push(t);return 1===n&&o(a),function(){s(t)}};r.request=c,r.cancel=s},3:function(t,n){"use strict";var r=function(t,n,r){for(var e=t.length>>>0,i=0>r?Math.max(0,e+r):r||0;e>i;i++)if(t[i]===n)return i;return-1};n.exports=r},4:function(t,n,r,e){"use strict";var i=t("1"),o=t("2"),u=(o.cancel,o.request),a=t("5"),s=t("d"),c=t("e"),l=t("g"),f=t("h"),h=t("i"),p=t("j"),v=t("3"),m=t("k"),d=t("o"),g=function(t,n){return String.prototype.match.call(t,n)},b={},y=function(t){return b[t]||(b[t]=f(t))},S=function(t){return Math.round(1e3*t)/1e3},x=e.getComputedStyle?function(t){var n=getComputedStyle(t,null);return function(t){return n&&n.getPropertyValue(y(t))||""}}:function(t){var n=t.currentStyle;return function(t){return n?n[s(t)]:""}},C=document.createElement("div"),w="border:none;margin:none;padding:none;visibility:hidden;position:absolute;height:0;",E=function(t,n){var r=t.parentNode,e=1;return r&&(C.style.cssText=w+("width:100"+n+";"),r.appendChild(C),e=C.offsetWidth/100,r.removeChild(C)),e},j=function(t){var n=t.length;return 1===n?t.push(t[0],t[0],t[0]):2===n?t.push(t[0],t[1]):3===n&&t.push(t[1]),t},T="([-.\\d]+)(%|cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vm)",q=T+"?",k="none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|inherit",R=RegExp(T,"g"),F=RegExp(q),O=RegExp(q,"g"),A=RegExp(k),M=function(t){return null==t?"":t+""},z=function(t,n){return null==t||""===t?n?"1":"":isFinite(t=+t)?0>t?"0":t+"":"1"};try{C.style.color="rgba(0,0,0,0.5)"}catch(P){}var N=/^rgba/.test(C.style.color),W=function(t,n){var r,e="rgba(0,0,0,1)";if(!t||!(r=i(t,!0)))return n?e:"";if(n)return"rgba("+r+")";var o=r[3];return 0===o?"transparent":N&&1!==o?"rgba("+r+")":"rgb("+r.slice(0,3)+")"},D=function(t,n){if(null==t||""===t)return n?"0px":"";var r=g(t,F);return r?r[1]+(r[2]||"px"):t},L=function(t,n){if(null==t||""===t)return n?"none":"";var r=t.match(A);return r?t:n?"none":""},I=function(t,n){var r="0px none rgba(0,0,0,1)";if(null==t||""===t)return n?r:"";if(0===t||"none"===t)return n?r:t+"";var e;t=t.replace(i.x,function(t){return e=t,""});var o=t.match(A),u=t.match(O);return c([D(u?u[0]:"",n),L(o?o[0]:"",n),W(e,n)].join(" "))},X=function(t,n){return null==t||""===t?n?"0px 0px 0px 0px":"":c(j(h(c(t).split(" "),function(t){return D(t,n)})).join(" "))},B=function(t,n,r){var e="rgba(0,0,0,0)",o=3===r?e+" 0px 0px 0px":e+" 0px 0px 0px 0px";if(null==t||""===t)return n?o:"";if("none"===t)return n?o:t;var u=[],t=c(t).replace(i.x,function(t){return u.push(t),""});return h(t.split(","),function(t,e){var i=W(u[e],n),o=/inset/.test(t),a=t.match(O)||["0px"];for(a=h(a,function(t){return D(t,n)});r>a.length;)a.push("0px");var s=o?["inset",i]:[i];return s.concat(a).join(" ")}).join(", ")},Y=function(t,n){return null==t||""===t?"":t.replace(i.x,function(t){return W(t,n)}).replace(R,function(t){return D(t,n)})},_={},H={},U={},V={},$=function(t){return _[t]||(_[t]=function(){var n=V[t]||t,r=U[t]||Y;return function(){return r(x(this)(n),!0)}}())},Z=function(t){return H[t]||(H[t]=function(){var n=V[t]||t,r=U[t]||Y;return function(t){this.style[n]=r(t,!1)}}())},G=["Top","Right","Bottom","Left"],J=["TopLeft","TopRight","BottomRight","BottomLeft"];p(G,function(t){var n="border"+t;p(["margin"+t,"padding"+t,n+"Width",t.toLowerCase()],function(t){U[t]=D}),U[n+"Color"]=W,U[n+"Style"]=L,U[n]=I,_[n]=function(){return[$(n+"Width").call(this),$(n+"Style").call(this),$(n+"Color").call(this)].join(" ")}}),p(J,function(t){U["border"+t+"Radius"]=D}),U.color=U.backgroundColor=W,U.width=U.height=U.minWidth=U.minHeight=U.maxWidth=U.maxHeight=U.fontSize=U.backgroundSize=D,p(["margin","padding"],function(t){U[t]=X,_[t]=function(){return h(G,function(n){return $(t+n).call(this)},this).join(" ")}}),U.borderWidth=X,U.borderStyle=function(t,n){return null==t||""===t?n?j(["none"]).join(" "):"":(t=c(t).split(" "),c(j(h(t,function(t){L(t,n)})).join(" ")))},U.borderColor=function(t,n){return t&&(t=g(t,i.x))?c(j(h(t,function(t){return W(t,n)})).join(" ")):n?j(["rgba(0,0,0,1)"]).join(" "):""},p(["Width","Style","Color"],function(t){_["border"+t]=function(){return h(G,function(n){return $("border"+n+t).call(this)},this).join(" ")}}),U.borderRadius=X,_.borderRadius=function(){return h(J,function(t){return $("border"+t+"Radius").call(this)},this).join(" ")},U.border=I,_.border=function(){for(var t,n=0;G.length>n;n++){var r=$("border"+G[n]).call(this);if(t&&r!==t)return null;t=r}return t},U.zIndex=M,U.opacity=z;var K=null!=C.style.MsFilter&&"MsFilter"||null!=C.style.filter&&"filter";if(K&&null==C.style.opacity){var Q=/alpha\(opacity=([\d.]+)\)/i;H.opacity=function(t){t="1"===(t=z(t))?"":"alpha(opacity="+Math.round(100*t)+")";var n=x(this)(K);return this.style[K]=Q.test(n)?n.replace(Q,t):n+" "+t},_.opacity=function(){var t=x(this)(K).match(Q);return(t?t[1]/100:1)+""}}var tn=U.boxShadow=function(t,n){return B(t,n,4)},nn=U.textShadow=function(t,n){return B(t,n,3)};p(["Webkit","Moz","ms","O",null],function(t){p(["transition","transform","transformOrigin","transformStyle","perspective","perspectiveOrigin","backfaceVisibility"],function(n){var r=t?t+l(n):n;"ms"===t&&(b[r]="-ms-"+y(n)),null!=C.style[r]&&(V[n]=r)})});var rn=V.transition,en=V.transform;"OTransition"===rn&&(rn=null);var on,un;!rn&&en&&function(){var n=t("q"),r="\\s*([-\\d\\w.]+)\\s*",e=RegExp("matrix\\("+[r,r,r,r,r,r]+"\\)"),i=function(t){var r=n.apply(null,t.match(e).slice(1))||[[0,0],0,0,[0,0]];return["translate("+h(r[0],function(t){return S(t)+"px"})+")","rotate("+S(180*r[1]/Math.PI)+"deg)","skewX("+S(180*r[2]/Math.PI)+"deg)","scale("+h(r[3],S)+")"].join(" ")},o=function(t){return t||"0px"},u=function(t){return t||"1"},s=function(t){return t||"0deg"},l={translate:function(t){t||(t="0px,0px");var n=t.split(",");return n[1]||(n[1]="0px"),h(n,c)+""},translateX:o,translateY:o,scale:function(t){t||(t="1,1");var n=t.split(",");return n[1]||(n[1]=n[0]),h(n,c)+""},scaleX:u,scaleY:u,rotate:s,skewX:s,skewY:s};un=a({constructor:function(t){var n=this.names=[],r=this.values=[];t.replace(/(\w+)\(([-.\d\s\w,]+)\)/g,function(t,e,i){n.push(e),r.push(i)})},identity:function(){var t=[];return p(this.names,function(n){var r=l[n];r&&t.push(n+"("+r()+")")}),t.join(" ")},sameType:function(t){return""+this.names==""+t.names},decompose:function(){var t=""+this;C.style.cssText=w+y(en)+":"+t+";",document.body.appendChild(C);var n=x(C)(en);return n&&"none"!==n||(n="matrix(1, 0, 0, 1, 0, 0)"),document.body.removeChild(C),i(n)}}),un.prototype.toString=function(t){var n=this.values,r=[];return p(this.names,function(e,i){var o=l[e];if(o){var u=o(n[i]);t&&u===o()||r.push(e+"("+u+")")}}),r.length?r.join(" "):"none"},un.union=function(t,n){if(t!==n){var r,e;if("none"===t?(e=new un(n),n=""+e,t=e.identity(),r=new un(t)):"none"===n?(r=new un(t),t=""+r,n=r.identity(),e=new un(n)):(r=new un(t),t=""+r,e=new un(n),n=""+e),t!==n&&(r.sameType(e)||(t=r.decompose(),n=e.decompose()),t!==n))return[t,n]}},on=U.transform=function(t){return t&&"none"!==t?new un(e.test(t)?i(t):t).toString(!0):"none"},_.transform=function(){var t=this.style;return t[en]||(t[en]=on(x(this)(en)))}}();var an,sn=function(t,n,r){var e=U[n]||Y,i=$(n).call(t),r=e(r,!0);if(r&&i!==r){if(e===D||e===I||e===X){var o=r.match(R),u=0;o&&(i=i.replace(R,function(n,r,e){var i=o[u++],a=i.match(F),s=a[2];if(e!==s){var c="px"===e?r:E(t,e)*r;return S(c/E(t,s))+s}return n})),u>0&&Z(n).call(t,i)}else if(e===on)return un.union(i,r);return i!==r?[i,r]:null}},cn=a({inherits:d,constructor:function cn(t,n){var r=$(n),e=Z(n);this.get=function(){return r.call(t)},this.set=function(n){return e.call(t,n)},cn.parent.constructor.call(this,this.set),this.node=t,this.property=n}});an=a({inherits:cn,constructor:function an(){return an.parent.constructor.apply(this,arguments)},start:function(t){if(this.stop(),0===this.duration)return this.cancel(t),this;var n=sn(this.node,this.property,t);if(!n)return this.cancel(t),this;if(an.parent.start.apply(this,n),!this.cancelStep)return this;var r=U[this.property]||Y;return r!==tn&&r!==nn&&r!==Y||this.templateFrom===this.templateTo||(this.cancelStep(),delete this.cancelStep,this.cancel(t)),this},parseEquation:function(t){return"string"==typeof t?an.parent.parseEquation.call(this,t):void 0}});var ln=function(t,n,r,e){var i=v(n,t);-1!==i&&(n.splice(i,1),r.splice(i,1),e.splice(i,1))},fn=a({inherits:cn,constructor:function fn(t,n){fn.parent.constructor.call(this,t,n),this.hproperty=y(V[n]||n);var r=this;this.bSetTransitionCSS=function(t){r.setTransitionCSS(t)},this.bSetStyleCSS=function(t){r.setStyleCSS(t)},this.bComplete=function(){r.complete()}},start:function(t){if(this.stop(),0===this.duration)return this.cancel(t),this;var n=sn(this.node,this.property,t);return n?(this.to=n[1],this.cancelSetTransitionCSS=u(this.bSetTransitionCSS),this):(this.cancel(t),this)},setTransitionCSS:function(){delete this.cancelSetTransitionCSS,this.resetCSS(!0),this.cancelSetStyleCSS=u(this.bSetStyleCSS)},setStyleCSS:function(t){delete this.cancelSetStyleCSS;var n=this.duration;this.cancelComplete=setTimeout(this.bComplete,n),this.endTime=t+n,this.set(this.to)},complete:function(){delete this.cancelComplete,this.resetCSS(),this.callback(this.endTime)},stop:function(t){return this.cancelExit?(this.cancelExit(),delete this.cancelExit):this.cancelSetTransitionCSS?(this.cancelSetTransitionCSS(),delete this.cancelSetTransitionCSS):this.cancelSetStyleCSS?(this.cancelSetStyleCSS(),delete this.cancelSetStyleCSS,t&&this.resetCSS()):this.cancelComplete&&(clearTimeout(this.cancelComplete),delete this.cancelComplete,t&&(this.resetCSS(),this.set(this.get()))),this},resetCSS:function(t){var n=x(this.node),r=(n(rn+"Property").replace(/\s+/g,"")||"all").split(","),e=(n(rn+"Duration").replace(/\s+/g,"")||"0s").split(","),i=(n(rn+"TimingFunction").replace(/\s+/g,"")||"ease").match(/cubic-bezier\([\d-.,]+\)|([a-z-]+)/g);ln("all",r,e,i),ln(this.hproperty,r,e,i),t&&(r.push(this.hproperty),e.push(this.duration+"ms"),i.push("cubic-bezier("+this.equation+")"));var o=this.node.style;o[rn+"Property"]=r,o[rn+"Duration"]=e,o[rn+"TimingFunction"]=i},parseEquation:function(t){return"string"==typeof t?fn.parent.parseEquation.call(this,t,!0):void 0}}),hn=rn?fn:an,pn=function(t,n){return"function"==typeof t?d(t):m(t,n)};m.implement({animate:function(t,n,r){var e=t,i=n;"string"==typeof t&&(e={},e[t]=n,i=r),null==i&&(i={});var o=typeof i;i="function"===o?{callback:i}:"string"===o||"number"===o?{duration:i}:i;var u=i.callback||function(){},a=0,c=0;i.callback=function(t){++a===c&&u(t)};for(var l in e){var f=e[l],l=s(l);this.forEach(function(t){c++;var n=m(t),r=n._animations||(n._animations={}),e=r[l]||(r[l]=new hn(t,l));e.setOptions(i).start(f)})}return this},style:function(t,n){var r=t;"string"==typeof t&&(r={},r[t]=n);for(var e in r){var i=r[e],o=Z(e=s(e));this.forEach(function(t){var n,r=m(t),u=r._animations;u&&(n=u[e])&&n.stop(!0),o.call(t,i)})}return this},compute:function(t){t=s(t);var n=this[0];if("transform"===t&&on)return x(n)(en);var r=$(t).call(n);return null!=r?r.replace(R,function(t,r,e){return"px"===e?t:E(n,e)*r+"px"}):""}}),pn.parse=function(t,n,r){return(U[s(t)]||Y)(n,r)},n.exports=pn},5:function(t,n){"use strict";var r=t("6"),e=t("7"),i=t("8"),o=t("a"),u=t("b"),a=t("c"),s=Object.defineProperty,c=Object.getOwnPropertyDescriptor;try{s({},"~",{}),c({},"~")}catch(l){s=null,c=null}var f=function(t,n,r){s(this,n,c(r,n)||{writable:!0,enumerable:!0,configurable:!0,value:t})},h=function(t,n){this[n]=t},p=function(t){return e(t,s?f:h,this.prototype),this},v=/^constructor|inherits|mixin$/,m=function(t){"function"===a(t)&&(t={constructor:t});var n=t.inherits,e=r(t,"constructor")?t.constructor:n?function(){return n.apply(this,arguments)}:function(){};if(n){i(e,n);var s=n.prototype,c=e.prototype=u(s);e.parent=s,c.constructor=e}e.implement||(e.implement=p);var l=t.mixin;if(l){"array"!==a(l)&&(l=[l]);for(var f=0;l.length>f;f++)e.implement(u(l[f].prototype))}return e.implement(o(t,function(t,n){return!n.match(v)}))};n.exports=m},6:function(t,n){"use strict";var r=Object.hasOwnProperty,e=function(t,n){return r.call(t,n)};n.exports=e},7:function(t,n){"use strict";var r=t("6"),e=function(t,n,r){for(var e in t)if(n.call(r,t[e],e,t)===!1)break;return t};if(!{valueOf:0}.propertyIsEnumerable("valueOf")){var i="constructor,toString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString".split(","),o=Object.prototype;e=function(t,n,e){for(var u in t)if(n.call(e,t[u],u,t)===!1)return t;for(var a=0;u=i[a];a++){var s=t[u];if((s!==o[u]||r(t,u))&&n.call(e,s,u,t)===!1)break}return t}}n.exports=e},8:function(t,n){"use strict";var r=t("9"),e=function(t,n){this[n]=t},i=function(t){for(var n=1,i=arguments.length;i>n;n++)r(arguments[n],e,t);return t};n.exports=i},9:function(t,n){"use strict";var r=t("7"),e=t("6"),i=function(t,n,i){return r(t,function(r,o){return e(t,o)?n.call(i,r,o,t):void 0}),t};n.exports=i},a:function(t,n){"use strict";var r=t("7"),e=function(t,n,e){var i={};return r(t,function(r,o){n.call(e,r,o,t)&&(i[o]=r)}),i};n.exports=e},b:function(t,n){"use strict";var r=function(t){var n=function(){};return n.prototype=t,new n};n.exports=r},c:function(t,n){"use strict";var r=Object.prototype.toString,e=/number|object|array|string|function|date|regexp|boolean/,i=function(t){if(null==t)return"null";var n=r.call(t).slice(8,-1).toLowerCase();return"number"===n&&isNaN(t)?"null":e.test(n)?n:"object"};n.exports=i},d:function(t,n){"use strict";var r=function(t){return(t+"").replace(/-\D/g,function(t){return t.charAt(1).toUpperCase()})};n.exports=r},e:function(t,n){"use strict";var r=t("f"),e=function(t){return r((t+"").replace(/\s+/g," "))};n.exports=e},f:function(t,n){"use strict";var r=function(t){return(t+"").replace(/^\s+|\s+$/g,"")};n.exports=r},g:function(t,n){"use strict";var r=function(t){return(t+"").replace(/\b[a-z]/g,function(t){return t.toUpperCase()})};n.exports=r},h:function(t,n){"use strict";var r=function(t){return(t+"").replace(/[A-Z]/g,function(t){return"-"+t.toLowerCase()})};n.exports=r},i:function(t,n){"use strict";var r=function(t,n,r){for(var e=t.length>>>0,i=Array(e),o=0,u=e;u>o;o++)i[o]=n.call(r,t[o],o,t);return i};n.exports=r},j:function(t,n){"use strict";var r=function(t,n,r){for(var e=0,i=t.length>>>0;i>e&&n.call(r,t[e],e,t)!==!1;e++);return t};n.exports=r},k:function(t,n,r,e){"use strict";var i=t("5"),o=t("j"),u=t("i"),a=t("l"),s=t("m"),c=t("n"),l=0,f=function(t){return t===e?"global":t.uniqueNumber||(t.uniqueNumber="n:"+(l++).toString(36))},h={},p=i({constructor:function p(t,n){if(null==t)return this&&this.constructor===p?new v:null;var r=t;if(t.constructor!==v){r=new v;var i;if("string"==typeof t)return r.search?(r[r.length++]=n||document,r.search(t)):null;if(t.nodeType||t===e)r[r.length++]=t;else if(t.length)for(var o={},u=0,a=t.length;a>u;u++){var s=p(t[u],n);if(s&&s.length)for(var c=0,l=s.length;l>c;c++){var m=s[c];i=f(m),o[i]||(r[r.length++]=m,o[i]=!0)}}}return r.length?1===r.length?(i=f(r[0]),h[i]||(h[i]=r)):r:null}}),v=i({inherits:p,constructor:function v(){this.length=0},unlink:function(){return this.map(function(t){return delete h[f(t)],t})},forEach:function(t,n){return o(this,t,n)},map:function(t,n){return u(this,t,n)},filter:function(t,n){return a(this,t,n)},every:function(t,n){return s(this,t,n)},some:function(t,n){return c(this,t,n)}});n.exports=p},l:function(t,n){"use strict";var r=function(t,n,r){for(var e=[],i=0,o=t.length>>>0;o>i;i++){var u=t[i];n.call(r,u,i,t)&&e.push(u)}return e};n.exports=r},m:function(t,n){"use strict";var r=function(t,n,r){for(var e=0,i=t.length>>>0;i>e;e++)if(!n.call(r,t[e],e,t))return!1;return!0};n.exports=r},n:function(t,n){"use strict";var r=function(t,n,r){for(var e=0,i=t.length>>>0;i>e;e++)if(n.call(r,t[e],e,t))return!0;return!1};n.exports=r},o:function(t,n){"use strict";var r=t("5"),e=t("2").request,i=t("p"),o=t("i"),u="([\\d.]+)(s|ms)?",a="cubic-bezier\\(([-.\\d]+),([-.\\d]+),([-.\\d]+),([-.\\d]+)\\)",s=RegExp(u),c=RegExp(a);RegExp(a,"g");var l={"default":"cubic-bezier(0.25, 0.1, 0.25, 1.0)",linear:"cubic-bezier(0, 0, 1, 1)","ease-in":"cubic-bezier(0.42, 0, 1.0, 1.0)","ease-out":"cubic-bezier(0, 0, 0.58, 1.0)","ease-in-out":"cubic-bezier(0.42, 0, 0.58, 1.0)"};l.ease=l["default"];var f=function(t,n,r){return(n-t)*r+t},h=function(t){var n=[],r=(t+"").replace(/[-.\d]+/g,function(t){return n.push(+t),"@"});return[n,r]},p=r({constructor:function p(t,n){this.setOptions(n),this.render=t||function(){};var r=this;this.bStep=function(t){return r.step(t)},this.bExit=function(t){r.exit(t)}},setOptions:function(t){if(null==t&&(t={}),!(this.duration=this.parseDuration(t.duration||"500ms")))throw Error("invalid duration");if(!(this.equation=this.parseEquation(t.equation||"default")))throw Error("invalid equation");return this.callback=t.callback||function(){},this},parseDuration:function(t){if(t=(t+"").match(s)){var n=+t[1],r=t[2]||"ms";if("s"===r)return 1e3*n;if("ms"===r)return n}},parseEquation:function(t,n){var r=typeof t;if("function"===r)return t;if("string"===r){t=l[t]||t;var e=t.replace(/\s+/g,"").match(c);if(e){if(t=o(e.slice(1),function(t){return+t}),n)return t;if("0,0,1,1"==""+t)return function(t){return t};r="object"}}return"object"===r?i(t[0],t[1],t[2],t[3],1e3/60/this.duration/4):void 0},cancel:function(t){this.to=t,this.cancelExit=e(this.bExit)},exit:function(t){this.render(this.to),delete this.cancelExit,this.callback(t)},start:function(t,n){if(this.stop(),0===this.duration)return this.cancel(n),this;this.isArray=!1,this.isNumber=!1;var r=typeof t,i=typeof n;"object"===r&&"object"===i?this.isArray=!0:"number"===r&&"number"===i&&(this.isNumber=!0);var o=h(t),u=h(n);return this.from=o[0],this.to=u[0],this.templateFrom=o[1],this.templateTo=u[1],this.from.length!==this.to.length||""+this.from==""+this.to?(this.cancel(n),this):(delete this.time,this.length=this.from.length,this.cancelStep=e(this.bStep),this)},stop:function(){return this.cancelExit?(this.cancelExit(),delete this.cancelExit):this.cancelStep&&(this.cancelStep(),delete this.cancelStep),this},step:function(t){this.time||(this.time=t);var n=(t-this.time)/this.duration;n>1&&(n=1);for(var r=this.equation(n),i=this.from,o=this.to,u=this.templateTo,a=0,s=this.length;s>a;a++){var c=i[a],l=o[a];u=u.replace("@",l!==c?f(c,l,r):l)}this.render(this.isArray?u.split(","):this.isNumber?+u:u,n),1!==n?this.cancelStep=e(this.bStep):(delete this.cancelStep,this.callback(t))}}),v=function(t){var n=new p(t);return{start:function(t,r,e){var i=typeof e;return n.setOptions("function"===i?{callback:e}:"string"===i||"number"===i?{duration:e}:e).start(t,r),this},stop:function(){return n.stop(),this}}};v.prototype=p.prototype,n.exports=v},p:function(t,n){n.exports=function(t,n,r,e,i){var o=function(n){var e=1-n;return 3*e*e*n*t+3*e*n*n*r+n*n*n},u=function(t){var r=1-t;return 3*r*r*t*n+3*r*t*t*e+t*t*t},a=function(n){var e=1-n;return 3*(2*(n-1)*n+e*e)*t+3*(-n*n*n+2*e*n)*r};return function(t){var n,r,e,s,c,l,f=t;for(e=f,l=0;8>l;l++){if(s=o(e)-f,i>Math.abs(s))return u(e);if(c=a(e),1e-6>Math.abs(c))break;e-=s/c}if(n=0,r=1,e=f,n>e)return u(n);if(e>r)return u(r);for(;r>n;){if(s=o(e),i>Math.abs(s-f))return u(e);f>s?n=e:r=e,e=.5*(r-n)+n}return u(e)}}},q:function(t,n){"use strict";var r=function(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1])},e=function(t){var n=r(t);return n?[t[0]/n,t[1]/n]:[0,0]},i=function(t,n){return t[0]*n[0]+t[1]*n[1]},o=Math.atan2,u=function(t,n,r,e){return[r*t[0]+e*n[0],r*t[1]+e*n[1]]};n.exports=function(t,n,a,s,c,l){if(0===t*s-n*a)return!1;var f=[c,l],h=[[t,n],[a,s]],p=[r(h[0])];h[0]=e(h[0]);var v=i(h[0],h[1]);h[1]=u(h[1],h[0],1,-v),p[1]=r(h[1]),v/=p[1];var m=o(h[0][1],h[0][0]);return[f,m,v,p]}}});
