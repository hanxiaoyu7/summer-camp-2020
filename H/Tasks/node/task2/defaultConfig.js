module.exports = {
  root:process.cwd(),//process.cwd()是当前执行node命令时候的文件夹地址（工作目录）//???怎么设置固定地址？
  hostname:'127.0.0.1',//127.0.0.1是回送地址，指本地机
  port:9527//这个端口号可以√
}

console.log(__filename);