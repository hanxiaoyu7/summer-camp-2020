function clear(){

}

window.onload = function(){//一开始就加载
    var text = document.getElementById('text');
    var list = document.getElementById('list0');
    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode==13){
            pressEnter();
        }
    }
    var k1=0;//未完成的待办事项数量
    function pressEnter(){//每点击一次
        if(text.value.trim() == ""){
          return false;
        }

        
        var li = document.createElement("li");//创建元素li（是对象），到后面需要document.body.appendChild(btn);
        li.innerHTML = text.value;//li的文字内容是输入内容
        li.className = "list1";
        var a = null;
//
        var n=null;
        var click = document.createElement("click");
        click.className = "clickoff";
        click.innerHTML = "√";
        click.href = "javascript:;";//??
        click.onclick = function(){
            if(n){
                click.className = "clickoff"; 
                this.parentNode.style.color="rgba(22, 22, 22, 0.692)";//关键：用this.parentNode而不是查找class!若用查找class注意不加[0]是个数组！！所以必须加[i]！！
                n=null;
                li.judge=false;
                k1--;
            }else{
                click.className = "clickon";
                this.parentNode.style.color="rgba(22, 22, 22, 0.2)";
                n=1;
                li.judge=true;
                k1++;
            }
        }
        li.appendChild(click);

        li.onmouseover = function(){//创建一个li新的函数属性——鼠标移动到li上会出现删除板块
            if(a) {
                a.style.display = "inline";//这里是关键！！删掉不可！！改成block,flex均不可！！神奇!!!
            } else {
                    a = document.createElement("a");//创建结点a（是对象）——删除板块
                    a.href = "javascript:;";//？创建一个属性？？去掉没影响
                    a.className = "delete";//对象a对应class，设置其css样式
                    a.innerHTML = "×";
                    a.onclick = function (){//点击a会执行删除函数——删除this.parentNode的结点
                    list.removeChild(this.parentNode);
                };
                this.appendChild(a);//添加a板块
            }
        };

        li.onmouseout = function(){//创建一个li新的函数属性——对于每个li，鼠标移走后a的所有显示、格式清除
                a.style.display = "none";
        };
    
        list.insertBefore(li,list.children[0]);//把li插入到list里的0号位置（最前面），类似document.body.appendChild(btn);的功能
        text.value = "";//清空输入栏

        if(k1>0){
            document.getElementById("k1").innerHTML = " items left";//？？？没用
        }
    };

    
}; 
    
  