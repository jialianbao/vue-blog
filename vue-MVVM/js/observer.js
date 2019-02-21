// 将data下的数据放到本身
function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    walk: function(data) {
        var self = this;
      //这里是通过对一个对象进行遍历，对这个对象的所有属性都进行监听
        Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key]);
        });
    },
    // data下的所有key都会执行这个函数 {}  key  val
    defineReactive: function(data, key, val) {
        var dep = new Dep();
        // dep.subs = [];
      // 递归遍历所有子属性
        var childObj = observe(val); // 递归是否是一个对象重复执行深度监听所有的key
        Object.defineProperty(data, key, {
            enumerable: true,// 可以被枚举
            configurable: true,// 可以修改特性
            get: function getter () {
                // console.log('111',Dep.target)
                if (Dep.target) {
                    // 在这里添加一个订阅者
                    console.log(Dep.target,'Dep.target')
                    dep.addSub(Dep.target);// 将data下所有的key的监听值放到Dep.subs中
                }
                return val;
            },
          // setter，如果对一个对象属性值改变，就会触发setter中的dep.notify(),通知watcher（订阅者）数据变更，执行对应订阅者的更新函数，来更新视图。
            set: function setter (newVal) {// 当新值与当前值不同时
                if (newVal === val) {
                    return;
                }
                val = newVal; // 修改当前值
              // 新的值是object的话，进行监听
                childObj = observe(newVal); // 新值是对象的话还得监听
                dep.notify(); // 去更新值
            }
        });
    }
};

// 判断SelfVue下的data值是不是一个对象并且有值执行New Observer();
function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};

// 消息订阅器Dep，订阅器Dep主要负责收集订阅者，然后再属性变化的时候执行对应订阅者的更新函数
function Dep () {
    this.subs = [];
}
Dep.prototype = {
  /**
   * [订阅器添加订阅者]
   * @param  {[Watcher]} sub [订阅者]
   */
    addSub: function(sub) {
        this.subs.push(sub);
    },
  // 通知订阅者数据变更
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};
Dep.target = null;
