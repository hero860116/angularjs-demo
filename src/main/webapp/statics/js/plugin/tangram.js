var T,baidu=T= function(){ 
// Copyright (c) 2009-2012, Baidu Inc. All rights reserved.
//
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://tangram.baidu.com/license.html
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


















var T, baidu = T = baidu || function(q, c) { return baidu.dom ? baidu.dom(q, c) : null; };

baidu.version = '2.0.2.2';
baidu.guid = "$BAIDU$";
baidu.key = "tangram_guid";

// Tangram 可能被放在闭包中
// 一些页面级别唯一的属性，需要挂载在 window[baidu.guid]上

var _ = window[ baidu.guid ] = window[ baidu.guid ] || {};
(_.versions || (_.versions = [])).push(baidu.version);

// 20120709 mz 添加参数类型检查器，对参数做类型检测保护
baidu.check = baidu.check || function(){};




 
baidu.lang = baidu.lang || {};





baidu.forEach = function( enumerable, iterator, context ) {
    var i, n, t;

    if ( typeof iterator == "function" && enumerable) {

        // Array or ArrayLike or NodeList or String or ArrayBuffer
        n = typeof enumerable.length == "number" ? enumerable.length : enumerable.byteLength;
        if ( typeof n == "number" ) {

            // 20121030 function.length
            //safari5.1.7 can not use typeof to check nodeList - linlingyu
            if (Object.prototype.toString.call(enumerable) === "[object Function]") {
                return enumerable;
            }

            for ( i=0; i<n; i++ ) {
                
                t = enumerable[ i ]
                t === undefined && (t = enumerable.charAt && enumerable.charAt( i ));

                // 被循环执行的函数，默认会传入三个参数(array[i], i, array)
                iterator.call( context || null, t, i, enumerable );
            }
        
        // enumerable is number
        } else if (typeof enumerable == "number") {

            for (i=0; i<enumerable; i++) {
                iterator.call( context || null, i, i, i);
            }
        
        // enumerable is json
        } else if (typeof enumerable == "object") {

            for (i in enumerable) {
                if ( enumerable.hasOwnProperty(i) ) {
                    iterator.call( context || null, enumerable[ i ], i, enumerable );
                }
            }
        }
    }

    return enumerable;
};



baidu.type = (function() {
    var objectType = {},
        nodeType = [, "HTMLElement", "Attribute", "Text", , , , , "Comment", "Document", , "DocumentFragment", ],
        str = "Array Boolean Date Error Function Number RegExp String",
        retryType = {'object': 1, 'function': '1'},//解决safari对于childNodes算为function的问题
        toString = objectType.toString;

    // 给 objectType 集合赋值，建立映射
    baidu.forEach(str.split(" "), function(name) {
        objectType[ "[object " + name + "]" ] = name.toLowerCase();

        baidu[ "is" + name ] = function ( unknow ) {
            return baidu.type(unknow) == name.toLowerCase();
        }
    });

    // 方法主体
    return function ( unknow ) {
        var s = typeof unknow;
        return !retryType[s] ? s
            : unknow == null ? "null"
            : unknow._type_
                || objectType[ toString.call( unknow ) ]
                || nodeType[ unknow.nodeType ]
                || ( unknow == unknow.window ? "Window" : "" )
                || "object";
    };
})();

// extend
baidu.isDate = function( unknow ) {
    return baidu.type(unknow) == "date" && unknow.toString() != 'Invalid Date' && !isNaN(unknow);
};

baidu.isElement = function( unknow ) {
    return baidu.type(unknow) == "HTMLElement";
};

// 20120818 mz 检查对象是否可被枚举，对象可以是：Array NodeList HTMLCollection $DOM
baidu.isEnumerable = function( unknow ){
    return unknow != null
        && (typeof unknow == "object" || ~Object.prototype.toString.call( unknow ).indexOf( "NodeList" ))
    &&(typeof unknow.length == "number"
    || typeof unknow.byteLength == "number"     //ArrayBuffer
    || typeof unknow[0] != "undefined");
};
baidu.isNumber = function( unknow ) {
    return baidu.type(unknow) == "number" && isFinite( unknow );
};

// 20120903 mz 检查对象是否为一个简单对象 {}
baidu.isPlainObject = function(unknow) {
    var key,
        hasOwnProperty = Object.prototype.hasOwnProperty;

    if ( baidu.type(unknow) != "object" ) {
        return false;
    }

    //判断new fn()自定义对象的情况
    //constructor不是继承自原型链的
    //并且原型中有isPrototypeOf方法才是Object
    if ( unknow.constructor &&
        !hasOwnProperty.call(unknow, "constructor") &&
        !hasOwnProperty.call(unknow.constructor.prototype, "isPrototypeOf") ) {
        return false;
    }
    //判断有继承的情况
    //如果有一项是继承过来的，那么一定不是字面量Object
    //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
    for ( key in unknow ) {}
    return key === undefined || hasOwnProperty.call( unknow, key );
};

baidu.isObject = function( unknow ) {
    return typeof unknow === "function" || ( typeof unknow === "object" && unknow != null );
};









baidu.extend = function(depthClone, object) {
    var second, options, key, src, copy,
        i = 1,
        n = arguments.length,
        result = depthClone || {},
        copyIsArray, clone;
    
    baidu.isBoolean( depthClone ) && (i = 2) && (result = object || {});
    !baidu.isObject( result ) && (result = {});

    for (; i<n; i++) {
        options = arguments[i];
        if( baidu.isObject(options) ) {
            for( key in options ) {
                src = result[key];
                copy = options[key];
                // Prevent never-ending loop
                if ( src === copy ) {
                    continue;
                }
                
                if(baidu.isBoolean(depthClone) && depthClone && copy
                    && (baidu.isPlainObject(copy) || (copyIsArray = baidu.isArray(copy)))){
                        if(copyIsArray){
                            copyIsArray = false;
                            clone = src && baidu.isArray(src) ? src : [];
                        }else{
                            clone = src && baidu.isPlainObject(src) ? src : {};
                        }
                        result[key] = baidu.extend(depthClone, clone, copy);
                }else if(copy !== undefined){
                    result[key] = copy;
                }
            }
        }
    }
    return result;
};



baidu.createChain = function(chainName, fn, constructor) {
    // 创建一个内部类名
    var className = chainName=="dom"?"$DOM":"$"+chainName.charAt(0).toUpperCase()+chainName.substr(1),
        slice = Array.prototype.slice,
        chain = baidu[chainName];
    if(chain){return chain}
    // 构建链头执行方法
    chain = baidu[chainName] = fn || function(object) {
        return baidu.extend(object, baidu[chainName].fn);
    };

    // 扩展 .extend 静态方法，通过本方法给链头对象添加原型方法
    chain.extend = function(extended) {
        var method;

        // 直接构建静态接口方法，如 baidu.array.each() 指向到 baidu.array().each()
        for (method in extended) {
            (function(method){//解决通过静态方法调用的时候，调用的总是最后一个的问题。
                // 20121128 这个if判断是防止console按鸭子判断规则将本方法识别成数组
                if (method != "splice") {
                    chain[method] = function() {
                        var id = arguments[0];

                        // 在新版接口中，ID选择器必须用 # 开头
                        chainName=="dom" && baidu.type(id)=="string" && (id = "#"+ id);

                        var object = chain(id);
                        var result = object[method].apply(object, slice.call(arguments, 1));

                        // 老版接口返回实体对象 getFirst
                        return baidu.type(result) == "$DOM" ? result.get(0) : result;
                    }
                }
            })(method);
        }
        return baidu.extend(baidu[chainName].fn, extended);
    };

    // 创建 链头对象 构造器
    baidu[chainName][className] = baidu[chainName][className] || constructor || function() {};

    // 给 链头对象 原型链做一个短名映射
    chain.fn = baidu[chainName][className].prototype;

    return chain;
};


baidu.overwrite = function(Class, list, fn) {
    for (var i = list.length - 1; i > -1; i--) {
        Class.prototype[list[i]] = fn(list[i]);
    }

    return Class;
};



baidu.createChain('number', function(number){
    var nan = parseFloat(number),
        val = isNaN(nan) ? nan : number,
        clazz = typeof val === 'number' ? Number : String,
        pro = clazz.prototype;
    val = new clazz(val);
    baidu.forEach(baidu.number.$Number.prototype, function(value, key){
        pro[key] || (val[key] = value);
    });
    return val;
});





baidu.number.extend({
    comma : function (length) {
        var source = this;
        if (!length || length < 1) {
            length = 3;
        }
    
        source = String(source).split(".");
        source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{'+length+'})+$)','ig'),"$1,");
        return source.join(".");
    }    
});







