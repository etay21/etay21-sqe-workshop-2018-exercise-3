import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

var vars;
var up = '';
var down ='';
var letCounter=0;
var assCounter=0;
var ifCounter=0;
var whileCounter=0;
var returnCounter=0;
var flagLet=false;
var counterLetForClose=0;
var nullCounter=0;
var runIndex=0;

const makeStart =()=>
{
    vars='';
    up = '';
    down ='';
    letCounter=0;
    assCounter=0;
    ifCounter=0;
    whileCounter=0;
    returnCounter=0;
    flagLet=false;
    counterLetForClose=0;
    nullCounter=0;
    runIndex=0;
};
const parseCode = (codeToParse,params) => {
    makeStart();
    var func = esprima.parseScript(codeToParse,{loc: true});
    var env= {};
    vars = esprima.parseScript(params,{loc: true});
    let flowArr={};
    var color='green';
    parser(func,params,env,flowArr,color);
    //console.log(''+up+down);
    return ''+up+down;
};


const parser= (ast,params,env,flowArr,color)=> {
    let check = ast.type;
    if(check==='Program')
        return programParser(ast,params,env,flowArr,color);
    else if(check==='VariableDeclaration')
        return varDecl(ast,params,env,flowArr,color);
    else if(check==='ExpressionStatement')
        return assDecl(ast,params,env,flowArr,color);
    else
        return parser2(ast,params,env,flowArr,color);

};

const parser2= (ast,params,env,flowArr,color)=> {
    let check = ast.type;
    if(check==='FunctionDeclaration')
        return  FunctionDcl(ast,params,env,flowArr,color);
    else if(check==='BlockStatement')
        return blockStatement(ast,params,env,flowArr,color);
    else
        return parser3(ast,params,env,flowArr,color);

};
const parser3= (ast,params,env,flowArr,color)=> {
    let check = ast.type;
    if (check === 'WhileStatement')
        return whilExp(ast,params,env,flowArr,color);
    else if (check === 'IfStatement')
        return ifExp(ast,params,env,flowArr,color);
    else
        return returnExp(ast,params,env,flowArr,color);

};
const assDeclForBlock= (ast,params,env)=>
{
    up+=escodegen.generate(ast.expression) +'\n';
    var tmpAst = Object.assign({},ast.expression.right);
    if(ast.expression.type==='UpdateExpression'){
        if(ast.expression.operator==='++')
            env[ast.expression.argument.name]=env[ast.expression.argument.name]+1;
        else
            env[ast.expression.argument.name]=env[ast.expression.argument.name]-1;
    }
    else
        env[ast.expression.left.name] = sub(tmpAst,params,env);
    return 'ass' + (assCounter-1)+'\n';
};
const helpToAss=(ast,params,env,flowArr,color,i)=>{
    up+='ass'+assCounter+ '=>operation: ('+runIndex+') \n';runIndex++;
    //if(flowArr!=='')
    down+=flowArr+'->'+'ass'+assCounter+'\n';
    assCounter++;
    while (i<ast.body.length && ast.body[i].type === 'ExpressionStatement') {
        assDeclForBlock(ast.body[i],params,env,flowArr,color);
        i++;
    }
    i--;
    up+='|'+color+'\n';
    return i;
};
const blockStatement = (ast,params,env,flowArr,color) =>
{
    for(let i=0;i<ast.body.length;i++)
    {
        if(ast.body[i].type==='ExpressionStatement') {
            i=helpToAss(ast,params,env,flowArr,color,i);
            flowArr='ass'+(assCounter-1);
        }
        else {
            flowArr = parser(ast.body[i], params, env, flowArr, color);
            flowArr = flowArr.substr(0, flowArr.length - 1);
        }
    }
    return flowArr+'\n';
};



const programParser = (ast,params,env,flowArr,color)=> {
    up+='st=>start: Start|green\n';
    return ast.body.map((rib) => parser(rib, params, env,'st',color));
};

const funchelp = (ast,params,env,parms)=>
{
    for (let i = 0; i < params.length; i = i + 1) {
        env[parms[i]] = vars.body[0].expression.expressions[i];
    }
};
const FunctionDcl = (ast,params,env,flowArr,color)=>
{
    const parms = ast.params.reduce((acc,curr)=> acc.concat(curr.name),[]);
    if(vars.body[0].expression.expressions) {
        funchelp  (ast,params,env,parms);
    }
    else{

        for (let i = 0; i < params.length; i = i + 1) {
            env[parms[i]] = vars.body[0].expression;
        }
    }
    let counter=0;

    ast.body.body.map((rib) => {if(rib.type==='VariableDeclaration')
        counter++;});
    counterLetForClose=counter;
    return parser(ast.body,params,env,flowArr,color);

};

const varHelper= (ast,params,env)=>
{
    ast.declarations.map((dec)=> {
        const value = dec.init;
        var tmp = Object.assign({},value);
        if(value === null)
        {
            env[dec.id.name] =null;
        }
        else {
            env[dec.id.name] =sub(tmp,params,env);
        }}
    );
};

