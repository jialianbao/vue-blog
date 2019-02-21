// new 出来一个实例
function SelfVue (options) {
    var self = this;
    // 将data中的 data（数据）和methods（方法）放到new出来的对象下
    this.data = options.data;
    this.methods = options.methods;
    // 遍历data
    Object.keys(this.data).forEach(function(key) {
        // 获取到data对象下所有的  key值
        self.proxyKeys(key);
    });

    observe(this.data);
    new Compile(options.el, this);
    options.mounted.call(this); // 所有事情处理好后执行mounted函数 把mounted的this指向SelfVue
    console.log(this.__proto__,'this.__proto__')
}

SelfVue.prototype = {
    proxyKeys: function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false, // 属性是否可以被枚举 （ for...in 或Object.keys() ）
            configurable: true,// 是可以重新修改设置特性
            get: function getter () { // 获取该属性时触发
                return self.data[key];
            },
            set: function setter (newVal) { // 当修改该属性时触发
                self.data[key] = newVal;
            }
        });
    }
}
