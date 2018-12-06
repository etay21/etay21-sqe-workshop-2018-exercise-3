import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {

    it('test 1 -clean', () => {
        assert.deepEqual(
            (parseCode('')),
            []
        );
    });


    it('test 2- let simple', () => {
        assert.deepEqual(
            (parseCode('let a;' + '\n' +
                'a=9')),
            [
                {
                    'Line': 1,
                    'Type': 'VariableDeclaration',
                    'Name': 'a',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 2,
                    'Type': 'AssignmentExpression',
                    'Name': 'a',
                    'Condition': '',
                    'Val': '9'
                }
            ]);
    });

    it('test 3 -let2', () => {
        assert.deepEqual(
            parseCode('let a=9;'),
            [
                {
                    'Line': 1,
                    'Type': 'VariableDeclaration',
                    'Name': 'a',
                    'Condition': '',
                    'Val': 9
                }
            ]
        );
    });

    it('test4 - while loop', () => {
        assert.deepEqual(
            parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}'),
            [
                {
                    'Line': 1,
                    'Type': 'FunctionDeclaration',
                    'Name': 'binarySearch',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'X',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'V',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'n',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 2,
                    'Type': 'VariableDeclaration',
                    'Name': 'low',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 2,
                    'Type': 'VariableDeclaration',
                    'Name': 'high',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 2,
                    'Type': 'VariableDeclaration',
                    'Name': 'mid',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 3,
                    'Type': 'AssignmentExpression',
                    'Name': 'low',
                    'Condition': '',
                    'Val': '0'
                },
                {
                    'Line': 4,
                    'Type': 'AssignmentExpression',
                    'Name': 'high',
                    'Condition': '',
                    'Val': 'n - 1'
                },
                {
                    'Line': 5,
                    'Type': 'WhileStatement',
                    'Name': '',
                    'Condition': 'low <= high',
                    'Val': ''
                },
                {
                    'Line': 6,
                    'Type': 'AssignmentExpression',
                    'Name': 'mid',
                    'Condition': '',
                    'Val': '(low + high) / 2'
                },
                {
                    'Line': 7,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': 'X < V[mid]',
                    'Val': ''
                },
                {
                    'Line': 8,
                    'Type': 'AssignmentExpression',
                    'Name': 'high',
                    'Condition': '',
                    'Val': 'mid - 1'
                },
                {
                    'Line': 10,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': 'mid'
                },
                {
                    'Line': 12,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '-1'
                }
            ]
        );
    });


    it('test 5 - while loop2- no if', () => {
        assert.deepEqual(
            parseCode('function test1(x){\n' +
                '    let tmp=1;\n' +
                '    while (tmp<4) {\n' +
                '        tmp=tmp+1;\n' +
                '    }\n' +
                '    return tmp;\n' +
                '}'),
            [
                {
                    'Line': 1,
                    'Type': 'FunctionDeclaration',
                    'Name': 'test1',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'x',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 2,
                    'Type': 'VariableDeclaration',
                    'Name': 'tmp',
                    'Condition': '',
                    'Val': 1
                },
                {
                    'Line': 3,
                    'Type': 'WhileStatement',
                    'Name': '',
                    'Condition': 'tmp < 4',
                    'Val': ''
                },
                {
                    'Line': 4,
                    'Type': 'AssignmentExpression',
                    'Name': 'tmp',
                    'Condition': '',
                    'Val': 'tmp + 1'
                },
                {
                    'Line': 6,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': 'tmp'
                }
            ]
        );
    });


    it('test 6- for loop', () => {
        assert.deepEqual(
            parseCode('let x=8;\n' +
                'let y=1;\n' +
                'for(let i =0;i<5;i++) {\n' +
                '    y = y + 1;\n' +
                '    x = x - x;\n' +
                '   }'),
            [
                {
                    'Line': 1,
                    'Type': 'VariableDeclaration',
                    'Name': 'x',
                    'Condition': '',
                    'Val': 8
                },
                {
                    'Line': 2,
                    'Type': 'VariableDeclaration',
                    'Name': 'y',
                    'Condition': '',
                    'Val': 1
                },
                {
                    'Line': 3,
                    'Type': 'ForStatement',
                    'Name': '',
                    'Condition': 'i < 5',
                    'Val': ''
                },
                {
                    'Line': 4,
                    'Type': 'AssignmentExpression',
                    'Name': 'y',
                    'Condition': '',
                    'Val': 'y + 1'
                },
                {
                    'Line': 5,
                    'Type': 'AssignmentExpression',
                    'Name': 'x',
                    'Condition': '',
                    'Val': 'x - x'
                }
            ]
        );
    });
    it('test7 - for2 simple', () => {
        assert.deepEqual(
            parseCode('let x=0;\n' +
                'for(let i =0;i<5;i++) {\n' +
                '    x = x + 1;\n' +
                '   }\n' +
                '\n'),
            [
                {
                    'Line': 1,
                    'Type': 'VariableDeclaration',
                    'Name': 'x',
                    'Condition': '',
                    'Val': 0
                },
                {
                    'Line': 2,
                    'Type': 'ForStatement',
                    'Name': '',
                    'Condition': 'i < 5',
                    'Val': ''
                },
                {
                    'Line': 3,
                    'Type': 'AssignmentExpression',
                    'Name': 'x',
                    'Condition': '',
                    'Val': 'x + 1'
                }
            ]
        );
    });
    it('test8- all fun', () => {
        assert.deepEqual(
            parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}'), [
                {
                    'Line': 1,
                    'Type': 'FunctionDeclaration',
                    'Name': 'binarySearch',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'X',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'V',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'n',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 2,
                    'Type': 'VariableDeclaration',
                    'Name': 'low',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 2,
                    'Type': 'VariableDeclaration',
                    'Name': 'high',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 2,
                    'Type': 'VariableDeclaration',
                    'Name': 'mid',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 3,
                    'Type': 'AssignmentExpression',
                    'Name': 'low',
                    'Condition': '',
                    'Val': '0'
                },
                {
                    'Line': 4,
                    'Type': 'AssignmentExpression',
                    'Name': 'high',
                    'Condition': '',
                    'Val': 'n - 1'
                },
                {
                    'Line': 5,
                    'Type': 'WhileStatement',
                    'Name': '',
                    'Condition': 'low <= high',
                    'Val': ''
                },
                {
                    'Line': 6,
                    'Type': 'AssignmentExpression',
                    'Name': 'mid',
                    'Condition': '',
                    'Val': '(low + high) / 2'
                },
                {
                    'Line': 7,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': 'X < V[mid]',
                    'Val': ''
                },
                {
                    'Line': 8,
                    'Type': 'AssignmentExpression',
                    'Name': 'high',
                    'Condition': '',
                    'Val': 'mid - 1'
                },
                {
                    'Line': 9,
                    'Type': 'else if statement',
                    'Name': '',
                    'Condition': 'X > V[mid]',
                    'Val': ''
                },
                {
                    'Line': 10,
                    'Type': 'AssignmentExpression',
                    'Name': 'low',
                    'Condition': '',
                    'Val': 'mid + 1'
                },
                {
                    'Line': 12,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': 'mid'
                },
                {
                    'Line': 14,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '-1'
                }
            ]);
    });
    /*
    it('test 9 -all', () => {
        assert.deepEqual(
            parseCode('function test(t){\n' +
                '   \n' +
                '   let low = 0;\n' +
                '   let  high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                'for(let i = 5;i>3; i++)\n' +
                '{\n' +
                'low = low -1;\n' +
                '}\n' +
                'if(3>4){\n' +
                'return 5;\n' +
                '}\n' +
                ' return -1;\n' +
                '}'),
            [
                {
                    'Line': 1,
                    'Type': 'FunctionDeclaration',
                    'Name': 'test',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 't',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 3,
                    'Type': 'VariableDeclaration',
                    'Name': 'low',
                    'Condition': '',
                    'Val': 0
                },
                {
                    'Line': 4,
                    'Type': 'VariableDeclaration',
                    'Name': 'high',
                    'Condition': ''
                },
                {
                    'Line': 5,
                    'Type': 'WhileStatement',
                    'Name': '',
                    'Condition': 'low <= high',
                    'Val': ''
                },
                {
                    'Line': 6,
                    'Type': 'AssignmentExpression',
                    'Name': 'mid',
                    'Condition': '',
                    'Val': '(low + high) / 2'
                },
                {
                    'Line': 7,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': 'X < V[mid]',
                    'Val': ''
                },
                {
                    'Line': 8,
                    'Type': 'AssignmentExpression',
                    'Name': 'high',
                    'Condition': '',
                    'Val': 'mid - 1'
                },
                {
                    'Line': 10,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': 'mid'
                },
                {
                    'Line': 12,
                    'Type': 'ForStatement',
                    'Name': '',
                    'Condition': 'i > 3',
                    'Val': ''
                },
                {
                    'Line': 14,
                    'Type': 'AssignmentExpression',
                    'Name': 'low',
                    'Condition': '',
                    'Val': 'low - 1'
                },
                {
                    'Line': 16,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': '3 > 4',
                    'Val': ''
                },
                {
                    'Line': 17,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '5'
                },
                {
                    'Line': 19,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '-1'
                }
            ]
        );
    });
    */
    it('test 9 -ifelse1', () => {
        assert.deepEqual(
            parseCode('function test(t){\n' +
                'if(3>4)\n' +
                '{\n' +
                ' if(4>3)\n' +
                '  {\n' +
                '  return 1;\n' +
                '  }\n' +
                '  else if(3>5)\n' +
                '  {\n' +
                '  return 2;\n' +
                '  }\n' +
                '  else\n' +
                '  return 3;\n' +
                '}\n' +
                '  else if(2>5)\n' +
                '  {\n' +
                '    if(4>3)\n' +
                '    {\n' +
                '    return 1;\n' +
                '    }\n' +
                '    else if(3>5)\n' +
                '    {\n' +
                '    return 9;\n' +
                '    }\n' +
                '    else\n' +
                '    return 3;\n' +
                '  }\n' +
                '  else\n' +
                '  return 5;\n' +
                '}'),
            [
                {
                    'Line': 1,
                    'Type': 'FunctionDeclaration',
                    'Name': 'test',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 't',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 2,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': '3 > 4',
                    'Val': ''
                },
                {
                    'Line': 4,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': '4 > 3',
                    'Val': ''
                },
                {
                    'Line': 6,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '1'
                },
                {
                    'Line': 8,
                    'Type': 'else if statement',
                    'Name': '',
                    'Condition': '3 > 5',
                    'Val': ''
                },
                {
                    'Line': 10,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '2'
                },
                {
                    'Line': 13,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '3'
                },
                {
                    'Line': 15,
                    'Type': 'else if statement',
                    'Name': '',
                    'Condition': '2 > 5',
                    'Val': ''
                },
                {
                    'Line': 17,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': '4 > 3',
                    'Val': ''
                },
                {
                    'Line': 19,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '1'
                },
                {
                    'Line': 21,
                    'Type': 'else if statement',
                    'Name': '',
                    'Condition': '3 > 5',
                    'Val': ''
                },
                {
                    'Line': 23,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '9'
                },
                {
                    'Line': 26,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '3'
                },
                {
                    'Line': 29,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '5'
                }
            ]
        );
    });
    it('test 10 -simple if', () => {
        assert.deepEqual(
            parseCode('function binarySearch(X, V, n){\n' +
                ' if(3>5)\n' +
                'return 5;  \n' +
                '}'),
            [
                {
                    'Line': 1,
                    'Type': 'FunctionDeclaration',
                    'Name': 'binarySearch',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'X',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'V',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'n',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 2,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': '3 > 5',
                    'Val': ''
                },
                {
                    'Line': 3,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '5'
                }
            ]
        );
    });



    it('test 11 complex if', () => {
        assert.deepEqual(
            parseCode('function binarySearch(X, V, n){\n' +
                'if(3>4)\n' +
                'return 4;\n' +
                'if(4>5)\n' +
                'return 5;\n' +
                'else if(3>9)\n' +
                'return 9;\n' +
                'if(4>5)\n' +
                'return 5;\n' +
                'else if(3>9)\n' +
                'return 9;\n' +
                'else \n' +
                'return 19;\n' +
                '}'),
            [
                {
                    'Line': 1,
                    'Type': 'FunctionDeclaration',
                    'Name': 'binarySearch',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'X',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'V',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'n',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 2,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': '3 > 4',
                    'Val': ''
                },
                {
                    'Line': 3,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '4'
                },
                {
                    'Line': 4,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': '4 > 5',
                    'Val': ''
                },
                {
                    'Line': 5,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '5'
                },
                {
                    'Line': 6,
                    'Type': 'else if statement',
                    'Name': '',
                    'Condition': '3 > 9',
                    'Val': ''
                },
                {
                    'Line': 7,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '9'
                },
                {
                    'Line': 8,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': '4 > 5',
                    'Val': ''
                },
                {
                    'Line': 9,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '5'
                },
                {
                    'Line': 10,
                    'Type': 'else if statement',
                    'Name': '',
                    'Condition': '3 > 9',
                    'Val': ''
                },
                {
                    'Line': 11,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '9'
                },
                {
                    'Line': 13,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '19'
                }
            ]
        );
    });



    it('test 12 -simple if 2', () => {
        assert.deepEqual(
            parseCode('function s(x)\n' +
                '{\n' +
                ' if (3>5)\n' +
                ' return 8;\n' +
                '}'),
            [
                {
                    'Line': 1,
                    'Type': 'FunctionDeclaration',
                    'Name': 's',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 1,
                    'Type': 'variable declaration',
                    'Name': 'x',
                    'Condition': '',
                    'Val': ''
                },
                {
                    'Line': 3,
                    'Type': 'IfStatement',
                    'Name': '',
                    'Condition': '3 > 5',
                    'Val': ''
                },
                {
                    'Line': 4,
                    'Type': 'ReturnStatement',
                    'Name': '',
                    'Condition': '',
                    'Val': '8'
                }
            ]
        );
    });
});












