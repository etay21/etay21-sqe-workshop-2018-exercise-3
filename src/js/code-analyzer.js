import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
import * as js2flowchart from 'js2flowchart';

var globalEnv={};
var vars;

const parseCode = (codeToParse,params) => {
    var func = esprima.parseScript(codeToParse,{loc: true});
    var env= {};
    vars = esprima.parseScript(params,{loc: true});

    let x=  parser(func,params,env);

    let y =x.body.map((rib)=> htmlParser(rib));
    y='<pre>'+y+'</pre>';
    return y;
};


const parser= (ast,params,env)=> {
    //debugger;
    let check = ast.type;
    if(check==='Program')
        return programParser(ast,params,env);
    else if(check==='VariableDeclaration')
        return varDecl(ast,params,env);
    else if(check==='ExpressionStatement')
        return  assDecl(ast,params,env);
    else
        return parser2(ast,params,env);

};

const parser2= (ast,params,env)=> {
    let check = ast.type;
    if(check==='FunctionDeclaration')
        return  FunctionDcl(ast,params,env);
    else if(check==='BlockStatement')
        return  blockStatement(ast,params,env);
    else
        return parser3(ast,params,env);

};
const parser3= (ast,params,env)=> {
    let check = ast.type;
    if (check === 'WhileStatement')
        return whilExp(ast, params, env);
    else if (check === 'IfStatement')
        return ifExp(ast, params, env);
    else
        return returnExp(ast, params, env);

};

const blockStatement = (ast,params,env) =>
{
    let bodyN = ast.body.map((rib) => parser(rib , params , env));
    bodyN = bodyN.filter((rib) => { if(rib.type === 'ExpressionStatement')
    {
        return globalEnv[rib.expression.left.name];
    }
    return rib.type !== 'VariableDeclaration';
    });
    ast.body=bodyN;
    return ast;
};

const programParser = (ast,params,env)=>
{

    ast.body =ast.body.map((rib)=> parser(rib,params,env));
    ast.body = ast.body.filter((rib) => { if(rib.type === 'ExpressionStatement')
    {
        return globalEnv[rib.expression.left.name];
    }
    return rib.type !== 'VariableDeclaration';
    });
    return ast;
};

const funchelp = (ast,params,env,parms)=>
{
    for (let i = 0; i < params.length; i = i + 1) {
        globalEnv[parms[i]] = vars.body[0].expression.expressions[i];
    }
};
const FunctionDcl = (ast,params,env)=>
{
    const parms = ast.params.reduce((acc,curr)=> acc.concat(curr.name),[]);
    if(vars.body[0].expression.expressions) {
        funchelp  (ast,params,env,parms);
    }
    else{

        for (let i = 0; i < params.length; i = i + 1) {
            globalEnv[parms[i]] = vars.body[0].expression;
        }
    }

    ast.body = parser(ast.body,params,env);
    return ast;

};

const varDecl= (ast,params,env)=>
{
    ast.declarations.map((dec)=> {
        const value = dec.init;

        if(value === null)
        {
            env[dec.id.name] =null;
        }
        else {
            env[dec.id.name] =sub(value,params,env);
        }}
    );
    return ast;

};
const assDecl= (ast,params,env)=>
{
    //console.log (ast);
    env[ast.expression.left.name] = sub(ast.expression.right,params,env);

    return ast;
};

const ifExp = (ast,params,env)=> {
    ast.test = sub(ast.test,params,env);
    var new1Env = Object.assign({},env);
    var new2Env = Object.assign({},env);
    ast.consequent = parser(ast.consequent,params,new1Env);
    if( ast.alternate ) {
        ast.alternate = parser(ast.alternate, params, new2Env);
    }
    var tmpast = escodegen.generate(ast.test);
    var newast =  esprima.parseScript(tmpast);
    let etay = sub(newast.body[0].expression,params,globalEnv);

    let tmp = eval(escodegen.generate(etay));

    return evaltmp(tmp,ast);

};

const evaltmp = (tmp,ast)=>{
    if(tmp===true) {
        ast['testTF'] = 'green';
    }
    else {
        ast['testTF'] = 'red';
    }
    return ast;
};