baidu.number.extend({
    pad : function (length) {
        var source = this;
        var pre = "",
            negative = (source < 0),
            string = String(Math.abs(source));
    
        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }
    
        return (negative ?  "-" : "") + pre + string;
    }
});



baidu.number.randomInt = function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
};





baidu.createChain('string',
    // 执行方法
    function(string){
        var type = baidu.type(string),
            str = new String(~'string|number'.indexOf(type) ? string : type),
            pro = String.prototype;
        baidu.forEach(baidu.string.$String.prototype, function(fn, key) {
            pro[key] || (str[key] = fn);
        });
        return str;
    }
);





baidu.string.extend({
    decodeHTML : function () {
        var str = this
                    .replace(/&quot;/g,'"')
                    .replace(/&lt;/g,'<')
                    .replace(/&gt;/g,'>')
                    .replace(/&amp;/g, "&");
        //处理转义的中文和实体字符
        return str.replace(/&#([\d]+);/g, function(_0, _1){
            return String.fromCharCode(parseInt(_1, 10));
        });
    }
});






baidu.string.extend({
    encodeHTML : function () {
        return this.replace(/&/g,'&amp;')
                    .replace(/</g,'&lt;')
                    .replace(/>/g,'&gt;')
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");
    }
});





baidu.string.extend({
    escapeReg : function () {
        return this.replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), '\\\x241');
    }
});







