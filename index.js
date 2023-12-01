const http = require('http') ; 
const fs = require('fs');
const path = require('path');

let port = 6565;

http.createServer((req, res) =>{
    console.log(req.url);
    if(req.url ==='/'){ // home page
        fs.readFile(path.join(__dirname,'public','index.html'),(err,content)=>{
            if (err) throw err ;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content);
        });
    }
    else if (req.url === '/api'){  // api database
        fs.readFile(path.join(__dirname,'public','db.json'),(err,content)=>{
            if (err) throw err ;
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(content);
        });
    }
    else if (req.url.startsWith('/images/') && !(req.url==='/images/') ){
        fs.readFile(path.join(__dirname, 'public', req.url), (err, content)=>{
            if (err) throw err;
            res.writeHead(200, {'Content-Type': 'image/png'}) //https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
            res.end(content)
        });
    }
    else{
        res.end("<h1>Error 404: Nothing is here</h1>");
    }

    

}).listen(port,()=>console.log(`Server is running on port ${port}`));