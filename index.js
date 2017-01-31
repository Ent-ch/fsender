var fs = require('fs');
var fsmonitor = require('fsmonitor');
var watchPath = '.';

var monitor = fsmonitor.watch(watchPath, {
    matches: function(relpath) {
        // return relpath.match(/\.js$/i) !== null;
        return true;
    },
    excludes: function(relpath) {
        return relpath.match(/^\.git$/i) !== null;
    }
});
monitor.on('change', function(changes) {
    var addedFiles = changes.addedFiles;
    if (addedFiles.length) {
        for (var i = 0; i < addedFiles.length; i++) {
            var element = watchPath + '/' + addedFiles[i];
            console.log(element);
            fs.readFile(element, 'utf8', function(err, contents) {
                SendMail(contents);
            });
        }
    }
});

function SendMail(text) {
    var nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: 'user@gmail.com',
            pass: 'pass'
        }
    }));

    var mailOptions = {
        from: '"User" <user@gmail.com>',
        to: 'user@mail.com',
        subject: 'Hello ✔',
        text: text,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}