const path = require('path');
const http = require('http');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.route('/').get((req, res) => {
  res.sendFile(path.join(__dirname+'/testclient.html'));
});


app.listen(8080, () => {

});
// const fs = require('fs');
// const path = require('path');
// const http = require('http');
// const https = require('https');
// const axios = require('axios');
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const yargs = require('yargs');

// const { ports, ssl, proxies, migrationUrl } = require('./config/config-server');
// const defaultserver = {
//   id: "34.125.114.43:8000"
// }
// const argv = yargs.option('httpOnly', {
//   alias: 'http',
//   type: 'boolean',
//   description: 'Run the server without HTTP.',
//   default: false,
// }).parse();

// const checkLoginResponse = (loginDataString) => {
//   if (loginDataString.charAt(0) === ']') {
//     const loginData = JSON.parse(loginDataString.substring(1));
//     return loginData.actionsuccess === true;
//   }

//   return false;
// };

// const checkRegisteredResponse = (loginDataString) => {
//   if (loginDataString.charAt(0) === ']') {
//     const loginData = JSON.parse(loginDataString.substring(1));
//     return !('actionerror' in loginData);
//   }

//   return false;
// };

// const app = express();
// app.use(cors());

// app.use(bodyParser.urlencoded({ extended: true }));
// app.post(`/~~${defaultserver.id}/action.php`, (request, response, next) => {
//   try {
//     if (request.body.act && request.body.act === 'register') {
//       return response.send(']{"actionerror":"Please register on https:\/\/play.pokemonshowdown.com\/."}')
//     }
  
//     let headers = {};
//     const cookieHeader = request.headers['Cookie'] || request.headers['cookie'];
//     if (cookieHeader) {
//       headers.cookie = cookieHeader;
//     }
  
//     const requestOptions = {
//       method: 'POST',
//       url: 'http://play.pokemonshowdown.com/action.php?serverid={}&act=' + request.body.act,
//       data: request.body,
//       headers,
//     };
  
//     if (proxies && proxies.length) {
//       const proxy = proxies[Math.floor(Math.random() * proxies.length)];
//       requestOptions.proxy = {
//         protocol: proxy.protocol | 'http',
//         host: proxy.ip,
//         port: proxy.port,
//       };
  
//       if (proxy.username) {
//         requestOptions.proxy.auth = {
//           username: proxy.username,
//           password: proxy.password || '',
//         };
//       }
//     }
  
//     axios(requestOptions).then((res) => {
//       const setCookieHeader = res.headers['Set-Cookie'] || res.headers['set-cookie'];
//       if (setCookieHeader) {
//         if (Array.isArray(setCookieHeader)) {
//           setCookieHeader.forEach((header) => {
//             response.setHeader('set-cookie', header.replace('pokemonshowdown.com', defaultserver.clientHost));
//           });
//         } else {
//           response.setHeader('set-cookie', setCookieHeader.replace('pokemonshowdown.com', defaultserver.clientHost));
//         }
//       };
//       if (migrationUrl) {
//         if (migrationUrl && (request.body.act === 'login') && checkLoginResponse(res.data)) {
//           if ((request.body.act === 'login') && checkLoginResponse(res.data)) {
//             const migrationRequestOptions = {
//               method: 'POST',
//               url: migrationUrl,
//               data: {
//                 username: request.body.name,
//                 password: request.body.pass,
//                 cpassword: request.body.pass,
//                 captcha: 'pikachu',
//                 challstr: "MEMES",
//               },
//             };
//             try {
//               axios(migrationRequestOptions).then((res) => {
//                 if (checkRegisteredResponse(res.data)) {
//                   console.log('registered: ' + request.body.name);
//                 }
//               }).catch((e) => { console.log(e) });
//             } catch (e) {
//               console.log(e);
//             }
//           }
//         }
//       }

//       response.send(res.data);
//     })
//     .catch((error) => next(error));
//   } catch (error) {
//     next(error);
//   }
// });
// app.use('*.php', (request, response) => response.sendStatus(404));
// app.get('/lobby-banner', (request, response) => {
//   const banners = fs.readdirSync('./banners');
//   const banner = banners[Math.floor(Math.random() * banners.length)];

//   response.sendFile(path.join(__dirname, 'banners', banner));
// });
// app.get('*', (request, response, next) => {
//   if (request.path.startsWith('/sprites/afd')) {
//     const afdPath = path.join(__dirname, 'public', request.path);
//     if (!fs.existsSync(afdPath)) {
//       return response.redirect(request.path.replace('/sprites/afd', '/sprites/gen5'));
//     }
//   }

//   next();
// });
// app.use(express.static('./public', { index: 'index.html', fallthrough: true }));
// app.get('*', (request, response) => {
//   response.sendFile(path.join(__dirname, './public/index.html'));
// });

// if (argv.httpOnly) {
//   const httpServer = http.createServer(app);
//   httpServer.listen(ports.http, () => console.log(`Listening on ${ports.http}`));
// } else {
//   // const privateKey  = fs.readFileSync(ssl.privateKeyPath, 'utf8');
//   // const certificate = fs.readFileSync(ssl.certificatePath, 'utf8');

//   const httpRedirectApp = express();
//   httpRedirectApp.use('*', (request, response) => {
//     response.redirect("https://" + request.headers.host + request.url);
//   });

//   const httpRedirectServer = http.createServer(httpRedirectApp);
//   // const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

//   httpRedirectServer.listen(ports.http, () => console.log(`Http redirect listening on ${ports.http}`));
//   // httpsServer.listen(ports.https, () => console.log(`Listening on ${ports.https}`));
// }