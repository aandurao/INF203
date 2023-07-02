"use strict";

import { createServer } from "http";
import *  as url from "url";
import * as fs from "fs";
import * as querystring from "querystring";


const port = process.argv[2] || 8000;

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
	'.mjs': 'application/javascript',
	'.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
	'.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg'
};

function webserver(req, res) {

    var url_parse = url.parse(req.url);
    var pathname = url_parse.pathname;

    try {
        if (pathname === "/") {
            // sending the header that says content will be in HTML
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.end("<!doctype html><html><body>Working!</body></html>");
            return;
        }
		
        else if (pathname === "/kill") {
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.end("<!doctype html><html><body>The server will stop now !</body></html>");
			process.exit(0);
            return;
        }

        else if (pathname.startsWith("/Root/")) {

            pathname = pathname.slice(6);
            
            if (pathname.startsWith("..")) {
                throw new Error('403');
            }
            
            if (!fs.existsSync(pathname)) {
                res.writeHeader(404, { 'Content-Type': 'text/html' });
                res.end("<!doctype html><html><body>The file does not exist !</body></html>");
                return;
            } else {
                var data = fs.readFileSync(pathname);
                var ext = pathname.slice(pathname.lastIndexOf('.'));
                res.writeHeader(200, { 'Content-Type': mimeType[ext] });
                res.write(data);
                res.end();
                return;
            }
        }
		
		else if (pathname.startsWith("/Show")) {
            if (!fs.existsSync("storage.json")) {
                throw new Error('404');
            } else {
                var data = fs.readFileSync("storage.json")
                res.writeHeader(200, { 'Content-Type': 'application/json' })
                res.write(data);
                res.end();
                return;
            }
        }

        else if (pathname.startsWith("/add")) {
            let query = querystring.parse(url_parse.query);
			
            var value = query.value;
            var title = query.title;
            var color = query.color;

            if (value == undefined || title == undefined || color == undefined) {
                throw new Error('400');
            }
			
            var data = fs.readFileSync("storage.json");
            var json = JSON.parse(data);
            var new_data = { "title": title, "value": value, "color": color };
            json.push(new_data);
            fs.writeFileSync("storage.json", JSON.stringify(json));
            res.writeHeader(200, { 'Content-Type': 'text/html' });
			res.write("<p>Data successfully added to database !</p>");
            res.end();
            return;
        }
		
		else if (pathname.startsWith("/remove")) {
            let query = querystring.parse(url_parse.query);
            var data = JSON.parse(fs.readFileSync("storage.json"));
            data.splice(query.index, 1);
            fs.writeFileSync("storage.json", JSON.stringify(data));
            res.writeHeader(200);
			res.write("<p>Data successfully removed to database !</p>");
            res.end();
            return;
        }

        else if (pathname.startsWith("/clear")) {
            fs.writeFileSync("storage.json", JSON.stringify([{ "title": "empty", "color": "red", "value": 1 }]));
            res.writeHeader(200);
			res.write("<p>Successfully cleared to database !</p>");
            res.end();
            return;
        }

        else if (pathname.startsWith("/restore")) {
            fs.writeFileSync("storage.json", JSON.stringify([
                {
                    "title": "foo",
                    "color": "red",
                    "value": 20
                },
                {
                    "title": "bar",
                    "color": "ivory",
                    "value": 100
                },
                {
                    "title": "babar",
                    "color": "pink",
                    "value": 0
                }
            ]));
            res.writeHeader(200);
			res.write("<p>Data successfully restored to database !</p>");
            res.end();
            return;
        }
		
		else {
            throw new Error('404');
        }
    } catch (err) {
        if (err.message === '404') {
            res.writeHeader(404, { 'Content-Type': 'text/html' });
            res.end("<!doctype html><html><body>404 Not Found</body></html>");
            return;
        }
        else if (err.message) {
            res.writeHeader(403, { 'Content-Type': 'text/html' });
            res.end("<!doctype html><html><body>404 Access forbidden</body></html>");
            return;
        }
    }
}

const server = createServer(webserver);

server.listen(port, (err) => { });