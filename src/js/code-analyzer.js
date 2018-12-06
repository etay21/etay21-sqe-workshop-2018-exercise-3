import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse) => {
    const func = esprima.parseScript(codeToParse,{loc: true});
    return parser(func);
};

var elseif=0;

const objectLine= (line,type,name,condition,val)=>
{
    return { Line:line, Type:type, Name:name, Condition:condition, Val:val};
};


const parser= (ast)=> {
    let check = ast.type;
    if(check==='Program')
        return programParser(ast);
    else if (check === 'ForStatement')
        return forExp(ast);
    else if(check==='VariableDeclaration')
        return varDecl(ast);
    else if(check==='ExpressionStatement')
        return  assDecl(ast);
    else
        return parser2(ast);

};


const parser2= (ast)=> {
    let check = ast.type;
    switch (check) {
    case 'WhileStatement':
        return whilExp(ast);
    case 'IfStatement':
        return ifExp(ast);
    case 'ReturnStatement':
        return returnExp(ast);
    case 'FunctionDeclaration':
        return FunctionDcl(ast);
    }
};

/*
const parser2= (ast)=> {
    let check = ast.type;
    if (check === 'WhileStatement')
        return whilExp(ast);
    if (check === 'IfStatement')
        return ifExp(ast);
    if (check === 'ReturnStatement')
        return returnExp(ast);
    if(check==='FunctionDeclaration')
        return FunctionDcl(ast);
    return;
};

*/
const programParser= (ast)=>
{
    //const obj= objectLine(ast.loc.start.line, ast.type, '', '','');
    //return ast.body.reduce(((acc,curr)=> acc.concat(parser(curr))),[obj]);
    return ast.body.reduce(((acc,curr)=> acc.concat(parser(curr))),[]);
};

const FunctionDcl= (ast)=>
{

    const obj = objectLine(ast.loc.start.line, ast.type, ast.id.name, '','');
    const parms = ast.params.map((param)=> objectLine (param.loc.start.line,'variable declaration',param.name ,'',''));
    return ast.body.body.reduce(((acc,curr)=> acc.concat(parser(curr))),[obj].concat(parms));

};

const varDecl= (ast)=>
{

    return ast.declarations.reduce((acc,curr) => acc.concat(objectLine(curr.loc.start.line, ast.type, curr.id.name,'',curr.init ? escodegen.generate(curr.init) : '')),[]);

};

const assDecl= (ast)=>
{

    return  objectLine(ast.expression.loc.start.line, ast.expression.type, escodegen.generate(ast.expression.left), '',escodegen.generate(ast.expression.right));

};

const whilExp= (ast)=>{

    const test = escodegen.generate(ast.test);
    const tmp= objectLine (ast.loc.start.line,ast.type, '',test,'');
    const all = ast.body.body.reduce((acc,curr) => acc.concat(parser(curr)),[]);
    // const all = parser(ast.body.body);
    return [tmp].concat(all);

};

const ifExp= (ast)=> {
    const test = escodegen.generate(ast.test);
    let all;
    let tmp=findTmp(ast,test);
    let ezer = findAlt(ast);
    if (ast.consequent.body === undefined) {
        all = parser(ast.consequent);
    }
    else {
        all = ast.consequent.body.reduce((acc, curr) => acc.concat(parser(curr)), []);
    }
    if (ezer === '') {
        return [tmp].concat(all);
    }
    else {
        return [tmp].concat(all).concat(ezer);
    }
};

const findTmp=(ast,test)=>
{
    if (elseif === 0) {
        return  objectLine(ast.loc.start.line, ast.type, '', test, '');
    }
    else {
        return objectLine(ast.loc.start.line, 'else if statement', '', test, '');
    }
};

const findAlt=(ast)=>
{
    if (ast.alternate === null) {
        elseif = 0;
        return '';

    }
    else {

        elseif = 1;
        let ezer = parser(ast.alternate);
        elseif = 0;
        return ezer;
    }
};

const returnExp= (ast)=> {
    const test = objectLine (ast.loc.start.line,ast.type, '','', escodegen.generate(ast.argument));
    return [test];
};
const forExp= (ast)=>{

    const test = escodegen.generate(ast.test);
    const tmp= objectLine (ast.loc.start.line,ast.type, '',test,'');
    const all = ast.body.body.reduce((acc,curr) => acc.concat(parser(curr)),[]);
    return [tmp].concat(all);

};

export {parseCode};