baidu.merge = function(first, second) {
    var i = first.length,
        j = 0;

    if ( typeof second.length === "number" ) {
        for ( var l = second.length; j < l; j++ ) {
            first[ i++ ] = second[ j ];
        }

    } else {
        while ( second[j] !== undefined ) {
            first[ i++ ] = second[ j++ ];
        }
    }

    first.length = i;

    return first;
};






//format(a,a,d,f,c,d,g,c);
baidu.string.extend({
    format : function (opts) {
        var source = this.valueOf(),
            data = Array.prototype.slice.call(arguments,0), toString = Object.prototype.toString;
        if(data.length){
            data = data.length == 1 ? 
                
                (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
                : data;
            return source.replace(/#\{(.+?)\}/g, function (match, key){
                var replacer = data[key];
                // chrome 下 typeof /a/ == 'function'
                if('[object Function]' == toString.call(replacer)){
                    replacer = replacer(key);
                }
                return ('undefined' == typeof replacer ? '' : replacer);
            });
        }
        return source;
    }
});







baidu.string.extend({
    formatColor: function(){
        // 将正则表达式预创建，可提高效率
        var reg1 = /^\#[\da-f]{6}$/i,
            reg2 = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i,
            keyword = {
                black: '#000000',
                silver: '#c0c0c0',
                gray: '#808080',
                white: '#ffffff',
                maroon: '#800000',
                red: '#ff0000',
                purple: '#800080',
                fuchsia: '#ff00ff',
                green: '#008000',
                lime: '#00ff00',
                olive: '#808000',
                yellow: '#ffff0',
                navy: '#000080',
                blue: '#0000ff',
                teal: '#008080',
                aqua: '#00ffff'
            };
            
        return function(){
            var color = this.valueOf();
            if(reg1.test(color)) {
                // #RRGGBB 直接返回
                return color;
            } else if(reg2.test(color)) {
                // 非IE中的 rgb(0, 0, 0)
                for (var s, i=1, color="#"; i<4; i++) {
                    s = parseInt(RegExp["\x24"+ i]).toString(16);
                    color += ("00"+ s).substr(s.length);
                }
                return color;
            } else if(/^\#[\da-f]{3}$/.test(color)) {
                // 简写的颜色值: #F00
                var s1 = color.charAt(1),
                    s2 = color.charAt(2),
                    s3 = color.charAt(3);
                return "#"+ s1 + s1 + s2 + s2 + s3 + s3;
            }else if(keyword[color])
                return keyword[color];
            
            return '';
        }
    }()
});




