const http = require('http');
const fs = require('fs');
const querystring = require("querystring");
const {json} = require("body-parser");
const parseString = require('xml2js').parseString;
const xmlBuilder = require('xmlbuilder');
let mp = require('multiparty');

const server = http.createServer((req, res) => {
    //-------------1------------------
    if (req.method === 'GET' && req.url === '/connection') {
        // Если запрос на /connection без параметра set
        const keepAliveTimeout = server.keepAliveTimeout;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`KeepAliveTimeout: ${keepAliveTimeout}`);
    } else if (req.method === 'GET' && req.url.startsWith('/connection')) {
        //-------------2------------------
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        console.log(urlParams);
        if (urlParams.has('set')) {
            const newTimeout = parseInt(urlParams.get('set'), 10);
            if (!isNaN(newTimeout)) {
                server.keepAliveTimeout = newTimeout;
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(`New KeepAliveTimeout set to: ${server.keepAliveTimeout}`);
                return;
            }
        }
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('Bad Request: Invalid or missing "set" parameter');
    }
    else if(req.method === "GET" && req.url === "/headers") {
        //-------------3------------------
        const allHeaders = req.headers;

        let headersString = 'All Headers:\n';
        for (const headerName in allHeaders) {
            headersString += `${headerName}: ${allHeaders[headerName]}<br>`;
        }
        res.end(`<p>${headersString}</p>`);
    }
    else if(req.method === "GET" && req.url.startsWith("/parameter") && req.url.indexOf('?') !== -1) {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);

        const paramsArray = Array.from(urlParams);

        const xParam = paramsArray.find(([name]) => name === 'x');
        const yParam = paramsArray.find(([name]) => name === 'y');

        const x = +(xParam ? xParam[1] : null);
        const y = +(yParam ? yParam[1] : null);
        if(x === null || y === null || isNaN(x) === true || isNaN(y) === true) {
            res.end('<h1>Error: x or y is not a number.</h1>');
            return;
        }
        const sum = x + y;
        const dif = x - y;
        const mull = x * y;
        const div = x / y;
        res.end(`<h1>Sum: ${sum}<br>Difinition: ${dif}<br>Mulltiply: ${mull}<br>Divine:${div}</h1>`);
    }
    else if(req.method === "GET" && req.url.startsWith('/parameter')) {
        //-------------4------------------
        const params = req.url.split('/');
        let x = +params[2];
        let y = +params[3];
        console.log(params);
        if(isNaN(x) || isNaN(y)) {
            res.end(`<h1>http://${req.headers.host}${req.url}</h1>`);
            return;
        }
        
        const sum = x + y;
        const dif = x - y;
        const mull = x * y;
        const div = x / y;
        res.end(`<h1>Sum: ${sum}<br>Difinition: ${dif}<br>Mulltiply: ${mull}<br>Divine:${div}</h1>`);
        
    }
    else if(req.method === "GET" && req.url === "/socket") {
        //-------------5---------------
        res.end(`<h1>Client IP: ${req.connection.remoteAddress}; Client Port:${req.connection.remotePort}<br>
                     Server IP: ${req.connection.localAddress}; Server Port:${req.connection.localPort}</h1>`)
    }
    else if(req.method === "GET" && req.url.startsWith("/resp-status")) {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
    
        const paramsArray = Array.from(urlParams);
    
        const code = paramsArray.find(([name]) => name === 'code');
        const mess = paramsArray.find(([name]) => name === 'mess');
        
        if (code && mess) {
            res.writeHead(code[1], mess[1], { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('Code: ${code[1]}<br>Mess: ${mess[1]}');
            return;
        }
        res.writeHead(404,  { 'Content-Type': 'text/html; charset=utf-8' })
        res.end("<h1>Invalid params!</h1>")
    }
    else if(req.url === "/formparameter" && req.method === "GET") {
        //--------------7------------
        const html = fs.readFileSync("index.html");
        res.end(html);
    }
    else if(req.url === "/formparameter" && req.method === "POST") {
        let data = '';
        let formData;
        req.on('data', chunk => data+=chunk);

        req.on('end', () => {
            formData = querystring.parse(data);
            res.end(`<h1>First input: ${formData.input1}<br>Second input: ${formData.input2}<br>
                 Date: ${formData.date}<br> Radio: ${formData.radio}<br> Checkbox: ${formData.check}<br>
                 Textarea: ${formData.textarea}</h1> Submit: ${formData.sumb}</h1> `)
        });

    }
    else if(req.method === "POST" && req.url === "/json") {
        //-----------8----------------

        //{
        //     "__comment": "Запрос.Лабараторная 8/10",
        //     "x":1,
        //     "y":2,
        //     "s":"Сообщение",
        //     "m":["a","b","c","d"],
        //     "x_plus_y": 3,
        //     "o":{"surname":"Иванов", "name":"Иван"}
        // }

        let incomedata = '';
        req.on('data', chunk => incomedata += chunk)
        req.on('end', () => {
            let data = JSON.parse(incomedata);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                "__comment": "Ответ.Лабараторная 8/10",
                "x_plus_y": data.x + data.y,
                "Concatination_s_o": `${data.s}: ${data.o.surname}, ${data.o.name}`,
                "Length_m": data.m.length
            }));
        })

    }
    else if(req.method === "POST" && req.url === "/xml") {
        let xmlString = '';
       // <request id="28">
            //<x value = "1"/>
            //<x value = "2"/>
            //<m value = "a"/>
            //<m value = "b"/>
            //<m value = "c"/>
        //</request>

        req.on('data', data => {
            xmlString += data.toString();
        });
        req.on('end', () => {
            parseString(xmlString, (err, result) => {
                if (err) {
                    res.end(`<result>parseString returned error: ${err}</result>`);
                    return;
                }
                let sum = 0;
                let mess = '';
                result.request.x.forEach(el => {
                    sum += Number.parseInt(el.$.value);
                })
                result.request.m.forEach(el => {
                    mess += el.$.value;
                })

                let xmlDoc = xmlBuilder.create('response')
                    .att('id', +result.request.$.id + 10)
                    .att('request', result.request.$.id);
                xmlDoc.ele('sum', {element: 'x', sum: `${sum}`});
                xmlDoc.ele('concat', {element: 'm', result: `${mess}`});
                let rc = xmlDoc.toString({pretty: true});
                res.writeHead(200, {'Content-Type': 'text/xml; charset=utf-8'});
                res.end(rc);
            });
        })
    }
