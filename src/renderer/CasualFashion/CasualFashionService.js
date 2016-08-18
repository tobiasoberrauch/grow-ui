"use strict";

var events = require('events');
var async = require('async');

const RestClient = require('./RestClient');
const IndentAnalyser = require('./IndentDataService');


export default class CasualFashionService extends events.EventEmitter {
  constructor() {
    super();

    this.indentService = new RestClient('casualfashion/report/indent');
    this.cronjobService = new RestClient('casualfashion/cronjob');
  }

  getIndents(cb) {
    this.indentService.run(cb);
  }

  getCronjobs(cb) {
    this.cronjobService.run(cb);
  }

  run() {
    async.parallel([
        callback => {
          this.indentService.run((err, indents) => {
            let indentAnalyser = new IndentAnalyser(indents);

            let content = [{
              label: 'Fehlgeschlagene Zahlungen',
              indents: indentAnalyser.getFailedIndents()
            }];

            let html = [];
            for (let element of content) {
              html.push("<h2>" + element.label + "</h2>");
              html.push("<table>");
              html.push('<thead class="thead-default">');
              html.push("<tr>");
              html.push("<th>ID</th>");
              html.push("<th>created</th>");
              html.push("<th>sumtotal</th>");
              html.push("<th>indentstatus_name</th>");
              html.push("<th>paymentmethod_name</th>");
              html.push("<th>piecestotal</th>");
              html.push("</tr>");
              html.push('</thead>');
              html.push("<tbody>");
              for (let indent of element.indents) {
                html.push("<tr>");
                html.push("<td>" + indent.id + "</td>");
                html.push("<td>" + indent.created + "</td>");
                html.push("<td>" + indent.sumtotal + "</td>");
                html.push("<td>" + indent.indentstatus_name + "</td>");
                html.push("<td>" + indent.paymentmethod_name + "</td>");
                html.push("<td>" + indent.piecestotal + "</td>");
                html.push("</tr>");
              }
              html.push("</tbody>");
              html.push("</table>");
            }

            callback(null, html);
          });
        },
        callback => {
          this.cronjobService.run((err, cronjobs) => {
            let html = [];
            let failedCronjobs = cronjobs.filter(cronjob => cronjob.laststatuscode != "200");

            html.push('<table class="table">');
            html.push('<thead class="thead-default">');
            html.push('<tr>');
            html.push('<th>ID</th>');
            html.push('<th>url</th>');
            html.push('<th>laststatuscode</th>');
            html.push('<th>lastruntime</th>');
            html.push('<th>lastexecution</th>');
            html.push('<th>schedule</th>');
            html.push('</tr>');
            html.push('</thead>');

            html.push("<tbody>");
            for (let failedCronjob of failedCronjobs) {
              html.push('<tr>');
              html.push('<td>' + failedCronjob.id + '</td>');
              html.push('<td>' + failedCronjob.url + '</td>');
              html.push('<td>' + failedCronjob.laststatuscode + '</td>');
              html.push('<td>' + failedCronjob.lastruntime + '</td>');
              html.push('<td>' + failedCronjob.lastexecution + '</td>');
              html.push('<td>' + failedCronjob.schedule + '</td>');
              html.push('</tr>');
            }
            html.push("</tbody>");
            html.push('</table>');

            callback(null, html);
          });
        }
      ],
      (err, results) => {
        let html = ["<h1>" + new Date().getTime() + "</h1>"].concat(results);
        document.querySelector('#content').innerHTML = html.join(' ');
      }
    );
  }
}
