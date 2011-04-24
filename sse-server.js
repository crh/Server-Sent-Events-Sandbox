var http = require('http');
var sys = require('sys');
var fs = require('fs');

http.createServer(
    function(req, res) {
        debugHeaders(req);
        if (req.headers.accept && req.headers.accept == 'text/event-stream') {
            if (req.url == '/events') {
                sendSSE(req, res);
            } else {
                res.writeHead(404);
                res.end();
            }
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(fs.readFileSync(__dirname + '/sse.html'));
            res.end();
        }
}).listen(8000);
console.log("Server running at http://localhost:8000");

function debugHeaders(req) {
    sys.puts('URL Path: ' + req.url);
    for (var key in req.headers) {
        sys.puts(key + ': ' + req.headers[key]);
    }
    sys.puts('\n\n');
}

function sendSSE(req, res) {
    res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
    });
    var id = (new Date()).toLocaleTimeString();
    setInterval(function() {
        constructSSE(res, id, (new Date()).toLocaleTimeString());
    }, 1000);
    }

    function constructSSE(res, id, data) {
        res.write('id: ' + id + '\n');
        res.write("data: " + data + '\n\n');
    }

