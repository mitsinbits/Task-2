var express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require("path")
const {GridFsStorage} = require('multer-gridfs-storage');
MONGO_URL="mongodb://localhost:27017/imagesInMongoApp"

var mongoose = require("mongoose")
var fs = require('fs');

require('dotenv/config');

//const storage = new GridFsStorage({ url });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }, err => {
      console.log('connected')
  });

  var imgModel = require('./model');

var multer = require('multer');
const { application } = require('express');
var upload = multer({dest:'uploads/'});
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var upload = multer({ 
  storage: storage,
  limits : {fileSize : 1000000},
  fileFilter : function fileFilter (req, file, cb) {    
    // Allowed ext
    if (file.mimetype == "image/png" || file.mimetype == "application/pdf" || file.mimetype == "image/jpeg" || file.mimetype == "application/octet-stream") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .pdf, .docx and .jpeg format allowed!'));
    }
  }
 })

//app.use(upload)
app.post('/single', upload.single('profile'), (req, res, error) => {

  var obj = {
    name : req.file.filename,
    img: {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: req.file.mimetype
    }
}
imgModel.create(obj, (err, item) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("upload to db")
        res.send("Uploaded Successfully")

    }
});
    // try {
      
    //   res.send(req.file);
    // }catch(err) {
    //   res.send(400);
    // }
  });
app.get('/', (req, res) => {
    res.send('hello Guys');
});
app.listen(port, () => {
    console.log('listening to the port: ' + port);
});