baidu.string.extend({
    stripTags : function() {
        return (this || '').replace(/<[^>]+>/g, '');
    }
});




baidu.string.extend({
    getByteLength : function () {
        return this.replace(/[^\x00-\xff]/g, 'ci').length;
    }
    //获取字符在gbk编码下的字节长度, 实现原理是认为大于127的就一定是双字节。如果字符超出gbk编码范围, 则这个计算不准确
});




baidu.string.extend({
    subByte : function (len, tail) {
        baidu.check('number(,string)?$', 'baidu.string.subByte');

        if(len < 0 || this.getByteLength() <= len){
            return this.valueOf(); // 20121109 mz 去掉tail
        }
        //thanks 加宽提供优化方法
        var source = this.substr(0, len)
            .replace(/([^\x00-\xff])/g,"\x241 ")//双字节字符替换成两个
            .substr(0, len)//截取长度
            .replace(/[^\x00-\xff]$/,"")//去掉临界双字节字符
            .replace(/([^\x00-\xff]) /g,"\x241");//还原
        return source + (tail || "");
    }
});





 //支持单词以“-_”分隔
 //todo:考虑以后去掉下划线支持？
baidu.string.extend({
    toCamelCase : function () {
        var source = this.valueOf();
        //提前判断，提高getStyle等的效率 thanks xianwei
        if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
            return source;
        }
        return source.replace(/[-_][^-_]/g, function (match) {
            return match.charAt(1).toUpperCase();
        });
    }
});






baidu.string.extend({
    toHalfWidth : function () {
        return this.replace(/[\uFF01-\uFF5E]/g,
            function(c){
                return String.fromCharCode(c.charCodeAt(0) - 65248);
            }).replace(/\u3000/g," ");
    }
});





