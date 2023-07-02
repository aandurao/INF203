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

const visitors = []

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

        // /kill” will stop the server.
        else if (pathname === "/kill") {
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.end("<!doctype html><html><body>The server will stop now !</body></html>");
			process.exit(0);
            return;
        }

        else if (pathname.startsWith("/root/")) {

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

        else if (pathname.startsWith("/hi")) {
		
            var query = "name="
			var name = req.url.slice(req.url.lastIndexOf(query) + query.length);
            
            name = querystring.unescape(name);

            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write('hi ' + name, 'utf8');
            res.end();
            return;
        }

        else if (pathname.startsWith("/ciao")) {
		
            var query = "visiteur="
			var visitor = req.url.slice(req.url.lastIndexOf(query) + query.length);
            visitor = visitor.replace( /(<([^>]+)>)/ig, '');
            visitor = querystring.unescape(visitor);
			
			visitor = visitor.replace(/<b>/g, '');

            visitor = visitor.replace(/<script>(.*?)<\/script>/g, '$1');

            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write('ciao ' + visitor + ', the following users have already visited this page: ' + visitors.join(', '), 'utf8');
			res.end();
			visitors.push(querystring.unescape(visitor));
            return;
        }

        else if (pathname.startsWith("/clear")) {
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write('The list of users has been cleared.', 'utf8');
            visitors.length = 0;
            res.end();
            return;
        } else {
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