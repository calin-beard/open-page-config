var fs = require('fs'),
    opn = require('opn'),
    readline = require('readline');

//define function that writes an array to a file from the specified path
function writeToFile(array, path) {
    var file = fs.createWriteStream(path);
    file.on('error', function (err) {
        if (err) {
            console.log(err);
        }
    });
    array.forEach(function (e, i) {
        file.write(e + '\n');
    });
    file.end();
}

fs.readFile(process.argv[2], 'utf8', function (err, data) {
    if (err) {
        console.error(err);
    }

    var searchRegex = /\d{7}/ig;
    var dataArray = data.split('=');
    var pageIds = dataArray.filter(function (v, i) {
        return v.match(searchRegex);
    }).map(function(e, i) {
        /*if (i === 0) {
            return e;
        } else {*/
        return e.split('\n')[0];
        //}
    });

    console.log(pageIds);

    //log the array
    pageIds.map(function (e, i) {
        console.log('#' + i + '  -  ' + e);
    });

    //write all the subdomains to file
    writeToFile(pageIds, 'pageIds.txt');

    //open all the subdomains in admin/domains search page
    //bulks of 5 using cli
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Open the ADMIN links? ', function (answer) {
        if (answer === 'y') {
            pageIds.forEach(function (e, i) {
                opn('https://app.instapage.com/admin/pages/configuration-edit/' + e, {
                    app: 'google chrome'
                }, false);
            });
        } else {
            return;
        }
        rl.close();
    });
});
