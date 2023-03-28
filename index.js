var express = require('express');
const carbone = require('blinked-carbon');
var fs = require("fs");
var mime = require('mime');
var bodyParser = require('body-parser');
const { Readable } = require('stream');
const path = require( "path" );
const log = console.log;


const app = express()
const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})

app.post('/api/template/render', function (req, res) {
  var template = req.body.template;
  var templatePath = 'template/'+template.templatePath;
  var fileName = template.fileName;
  var mimetype = template.mimetype;
  var data = req.body.content.data;

  try {
    //options

    carbone.render(templatePath, data, function (err, result) {
      if (err) return console.log(err);

      // console.log(result instanceof Buffer);

      res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
      if (mimetype)
        res.setHeader('Content-type', mimetype);

      const stream = Readable.from(result);
      stream.pipe(res);

      // fs.writeFileSync('./result.pdf', result);
      // fs.writeFileSync(fileName, result);
      log("File has been Generated successfully", fileName);
    });
  } catch (e) {
    const errorMsg = {
      message: "Coudn't render template",
      error: e
    }
    return res.send(errorMsg);
  }

});


// Export the Express API
module.exports = app
