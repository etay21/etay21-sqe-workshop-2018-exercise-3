import $ from 'jquery';
import {parseCode} from './code-analyzer';
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let vars =  $('#varsPlace').val();
        let parsedCode = parseCode(codeToParse,vars);
        //console.log(parsedCode);
        //$('#parsedCode').html(parsedCode);
        const diagram = flowchart.parse(parsedCode);
        const opt={
            'x': 0,
            'y': 0,
            'line-width': 3,
            'line-length': 50,
            'text-margin': 10,
            'font-size': 14,
            'font-color': 'black',
            'line-color': 'black',
            'element-color': 'black',
            'fill': 'white',
            'yes-text': 'yes',
            'no-text': 'no',
            'arrow-end': 'block',
            'scale': 1,
            // style symbol types
            'symbols': {
                'start': {
                    'font-color': 'red',
                    'element-color': 'green',
                    'fill': 'yellow'
                },
                'end':{
                    'class': 'end-element'
                }
            },
            // even flowstate support ;-)
            'flowstate' : {
                'past' : { 'fill' : '#CCCCCC', 'font-size' : 12},
                'current' : {'fill' : 'yellow', 'font-color' : 'red', 'font-weight' : 'bold'},
                'future' : { 'fill' : '#FFFF99'},
                'request' : { 'fill' : 'blue'},
                'green': {'fill' : '#444444'},
                'red': {'fill' : '#444444'},
                'approved' : { 'fill' : '#58C4A3', 'font-size' : 12, 'yes-text' : 'APPROVED', 'no-text' : 'n/a' },
                'rejected' : { 'fill' : '#C45879', 'font-size' : 12, 'yes-text' : 'n/a', 'no-text' : 'REJECTED' }
            }
        };
        diagram.drawSVG('diagram', opt);
    });
});







