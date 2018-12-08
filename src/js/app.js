import $ from 'jquery';
import {parseCode} from './code-analyzer';
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let vars =  $('#varsPlace').val();
        let parsedCode = parseCode(codeToParse,vars);
        //console.log(parsedCode);
        $('#parsedCode').html(parsedCode);

    });
});







