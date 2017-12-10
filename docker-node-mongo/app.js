var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var moment = require('./photo');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 3002;
var router = express.Router();

//mongoose.connect('mongodb://mongo:27017/photos');

mongoose.connect('mongodb://localhost:27017/photos');

router.use(function (req, res, next) {
    // do logging 
    // do authentication 
    console.log('Logging of request will be done here');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/moments').get(function (req, res) {
    moment.find(function (err, moments) {
        if (err) {
            res.send(err);
        }
        res.json(moments);
    });
});


router.route('/moments/:photo_id').get(function (req, res) {

    moment.findById(req.params.photo_id, function (err, moment) {
        if (err)
            res.send(err);
        res.json(moment);
    });
});

// Return selected metadata for image
router.route('/moments/:photo_id/getSelectedData').get(function (req, res) {

    moment.findOne({photoId: req.params.photo_id}, function (err, moment) {
        if (err)
            res.send(err);
        res.json(moment);
    });
});

function getPhotoId(metadata){
    console.log(metadata.body.id);
    var photoid = metadata.body.id;
    console.log("id = "+photoid)
    return photoid

}

function getPhotoSource(metadata){

    var photoSrc = metadata.body.service_type;
    console.log("src = "+photoSrc)
    return photoSrc
}

function checkProcessed(assistantInputs){

    return true
}

function checkAccessible(metadata){
    return true
}

function getImageURL(metadata){
    return "test"
}

function getWDataGoogle(metadata){
    var firstName = "John";
    var lastName = "Smith";
    var employee = {
        "firstName": firstName,
        "lastName": lastName
    }

    return employee
}


function getSelectedDataGoogle(metadata){
    var firstName = "John";
    var lastName = "Smith";
    var employee = {
        "firstName": firstName,
        "lastName": lastName
    }

    return employee
}

function getWData(metadata, src){

    if(src == "google")
        return getWDataGoogle(metadata)
    //else if(source == "Facebook")
      //  return getWDataFacebook(metadata);
}

function getSelectedData(metadata, src){

    if(src == "google")
        return getSelectedDataGoogle(metadata)
    //else if(source == "Facebook")
      //  return getSelectedDataFacebook(metadata);
}

function getMLData(metadata){
    var firstName = "John";
    var lastName = "Smith";
    var employee = {
        "firstName": firstName,
        "lastName": lastName
    }

    return employee
}

router.route('/moments').post(function (req, res) {
    var p = new moment();
    var id = getPhotoId(req);
    var src = getPhotoSource(req);
    p.photoIndex = id;
    p.photoId = src+"_"+id
    p.assistantInputs = getWData(req, src);
    p.MLInputs = getMLData(req);
    p.chosenMetadata = getSelectedData(req, src);
    p.rawMetadata = req;
    p.photoSource = src;
    p.isProcessed = checkProcessed(p.assistantInputs);
    p.isAccessible = checkAccessible(req);
    p.imageURL = getImageURL(req);
    p.initialTimeStamp = new Date();
    p.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
        console.error(err.message);
        res.status(400).send({ error: err })
        //res.status(400).send("unable to save to database");
    });
    /*p.save(function(err, moment) {
    if (err)
      res.send(err);
    //res.send({ message: 'moment created!' });
    res.json(moment);

  });*/
});

/*
router.route('/photos/:photo_id').put(function (req, res) {

    photo.findById(req.params.photo_id, function (err, p) {
        if (err) {
            res.send(err);
        }
        p.photoid = req.body.photoid;
    	p.what = req.body.what;
    	p.when = req.body.when;
    	p.who = req.body.who;
    	p.where = req.body.where;
    	p.why = req.body.why;
    	p.metadata = req.body.metadata;
        p.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Photo updated!' });
        });

    });
});

*/
router.route('/moments/:photo_id').delete(function (req, res) {

    moment.remove({_id: req.params.photo_id}, function (err, prod) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
    })

});

app.use(cors());
app.use('/api', router);
app.listen(port);
console.log('Baycrest API is runnning at ' + port);

