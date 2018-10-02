"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PDFExtract = require('pdf.js-extract').PDFExtract;
var pdfjsLib = require('pdfjs-dist');
var fs = require('fs');
var https = require("https");
var pdfExtract = new PDFExtract();
var Parser = require('./Parser')
var courses = new Map();
exports.start = function (data)
{
    return new Promise(function ( resolve , reject){
       pdfjsLib.getDocument({ data: atob(data) }).then(function getPdfHelloWorld(pdf) {
            /* Extract all the data as tokens from the PDF document */
                pdfExtract.test(pdf).then(function () {
                var new_courses;
                var data = pdfExtract.getData();
                for(var i=0 ; i < data.pages.length; i++){
                    var lines = PDFExtract.utils.pageToLines(data.pages[i], 2); // If you want to change page of the PDF, change the index ==> data.pages[i]
                new_courses = new Map([...courses, ...Parser.InsertPageToMap(lines)]) ;
                }
                
               //console.log(JSON.stringify(exports.courses.get("202.1.3021") , null,2));
                //console.log(courses.get("153.1.5041").lectures[0].sessions[0]);
                resolve(new_courses)
            });
        }); });
}