const whilExp= (ast,params,env)=>{
    ast.test = sub(ast.test,params,env);
    var newEnv = Object.assign({},env);
    ast.body= parser(ast.body,params,newEnv);
    //ast.body=bodyN;
    var tmpast = escodegen.generate(ast.test);
    var newast =  esprima.parseScript(tmpast);
    let tmp = eval(escodegen.generate((sub(newast.body[0].expression,params,globalEnv))));
    if(tmp===true) {
        ast['testTF'] = 'green';
    }
    else {
        ast['testTF'] = 'red';
    }
    return ast;
};


const returnExp= (ast,params,env)=> {

    ast.argument= sub(ast.argument,params,env);
    return ast;
};


const sub = (ast,params,env)=>
{
    let type = ast.type;
    if(type === 'BinaryExpression'){
        ast.left = sub(ast.left,params,env);
        ast.right = sub(ast.right,params,env);
    }
    else if (ast.type === 'ArrayExpression') {
        ast.elements = ast.elements.map((member) => sub( member,params,env));
    }
    else if(type === 'Identifier')
    {
        ast= ident(ast,params,env);
    }
    if (ast.type === 'MemberExpression') {
        ast.object = sub(ast.object,params,env );
        ast.property = sub(ast.property,params,env );
    }
    return ast;
};

const ident = (ast,params,env)=>{
    if(env[ast.name]) {
        ast = env[ast.name];
    }
    return ast;
};

///////////////////////////////////////////////////////////////////////////////////////////////////


const htmlParser= (ast)=> {
    let check = ast.type;
    if (check === 'WhileStatement')
        return whilExpH(ast);
    if (check === 'IfStatement')
        return ifExpH(ast);
    if (check === 'ReturnStatement')
        return returnExpH(ast);
    return htmlParser2(ast);

};

const htmlParser2 = (ast)=> {
    let check = ast.type;
    switch (check) {
    case 'FunctionDeclaration':
        return FunctionDclH(ast);
    case 'ExpressionStatement':
        return expH(ast);
    case 'BlockStatement':
        return blockStatementH(ast);
    }
};

const expH = (ast)=>
{
    let tmpSpace = space(ast);
    return  tmpSpace + escodegen.generate(ast);
};
const FunctionDclH = (ast)=> {
    const parms = ast.params.reduce((acc,curr)=> acc.concat(curr.name),[]);
    let tmp= '<br>' + 'function ' + ast.id.name + '(';
    parms.map((rib) => tmp += rib + ',');
    tmp=tmp.slice(0,tmp.length-1);
    tmp = tmp + ')' +'{' + '<br>';
    return tmp + htmlParser(ast.body) ;
};

const space = (ast) =>
{
    let num= ast.loc.start.column;
    let space='';
    for(let i=0;i<num;i++)
    {
        space += ' ';
    }
    return space;
};
const blockStatementH = (ast)=>
{
    let tmp='';
    let tmpSpace = space(ast);
    // let tmp = tmpSpace + '{<br>';
    ast.body.map((rib) => tmp += (htmlParser(rib) + '<br>'));
    tmp += tmpSpace;
    return tmp;
};
const ifExpH = (ast)=>
{
    let tmpSpace = space(ast);

    let tmp = tmpSpace + 'if ';
    tmp += '<span style="background-color:' + ast.testTF + ';">(' + escodegen.generate(ast.test) + ') </span>'+'{' + '<br>';
    tmp += htmlParser(ast.consequent)+'<br>'+tmpSpace+'}';

    if(ast.alternate){
        tmp +=  '<br>'+tmpSpace+' else ' + '<br>' + htmlParser(ast.alternate);
    }

    return tmp ;
};
//
const whilExpH = (ast)=>
{
    let tmpSpace = space(ast);
    let tmp = tmpSpace + 'while ';
    tmp += '<span style="background-color:' + ast.testTF + ';">(' + escodegen.generate(ast.test) + ')</span>'+'<br>';

    tmp += tmpSpace+'{'+'<br>'+htmlParser(ast.body) + '<br>'+tmpSpace+ '}';
    return tmp;
};

const returnExpH =(ast)=>
{
    let tmpSpace = space(ast);
    return  tmpSpace + escodegen.generate(ast);
};

export {parseCode};