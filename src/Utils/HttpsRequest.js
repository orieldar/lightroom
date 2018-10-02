
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Prepare the tools */
var PDFExtract = require('pdf.js-extract').PDFExtract;
var pdfjsLib = require('pdfjs-dist');
var fs = require('fs');
var https = require("https");
var Parser = require('./Parser')
var pdfExtract = new PDFExtract();

exports.httpstart = function (department,sem) {
    /************************    Request    **************************/
    /* Prepare the request */
    var options = {
        host: "reports4u.bgu.ac.il",
        path: "/reports/rwservlet?cmdkey=PROD&server=rep_aristo4stu4_FRHome1&report=acrr008w&desformat=pdf&DESTYPE=cache&P_YEAR=2019&P_SEMESTER=1&P_INSTITUTION=0&"
            + "P_DEGREE_LEVEL=1&P_DEPARTMENT=373&P_GLOBAL_COURSES=1&P_PATH=1&P_SPEC=1&P_YEAR_DEGREE=3&P_SORT=1&P_WEB=1&P_SPECIAL_PATH=0&P_KEY=",
        method: "GET"
    };
    /* Send the request */
    var req = https.request(options, function (res) {
        var resBody = "";
        res.setEncoding("base64");
        /* Aggrigate all the data from the website by base64 encoding to resBody variable */
        res.on('data', function (chunk) {
            resBody += chunk;
        });
        /* When finish aggrigate all the data from the website by base64 encoding to resBody variable , convert resBody to PDF document by getDocument() method */
        res.on("end", function () {
            pdfjsLib.getDocument({ data: atob(resBody) }).then(function getPdfHelloWorld(pdf) {
                /* Extract all the data as tokens from the PDF document */
                pdfExtract.test(pdf).then(function () {
                    var data = pdfExtract.getData();
                    var lines = PDFExtract.utils.pageToLines(data.pages[0], 2); // If you want to change page of the PDF, change the index ==> data.pages[i]
                    Parser.InsertPageToMap(lines);
                    console.log(Parser.courses.get("125.1.0059").lectures[0].sessions[0]);
                });
            });
        });
    });
    req.end();
};
