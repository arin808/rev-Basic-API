// Create mock array of items
const groceryList = [
    { id: 1, productName:"Cookies", price: 9.99, qty: 3, purchased: false },
    { id: 2, productName: "Milk", price: 4.99, qty: 2, purchased: false },
    { id: 3, productName: "Whipped Cream", price: 2.99, qty: 2, purchased: false}];

//Winston logger setup
const { createLogger, transports, format} = require('winston');

// Create the logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'basicAPI.log'}),
    ]
});

// Http setup
const http = require("http");
const url = require("node:url");

const PORT = 3000;

const server = http.createServer((req, res) => {
    // GET (view the list)
    if(req.method === 'GET' && req.url === '/api/groceryList'){
        logger.info("Full grocery list viewed");
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(groceryList));
        
    // POST (add an item to the list)
    }else if(req.method === 'POST' && req.url === '/api/addItem'){
        res.writeHead(200, { 'Content-Type': 'application/json'});
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const newItem = JSON.parse(body);
            groceryList.push(newItem);
            logger.info(`New item added: ${newItem.productName}`);
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Item successfully added to the list'}));
        })

    // PUT (edit an item)
    }else if(req.method === 'PUT'){
        res.writeHead(200, { 'Content-Type': 'application/json'});
        // Id from url param
        const id = url.parse(req.url).query;
        // Subtract to find index
        const index = id - 1;
        let body = '';
        req.on('data', (chunk) =>{
            body += chunk;
        });
        req.on('end', () => {
            const updatedItem = JSON.parse(body);
            // Reassign object and index to the updated item
            logger.info(`Item was updated: ${updatedItem.productName}`);
            groceryList[index] = updatedItem;
            res.writeHead(201, { 'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Item successfully changed.'}));
        });

    // DELETE (remove an item from the list)
    }else if(req.method === 'DELETE'){
        // Take id from url param
        const id = url.parse(req.url).query;
        // Subtract to find index
        const index = id - 1;
        // Delete and print message to user
        const deletedItem = groceryList[index];
        groceryList.splice(index, 1).productName;
        logger.info(`Item was deleted: ${deletedItem.productName}`);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Item successfully deleted'}));
    }else{
        // If request not found, default to message
        logger.warn("Bad request made");
        res.writeHead(404, { 'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});