baidu.string.extend({
    trim: function(){
        var trimer = new RegExp('(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 'g');
        return function(){
            return this.replace(trimer, '');
        }
    }()
});






baidu.string.extend({
    wbr : function () {
        return this.replace(/(?:<[^>]+>)|(?:&#?[0-9a-z]{2,6};)|(.{1})/gi, '$&<wbr>')
            .replace(/><wbr>/g, '>');
    }
});






baidu.createChain("array", function(array){
    var pro = baidu.array.$Array.prototype
        ,ap = Array.prototype
        ,key;

    baidu.type( array ) != "array" && ( array = [] );

    for ( key in pro ) {
        //ap[key] || (array[key] = pro[key]);
        array[key] = pro[key];
    }

    return array;
});

// 对系统方法新产生的 array 对象注入自定义方法，支持完美的链式语法
baidu.overwrite(baidu.array.$Array, "concat slice".split(" "), function(key) {
    return function() {
        return baidu.array( Array.prototype[key].apply(this, arguments) );
    }
});







baidu.array.extend({
    indexOf : function (match, fromIndex) {
        baidu.check(".+(,number)?","baidu.array.indexOf");
        var len = this.length;

        // 小于 0
        (fromIndex = fromIndex | 0) < 0 && (fromIndex = Math.max(0, len + fromIndex));

        for ( ; fromIndex < len; fromIndex++) {
            if(fromIndex in this && this[fromIndex] === match) {
                return fromIndex;
            }
        }
        
        return -1;
    }
});






baidu.array.extend({
    contains : function (item) {
        return !!~this.indexOf(item);
    }
});





baidu.each = function( enumerable, iterator, context ) {
    var i, n, t, result;

    if ( typeof iterator == "function" && enumerable) {

        // Array or ArrayLike or NodeList or String or ArrayBuffer
        n = typeof enumerable.length == "number" ? enumerable.length : enumerable.byteLength;
        if ( typeof n == "number" ) {

            // 20121030 function.length
            //safari5.1.7 can not use typeof to check nodeList - linlingyu
            if (Object.prototype.toString.call(enumerable) === "[object Function]") {
                return enumerable;
            }

            for ( i=0; i<n; i++ ) {
                //enumerable[ i ] 有可能会是0
                t = enumerable[ i ];
                t === undefined && (t = enumerable.charAt && enumerable.charAt( i ));
                // 被循环执行的函数，默认会传入三个参数(i, array[i], array)
                result = iterator.call( context || t, i, t, enumerable );

                // 被循环执行的函数的返回值若为 false 和"break"时可以影响each方法的流程
                if ( result === false || result == "break" ) {break;}
            }
        
        // enumerable is number
        } else if (typeof enumerable == "number") {

            for (i=0; i<enumerable; i++) {
                result = iterator.call( context || i, i, i, i);
                if ( result === false || result == "break" ) { break;}
            }
        
        // enumerable is json
        } else if (typeof enumerable == "object") {

            for (i in enumerable) {
                if ( enumerable.hasOwnProperty(i) ) {
                    result = iterator.call( context || enumerable[ i ], i, enumerable[ i ], enumerable );

                    if ( result === false || result == "break" ) { break;}
                }
            }
        }
    }

    return enumerable;
};





baidu.array.extend({
    each: function(iterator, context){
        return baidu.each(this, iterator, context);
    },
    
    forEach: function(iterator, context){
        return baidu.forEach(this, iterator, context);
    }
});








baidu.array.extend({
    empty : function () {
        this.length = 0;
        return this;
    }
});












baidu.array.extend({
    filter: function(iterator, context) {
        var result = baidu.array([]),
            i, n, item, index=0;
    
        if (baidu.type(iterator) === "function") {
            for (i=0, n=this.length; i<n; i++) {
                item = this[i];
    
                if (iterator.call(context || this, item, i, this) === true) {
                    result[index ++] = item;
                }
            }
        }
        return result;
    }
});








baidu.array.extend({
    find : function (iterator) {
        var i, item, n=this.length;

        if (baidu.type(iterator) == "function") {
            for (i=0; i<n; i++) {
                item = this[i];
                if (iterator.call(this, item, i, this) === true) {
                    return item;
                }
            }
        }

        return null;
    }
});






baidu.array.extend({
    hash : function (values) {
        var result = {},
            vl = values && values.length,
            i, n;

        for (i=0, n=this.length; i < n; i++) {
            result[this[i]] = (vl && vl > i) ? values[i] : true;
        }
        return result;
    }
});






baidu.array.extend({
    lastIndexOf : function (match, fromIndex) {
        baidu.check(".+(,number)?", "baidu.array.lastIndexOf");
        var len = this.length;

        (!(fromIndex = fromIndex | 0) || fromIndex >= len) && (fromIndex = len - 1);
        fromIndex < 0 && (fromIndex += len);

        for(; fromIndex >= 0; fromIndex --){
            if(fromIndex in this && this[fromIndex] === match){
                return fromIndex;
            }
        }
        
        return -1;
    }
});





baidu.array.extend({
    map: function(iterator, context){
        baidu.check("function(,.+)?","baidu.array.map");
        var len = this.length,
            array = baidu.array([]);
        for(var i = 0; i < len; i++){
            array[i] = iterator.call(context || this, this[i], i, this);
        }
        return array;
    }
});







baidu.array.extend({
    remove : function (match) {
        var n = this.length;
            
        while (n--) {
            if (this[n] === match) {
                this.splice(n, 1);
            }
        }
        return this;
    }
});






baidu.array.extend({
    removeAt : function (index) {
        baidu.check("number", "baidu.array.removeAt");
        return this.splice(index, 1)[0];
    }
});






baidu.array.extend({
    unique : function (fn) {
        var len = this.length,
            result = this.slice(0),
            i, datum;
            
        if ('function' != typeof fn) {
            fn = function (item1, item2) {
                return item1 === item2;
            };
        }
        
        // 从后往前双重循环比较
        // 如果两个元素相同，删除后一个
        while (--len > 0) {
            datum = result[len];
            i = len;
            while (i--) {
                if (fn(datum, result[i])) {
                    result.splice(len, 1);
                    break;
                }
            }
        }

        len = this.length = result.length;
        for ( i=0; i<len; i++ ) {
            this[ i ] = result[ i ];
        }

        return this;
    }
});

baidu.object = baidu.object || {};




//baidu.lang.isArray = function (source) {
//    return '[object Array]' == Object.prototype.toString.call(source);
//};
baidu.lang.isArray = baidu.isArray;




baidu.object.isPlain  = baidu.isPlainObject;


baidu.object.clone  = function (source) {
    var result = source, i, len;
    if (!source
        || source instanceof Number
        || source instanceof String
        || source instanceof Boolean) {
        return result;
    } else if (baidu.lang.isArray(source)) {
        result = [];
        var resultLen = 0;
        for (i = 0, len = source.length; i < len; i++) {
            result[resultLen++] = baidu.object.clone(source[i]);
        }
    } else if (baidu.object.isPlain(source)) {
        result = {};
        for (i in source) {
            if (source.hasOwnProperty(i)) {
                result[i] = baidu.object.clone(source[i]);
            }
        }
    }
    return result;
};


baidu.object.each = function (source, iterator) {
    var returnValue, key, item; 
    if ('function' == typeof iterator) {
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                item = source[key];
                returnValue = iterator.call(source, item, key);
        
                if (returnValue === false) {
                    break;
                }
            }
        }
    }
    return source;
};



//baidu.object.extend = function (target, source) {
//    for (var p in source) {
//        if (source.hasOwnProperty(p)) {
//            target[p] = source[p];
//        }
//    }
//    
//    return target;
//};
baidu.object.extend = baidu.extend;


baidu.object.isEmpty = function(obj) {
    var ret = true;
    if('[object Array]' === Object.prototype.toString.call(obj)){
        ret = !obj.length;
    }else{
        obj = new Object(obj);
        for(var key in obj){
            return false;
        }
    }
    return ret;
};


baidu.object.keys = function (source) {
    var result = [], resultLen = 0, k;
    for (k in source) {
        if (source.hasOwnProperty(k)) {
            result[resultLen++] = k;
        }
    }
    return result;
};


baidu.object.map = function (source, iterator) {
    var results = {};
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            results[key] = iterator(source[key], key);
        }
    }
    return results;
};




