const Dukpt = require('dukpt');
const encryptionBDK = '0123456789ABCDEFFEDCBA9876543210';
const ksn = 'FFFF9876543210E00008';
const dukpt = new Dukpt(encryptionBDK, ksn);
const moment = require('moment-timezone');

trackdata = createEncryptedTrack('5454545454545454','test account','999','123 main street','53805','2050-05-25');

console.log(trackdata);

function createEncryptedTrack(account_number,account_holder_name,cvv,billing_street,billing_zip,exp_date)
{
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
    result.billing_street = billing_street;
    result.billing_zip = billing_zip

    result.track1 = '%B' + result.account_number + '^' + result.account_holder_name + '^'
        + '17041010001111A123456789012?' + result.track_exp_date + "12000000153000000?";

    result.track2 = ';' + result.account_number + '='
        + result.track_exp_date + '1011000012345678?';

    result.ingenico_keyed_data = result.account_number + '=' + result.track_exp_date + '=' + result.cvv;

        result.track1_encrypted = dukpt.dukptEncrypt(result.track1, dukpt.options);
        result.track2_encrypted = dukpt.dukptEncrypt(result.track2, dukpt.options);
        result.ingenico_keyed_data_encrypted = dukpt.dukptEncrypt(result.ingenico_keyed_data, dukpt.options);

    result.trackfull = result.track1 + result.track2;
    result.e_track_data = result.trackfull + '00|' + result.track1_encrypted + '|' + result.track2_encrypted;

    return result;
}

