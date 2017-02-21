# Nos-PDF #

Authored by IBI Data

## Usage ##

The PDF module can be used with callbacks or promises. No special setup required.


### Callbacks ###

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

### Promises ###
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


## Methods ##

### fillForm ###

> Fills PDF forms

#### Arguments ####

**options** {Object}

- **options.src** {String} *null*

    - The path to your PDF template

- **options.dest** {String} *null*

    - Destination path of newly created PDF. If omitted, file will only be sent to browser, not saved.

- **options.data** {Object} *null*

    - Data to fill PDF form.

- **options.flatten** {Boolean} *true*

    - Flatten PDF. This makes it uneditable. If you select false, it may be editable in the browser.

### stamp ###

> Stamp one PDF onto another (stamps all pages)

#### Arguments ####

**options** {Object}

- **options.src** {String} *null*

    - The path to your PDF to be stamped

- **options.stampFile** {String} *null*

    - The path to your PDF that you wish to stamp on the src (works best as transparent)

- **options.dest** {String} *null*

    - Destination path of newly created PDF. If omitted, file will only be sent to browser, not saved.

- **options.flatten** {Boolean} *true*

    - Flatten PDF. This makes it uneditable. If you select false, it will be editable in the browser.

### multiStamp ###

> Stamp one PDF onto another (stamps each page to corresponding page of input PDF)

#### Arguments ####

**options** {Object}

- **options.src** {String} *null*

    - The path to your PDF to be stamped

- **options.stampFile** {String} *null*

    - The path to your PDF that you wish to stamp on the src (works best as transparent)

- **options.dest** {String} *null*

    - Destination path of newly created PDF. If omitted, file will only be sent to browser, not saved.

- **options.flatten** {Boolean} *true*

    - Flatten PDF. This makes it uneditable. If you select false, it will be editable in the browser.



### generateXfdf ###

> Transform JSON object into XFDF file.

#### Arguments ####

**data** {Object} *null*

    - Data to convert to XFDF file