#Nos-PDF

Authored by IBI Data

##Usage

The PDF module can be used with callbacks or promises. No special setup required.


###Callbacks

```javascript
app.get(`${config.site.url}/example.pdf`, (req, res, next) => {

    let pdf = require('nos-pdf');

    let options = {
        src: './path/to/pdf/template.pdf',
        data: {
            customernm: 'john',
            email: 'johndoe@email.com'
        },
        flatten: true
    };

    pdf.fillForm(options, (err, file) {
        if (err) return next(err);
        res.type('application/pdf'); // IF YOU WANT TO SEND THE FILE TO THE BROWSER. OMIT THIS IF YOU WANT IT TO DOWNLOAD.
        res.send(file);
    });

});

```

###Promises
```javascript
app.get(`${config.site.url}/example.pdf`, (req, res, next) => {

    let pdf = require('nos-pdf');

    let options = {
        src: './path/to/pdf/template.pdf',
        data: {
            customernm: 'john',
            email: 'johndoe@email.com'
        },
        flatten: true
    };

    pdf.fillForm(options)

    .then(file => {
        res.type('application/pdf'); // IF YOU WANT TO SEND THE FILE TO THE BROWSER. OMIT THIS IF YOU WANT IT TO DOWNLOAD.
        res.send(file);
    })

    .catch(err => {
        return next(err);
    });

});
```

##Options

- **src** <String> - The path to your PDF template.
- **data** <Object> - JSON object with data to fill PDF form.
- **flatten** <Boolean> - Flatten PDF. This makes it uneditable. If you select false, it will be editable in the browser.


##Methods

- **fillForm**
- **stamp**
- **generateXfdf**