const varHelper2= (ast)=>{
    up+='let'+letCounter+'=>operation: ('+runIndex+') \n';
    runIndex++;
    ast.declarations.map((dec)=> {
        up+= escodegen.generate(dec)+'\n';

    });
    letCounter++;
    flagLet=true;
};
const varDecl= (ast,params,env)=>
{
    counterLetForClose--;
    varHelper(ast,params,env);
    if(flagLet===false)
        varHelper2(ast);
    else {
        ast.declarations.map((dec)=> {
            up+= escodegen.generate(dec)+'\n';
        });
    }
    if(counterLetForClose===0)
    {
        up+='|green\n';
        down+='st->let0'+'\n';
        return 'let0\n';
    }
    return '';
};
const assDecl= (ast,params,env,flowArr,color)=>
{
    up+='ass'+assCounter+ '=>operation: ('+runIndex+') \n'+escodegen.generate(ast.expression) +'|'+color+'\n';
    runIndex++;
    down+=flowArr+'->'+'ass'+assCounter+'\n';
    assCounter++;
    var tmpAst = Object.assign({},ast.expression.right);
    if(ast.expression.type==='UpdateExpression'){
        if(ast.expression.operator==='++')
            env[ast.expression.argument.name]=env[ast.expression.argument.name]+1;
        else
            env[ast.expression.argument.name]=env[ast.expression.argument.name]-1;
    }
    else
        env[ast.expression.left.name] = sub(tmpAst,params,env);
    return 'ass' + (assCounter-1)+'\n';
};

const evalColor=(ast,params,env,flowArr,color,tmp)=>{
    var color0='green';
    if(color==='red')
        color0='red';
    else
        color0= evaltmp(tmp,ast);
    return color0;
};

const ifExp = (ast,params,env,flowArr,color)=> {
    let tmpAst = JSON.parse(JSON.stringify(ast.test));
    var tmpAstTest= sub(tmpAst,params,env);
    var tmp = eval(escodegen.generate(tmpAstTest));
    let ifCount = JSON.parse(JSON.stringify(ifCounter));
    let nullCount = JSON.parse(JSON.stringify(nullCounter));
    up+='if'+ifCounter+ '=>condition: ('+runIndex+') \n'+escodegen.generate(ast.test) +'|'+color+'\n'; runIndex++;
    for(let i=0; i<flowArr.split('\n').length;i++)
        down+=flowArr.split('\n')[i]+'->'+'if'+ifCount+'\n';
    var new1Env = Object.assign({},env);ifCounter++;
    var color0=evalColor(ast,params,env,flowArr,color,tmp); nullCounter++;
    var returnCons= parser(ast.consequent,params,new1Env,'if'+ifCount+'(yes)',color0);
    for(let i=0; i<returnCons.split('\n').length-1;i++)
        down+=returnCons.split('\n')[i]+'->' + 'null' + nullCount + '\n';
    if(ast.alternate)
        return takeCareAlt(ast, params, env, flowArr, color, tmp, ifCount, nullCount);
    else {
        up+='null'+nullCount+ '=>operation: ('+runIndex+') \n'+'null|'+'green'+'\n'; runIndex++;
        return 'if' + ifCount + '(no)' + '\n' + returnCons;}
};

const takeCareAlt = (ast,params,env,flowArr,color,tmp,ifCount,nullCount)=> {
    var new2Env = Object.assign({},env);
    var color1='green';
    if(color==='red')
        color1='red';
    else
    if (evaltmp(tmp, ast) === 'green')
        color1='red';
    nullCounter++;
    var  returnAlt= parser(ast.alternate, params, new2Env,'if'+ifCount+'(no)',color1);
    for(let i=0; i<returnAlt.split('\n').length-1;i++)
        down+=returnAlt.split('\n')[i]+'->'+'null'+nullCount+'\n';
    up+='null'+nullCount+ '=>operation: ('+runIndex+') \n'+'null|'+'green'+'\n'; runIndex++;
    return 'null'+nullCount+'\n';
};

const evaltmp = (tmp)=>{
    if(tmp===true) {
        return 'green';
    }
    else {
        return 'red';
    }
};

const whilExp= (ast,params,env,flowArr,color)=>{
    var whileCount = JSON.parse(JSON.stringify(whileCounter));
    var nullCount = JSON.parse(JSON.stringify(nullCounter));
    let tmpAst = JSON.parse(JSON.stringify(ast.test));
    var tmpAstTest= sub(tmpAst,params,env);var tmp = eval(escodegen.generate(tmpAstTest));
    var color0 = evalColor(ast,params,env,flowArr,color,tmp);
    up+='null'+nullCounter+ '=>operation: ('+runIndex+') \n'+'null|'+color+'\n';runIndex++;
    up+='while'+whileCounter+ '=>condition: ('+runIndex+') \n'+escodegen.generate(ast.test) +'|'+color0+'\n';runIndex++;
    if(down==='')
        down+='st->null'+nullCount+'\n';
    down+='null'+nullCount+'->'+'while'+whileCount+'\n';
    for(let i=0; i<flowArr.split('\n').length;i++)
        down+=flowArr.split('\n')[i]+'->'+'null'+nullCount+'\n';
    whileCounter++; nullCounter++;
    var newEnv = Object.assign({},env);
    var tmp1= parser(ast.body,params,newEnv,('while'+whileCount+'(yes)'),color0);
    for(let i=0; i<tmp1.split('\n').length-1;i++)
        down+=tmp1.split('\n')[i]+'->'+'null'+nullCount+'\n';
    return 'while'+whileCount+'(no)'+'\n';
};


const returnExp= (ast,params,env,flowArr,color)=> {
    sub(ast.argument,params,env);
    up+='return'+returnCounter+ '=>operation: ('+runIndex+') \n'+'return '+escodegen.generate(ast.argument) +'|'+color+'\n';
    runIndex++;
    for(let i=0; i<flowArr.split('\n').length;i++)
        down+=flowArr.split('\n')[i]+'->'+'return'+returnCounter+'\n';
    returnCounter++;

    return 'return0' + (returnCounter-1)+'\n';
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

export {parseCode};