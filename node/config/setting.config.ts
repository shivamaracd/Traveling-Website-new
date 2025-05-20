'use strict';
// export const textToSpeech = require('@google-cloud/text-to-speech');
// export const ttsClient = new textToSpeech.TextToSpeechClient({
//     projectId: 'your-project-id',
//     keyFilename: './rmg-dialer-216800-d34497254035.json',
// });
export class Setting {
    KEY = "/etc/httpd/conf/ca.key";
    CERT = "/etc/httpd/conf/ca.crt";
    HTTPS = false;
    PORT = 4220;
    DOMAIN = "localhost";
}

// export class DataBaseConfig {
//   HOST = "192.168.1.8";
//     USER = "celetel_team";
//     PASS = "ASDFGQWERTZXC";
//     NAME = "celetel";
//     PORT = "3306";
// }

// export class DataBaseConfig {
//   HOST = "115.117.3.202";
//     USER = "celetel_team";
//     PASS = "Yn95ph49ph43zYsf!";
//     NAME = "celetel";
//     PORT = "3306";
// }


// export class DataBaseConfig {
//     HOST = "localhost";
//       USER = "root";
//       PASS = "";
//       NAME = "celetel";
//       PORT = "3306";
//   }


export class DataBaseConfig {
    HOST = "localhost";
    USER = "root";
    PASS = "";
    NAME = "rvtracks";
    // PASS = "";
    // HOST = "35.224.177.192";
    // USER = "celetel_team";
    // PASS = "o(DBQ%{$)Yn>?>0?";
    // NAME = "advocate";
    PORT = "3306";



    // HOST = "35.224.177.192";
    // USER = "root";
    // PASS = "o(DBQ%{$)Yn>?>0?";
    // NAME = "advocate";
    // PORT = "3306";
}



export class VoiceServer {
    TYPE = "none";
    HOST = "127.0.0.1";
    USER = "";
    PASS = "ClueCon";
    NAME = "agentstraining";
    PORT = "8021";
    IVR = "";
    CALLERID = '9145806758';
    GATEWAY_PREFIX = '31425366*';
    GATEWAY_NAME = 'flowroute';
}

export class API { }

export class UploadDirectory {
    public UPLOADSDIR = '/Users/shivamagrahari/project/adv/Advocate/node/ploads/';
    public UPLOADSDTMFDIR = 'C:/Users/Admin/Desktop/celetel/angular/src/assets/audiofiles/';
    public UPLOADSVOICEDIR = 'C:/Users/Admin/Desktop/celetel/angular/src/assets/audiofiles/';
    public SETTINGDIR = 'C:/Users/Admin/Desktop/celetel/angular/src/assets/audiofiles/';
    public IMGUPLOADSDIR ='/Users/shivamagrahari/project/adv/Advocate/Angular/src/assets/images/image/';
    public COMPANYDOCS ='D:/Offic/celetel user panel/revisions21082023/angular/src/assets/companydocs/';

}

export class downloadUrl {
    public MYSQLDIR = '/home/dell/projects/trunk/downloads/';
}

export class AssetsPath {
    public SAMPLECSV = "/home/dell/projects/trunk/node/assets/"
}

export const sipDomain = 'http://app.nexcon.com/';

export const sipDomainwithouthttp = 'app.nexcon.com';