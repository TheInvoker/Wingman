var express = require('express');
var app = express();
var fs = require('fs');
var handlebars = require('handlebars');

    
var RENDER_ERROR = "Error occured on server when rendering view.";

handlebars.registerHelper("inc", function(value, options) {
    return parseInt(value) + 1;
});

function isMobile(req) {
    var ua = req.headers['user-agent'];
    return /mobile/i.test(ua);
}

// set up view rendering using handlebars
function renderView(sourceFile, jsonObj, callback) {
    fs.readFile(sourceFile, function(err, data){
        if (!err) {
            // make the buffer into a string
            var source = data.toString();
            // call the render function
            callback(200, renderToString(source, jsonObj));
        } else {
            // handle file read error
            callback(500, RENDER_ERROR);
        }
    });
}
function renderToString(source, data) {
    var template = handlebars.compile(source);
    var outputString = template(data);
    return outputString;
}




app.use(express.static(__dirname + '/public'));


/*
 * Visit the home page.
 */
app.get('/', function (req, res) {
	res.redirect('/welcome');
});

app.get('/welcome', function (req, res) {
	fs.readFile(__dirname + '/res/strings.json', 'utf8', function (err, res_data) {
		if (err) throw err;
		var res_data = JSON.parse(res_data);
		
		fs.readFile(__dirname + '/res/refs.html', 'utf8', function (err, ref_data) {
			if (err) throw err;
			res_data["meta_js_css_references"] = ref_data;
			
			var filename = __dirname + (isMobile(req) ? '/views/welcome_mobile.html' : '/views/welcome.html');
			renderView(filename, res_data, function(code, str) {
				res.writeHead(code); 
				res.end(str);
			});
		});
	});
});

app.get('/tou', function (req, res) {
	fs.readFile(__dirname + '/res/strings.json', 'utf8', function (err, res_data) {
		if (err) throw err;
		var res_data = JSON.parse(res_data);
		
		fs.readFile(__dirname + '/res/refs.html', 'utf8', function (err, ref_data) {
			if (err) throw err;
			res_data["meta_js_css_references"] = ref_data;
			
			var filename = __dirname + (isMobile(req) ? '/views/tou_mobile.html' : '/views/tou.html');
			renderView(filename, res_data, function(code, str) {
				res.writeHead(code); 
				res.end(str);
			});
		});
	});
});


var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Wingman started at http://%s:%s', host, port);
});