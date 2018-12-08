import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('test 1 -clean', () => {
        assert.deepEqual(
            (parseCode('','')),
            '<pre></pre>'
        );
    });


    it('test 2 ', () => {
        let inputVars='1,2,3';
        assert.deepEqual(
            (parseCode('function foo(x, y, z){\n' +
                ' let a=2;\n' +
                '}\n',inputVars)),
            '<pre><br>function foo(x,y,z){<br>                     </pre>');
    });
    it('test 3 ', () => {
        let inputVars='1,2,3';
        let input='function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    while (a < z) {\n' +
            '        c = a + b;\n' +
            '        z = c * 2;\n' +
            '    }\n' +
            '    \n' +
            '    return z;\n' +
            '}\n';
        let out='<pre><br>function foo(x,y,z){<br>    while <span style="background-color:green;">(x + 1 < z)</span><br>    {<br>        z = (x + 1 + (x + 1 + y)) * 2;<br>                  <br>    }<br>    return z;<br>                     </pre>';
        assert.deepEqual(
            (parseCode(input,inputVars)),
            out);
    });


    it('test 4 ', () => {
        let inputVars='1,2,3';
        let input='function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n';
        let out='<pre><br>function foo(x,y,z){<br>    if <span style="background-color:red;">(x + 1 + y < z) </span>{<br>        return x + y + z + (0 + 5);<br>               <br>    }<br>     else <br>           if <span style="background-color:green;">(x + 1 + y < z * 2) </span>{<br>        return x + y + z + (0 + x + 5);<br>                          <br>           }<br>            else <br>        return x + y + z + (0 + z + 5);<br>           <br>                     </pre>';
        assert.deepEqual(
            (parseCode(input,inputVars)),
            out);
    });

    it('test 5 ', () => {
        let inputVars='1,2,3';
        let input='function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n';
        let out='<pre><br>function foo(x,y,z){<br>    if <span style="background-color:red;">(x + 1 + y < z) </span>{<br>        return x + y + z + (0 + 5);<br>               <br>    }<br>     else <br>           if <span style="background-color:green;">(x + 1 + y < z * 2) </span>{<br>        return x + y + z + (0 + x + 5);<br>                          <br>           }<br>            else <br>        return x + y + z + (0 + z + 5);<br>           <br>                     </pre>';
        assert.deepEqual(
            (parseCode(input,inputVars)),
            out);
    });

    it('test 6 ', () => {
        let inputVars='5,[90,80,\'etay\']';
        let input='function foo(x,y){\n' +
            '    let a = [x,x+2,x+5];\n' +
            '    let b;\n' +
            '    let c = 10;\n' +
            '    b = a[1]-a[0];\n' +
            '    if(a[b] < c){\n' +
            '      b = 0;\n' +
            '      return y[b];\n' +
            '    }\n' +
            '    else{\n' +
            '       while(y[0] < 150) \n' +
            '       {\n' +
            '         c = c + 2;\n' +
            '         return a[0];\n' +
            '       }\n' +
            '      while(y[0] < 120){\n' +
            '         x = x +1;\n' +
            '         return b + 2;\n' +
            '       }\n' +
            '       b = 0;\n' +
            '      return y[b];\n' +
            '    }\n' +
            '}';
        let out='<pre><br>function foo(x,y){<br>    if <span style="background-color:red;">([\n' +
            '    x,\n' +
            '    x + 2,\n' +
            '    x + 5\n' +
            '][[\n' +
            '    x,\n' +
            '    x + 2,\n' +
            '    x + 5\n' +
            '][1] - [\n' +
            '    x,\n' +
            '    x + 2,\n' +
            '    x + 5\n' +
            '][0]] < 10) </span>{<br>      return y[0];<br>                <br>    }<br>     else <br>       while <span style="background-color:green;">(y[0] < 150)</span><br>       {<br>         return [\n' +
            '    x,\n' +
            '    x + 2,\n' +
            '    x + 5\n' +
            '][0];<br>       <br>       }<br>      while <span style="background-color:green;">(y[0] < 120)</span><br>      {<br>         x = x + 1;<br>         return [\n' +
            '    x,\n' +
            '    x + 2,\n' +
            '    x + 5\n' +
            '][1] - [\n' +
            '    x,\n' +
            '    x + 2,\n' +
            '    x + 5\n' +
            '][0] + 2;<br>                       <br>      }<br>      return y[0];<br>        <br>                 </pre>';
        assert.deepEqual(
            (parseCode(input,inputVars)),
            out);
    });

    it('test 7 ', () => {
        let inputVars='1';
        let input='function foo(x){\n' +
            '    let a=5;\n' +
            '    x=x+a;\n' +
            '}';
        let out='<pre><br>function foo(x){<br>    x = x + 5;<br>               </pre>';
        assert.deepEqual(
            (parseCode(input,inputVars)),
            out);
    });
    it('test 8 ', () => {
        let inputVars='1';
        let input='function foo(x){\n' +
            '    let a=5;\n' +
            '    x=x+a;\n' +
            '    if(x>2){\n' +
            '      return x;\n' +
            '      }\n' +
            '}';
        let out='<pre><br>function foo(x){<br>    x = x + 5;<br>    if <span style="background-color:green;">(x + 5 > 2) </span>{<br>      return x + 5;<br>           <br>    }<br>               </pre>';
        assert.deepEqual(
            (parseCode(input,inputVars)),
            out);
    });

    it('test 9 ', () => {
        let inputVars='1';
        let input='let a=5;\n' +
            'function foo(x){\n' +
            '    let a=5;\n' +
            '    x=x+a;\n' +
            '    if(x>2){\n' +
            '      return x;\n' +
            '      }\n' +
            '}';
        let out='<pre><br>function foo(x){<br>    x = x + 5;<br>    if <span style="background-color:green;">(x + 5 > 2) </span>{<br>      return x + 5;<br>           <br>    }<br>               </pre>';
        assert.deepEqual(
            (parseCode(input,inputVars)),
            out);
    });

    it('test 10 ', () => {
        let inputVars='2';
        let input='let a=5;\n' +
            'function foo(x){\n' +
            '    let a=5;\n' +
            '    x=x+a;\n' +
            '    while(6>7){\n' +
            '    x=x+1;\n' +
            '    }\n' +
            '}';
        let out='<pre><br>function foo(x){<br>    x = x + 5;<br>    while <span style="background-color:red;">(6 > 7)</span><br>    {<br>    x = x + 5 + 1;<br>              <br>    }<br>               </pre>';
        assert.deepEqual(
            (parseCode(input,inputVars)),
            out);
    });

    it('test 11 ', () => {
        let inputVars='1,2,3';
        let input='function foo(x, y, z){ \n' +
            ' x=6;\n' +
            '    if (y>x) {\n' +
            '        return x;\n' +
            '    } \n' +
            '     \n' +
            '}\n';
        let out='<pre><br>function foo(x,y,z){<br> x = 6;<br>    if <span style="background-color:red;">(y > 6) </span>{<br>        return 6;<br>             <br>    }<br>                     </pre>';
        assert.deepEqual(
            (parseCode(input,inputVars)),
            out);
    });


    it('test 12 ', () => {
        let inputVars='1,2,3';
        let input='function foo(x, y, z){ \n' +
            ' let a=7;\n' +
            ' a=a+a;\n' +
            '    if (y>x) {\n' +
            '        return x;\n' +
            '    } \n' +
            '     \n' +
            '}\n';
        let out='<pre><br>function foo(x,y,z){<br>    if <span style="background-color:green;">(y > x) </span>{<br>        return x;<br>             <br>    }<br>                     </pre>';
        assert.deepEqual(
            (parseCode(input,inputVars)),
            out);
    });

    it('test 13 ', () => {
        let inputVars='1,2,3';
        let input='let a=0;\n' +
            'a=a+5;\n' +
            'function foo(x, y, z){ \n' +
            ' let a=7;\n' +
            ' a=a+a;\n' +
            '    if (y>x) {\n' +
            '        return x;\n' +
            '    } \n' +
            '     \n' +
            '}\n';
        let out='<pre><br>function foo(x,y,z){<br>    if <span style="background-color:green;">(y > x) </span>{<br>        return x;<br>             <br>    }<br>                     </pre>';
        assert.deepEqual(
            (parseCode(input,inputVars)),
            out);
    });
});












