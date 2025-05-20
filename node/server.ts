import https from "https";
import http from "http";
import express from 'express';
import session from "express-session";
import bodyParser from 'body-parser';
import path from "path";
import fs from 'fs';
//import HashMap from 'hashmap';
import cookieParser from "cookie-parser";
//import { SocketIO } from "./include/io.sockets";
import { Request, Response, NextFunction } from "express";
var net = require('net');
const CRLF = "\r\n";
const END = "\r\n\r\n";
var client = new net.Socket();

const swaggerUi = require('swagger-ui-express');
const YMLJS = require('yamljs');

import {VoiceServer, Setting} from './config/setting.config';
import { Res406 } from "./lib/view/406";
import { getMod, cursess, sessiondata } from "./config/module.config";
import { SessionManagment } from "./lib/model/Session";
const vs_server=new VoiceServer();
const setting=new Setting();
const app = express();

app.use(bodyParser.urlencoded({  limit: '20mb',
parameterLimit: 100000,
extended: true }));
app.use(bodyParser.json({
  limit: '20mb'
}));
app.use(cookieParser());
app.use(function(req:Request, res:Response, next:NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const swaggerDocument = YMLJS.load(process.cwd() + "/swagger/swagger.yml");

// Swagger configuration options
const options = {
  swaggerDefinition: {
    openapi: '3.0.0', // or the version you're using
    info: {
      title: 'Celetel API Platform',
      version: '1.0.0',
      // description: `Every API request authenticates the user, which you may do through the customer's site by creating tokens.
      // Customers can now use the same or different tokens for each activity they make, thanks </br>to a single management location.
      // Log in to the portal, then go to the API Menu and select "Tokens" from the submenu.
      // To make a token, go to the right upper corner and click "Add Token."
      // There will be a pop-up window. Choose the function (s) to link to the token.`,
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes in your project
};


// app.use('/v1.0/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));


app.use((req: Request, res: Response, next: NextFunction)=>{
  let url=req.url.split("?");
  // console.log("URL::", url[0])
  if(url[0]=="/loginuser" || url[0]=='/dnclist'|| url[0]=='/crmlabel' ||  url[0]== '/forgotpassword' || url[0]== '/confirmationotp' || url[0]=='/updatepassword' || url[0]== '/signup' || url[0]== '/logout' || url[0]== '/change_password' || url[0]== '/getcrmdata' || url[0]== '/apilogin')
  
  {
    next();
  }
  else
  {
    if(req.method=="OPTIONS")
    {
      res.status(200).send();
    }
    else{
      let sess=new SessionManagment(req, res, next);
      /* console.log("Main file further "+req.url);
      console.log("Current session key "+req.headers.authorization); */
      sess.GetSession((error, data)=>{
        if(error==1)
        {
          cursess.session=data;
          cursess.error=0;
        }
        else
        {
          let objv=new Res406(res)
          objv.prepare("Error in session");
          objv.execute();
        }
        next();
      });
    }
  }
});

//app.use(session({secret:"gventureworksforyou", resave: false, saveUninitialized: false}));

var routes = require('./routes/routes.class'); //importing route


if(vs_server.TYPE.toLowerCase()=="freeswitch")
{
  client.connect(vs_server.PORT, vs_server.HOST, function () {
    // console.log('CONNECTED TO: ' + vs_server.HOST + ':' + vs_server.PORT);
    client.write('auth '+vs_server.PASS+'\n\n');
    // console.log("Password : "+vs_server.PASS);
  });
}

if(vs_server.TYPE.toLowerCase()=="asterisk"){
  client.connect(vs_server.PORT, vs_server.HOST, function () {
    // console.log('CONNECTED TO: ' + vs_server.HOST + ':' + vs_server.PORT);
    var obj = { Action: 'Login', Username: vs_server.USER, Secret: vs_server.PASS, ActionID:1};
    var str = '';
    Object.entries(obj).forEach(([key, value]) => {
        str += (key + ": " + value + CRLF);
    });
    str+=CRLF;
    client.write(str, 'ascii');
  });
}

//HTTPS server
if(setting.HTTPS){
  let serversocket= new https.Server({});
  const options = {
    key: fs.readFileSync(setting.KEY),
    cert: fs.readFileSync(setting.CERT),
    // ca: [
    //   fs.readFileSync(setting.CA)
    // ]
  };
  
  serversocket = https.createServer(options, app);

  if(vs_server.TYPE!="none"){
    const io = require("socket.io").listen(serversocket);
     //var iosocket = new SocketIO(io, client); 
  }

  app.set("port", process.env.PORT || setting.PORT);
  routes(app); //register the route

  const server = serversocket.listen(app.get("port"),setting.DOMAIN, () => {
    console.log("  App is running at https://localhost:%d in %s mode",setting.DOMAIN,
      app.get("port"),
      //app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
  });
}
//HTTP server generation setting with complete socket
else
{
  let serversocket= new http.Server();
  serversocket = http.createServer(app);
  if(vs_server.TYPE!="none"){
    const io = require("socket.io").listen(serversocket);
     //var iosocket = new SocketIO(io, client); 
  }

  app.set("port", process.env.PORT || setting.PORT);
  routes(app); //register the route

  const server = serversocket.listen(app.get("port"),setting.DOMAIN, () => {
    console.log("  App is running at http://localhost:%d in %s mode",setting.DOMAIN,
      app.get("port"),
      //app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
  });

  
}














//------------------------------------------------- server setup ---------------------------------------//

// import https from "https";
// import http from "http";
// import express from 'express';
// import session from "express-session";
// import bodyParser from 'body-parser';
// import path from "path";
// import fs from 'fs';
// //import HashMap from 'hashmap';
// import cookieParser from "cookie-parser";
// //import { SocketIO } from "./include/io.sockets";
// import { Request, Response, NextFunction } from "express";
// var net = require('net');
// const CRLF = "\r\n";
// const END = "\r\n\r\n";
// var client = new net.Socket();

// import {VoiceServer, Setting} from './config/setting.config';
// import { Res406 } from "./lib/view/406";
// import { getMod, cursess, sessiondata } from "./config/module.config";
// import { SessionManagment } from "./lib/model/Session";
// const vs_server=new VoiceServer();
// const setting=new Setting();
// const app = express();

// app.use(bodyParser.urlencoded({  limit: '20mb',
// parameterLimit: 100000,
// extended: true }));
// app.use(bodyParser.json({
//   limit: '20mb'
// }));
// app.use(cookieParser());
// app.use(function(req:Request, res:Response, next:NextFunction) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
//   next();
// });

// app.use((req, res, next)=>{
//   let url=req.url.split("?");
//   if(url[0]=="/login" || url[0]=='/getaudio' || url[0]=='/gettmpaudio')
//   {
//     next();
//   }
//   else
//   {
//     if(req.method=="OPTIONS")
//     {
//       res.status(200).send();
//     }
//     else{
//       let sess=new SessionManagment(req, res, next);
//       /* console.log("Main file further "+req.url);
//       console.log("Current session key "+req.headers.authorization); */
//       sess.GetSession((error, data)=>{
//         if(error==1)
//         {
//           cursess.session=data;
//           cursess.error=0;
//         }
//         else
//         {
//           let objv=new Res406(res)
//           objv.prepare("Error in session");
//           objv.execute();
//         }
//         next();
//       });
//     }
//   }
// });

// //app.use(session({secret:"gventureworksforyou", resave: false, saveUninitialized: false}));

// var routes = require('./routes/routes.class'); //importing route


// if(vs_server.TYPE.toLowerCase()=="freeswitch")
// {
//   client.connect(vs_server.PORT, vs_server.HOST, function () {
//     console.log('CONNECTED TO: ' + vs_server.HOST + ':' + vs_server.PORT);
//     client.write('auth '+vs_server.PASS+'\n\n');
//     console.log("Password : "+vs_server.PASS);
//   });
// }

// if(vs_server.TYPE.toLowerCase()=="asterisk"){
//   client.connect(vs_server.PORT, vs_server.HOST, function () {
//     console.log('CONNECTED TO: ' + vs_server.HOST + ':' + vs_server.PORT);
//     var obj = { Action: 'Login', Username: vs_server.USER, Secret: vs_server.PASS, ActionID:1};
//     var str = '';
//     Object.entries(obj).forEach(([key, value]) => {
//         str += (key + ": " + value + CRLF);
//     });
//     str+=CRLF;
//     client.write(str, 'ascii');
//   });
// }

// //HTTPS server
// if(setting.HTTPS){
//   let serversocket= new https.Server();
//   const options = {
//     key: fs.readFileSync(setting.KEY),
//     cert: fs.readFileSync(setting.CERT)
//   };
  
//   serversocket = https.createServer(options, app);

//   if(vs_server.TYPE!="none"){
//     const io = require("socket.io").listen(serversocket);
//      //var iosocket = new SocketIO(io, client); 
//   }

//   app.set("port", process.env.PORT || 3090);
//   routes(app); //register the route

//   const server = serversocket.listen(app.get("port"), () => {
//     console.log("  App is running at https://localhost:%d in %s mode",
//       app.get("port"),
//       //app.get("env")
//     );
//     console.log("  Press CTRL-C to stop\n");
//   });
// }
// //HTTP server generation setting with complete socket
// else
// {
//   let serversocket= new http.Server();
//   serversocket = http.createServer(app);
//   if(vs_server.TYPE!="none"){
//     const io = require("socket.io").listen(serversocket);
//      //var iosocket = new SocketIO(io, client); 
//   }

//   app.set("port", process.env.PORT || setting.PORT);
//   routes(app); //register the route

//   const server = serversocket.listen(app.get("port"), () => {
//     console.log("  App is running at http://localhost:%d in %s mode",
//       app.get("port"),
//       //app.get("env")
//     );
//     console.log("  Press CTRL-C to stop\n");
//   });
// }