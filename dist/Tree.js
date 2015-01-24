function BinarySearchTree$696(r){r=r||{},"function"==typeof r&&(r.compare=r),this._root=null,this._min=null,this._max=null,this._length=0,this._cc=r.compare}module.exports=BinarySearchTree$696;var Iterator$695=require("./Iterator");Object.defineProperties(BinarySearchTree$696.prototype,{root:{get:function(){return this._root.v}},rootKey:{get:function(){return this._root.k}},min:{get:function(){return this._min.v}},minKey:{get:function(){return this._min.k}},max:{get:function(){return this._max.v}},maxKey:{get:function(){return this._max.k}},length:{get:function(){return this._length}}}),BinarySearchTree$696.prototype.set=function(r,e){if(!this._root)return this._root=this._min=this._max={k:r,v:e,p:null,l:null,r:null,m:null},this._length++,this;var t=this._search(r);if(t[0])return t[1].v=e,this;var n={k:r,v:e,p:null,l:null,r:null,m:null};return this._linkNodes(t[1],n),this._length++,this.compareKeys(r,this._min.k)<0?this._min=n:this.compareKeys(r,this._max.k)>0&&(this._max=n),this},BinarySearchTree$696.prototype.get=function(r){var e=this._search(r);if(e[0])return e[1].v},BinarySearchTree$696.prototype.has=function(r){return this._search(r)[0]},BinarySearchTree$696.prototype["delete"]=function(r){var e=this._search(r);if(!e[0])return!1;var t=e[1];return t===this._root?this._root=this._removeNode(t):this._removeNode(t),this._length--,!0},BinarySearchTree$696.prototype.clone=function(){var r=new this.constructor;return r._cc=this._cc,r},BinarySearchTree$696.prototype.forEach=function(r){if(null!==this._min){var e=this._min,t=e,n=new Array(50),i=0;do for(r(t.v,t.k,this);t.r;){for(t=t.r;t.l;)n[i++]=t,t=t.l;r(t.v,t.k,this)}while(t=i?n[--i]:e=e.p)}},BinarySearchTree$696.prototype.every=function(r){if(null===this._min)return!0;var e=this._min,t=e,n=new Array(50),i=0;do{if(!r(t.v,t.k,this))return!1;for(;t.r;){for(t=t.r;t.l;)n[i++]=t,t=t.l;if(!r(t.v,t.k,this))return!1}}while(t=i?n[--i]:e=e.p);return!0},BinarySearchTree$696.prototype.some=function(r){if(null===this._min)return!0;var e=this._min,t=e,n=new Array(50),i=0;do{if(r(t.v,t.k,this))return!0;for(;t.r;){for(t=t.r;t.l;)n[i++]=t,t=t.l;if(r(t.v,t.k,this))return!0}}while(t=i?n[--i]:e=e.p);return!1},BinarySearchTree$696.prototype.reduce=function(r,e){if(null===this._min)return e;var t=e,n=this._min,i=n,o=new Array(50),l=0;do for(t=r(t,i.v,i.k,this);i.r;){for(i=i.r;i.l;)o[l++]=i,i=i.l;t=r(t,i.v,i.k,this)}while(i=l?o[--l]:n=n.p);return t},BinarySearchTree$696.prototype.reduceRight=function(r,e){if(null===this._max)return e;var t=e,n=this._max,i=n,o=new Array(50),l=0;do for(t=r(t,i.v,i.k,this);i.l;){for(i=i.l;i.r;)o[l++]=i,i=i.r;t=r(t,i.v,i.k,this)}while(i=l?o[--l]:n=n.p);return t},BinarySearchTree$696.prototype.map=function(r){var e=this;return this._produce(function(t){return{k:t.k,v:r(t.v,t.k,e),p:null,l:null,r:null,m:null}})},BinarySearchTree$696.prototype.filter=function(r){for(var e=this,t=[],n=this._produce(function(n){var i=n.k,o=n.v,l={k:i,v:o,p:null,l:null,r:null,m:null};return r(o,i,e)||t.push(l),l}),i=n._length,o=0,l=t.length;l>o;++o){var h=t[o];n._root===h?n._root=n._removeNode(h):n._removeNode(h),--i}return n._length=i,n},BinarySearchTree$696.prototype[Symbol.iterator]=function(){return this.values()},BinarySearchTree$696.prototype.values=function(){return new Iterator$695(this,"v")},BinarySearchTree$696.prototype.keys=function(){return new Iterator$695(this,"k")},BinarySearchTree$696.prototype.entries=function(){return new Iterator$695(this,"e")},BinarySearchTree$696.prototype._produce=function(r){var e=this,t=null,n=null,i="",o=[],l=[],h=0,s=null,u=null;if(this._traverse(function(a,c){++h;var p=r(a);a===e._min&&(s=p),a===e._max&&(u=p),t||a.p||(t=p);var f=c.length-1;if(!n)return void(n=p);for(var _=0;f>_;++_){var y=c[_],v=i[i.length-1];if(("L"===y&&"l"===v||"R"===y&&"r"===v)&&(i=i.slice(0,-1)),"L"!==y&&"R"!==y)if("l"!==y&&"r"!==y);else{if(!n[y])return o.push(n),n=p,i&&l.push(i),void(i=c.slice(_));n=n[y]}else{if(!n.p)return o.push(n),n=p,i&&l.push(i),void(i=c.slice(_));n=n.p}}switch(c[f]){case"L":"l"===i[i.length-1]&&(i=i.slice(0,-1)),1===i.length&&("L"===i||"R"===i?e._linkNodes(p,o.pop(),i):e._linkNodes(o.pop(),p,i),i=l.length?l.pop():""),e._linkNodes(p,n,"l");break;case"R":"r"===i[i.length-1]&&(i=i.slice(0,-1)),1===i.length&&("L"===i||"R"===i?e._linkNodes(p,o.pop(),i):e._linkNodes(o.pop(),p,i),i=l.length?l.pop():""),e._linkNodes(p,n,"r");break;case"l":o.length&&(i+="l"),e._linkNodes(n,p,"l");break;case"r":o.length&&(i+="r"),e._linkNodes(n,p,"r")}n=p}),!t)throw new Error("Could not map tree: root node was not found!");return e=e.clone(),e._root=t,e._min=s,e._max=u,e._length=h,e},BinarySearchTree$696.prototype._traverse=function(r,e){var t;"function"==typeof r&&(e=r,r={});for(var n=r.reverse||!1,i=r.from||this._root,o=r.steps||1/0,l="",h=r._up||!1,s=r._im||!1,u=r._ff||!1;o&&i;)if(!h&&(n?i.r:i.l))n?(i=i.r,null!==l&&(l+="r")):(i=i.l,null!==l&&(l+="l")),h=!1,s=!1;else{if(!h||s){if(i!==r.from)if(--o,e){if("break"===e(i,l))return;l=""}else if(0===o)return u?[i,l,h,s]:null;if(n?i.l:i.r){n?(i=i.l,l+="l"):(i=i.r,l+="r"),h=!1,s=!1;continue}}h=!0,t=i.p,s=t&&i===(n?t.r:t.l),t&&(l+=i===t.r?"R":"L"),i=t}return e?void 0:null},BinarySearchTree$696.prototype.compareKeys=function(r,e){var t=this._cc,n=t&&t(r,e),i=Object.prototype.toString;return"undefined"!=typeof n?"[object Number]"===i.call(n)?n:n?-1:1:r===e?0:r>e?1:-1},BinarySearchTree$696.prototype._search=function(r,e){var t,n=e||this._root;if(!n)return[!1,n];for(;t=this.compareKeys(r,n.k);)if(0>t){if(!n.l)return[!1,n];n=n.l}else{if(!n.r)return[!1,n];n=n.r}return[!0,n]},BinarySearchTree$696.prototype._linkNodes=function(r,e,t){e.p=r;var n=this.compareKeys(e.k,r.k);if(0===n)throw new Error("Could not link parent and child nodes with equal keys!");if("undefined"!=typeof t)switch(t.toLowerCase()){case"l":case"left":r.l=e;break;case"r":case"right":r.r=e;break;default:throw new Error("Incorrect link nodes type!")}else 0>n?r.l=e:r.r=e},BinarySearchTree$696.prototype._removeNode=function(r){var e=r.p,t=r.l,n=r.r;r===this._min&&(this._min=r.r?this._getMinNode(r.r):r.p),r===this._max&&(this._max=r.l?this._getMaxNode(r.l):r.p);var i=e&&(e.l===r?"left":"right");return n||t?n?t?(this._linkNodes(this._getMaxNode(n),t,"right"),e?(this._linkNodes(e,n,i),r.p=null):n.p=null,r.l=null,r.r=null,e||n):(e?(this._linkNodes(e,n,i),r.p=null):n.p=null,r.l=null,e||n):(e?(this._linkNodes(e,t,i),r.p=null):t.p=null,r.r=null,e||t):(e&&("left"===i?e.l=null:e.r=null,r.p=null),e)},BinarySearchTree$696.prototype._getMinNode=function(r){for(var e=r||this._root;e.l;)e=e.l;return e},BinarySearchTree$696.prototype._getMaxNode=function(r){for(var e=r||this._root;e.r;)e=e.r;return e};
//# sourceMappingURL=Tree.js.map