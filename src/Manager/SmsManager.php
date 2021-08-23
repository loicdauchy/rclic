<?php

namespace App\Manager;

use CURLFile;

const ERROR_API = "Error during API call\n";
const ERROR_FILE = "The specified file does not exist\n";
const URL = "https://api.smsmode.com/http/1.6/";
const PATH_SEND_SMS = "sendSMS.do";
const PATH_DELETE_SMS = "deleteSMS.do";
const PATH_SEND_SMS_BATCH = "sendSMSBatch.do";
 
/**
*    Function parameters:
*
*    - accessToken (required)
*    - message (required)
*    - destinataires (required): Receivers separated by a comma
*    - emetteur (optional): Allows to deal with the sms sender
*    - optionStop (optional): Deal with the STOP sms when marketing send (cf. API HTTP documentation)
*    - batchFilePath (required for batch mode): The path of CSV file for sms in Batch Mode
*/
 
class SmsManager 
{
    // send SMS with GET method
    public function sendSmsGet($accessToken, $message, $destinataires, $emetteur, $optionStop) 
    {
        $message = iconv("UTF-8", "ISO-8859-15", $message);
        $fields_string = '?accessToken='.$accessToken.'&message='.urlencode($message).'&numero='.$destinataires.'&emetteur='.$emetteur.'&stop='.$optionStop;
    
        $ch = curl_init();
        curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch,CURLOPT_URL, URL.PATH_SEND_SMS.$fields_string);
        $result = curl_exec($ch);
        curl_close($ch);
        if (!$result) {
            return ERROR_API;
        }
        return $result;
    }
    
    // send SMS with POST method
    public function sendSmsPost($accessToken, $message, $destinataires, $emetteur, $optionStop, $date) 
    {
        $message = iconv("UTF-8", "ISO-8859-15", $message);
        $fields_string = 'accessToken='.$accessToken.'&message='.urlencode($message).'&numero='.$destinataires.'&emetteur='.$emetteur.'&stop='.$optionStop.'&date_envoi='.$date;
    
        $ch = curl_init();
        curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch,CURLOPT_URL, URL.PATH_SEND_SMS);
        curl_setopt($ch,CURLOPT_POST, 1);
        curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
        $result = curl_exec($ch);
        curl_close($ch);
        if (!$result) {
            return ERROR_API;
        }
        return $result;
    }

    // send SMS with POST method (Batch)
    public function sendSmsBatch($accessToken, $batchFilePath, $optionStop) 
    {
        if (!file_exists($batchFilePath)) {
            return ERROR_FILE;
        }
    
        $fields_string = '?accessToken='.$accessToken.'&stop='.$optionStop;
        $cfile = new CURLFile($batchFilePath, 'text/csv');
        $data = array('data-binary' => $cfile);
    
        $ch = curl_init();
        curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array( 'content-type: multipart/form-data'));
        curl_setopt($ch,CURLOPT_URL, URL.PATH_SEND_SMS_BATCH.$fields_string);
        curl_setopt($ch,CURLOPT_POST, 1);
        curl_setopt($ch,CURLOPT_POSTFIELDS, $data);
        $result = curl_exec($ch);
        curl_close($ch);
        if (!$result) {
            return ERROR_API;
        }
        return $result;
    }

    public function deleteSms($accessToken, $smsId){
       
        $fields_string = '?accessToken='.$accessToken.'&smsID='.$smsId;
    
        $ch = curl_init();
        curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch,CURLOPT_URL, URL.PATH_DELETE_SMS.$fields_string);
        $result = curl_exec($ch);
        curl_close($ch);
        
        if (!$result) {
            return ERROR_API;
        }
        return $result;
    }
}