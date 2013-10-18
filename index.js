var request = require('superagent'),
	_ = require('underscore');

//info about the db
request
    .get('http://127.0.0.1:5984')
    .end(function (res) {
        if (res.ok) {
        	console.log(JSON.parse(res.text));
           	// console.log('yay got ' + JSON.stringify(res.text, null, 4));
        } else {
           	console.log('Oh no! error ' + res.text);
        }
    });

//delete db
request
    .del('http://127.0.0.1:5984/toggl')
    .end(function (res) {
        if (res.ok) {
        	console.log(JSON.parse(res.text));
           	// console.log('yay got ' + JSON.stringify(res.text, null, 4));
        } else {
           	console.log('Oh no! error ' + res.text);
        }
    });

//create db
request
    .put('http://127.0.0.1:5984/toggl')
    .end(function (res) {
        if (res.ok) {
        	console.log(JSON.parse(res.text));
           	// console.log('yay got ' + JSON.stringify(res.text, null, 4));
        } else {
           	console.log('Oh no! error ' + res.text);
        }
    });

var getTimeRecords = function (callback) {
	request
	   	.get('https://www.toggl.com/api/v8/time_entries')
	   	.auth('024ef3632096fd0b27b0b0081fc5975e', 'api_token')
	   	.end(function(res){

	   		callback(res);

	});
};

var persistTimeRecord = function (record) {

	//skip time record if tag 'tagged' is present
	if (Array.isArray(record.tags) && typeof _.contains(record.tags, 'tagged')) {
		console.log('logged tag found, skipping...');
		return;
	}
	
	request
	    .put('http://127.0.0.1:5984/toggl/' + record.guid)
        .set('Content-Type', 'application/json')
        .send(record)
        .end(function (res) {
            // console.log(JSON.parse(res.text));
        });
};

getTimeRecords(function (res) {
	var timeRecords = JSON.parse(res.text);
	var i;
	for (i = 0; i < timeRecords.length; i++) {
		persistTimeRecord(timeRecords[i]);
	}
});
   	