//baidu.lang.isObject = function (source) {
//    return 'function' == typeof source || !!(source && 'object' == typeof source);
//};
baidu.lang.isObject = baidu.isObject;




//baidu.lang.isFunction = function (source) {
    // chrome下,'function' == typeof /a/ 为true.
//    return '[object Function]' == Object.prototype.toString.call(source);
//};
baidu.lang.isFunction = baidu.isFunction;



baidu.object.merge = function(){
    function isPlainObject(source) {
        return baidu.lang.isObject(source) && !baidu.lang.isFunction(source);
    };
    function mergeItem(target, source, index, overwrite, recursive) {
        if (source.hasOwnProperty(index)) {
            if (recursive && isPlainObject(target[index])) {
                // 如果需要递归覆盖，就递归调用merge
                baidu.object.merge(
                    target[index],
                    source[index],
                    {
                        'overwrite': overwrite,
                        'recursive': recursive
                    }
                );
            } else if (overwrite || !(index in target)) {
                // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
                target[index] = source[index];
            }
        }
    };
    
    return function(target, source, opt_options){
        var i = 0,
            options = opt_options || {},
            overwrite = options['overwrite'],
            whiteList = options['whiteList'],
            recursive = options['recursive'],
            len;
    
        // 只处理在白名单中的属性
        if (whiteList && whiteList.length) {
            len = whiteList.length;
            for (; i < len; ++i) {
                mergeItem(target, source, whiteList[i], overwrite, recursive);
            }
        } else {
            for (i in source) {
                mergeItem(target, source, i, overwrite, recursive);
            }
        }
        return target;
    };
}();


