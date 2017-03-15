const express = require('express');
const path = require('path');
const winston = require('winston');

var app = express();
app.use(express.static(path.join('.', 'public')));

var router = express.Router();

const bodyParser = require('body-parser');

app.use(bodyParser.json());


// Create endpoint handlers for oauth2 authorize
router.route('/carddata')
  .post(
    //authorize request
    function(req, res, next) {
      next();
    },
    //process request
    function(req, res, next) {
      winston.debug('request params=' + JSON.stringify(req.params));
      winston.debug('request body=' + JSON.stringify(req.body));
      var result = createEncryptedTrack(req.body);
      console.log(req.body);
      winston.info(result);
      res.json(result);
    }
  );

router.get('/ping', function(req, res, next) {
  res.end('hello');
});


app.use('/v1', router);


// Start the server
var server = app.listen(process.env.PORT, function() {
  winston.info(server.address().port);
});




const Dukpt = require('dukpt');
const encryptionBDK = '0123456789ABCDEFFEDCBA9876543210';
const ksn = 'FFFF9876543210E00008';
const dukpt = new Dukpt(encryptionBDK, ksn);
const moment = require('moment-timezone');

function createEncryptedTrack(opts) {
  var account_number = opts.account_number || '5454545454545454';
    var account_holder_name = opts.account_number || 'test account';
  var cvv = opts.cvv || '999';
  var exp_date = opts.exp_date || '2050-03-05';
  
  exp_date = moment(exp_date);


  var result = {};
  result.account_number = account_number;
  result.last_four = result.account_number.substr(-4);
  result.exp_date = exp_date.format('MMYY');
  result.track_exp_date = exp_date.format('YYMM');
  result.first_six = result.account_number.substr(0, 6);
  result.last_four = result.account_number.substr(-4);
  result.account_holder_name = account_holder_name;
  result.cvv = cvv;

  result.track1 = '%B' + result.account_number + '^' + result.account_holder_name + '^' +
    '17041010001111A123456789012?' + result.track_exp_date + "12000000153000000?";

  result.track2 = ';' + result.account_number + '=' +
    result.track_exp_date + '1011000012345678?';

  result.ingenico_keyed_data = result.account_number + '=' + result.track_exp_date + '=' + result.cvv;

  result.track1_encrypted = dukpt.dukptEncrypt(result.track1, dukpt.options);
  result.track2_encrypted = dukpt.dukptEncrypt(result.track2, dukpt.options);
  result.ingenico_keyed_data_encrypted = dukpt.dukptEncrypt(result.ingenico_keyed_data, dukpt.options);

  result.trackfull = result.track1 + result.track2;
  result.e_track_data = result.trackfull + '00|' + result.track1_encrypted + '|' + result.track2_encrypted;
  
  
  result.encryptionBDK = encryptionBDK;
  result.ksn = ksn;

  return result;
}
