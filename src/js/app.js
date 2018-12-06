import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let str = '<table>' +
            '<th>Line</th>' +
            '<th>Type</th>' +
            '<th>Name</th>' +
            '<th>Condition</th>' +
            '<th>Value</th>';
        str=makeStr(str,parsedCode);
        str+='</table>';
        $('#exps').html(str);
    });
});




const makeStr = (str,parsedCode)=>
{

    for (let i = 0 ; i < parsedCode.length ; i++)
    {
        let line= parsedCode[i].Line;
        let type= parsedCode[i].Type;
        let name= parsedCode[i].Name;
        let cond= parsedCode[i].Condition;
        let val= parsedCode[i].Val;
        str += '<tr>' +
            '  <td>' + line  + '</td>'+
            ' <td>' + type + '</td>' +
            ' <td>' + name + '</td>' +
            ' <td>' + cond + '</td>' +
            '<td>' + val + '</td>' +
            '</tr>';
    }
    return str;
};

