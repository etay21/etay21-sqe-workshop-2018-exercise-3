import * as esprima from 'esprima';
import * as escodegen from 'escodegen';


//var globalEnv={};
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
var isMain=true;

const parseCode = (codeToParse,params) => {
    var func = esprima.parseScript(codeToParse,{loc: true});
    var env= {};
    vars = esprima.parseScript(params,{loc: true});
    let flowArr={};
    console.log(func);
    var color='green';
    let x=  parser(func,params,env,flowArr,color);
    console.log(up);
    console.log(down);
    console.log(''+up+'\n'+down);

    return ''+up+down;
};


const parser= (ast,params,env,flowArr,color)=> {
    let check = ast.type;
    if(check==='Program')
        return programParser(ast,params,env,flowArr,color);
    else if(check==='VariableDeclaration')
        return varDecl(ast,params,env,flowArr,color);
    else if(check==='ExpressionStatement')
    { var x= assDecl(ast,params,env,flowArr,color);
        return x;
    }

    else
        return parser2(ast,params,env,flowArr,color);

};

const parser2= (ast,params,env,flowArr,color)=> {
    let check = ast.type;
    if(check==='FunctionDeclaration')
        return  FunctionDcl(ast,params,env,flowArr,color);
    else if(check==='BlockStatement')
    {var x=blockStatement(ast,params,env,flowArr,color);

        return  x;
    }

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

const blockStatement = (ast,params,env,flowArr,color) =>
{
    var ismainFrame = JSON.parse(JSON.stringify(isMain));
    var tmp='';


    var first=0;
    var tmpReutn='';
    for(let i=0;i<ast.body.length;i++)
    {

        tmpReutn = parser(ast.body[i],params,env,tmpReutn,color);
        tmpReutn=tmpReutn.substr(0,tmpReutn.length-1);
        if(first===0&&tmpReutn!=='')
        {

            var y = tmpReutn;
            down += flowArr + '->' + y + '\n';
        }
        first++;
    }

    return tmpReutn+'\n';

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

const varDecl= (ast,params,env,flowArr,color)=>
{
    counterLetForClose--;


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

    if(flagLet===false){
        up+='let'+letCounter+'=>operation: ';
        ast.declarations.map((dec)=> {
            up+= escodegen.generate(dec)+'\n';

        });

        letCounter++;
        flagLet=true;
    }
    else if(flagLet===true){

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
    up+='ass'+assCounter+ '=>operation: '+escodegen.generate(ast.expression) +'|'+color+'\n';
    if(flowArr!=='')
    {
        down+=flowArr+'->'+'ass'+assCounter+'\n';
    }
    assCounter++;
    var tmpAst = Object.assign({},ast.expression.right);
    if(ast.expression.type==='UpdateExpression'){
        if(ast.expression.operator==='++')
        {

            env[ast.expression.argument.name]=env[ast.expression.argument.name]+1;
        }
        else {
            env[ast.expression.argument.name]=env[ast.expression.argument.name]-1;
        }
    }
    else
        env[ast.expression.left.name] = sub(tmpAst,params,env);

    var x='ass' + (assCounter-1)+'\n';
    return x;

};

const ifExp = (ast,params,env,flowArr,color)=> {
    isMain=false;

    let tmpAst = JSON.parse(JSON.stringify(ast.test));
    var tmpAstTest= sub(tmpAst,params,env);


    var tmp = eval(escodegen.generate(tmpAstTest));
    let ifCount = JSON.parse(JSON.stringify(ifCounter));
    let nullCount = JSON.parse(JSON.stringify(nullCounter));
    up+='if'+ifCounter+ '=>condition: '+escodegen.generate(ast.test) +'|'+evaltmp(tmp,ast)+'\n';
    if(flowArr!=='')
    {
        down+=flowArr+'->'+'if'+ifCount+'\n';
    }

    ifCounter++;

    var new1Env = Object.assign({},env);
    var new2Env = Object.assign({},env);
    up+='null'+nullCount+ '=>operation: '+'null|'+'green'+'\n';

    nullCounter++;
    var returnCons='';

    returnCons= parser(ast.consequent,params,new1Env,'if'+ifCount+'(yes)',evaltmp(tmp,ast));

    down+=returnCons.substr(0,returnCons.length-1)+'->'+'null'+nullCount+'\n';


    let returnAlt='';
    if(ast.alternate) {
        var color1='green';
        if(evaltmp(tmp,ast)==='green')
        {
            color1='red';
        }
        nullCounter--;

        returnAlt= parser(ast.alternate, params, new2Env,'if'+ifCount+'(no)',color1);
        down+=returnAlt.substr(0,returnAlt.length-1)+'->'+'null'+nullCount+'\n';

    }

    return 'null'+nullCount+'\n';

};

const evaltmp = (tmp,ast)=>{
    if(tmp===true) {
        return 'green';
    }
    else {
        return 'red';
    }

};

const whilExp= (ast,params,env,flowArr,color)=>{
    isMain=false;

    var whileCount = JSON.parse(JSON.stringify(whileCounter));
    var nullCount = JSON.parse(JSON.stringify(nullCounter));

    let tmpAst = JSON.parse(JSON.stringify(ast.test));
    var tmpAstTest= sub(tmpAst,params,env);


    var tmp = eval(escodegen.generate(tmpAstTest));


    up+='while'+whileCounter+ '=>condition: '+escodegen.generate(ast.test) +'|'+evaltmp(tmp,ast)+'\n';
    down+='null'+nullCount+'->'+'while'+whileCount+'\n';
    if(flowArr!=='')
    {
        down+=flowArr+'->'+'while'+whileCount+'\n';
    }
    up+='null'+nullCounter+ '=>operation: '+'null|'+evaltmp(tmp,ast)+'\n';
    whileCounter++;
    nullCounter++;
    if(down==='')
    {
        down+='st->null'+nullCount+'\n';
    }

    if(whileCounter===1&&ifCounter===0)
    {
        down+='let0->null'+ nullCount +'\n';
    }
    var newEnv = Object.assign({},env);

    var tmp1= parser(ast.body,params,newEnv,('while'+whileCount+'(yes)'),evaltmp(tmp,ast));

    down+=tmp1.substr(0,tmp1.length-1)+'->'+'null'+nullCount+'\n';

    return 'while'+whileCount+'(no)'+'\n';

};


const returnExp= (ast,params,env,flowArr,color)=> {

    var tmpAstArgument= sub(ast.argument,params,env);

    up+='return'+returnCounter+ '=>operation: '+'return '+escodegen.generate(ast.argument) +'|'+'green'+'\n';
    down+=flowArr+'->'+'return'+returnCounter;
    returnCounter++;

    var x='return' + (returnCounter-1)+'\n';
    return x;
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