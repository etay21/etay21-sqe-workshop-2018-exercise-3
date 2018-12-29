import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
describe('The javascript parser', () => {

    it('test 0 -clean', () => {
        let inputVars1='1,2,3';
        let expect1='st=>start: Start|green\n' +
            'let0=>operation: (0) \n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0\n' +
            '|green\n' +
            'return0=>operation: (1) \n' +
            'return z|green\n' +
            'st->let0\n' +
            'let0->return0\n';
        var result1 = parseCode('function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   return z;\n' +
            '}',inputVars1);

        assert.deepEqual(result1,expect1);

    });
    it('test 1 -clean', () => {
        var inputVars2='1,2,3';
        var expect2='st=>start: Start|green\n' +
            'return0=>operation: (0) \n' +
            'return z|green\n' +
            'st->return0\n';
        var result2=parseCode('function foo(x, y, z){\n' +
            '    return z;\n' +
            '}',inputVars2);
        assert.deepEqual(expect2,result2);

    });

    it('test 3 -clean', () => {
        let expect3='st=>start: Start|green\n' +
            'let0=>operation: (0) \n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0\n' +
            '|green\n' +
            'null0=>operation: (1) \n' +
            'null|green\n' +
            'while0=>condition: (2) \n' +
            'a < z|green\n' +
            'ass0=>operation: (3) \n' +
            'c = a + b\n' +
            'z = c * 2\n' +
            'a++\n' +
            '|green\n' +
            'return0=>operation: (4) \n' +
            'return z|green\n' +
            'st->let0\n' +
            'null0->while0\n' +
            'let0->null0\n' +
            'while0(yes)->ass0\n' +
            'ass0->null0\n' +
            'while0(no)->return0\n';
        let inputVars3='1,2,3';
        let result3=parseCode('function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n',inputVars3);
        assert.deepEqual(expect3,result3)
        ;
    });

    it('test 4 -clean', () => {
        let inputVars4='1,2,3';
        let expect4=parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n',inputVars4);
        let result4='st=>start: Start|green\n' +
            'let0=>operation: (0) \n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0\n' +
            '|green\n' +
            'if0=>condition: (1) \n' +
            'b < z|green\n' +
            'ass0=>operation: (2) \n' +
            'c = c + 5\n' +
            '|red\n' +
            'if1=>condition: (3) \n' +
            'b < z * 2|green\n' +
            'ass1=>operation: (4) \n' +
            'c = c + x + 5\n' +
            '|green\n' +
            'ass2=>operation: (5) \n' +
            'c = c + z + 5\n' +
            '|red\n' +
            'null2=>operation: (6) \n' +
            'null|green\n' +
            'null0=>operation: (7) \n' +
            'null|green\n' +
            'return0=>operation: (8) \n' +
            'return c|green\n' +
            'st->let0\n' +
            'let0->if0\n' +
            'if0(yes)->ass0\n' +
            'ass0->null0\n' +
            'if0(no)->if1\n' +
            'if1(yes)->ass1\n' +
            'ass1->null2\n' +
            'if1(no)->ass2\n' +
            'ass2->null2\n' +
            'null2->null0\n' +
            'null0->return0\n';
        assert.deepEqual(expect4,result4)
        ;
    });

    it('test 5 -clean', () => {
        let expect5=parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        while(3>2){\n' +
            '         a++;\n' +
            '           }\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}','1,2,3');
        let result5='st=>start: Start|green\n' +
            'let0=>operation: (0) \n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0\n' +
            '|green\n' +
            'if0=>condition: (1) \n' +
            'b < z|green\n' +
            'null1=>operation: (2) \n' +
            'null|green\n' +
            'while0=>condition: (3) \n' +
            '3 > 2|red\n' +
            'ass0=>operation: (4) \n' +
            'a++\n' +
            '|green\n' +
            'null0=>operation: (5) \n' +
            'null|green\n' +
            'return0=>operation: (6) \n' +
            'return c|green\n' +
            'st->let0\n' +
            'let0->if0\n' +
            'null1->while0\n' +
            'if0(yes)->null1\n' +
            'while0(yes)->ass0\n' +
            'ass0->null1\n' +
            'while0(no)->null0\n' +
            'null0->return0\n';
        assert.deepEqual(expect5,result5)
        ;
    });

    it('test 6 -clean', () => {
        let expect6='st=>start: Start|green\n' +
            'ass0=>operation: (0) \n' +
            'x = x + 1\n' +
            '|green\n' +
            'null0=>operation: (1) \n' +
            'null|red\n' +
            'while0=>condition: (2) \n' +
            'x < x|green\n' +
            'ass1=>operation: (3) \n' +
            'x++\n' +
            '|red\n' +
            'ass2=>operation: (4) \n' +
            'y[2] = 2\n' +
            '|green\n' +
            'return0=>operation: (5) \n' +
            'return z|green\n' +
            'st->ass0\n' +
            'null0->while0\n' +
            'ass0->null0\n' +
            'while0(yes)->ass1\n' +
            'ass1->null0\n' +
            'while0(no)->ass2\n' +
            'ass2->return0\n';
        let result6=parseCode('function foo(x, y, z){\n' +
            'x=x+1;\n' +
            '   while (x< x) {\n' +
            '       x++;\n' +
            '   }\n' +
            '  y[2]=2;\n' +
            '   return z;\n' +
            '}','1,[2,3],3');
        assert.deepEqual(expect6,result6)
        ;
    });

    it('test 7 -clean', () => {
        let expect7=parseCode('function foo(x, y, z){\n' +
            'x=x+1;\n' +
            '   while (x< x+1) \n' +
            '       x++;\n' +
            '  if(x>2)\n' +
            '    x=x+3;\n' +
            'else\n' +
            'x++;\n' +
            '   return z;\n' +
            '}','1,2,3');
        let result7='st=>start: Start|green\n' +
            'ass0=>operation: (0) \n' +
            'x = x + 1\n' +
            '|green\n' +
            'null0=>operation: (1) \n' +
            'null|green\n' +
            'while0=>condition: (2) \n' +
            'x < x + 1|green\n' +
            'ass1=>operation: (3) \n' +
            'x++|green\n' +
            'if0=>condition: (4) \n' +
            'x > 2|green\n' +
            'ass2=>operation: (5) \n' +
            'x = x + 3|red\n' +
            'ass3=>operation: (6) \n' +
            'x++|green\n' +
            'null1=>operation: (7) \n' +
            'null|green\n' +
            'return0=>operation: (8) \n' +
            'return z|green\n' +
            'st->ass0\n' +
            'null0->while0\n' +
            'ass0->null0\n' +
            'while0(yes)->ass1\n' +
            'ass1->null0\n' +
            'while0(no)->if0\n' +
            'if0(yes)->ass2\n' +
            'ass2->null1\n' +
            'if0(no)->ass3\n' +
            'ass3->null1\n' +
            'null1->return0\n';
        assert.deepEqual(expect7,result7)
        ;
    });

    it('test 8 -clean', () => {
        let expect8=parseCode('function foo(x, y, z){\n' +
            'let c,d;\n' +
            'x=x+1;\n' +
            '   while (x< x+1) \n' +
            '       x++;\n' +
            '  if(x>2)\n' +
            '    x=x+3;\n' +
            'else if(x>2)\n' +
            'x--;\n' +
            'else\n' +
            'x++;\n' +
            '   return z;\n' +
            '}','1,2,3');
        let result8='st=>start: Start|green\n' +
            'let0=>operation: (0) \n' +
            'c\n' +
            'd\n' +
            '|green\n' +
            'ass0=>operation: (1) \n' +
            'x = x + 1\n' +
            '|green\n' +
            'null0=>operation: (2) \n' +
            'null|green\n' +
            'while0=>condition: (3) \n' +
            'x < x + 1|green\n' +
            'ass1=>operation: (4) \n' +
            'x++|green\n' +
            'if0=>condition: (5) \n' +
            'x > 2|green\n' +
            'ass2=>operation: (6) \n' +
            'x = x + 3|red\n' +
            'if1=>condition: (7) \n' +
            'x > 2|green\n' +
            'ass3=>operation: (8) \n' +
            'x--|red\n' +
            'ass4=>operation: (9) \n' +
            'x++|green\n' +
            'null3=>operation: (10) \n' +
            'null|green\n' +
            'null1=>operation: (11) \n' +
            'null|green\n' +
            'return0=>operation: (12) \n' +
            'return z|green\n' +
            'st->let0\n' +
            'let0->ass0\n' +
            'null0->while0\n' +
            'ass0->null0\n' +
            'while0(yes)->ass1\n' +
            'ass1->null0\n' +
            'while0(no)->if0\n' +
            'if0(yes)->ass2\n' +
            'ass2->null1\n' +
            'if0(no)->if1\n' +
            'if1(yes)->ass3\n' +
            'ass3->null3\n' +
            'if1(no)->ass4\n' +
            'ass4->null3\n' +
            'null3->null1\n' +
            'null1->return0\n';
        assert.deepEqual(expect8,result8)
        ;
    });

    it('test 9 -clean', () => {
        let expect9=parseCode('function foo(x, y, z){\n' +
            'let c,d;\n' +
            'x=2;\n' +
            '}','1,2,3');
        let result9='st=>start: Start|green\n' +
            'let0=>operation: (0) \n' +
            'c\n' +
            'd\n' +
            '|green\n' +
            'ass0=>operation: (1) \n' +
            'x = 2\n' +
            '|green\n' +
            'st->let0\n' +
            'let0->ass0\n';
        assert.deepEqual(expect9,result9)
        ;
    });
    it('test 10 -clean', () => {
        let expect10=parseCode('function foo(x, y, z){\n' +
            'let c,d;\n' +
            'x--;\n' +
            'return x;\n' +
            '}','1,2,3');
        let result10='st=>start: Start|green\n' +
            'let0=>operation: (0) \n' +
            'c\n' +
            'd\n' +
            '|green\n' +
            'ass0=>operation: (1) \n' +
            'x--\n' +
            '|green\n' +
            'return0=>operation: (2) \n' +
            'return x|green\n' +
            'st->let0\n' +
            'let0->ass0\n' +
            'ass0->return0\n';
        assert.deepEqual(expect10,result10);
    });
    it('test 11 -clean', () => {
        let expect11=parseCode('function foo(x){\n' +
            'let z=8;\n' +
            'return x;\n' +
            '}','1');
        let result11='st=>start: Start|green\n' +
            'let0=>operation: (0) \n' +
            'z = 8\n' +
            '|green\n' +
            'return0=>operation: (1) \n' +
            'return x|green\n' +
            'st->let0\n' +
            'let0->return0\n';
        assert.deepEqual(expect11,result11);
    });
    it('test 12 -clean', () => {
        let expect12=parseCode('function foo(x){\n' +
            'if(x>8){\n' +
            'if(x>9){\n' +
            'x++;\n' +
            '}\n' +
            'else{\n' +
            'x--;\n' +
            '}\n' +
            '}\n' +
            '}\n' +
            '\n','1');
        let result12='st=>start: Start|green\n' +
            'if0=>condition: (0) \n' +
            'x > 8|green\n' +
            'if1=>condition: (1) \n' +
            'x > 9|red\n' +
            'ass0=>operation: (2) \n' +
            'x++\n' +
            '|red\n' +
            'ass1=>operation: (3) \n' +
            'x--\n' +
            '|red\n' +
            'null1=>operation: (4) \n' +
            'null|green\n' +
            'null0=>operation: (5) \n' +
            'null|green\n' +
            'st->if0\n' +
            'if0(yes)->if1\n' +
            'if1(yes)->ass0\n' +
            'ass0->null1\n' +
            'if1(no)->ass1\n' +
            'ass1->null1\n' +
            'null1->null0\n';
        assert.deepEqual(expect12,result12);
    });
    it('test 13 -clean', () => {
        let expect13=parseCode('function foo(x){\n' +
            'let z=[1,2,3];\n' +
            'while(3>x[2])\n' +
            '{\n' +
            'z[1]=4;\n' +
            '}\n' +
            'return z[1];\n' +
            '}\n' +
            '\n','1');
        let result13='st=>start: Start|green\n' +
            'let0=>operation: (0) \n' +
            'z = [\n' +
            '    1,\n' +
            '    2,\n' +
            '    3\n' +
            ']\n' +
            '|green\n' +
            'null0=>operation: (1) \n' +
            'null|red\n' +
            'while0=>condition: (2) \n' +
            '3 > x[2]|green\n' +
            'ass0=>operation: (3) \n' +
            'z[1] = 4\n' +
            '|red\n' +
            'return0=>operation: (4) \n' +
            'return [\n' +
            '    1,\n' +
            '    2,\n' +
            '    3\n' +
            '][1]|green\n' +
            'st->let0\n' +
            'null0->while0\n' +
            'let0->null0\n' +
            'while0(yes)->ass0\n' +
            'ass0->null0\n' +
            'while0(no)->return0\n';
        assert.deepEqual(expect13,result13);
    });
    it('test 14 -clean', () => {
        let expect14=parseCode('function foo(x){\n' +
            'while(x>3){\n' +
            'x--;\n' +
            '}\n' +
            'return 4;\n' +
            '}\n' +
            '\n','1');
        let result14='st=>start: Start|green\n' +
            'null0=>operation: (0) \n' +
            'null|red\n' +
            'while0=>condition: (1) \n' +
            'x > 3|green\n' +
            'ass0=>operation: (2) \n' +
            'x--\n' +
            '|red\n' +
            'return0=>operation: (3) \n' +
            'return 4|green\n' +
            'st->null0\n' +
            'null0->while0\n' +
            'st->null0\n' +
            'while0(yes)->ass0\n' +
            'ass0->null0\n' +
            'while0(no)->return0\n';
        assert.deepEqual(expect14,result14)
        ;
    });
    it('test 15 -clean', () => {
        let expect15=parseCode('function foo(x, y, z){\n' +
            '  if(x>3){}\n' +
            '   return z;\n' +
            '}\n','1,2,3');
        let result15='st=>start: Start|green\n' +
            'if0=>condition: (0) \n' +
            'x > 3|green\n' +
            'null0=>operation: (1) \n' +
            'null|green\n' +
            'return0=>operation: (2) \n' +
            'return z|green\n' +
            'st->if0\n' +
            'if0(yes)->null0\n' +
            'null0->return0\n';
        assert.deepEqual(expect15,result15);
    });
});













