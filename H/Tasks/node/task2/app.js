const chalk = require('chalk');//用来改变控制台输出字体颜色
const config = require('./defaultConfig.js');
const path = require("path");
const url = require("url");
const fs = require("fs");
const http = require("http");
const mime = require("mime");//mime指文件类型，包括text-plain(文本文件默认值)，application/octet-stream（应用程序文件默认值）等等
const marked = require("marked");

let root = path.resolve("public/catalog");
 
var server = http.createServer(function(req,res){
	let pathname = url.parse(req.url).pathname;//指url路径
	if (pathname === "/") {//如果没有就创建一个
    pathname = "/index.html";
  }
	let filepath = path.join(config.root, pathname).replace(/%20/g, " ");//root结合url形成文件路径
	let ext = path.parse(filepath).ext;//path.parse表示path的有效元素，是个对象，ext部分指文件后缀名
  let mimeType = mime.getType(ext) || "";//根据后缀名获取文件类型
	const filePath = path.join(config.root,req.url);//root结合url形成文件路径
	console.info("path",`${chalk.green(filePath)}`)
	fs.stat(filePath,(err,stats)=>{//fs.stat(path,callback),读取文件的状态；
		if(err){//说明这个文件不存在或错误
			console.log(err)
			res.statusCode = 404;//http状态码，4开头表示请求错误，5开头表示服务器错误，2开头表示成功，3开头重定向
			res.setHeader('Content-Type','text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
			res.end(`${filePath} is not a directory or file.`)
			return;
		}
		if(stats.isFile()){//如果是文件
			//res.statusCode = 200;
			//res.setHeader('Content-Type','text/javascript;charset=UTF-8');
			//var extname=path.extname(filePath);
				if (mimeType && !mimeType.startsWith("text")) {//如果非文本文件而是二进制文件
					let range = req.headers.range || "bytes=0-";//大概是获取二进制码？
					let positions = range.replace("bytes=", "").split("-");//replace查找并替换，split() 方法用于把一个字符串分割成字符串数组
					let start = parseInt(positions[0], 10);//parseInt解析一个字符串返回整数，以10为基数，返回十进制数
					fs.stat(filepath, function (err, stat) {
						if (err) {//如果文件出错
							res.end("<h1>404 Not Found</h1>");
						}
						else {//如果文件正常
							let total = stat.size;//文件长度（stat命令用于显示文件的状态信息）
							let end = positions[1] ? parseInt(positions[1], 10) : total - 1;//开始处理二进制码的第二节（数组的第二个元素），如果存在则也返回整数，否则返回total-1
							let chunkSize = (end - start) + 1;//第二节-第一节+1
							res.writeHead(206, {//设置响应头，有write和set两种方法
								"Content-Type": mimeType,
								"Content-Length": chunkSize,
								"Content-Range": `bytes ${start}-${end}/${total}`,
								"Accept-Ranges": "bytes"
							});
							let stream = fs.createReadStream(filepath, { start: start, end: end })//开启可读流
								.on("error", function () {//服务器出错
									res.writeHead(500, { "Content-Type": mimeType });
									res.end("<h1>500 Server Error</h1>");
								})
								.on("open", function () {//正常
									stream.pipe(res);//输出流
								})
						}
					});
				}
				else {//如果是文本文件
					fs.readFile(filepath, "utf-8", function (err, data) {//异步读取文件
						if (!err) {//无错误
							//处理markdown
							if (mimeType === "text/markdown") {
								res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });//设置响应头
								res.write(marked(data));
							}
							//处理其他文本文件
							else {
								res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });//设置响应头
								res.writeHead(200, { "Content-Type": mimeType });
								res.write(data);
							}
							res.end();
						}
						else {//文件错误
							res.writeHead(404);
							res.end("<h1>404 Not Found</h1>");
						}
					});
				}
		}else if (stats.isDirectory()) {//如果是文件夹，拿到文件列表
			fs.readdir(filePath,(err,files)=>{//files是个数组
				res.statusCode = 200;
				res.setHeader('Content-Type','text/html;charset=UTF-8');//设置响应头
        res.write('<html><body><div>')//输出html内容
        var html= '';//初始化元素html
        for(let i=0;i<files.length;i++){//
            html+='<button style="width: 130px;height: 40px;background: linear-gradient(to bottom, #4eb5e5 0%,#389ed5 100%);border: none;border-radius: 5px;position: relative;border-bottom: 4px solid #2b8bc6;color: #fbfbfb;font-weight: 600;font-family:Open Sans, sans-serif;text-shadow: 1px 1px 1px rgba(0,0,0,.4);font-size: 15px;text-align: left;text-indent: 5px;box-shadow: 0px 3px 0px 0px rgba(0,0,0,.2);cursor: pointer;display: block;margin: 0 auto;margin-bottom: 20px;"><a style="text-decoration:none;display:block" href="http://127.0.0.1:9527'+ 
                    req.url+'/'+files[i]+'">'+files[i]+'</a></button><br><br>';
        }
        res.write(html);//返回所有的文件名
        res.end('</div></body></html>')
				//res.end(files.join(','));//返回所有的文件名
			})
		}
	})
});
 
server.listen(config.port,config.hostname,()=>{
	var addr = `http://${config.hostname}:${config.port}`;
	console.info(`listenning in:${chalk.green(addr)}`);	
})