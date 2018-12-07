import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse,params) => {
    var func = esprima.parseScript(codeToParse,{loc: true});
    var env= {};

    return parser(func,params,env);
};



const parser= (ast,params,env)=> {
    let check = ast.type;
    if(check==='Program')
        return programParser(ast,params,env);
    else if (check === 'ForStatement')
        return forExp(ast,params,env);
    else if(check==='VariableDeclaration')
        return varDecl(ast,params,env);
    else if(check==='ExpressionStatement')
        return  assDecl(ast,params,env);
    else
        return parser2(ast,params,env);

};

const parser2= (ast,params,env)=> {
    let check = ast.type;
    switch (check) {
        case 'WhileStatement':
            return whilExp(ast,params,env);
        case 'IfStatement':
            return ifExp(ast,params,env);
        case 'ReturnStatement':
            return returnExp(ast,params,env);
        case 'FunctionDeclaration':
            return FunctionDcl(ast,params,env);
        case 'BlockStatement':
            return blockStatement(ast,params,env);
    }
};



const blockStatement = (ast,params,env) =>
{
    var bodyN = ast.body.map((rib) => parseCode(rib , params , env))
    bodyN.filter((rib) => (rib.type != 'ExpressionStatement' && rib.type != 'VariableDeclaration'))
    ast.body=bodyN;
    return ast;
};

const programParser= (ast,params,env)=>
{
    return ast.body.reduce(((acc,curr)=> acc.concat(parser(curr))),[]);
};

const FunctionDcl= (ast,params,env)=>
{
    //const obj = objectLine(ast.loc.start.line, ast.type, ast.id.name, '','');
    const parms = ast.params.reduce((acc,curr)=> acc.concat(curr.name),[]);
    parms.map((name)=> env[name]= name);
    const bodyN = parseCode(ast.body,params,env);
    ast.body=bodyN;
    return ast;

};


const varDecl= (ast,params,env)=>
{
    ast.declarations.map((dec)=> {const value = dec.init;
        if(value === undefined)
        {
            env[dec.id.name] =null;
        }
        else {
            env[dec.id.name] =escodegen.generate(sub(value,params,env));
        }}
    )
    return ast;

};

const assDecl= (ast,params,env)=>
{
    env[ast.left.name] = escodegen.generate(sub(ast.right,params,env));
    return ast;
};



const ifExp= (ast,params,env)=> {
    ast.test = sub(ast.test,params,env);
    var new1Env = Object.assign({},env);
    var new2Env = Object.assign({},env);
    ast.consequent = parseCode(ast.consequent,params,newEnv1);
    ast.alternate = parseCode(ast.alternate,params,newEnv2);
    //TODO EVALLLLLLLLLLLLLLLLLLLLLL
    ast['testTF'] = checkTest(ast.test,ast,params,env)
    //END EVALLLLLLLL
    return ast;
};


const whilExp= (ast,params,env)=>{

    ast.test = sub(ast.test,params,env);
    var newEnv = Object.assign({},env);
    const bodyN = parseCode(ast.body,newEnv);
    ast.body=bodyN;
    //TODO EVALLLLLLLLLLLLLLLLLLLLLL
    ast['testTF'] = checkTest(ast.test,params,env)
    //END EVALLLLLLLL
    return ast;
};


const checkTest = (ast,params,env) =>{
//TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return false;
};

const returnExp= (ast,params,env)=> {
    ast.argument= sub(ast,params,env);
    return ast;
};


const sub = (ast,params,env)=>
{
    //TODO
};

/*
const forExp= (ast,params,env)=>{

    const test = escodegen.generate(ast.test);
    const tmp= objectLine (ast.loc.start.line,ast.type, '',test,'');
    const all = ast.body.body.reduce((acc,curr) => acc.concat(parser(curr)),[]);
    return [tmp].concat(all);

};
*/


export {parseCode};