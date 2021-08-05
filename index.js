const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');


// Bloking, synchronous way
// const textIn = fs.readFileSync('txt/input.txt', 'utf8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('txt/output.txt', textOut);
// console.log('File written!');

// Non-bloking, asynchronous way
// fs.readFile('txt/start.txt', 'utf8', (err, data1) => {
//     fs.readFile(`txt/${data1}.txt`, 'utf8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('txt/append.txt', 'utf8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('txt/final.txt', `${data2}\n${data3}`,'utf8', err => {
//                 console.log('Your file has been written');
//             });
//         });
//     });
// });
// console.log('Will read file! ');

/// Server 

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObj = JSON.parse(data);  


const server = http.createServer((req, res) => {
    
    const { query, pathname } = url.parse(req.url, true);

    // Overview page 
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);

    // Product page 
    } else if(pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output);

    // API 
    } else if (pathname === '/api') {

        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);

    // NOt found
    }else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to req on port 8000');
});