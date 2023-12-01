const http = require('http') ; 
const fs = require('fs');
const path = require('path');
const {MongoClient} = require('mongodb'); 

let port = 6565;

async function getData(client){    
    const cursor = client.db('Castlevania').collection("GameInfo").find({});
    const results = await cursor.toArray();
    const js = JSON.stringify(results);
    return js;
}

async function apiCall(){
    const uri = "mongodb+srv://Declan:Straut@cluster0.yua7efv.mongodb.net/?retryWrites=true&w=majority&authMechanism=DEFAULT";

    const client = new MongoClient(uri);
    let data;
    
    try{
        await client.connect();
        console.log("Connected to database")
        data = await getData(client);
    }
    catch(err){
        console.log(err);
    }
    finally{
        await client.close();
        console.log("Closed connection to database")
    }
    return data;

}

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
        apiCall().then((data)=>{
            res.writeHead(200, {'Content-Type': 'application/json',
                                'access-control-allow-origin': '*'});
            res.end(data);
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