//--10
    else if(req.method === "GET" && req.url.startsWith("/files")) {

        let filename = req.url.split('/')[2];
        if(filename !== undefined) {
            try {
                let file = fs.readFileSync(`./static/${filename}`);
                res.end(file);
                return;
            }
            catch (e) {
                res.writeHead(404, 'Resource not found', {'Content-Type': 'text/html; charset=utf-8'});
                res.end("<h1>404: Error file not founded</h1>");
            }
        }
        else {
            fs.readdir('./static', (err, files) => {
                if (err) {
                    res.end('<h1>Unable to find ./static directory<h1>');
                    return;
                }
                res.setHeader('X-static-files-count', `${files.length}`);
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(`<h1>Count of files in ./static directory: ${files.length}.</h1>`);
            });
        }
    }
    
    else if(req.method === "GET" && req.url === "/upload") {
        let html = fs.readFileSync("upload.html");
        res.end(html);
    }
    else if(req.method === "POST" && req.url === "/upload") {
        if (req.method === 'GET') {
            res.end(fs.readFileSync('./upload.html'))
        }

        else if (req.method === 'POST') {
            let form = new mp.Form({ uploadDir: './static' });
            form.on('file', (name, file) => {
                console.log(`name = ${name}; original filename: ${file.originalFilename}; path = ${file.path}`);
            });
            form.on('error', err => { res.end(`<h1>form returned error: ${err}</h1>`) });
            form.on('close', () => {
                res.end('<h1>File successfully uploaded.</h1>');
            });
            form.parse(req);
        }

    }
    else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
