var Crawler = require("crawler");
var _ = require("underscore");
var fs = require('fs');
var FILE = "emails.txt";

var WEBSITE = 'http://rainbowpages.lk';
var DOMAIN = getDomain(WEBSITE);

function getDomain(url) {
    var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    return matches && matches[1];
}
var c = new Crawler({
    maxConnections : 10,
    skipDuplicates : true,
    callback : function (error, result, $) {

        if (error){
            console.log(error);
            return;
        }

        console.log(result.uri || result.url );
        var emails = result.body.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum|lk|me)\b/g);
        _.map(emails, function(email){
            fs.appendFileSync(FILE,email+"\n");
        });

        if ($){
            $('a').each(function(index, a) {
                var toQueueUrl = $(a).attr('href');
                if (toQueueUrl){
                    var domain = getDomain(toQueueUrl);
                    if (DOMAIN == domain || domain == null){
//                console.log(toQueueUrl);
                        c.queue(WEBSITE +toQueueUrl);
                    }
                }
            });
        }

    }
});

c.queue(WEBSITE);
