
class Myvue extends EventTarget {
    constructor(arg) {
        super();
        this.arg = arg;
        let nodes = this.arg.el.childNodes
        this.traverse(nodes);
        this.hijack(this.arg.data);
    }
    // 查找变量
    traverse(nodes) {
        // 循环查找node
        nodes.forEach(node => {
            if (node.nodeType === 3) {
                // 文本 匹配是否为{{XXX}}
                let regExp = /\{\{\s*(\w+)\s*}\}/;
                let res = node.nodeValue.match(regExp);
                // !=null 匹配到了
                if (res != null) {
                    // 值
                    let value = RegExp.$1;
                    // 替换值
                    node.textContent = node.textContent.replace(regExp, this.arg.data[value]);
                    // 监听数据改变后发射的事件
                    this.addEventListener(value, (e) => {
                        let tar = this.arg.data[value];
                        // 替换传过来的值
                        node.textContent = node.textContent.replace(tar, e.detail);
                    })
                }
                // 标签节点
            } else if (node.nodeType === 1) {
                if (!node.childNodes.lenght === 0) { // 节点里没有内容了
                    return false;
                }
                // 再次查找
                this.traverse(node.childNodes);
            }
        });
    }
    // 匹配变量,返回变量名
    // mapping(value, data) {
    //     let res = Object.keys(data);
    //     let num = res.indexOf(value);
    //     return res[num];
    // }

    // 数据劫持前的准备
    hijack(data) {
        let dataKey = Object.keys(data);
        dataKey.forEach((key) => {
            this.defineReact(data, key, data[key])
        })
    }
    // 劫持数据
    defineReact(data, key, oldVal) {
        let _this = this;
        // 做劫持
        /**
         * data 监控对象
         * key 对象里的键
         * {} 写相关配置
         * 
        */
        Object.defineProperty(data, key, {
            // 相关配置
            // 是否可迭代
            configurable: true,
            // 是否可枚举
            enumerable: true,
            get() {
                // 返回原值
                return oldVal
            },
            set(newVal) {
                /**
                 * 定义事件
                 * key 事件名唯一值
                */
                // let event = new Event(key); // 不能传值
                let event = new CustomEvent(key, { // 可传值
                    detail: newVal
                })
                // 发射事件
                _this.dispatchEvent(event, newVal);
                // 旧值变新值
                oldVal = newVal;
            }
        })
    }

}