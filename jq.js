

// 框架结构
(function(global){
    var document = global.document,
        arr = [],
        push = arr.push;
    function it( selector ) {
        return new it.fn.init( selector )
    }

    // 置换原型,添加方法
    it.fn = it.prototype = {
        constructor:it,
        length: 0 ,//使it对象永远为伪数组对象
        toArray:function(){
           return slice.call(this);
        },
        get:function(index){
          if(index ==null){
              return this.toArray();
          }
          return this [index < 0 ? this.length + index : index];
        },
        eq:function(index){
            return it(this[index < 0 ? this.length + index : index]);
        },
        first:function () {
            return this.eq(0);
        },
        last:function(){
            return this.eq(-1);
        },
        each:function(callback){
            it.each(this,callback);
            return this;
        }
    };
    // 给it的原型动态创建init函数，并赋值给init
    var init = it.fn.init = function(selector){
        if(!selector){
            return this;
        }else if(it.isString(selector)){
            if(it.isHTML(selector)){
                push.apply(this,it.parseHTML(selector));
            }else{
                push.apply(this,document.querySelectorAll(selector));
            }
        }else if(it.isDOM(selector)){
            this[0] = selector;
            this.length = 1;
        }else if(it.isArrayLike(selector)){
            push.apply(this,selector);
        }else if(it.isFunction(selector)){
            document.addeventListener("DOMContentLoaded",function(){
                selector();
            });
        }

    };

    // init的原型继承与it
    init.prototype = it.fn;


    it.extend = function(){
        var args = arguments,
            i = 0,
            l = args.length,
            obj,
            target;
        if( l == 0 ){
            return this;
        }
        for(;i<l; i++){
            obj = args[i];
            for(var k in obj){
                if(obj.hasOwnProperty(k)){
                    this[k] = obj[k]
                }
            }
        }
    }
    // 在it对象上使用extend拓展方法
    it.extend({
        each:function (obj,callback) {
            var i = 0,
                l;
            // 判断obj是否为数组
            if(it.isArrayLike(obj)){
                l = obj.length;
                // 如果是数组就进行遍历，使用回调函数处理数组
                for(;i<l;i++){
                    if(callback.call(obj[i],i,obj[i])===false){
                        break;
                    }
                }
            // 如果obj是普通对象
            }else{
                for(i in obj){
                    if(callback.call(obj[i],i,obj[i])===false){
                        break;
                    }
                }
            }
            return obj;
        },
        type:function (obj) {
            if(obj ==null){
                return obj + "";
            }
            return typeof obj !== "object" ? typeof obj:
                Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
        },
        parseHTML:function (html) {
            var div = document.createElement("div"),
                node,
                ret = [];
            div.innerHTML = html;
            for(node = div.firstChild;node; node = node.nextSibling){
                if(node.nodeType === 1){
                    ret.push(node);
                }
            }
            return ret;
        },

    })



    // 在it对象上使用extend拓展方法
    it.extend({
        isString:function(obj){
            return typeof obj === "string";
        },
        isHTML:function(obj){
            return obj.charAt(  0) ==="<" && obj.charAt(obj.length-1===">")&&obj.length>=3;
        },
        isDOM:function(obj){
            return !!obj && !!obj.nodeType;
        },
        isArrayLike:function(obj){
            var length = !!obj && "length" in obj && obj.length,
                type = it.type(obj);
            if(type ==="function"|| it.isWindow(obj)){
                return false;
            }
            return type ==="array" || length === 0 ||
                    typeof length ==="number"&&length>0&&(length-1) in obj;
        },
        isFunction:function(obj){
            return typeof obj === "function";
        },
        isWindow:function(obj){
            return !!obj && obj.window === obj;
        }
    })



    //支持模块化开发
    if(typeof define ==="function"){
        define(function(){
            return it;
        });
    }else if(typeof exports !== "undefined"){
        module.exports = it;
    }else{
        global.$ = it;
    }



}( window ))