baidu.object.values = function (source) {
    var result = [], resultLen = 0, k;
    for (k in source) {
        if (source.hasOwnProperty(k)) {
            result[resultLen++] = source[k];
        }
    }
    return result;
};

baidu.date = baidu.date || {};





baidu.date.format = function (source, pattern) {
    if ('string' != typeof pattern) {
        return source.toString();
    }

    function replacer(patternPart, result) {
        pattern = pattern.replace(patternPart, result);
    }
    
    var pad     = baidu.number.pad,
        year    = source.getFullYear(),
        month   = source.getMonth() + 1,
        date2   = source.getDate(),
        hours   = source.getHours(),
        minutes = source.getMinutes(),
        seconds = source.getSeconds();

    replacer(/yyyy/g, pad(year, 4));
    replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
    replacer(/MM/g, pad(month, 2));
    replacer(/M/g, month);
    replacer(/dd/g, pad(date2, 2));
    replacer(/d/g, date2);

    replacer(/HH/g, pad(hours, 2));
    replacer(/H/g, hours);
    replacer(/hh/g, pad(hours % 12, 2));
    replacer(/h/g, hours % 12);
    replacer(/mm/g, pad(minutes, 2));
    replacer(/m/g, minutes);
    replacer(/ss/g, pad(seconds, 2));
    replacer(/s/g, seconds);

    return pattern;
};



baidu.date.parse = function (source) {
    var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
    if ('string' == typeof source) {
        if (reg.test(source) || isNaN(Date.parse(source))) {
            var d = source.split(/ |T/),
                d1 = d.length > 1 
                        ? d[1].split(/[^\d]/) 
                        : [0, 0, 0],
                d0 = d[0].split(/[^\d]/);
            return new Date(d0[0] - 0, 
                            d0[1] - 1, 
                            d0[2] - 0, 
                            d1[0] - 0, 
                            d1[1] - 0, 
                            d1[2] - 0);
        } else {
            return new Date(source);
        }
    }
    
    return new Date();
};




baidu.createChain("fn",

// 执行方法
function(fn){
    return new baidu.fn.$Fn(~'function|string'.indexOf(baidu.type(fn)) ? fn : function(){});
},

// constructor
function(fn){
    this.fn = fn;
});


baidu.fn.extend({
    bind: function(scope){
        var func = this.fn,
            xargs = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : null;
        return function(){
            var fn = baidu.type(func) === 'string' ? scope[func] : func,
                args = xargs ? xargs.concat(Array.prototype.slice.call(arguments, 0)) : arguments;
            return fn.apply(scope || fn, args);
        }
    }
});


baidu.json = baidu.json || {};


baidu.json.parse = function (data) {
    //2010/12/09：更新至不使用原生parse，不检测用户输入是否正确
    return (new Function("return (" + data + ")"))();
};



