// /*global require*/
//
// let request = require('request');
// let twig = require("twig");
//
// class ConfluenceService {
//     constructor(config) {
//         this.config = config;
//         this.templatePath = 'view/table.html.twig';
//     }
//
//     createPage({title, spaceKey, content}) {
//         return new Promise(function (fulfill, reject) {
//             request.post(this.config.baseUrl + '/rest/api/content', {
//                 type: 'page',
//                 title: title,
//                 space: {
//                     key: spaceKey
//                 },
//                 body: {
//                     storage: {
//                         value: content,
//                         representation: 'storage'
//                     }
//                 }
//             }, function (err, response, body) {
//                 if (err) {
//                     return reject(err);
//                 }
//
//                 fulfill(body);
//             });
//         });
//     }
//
//     updatePage(pageId) {
//         let config = this.config;
//         let templatePath = this.templatePath;
//
//         return new Promise(function (fulfill, reject) {
//             let options = {
//                 'foo': 'toob # ' + new Date().getTime()
//             };
//
//             request.get(config.baseUrl + '/rest/api/content/' + pageId, {
//                 auth: {
//                     user: config.username,
//                     pass: config.password
//                 }
//             }, function (err, res, body) {
//                 if (err) {
//                     return reject(err);
//                 }
//
//                 let page = JSON.parse(body);
//
//                 twig.renderFile(templatePath, options, function (err, content) {
//                     if (err) {
//                         return reject(err);
//                     }
//
//                     let data = {
//                         id: page.id,
//                         type: page.type,
//                         title: page.title,
//                         space: {
//                             key: page.space.key
//                         },
//                         body: {
//                             storage: {
//                                 value: content,
//                                 representation: 'storage'
//                             }
//                         },
//                         version: {
//                             number: page.version.number + 1
//                         }
//                     };
//
//                     request.put({
//                         url: config.baseUrl + '/rest/api/content/' + page.id,
//                         auth: {
//                             user: config.username,
//                             pass: config.password
//                         },
//                         json: true,
//                         headers: {
//                             "content-type": "application/json"
//                         },
//                         body: data
//                     }, function (err, response, body) {
//                         if (err) {
//                             reject(err);
//                         } else {
//                             fulfill(body);
//                         }
//                     });
//                 });
//             });
//         });
//     }
// }
//
// module.exports = ConfluenceService;