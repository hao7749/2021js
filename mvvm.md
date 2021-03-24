# mvvm数据绑定的做法

1. 传入id,以id为主体拿到其内部所有节点（childNodes）,然后判断其标签属性（type == 1 标签 type == 3 文本），拿文本节点匹配正则找到{{}}及其内容再单独拿到内容（正则组），做替换，如果是标签节点的话就再做一次循环内部节点
2. 数据劫持：Object.defineProperty()
3. 自定义事件EventTarget() 被继承，调用super(),创建事件`let event = new Event('唯一值')`,传值版创建事件`let event = new CustomEvent(唯一值,{detailL:value})`,派发事件`this.dispatchEvent(event)`,触发函数this.addEventListener('唯一值', e => {'e里面有值'})
4. 