baidu.json.stringify = (function () {
    
    var escapeMap = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"' : '\\"',
        "\\": '\\\\'
    };
    
    
    function encodeString(source) {
        if (/["\\\x00-\x1f]/.test(source)) {
            source = source.replace(
                /["\\\x00-\x1f]/g, 
                function (match) {
                    var c = escapeMap[match];
                    if (c) {
                        return c;
                    }
                    c = match.charCodeAt();
                    return "\\u00" 
                            + Math.floor(c / 16).toString(16) 
                            + (c % 16).toString(16);
                });
        }
        return '"' + source + '"';
    }
    
    
    function encodeArray(source) {
        var result = ["["], 
            l = source.length,
            preComma, i, item;
            
        for (i = 0; i < l; i++) {
            item = source[i];
            
            switch (typeof item) {
            case "undefined":
            case "function":
            case "unknown":
                break;
            default:
                if(preComma) {
                    result.push(',');
                }
                result.push(baidu.json.stringify(item));
                preComma = 1;
            }
        }
        result.push("]");
        return result.join("");
    }
    
    
    function pad(source) {
        return source < 10 ? '0' + source : source;
    }
    
    
    function encodeDate(source){
        return '"' + source.getFullYear() + "-" 
                + pad(source.getMonth() + 1) + "-" 
                + pad(source.getDate()) + "T" 
                + pad(source.getHours()) + ":" 
                + pad(source.getMinutes()) + ":" 
                + pad(source.getSeconds()) + '"';
    }
    
    return function (value) {
        switch (typeof value) {
        case 'undefined':
            return 'undefined';
            
        case 'number':
            return isFinite(value) ? String(value) : "null";
            
        case 'string':
            return encodeString(value);
            
        case 'boolean':
            return String(value);
            
        default:
            if (value === null) {
                return 'null';
            } else if (baidu.type(value) === 'array') {
                return encodeArray(value);
            } else if (baidu.type(value) === 'date') {
                return encodeDate(value);
            } else {
                var result = ['{'],
                    encode = baidu.json.stringify,
                    preComma,
                    item;
                    
                for (var key in value) {
                    if (Object.prototype.hasOwnProperty.call(value, key)) {
                        item = value[key];
                        switch (typeof item) {
                        case 'undefined':
                        case 'unknown':
                        case 'function':
                            break;
                        default:
                            if (preComma) {
                                result.push(',');
                            }
                            preComma = 1;
                            result.push(encode(key) + ':' + encode(item));
                        }
                    }
                }
                result.push('}');
                return result.join('');
            }
        }
    };
})();// 声明快捷


//链头
baidu.array = baidu.array ||{};

//链头
baidu.dom = baidu.dom ||{};

//为目标元素添加className
baidu.addClass = baidu.dom.addClass ||{};

//从文档中获取指定的DOM元素
baidu.g = baidu.G = baidu.dom.g ||{};

//获取目标元素的属性值
baidu.getAttr = baidu.dom.getAttr ||{};

//获取目标元素的样式值
baidu.getStyle = baidu.dom.getStyle ||{};

//隐藏目标元素
baidu.hide = baidu.dom.hide ||{};

//在目标元素的指定位置插入HTML代码
baidu.insertHTML = baidu.dom.insertHTML ||{};

//通过className获取元素
baidu.q = baidu.Q = baidu.dom.q ||{};

//移除目标元素的className
baidu.removeClass = baidu.dom.removeClass ||{};

//设置目标元素的attribute值
baidu.setAttr = baidu.dom.setAttr ||{};

//批量设置目标元素的attribute值
baidu.setAttrs = baidu.dom.setAttrs ||{};

//按照border-box模型设置元素的height值
baidu.dom.setOuterHeight = baidu.dom.setBorderBoxHeight ||{};

//按照border-box模型设置元素的width值
baidu.dom.setOuterWidth = baidu.dom.setBorderBoxWidth ||{};

//设置目标元素的style样式值
baidu.setStyle = baidu.dom.setStyle ||{};

//批量设置目标元素的style样式值
baidu.setStyles = baidu.dom.setStyles ||{};

//显示目标元素，即将目标元素的display属性还原成默认值。默认值可能在stylesheet中定义，或者是继承了浏览器的默认样式值
baidu.show = baidu.dom.show ||{};

//链头
//baidu.e = baidu.element = baidu.element ||{};

//链头
baidu.event = baidu.event ||{};

//为目标元素添加事件监听器
baidu.on = baidu.event.on ||{};

//为目标元素移除事件监听器
baidu.un = baidu.event.un ||{};

//链头
baidu.lang = baidu.lang ||{};

//为类型构造器建立继承关系
baidu.inherits = baidu.lang.inherits ||{};

//链头
baidu.object = baidu.object ||{};

//链头
baidu.string = baidu.string ||{};

//对目标字符串进行html解码
baidu.decodeHTML = baidu.string.decodeHTML ||{};

//对目标字符串进行html编码
baidu.encodeHTML = baidu.string.encodeHTML ||{};

//对目标字符串进行格式化
baidu.format = baidu.string.format ||{};

//删除目标字符串两端的空白字符
baidu.trim = baidu.string.trim ||{};
 return baidu;
}();