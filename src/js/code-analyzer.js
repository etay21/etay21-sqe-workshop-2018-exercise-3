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
    var color='past';
    let x=  parser(func,params,env,flowArr,color);
    console.log(up);
    console.log(down);
    console.log(''+up+'\n'+down);

    //let y =x.body.map((rib)=> htmlParser(rib));
    //y='<pre>'+y+'</pre>';
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

    ast.body.map((rib) => { tmp+= parser(rib,params,env,flowArr,color);
    });
    if(ismainFrame===false) {
        var arr = tmp.split('\n');

        for (let i = 0; i < arr.length - 2; i++) {
            down += arr[i] + '->' + arr[i + 1] + '\n';
        }


        var y = arr[0];

        down += flowArr + '->' + y + '\n';

        //down+=arr[arr.length-2]+'->'+'return0'+'\n';
        return arr[arr.length - 2] + '\n';
    }
    else {

        var arr1 = tmp.split('\n');
        var tmpWhile = arr1[arr1.length - 3];

        if(tmpWhile.substr(0,tmpWhile.length-1)==='while')
        {
            down += arr1[arr1.length - 3]+'(no)' + '->' + arr1[arr1.length - 2] + '\n';
        }
        else {
            down += arr1[arr1.length - 3] + '->' + arr1[arr1.length - 2] + '\n';
        }
        return arr1[arr1.length - 2] + '\n';
    }

    //down+=arr[arr.length-2]+'->'+'return0'+'\n';

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
    assCounter++;
    var tmpAst = Object.assign({},ast.expression.right);
    env[ast.expression.left.name] = sub(tmpAst,params,env);

    var x='ass' + (assCounter-1)+'\n';
    return x;

};

const ifExp = (ast,params,env,flowArr,color)=> {
    isMain=false;
    // var copyAst = Object.assign({},ast);

    //var tmpAst = Object.assign({},ast.test);
    let tmpAst = JSON.parse(JSON.stringify(ast.test));
    var tmpAstTest= sub(tmpAst,params,env);


    var tmp = eval(escodegen.generate(tmpAstTest));
    let ifCount = JSON.parse(JSON.stringify(ifCounter));
    let nullCount = JSON.parse(JSON.stringify(nullCounter));
    up+='if'+ifCounter+ '=>condition: '+escodegen.generate(ast.test) +'|'+evaltmp(tmp,ast)+'\n';
    ifCounter++;
    if(down==='')
    {
        down+='st->if'+(ifCounter-1)+'\n';
    }
    else if(whileCounter===0 && ifCounter===1)
    {
        down+='let0->if0\n';
    }


    var new1Env = Object.assign({},env);
    var new2Env = Object.assign({},env);
    up+='null'+nullCount+ '=>operation: '+'null|'+evaltmp(tmp,ast)+'\n';


    nullCounter++;
    var returnCons='';

    returnCons= parser(ast.consequent,params,new1Env,'if'+ifCount+'(yes)',evaltmp(tmp,ast));
    down+=returnCons.substr(0,returnCons.length-1)+'->'+'null'+nullCount+'\n';
    down+='null'+nullCount+'->'+'return0'+'\n';
    let returnAlt='';
    if(ast.alternate) {
        var color1='green';
        if(evaltmp(tmp,ast)==='green')
        {
            color1='red';
        }
        returnAlt= parser(ast.alternate, params, new2Env,'if'+ifCount+'(no)',color1);
        down+='if'+ifCount +'(no)'+'->'+returnAlt+'\n';
        down+=returnAlt.substr(0,returnAlt.length-1)+'->'+'null'+nullCount+'\n';

    }


    return 'if'+ifCount+'\n';

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


    //var tmpast = escodegen.generate(ast.test);
    // var newast =  esprima.parseScript(tmpast);
    var whileCount = JSON.parse(JSON.stringify(whileCounter));
    var nullCount = JSON.parse(JSON.stringify(nullCounter));
    ////

    let tmpAst = JSON.parse(JSON.stringify(ast.test));
    var tmpAstTest= sub(tmpAst,params,env);

    // ast.test = sub(ast.test,params,env);
    //var tmpast = escodegen.generate(tmpAstTest);
    //var newast =  esprima.parseScript(tmpast);

    // var etay = sub(tmpAstTest,params,env);

    var tmp = eval(escodegen.generate(tmpAstTest));
    ///

    //let tmp = eval(escodegen.generate(tmp,params,env)));
    up+='while'+whileCounter+ '=>condition: '+escodegen.generate(ast.test) +'|'+evaltmp(tmp,ast)+'\n';
    down+='null'+nullCount+'->'+'while'+whileCount+'\n';

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
    //let tmpTest = sub(ast.test,params,env);

    var newEnv = Object.assign({},env);

    var tmp1= parser(ast.body,params,newEnv,('while'+whileCount+'(yes)'),evaltmp(tmp,ast));

    down+=tmp1.substr(0,tmp1.length-1)+'->'+'null'+nullCount+'\n';

    return 'while'+whileCount+'\n';

};


const returnExp= (ast,params,env,flowArr,color)=> {

    var tmpAstArgument= sub(ast.argument,params,env);

    up+='return'+returnCounter+ '=>operation: '+escodegen.generate(ast.argument) +'|'+'green'+'\n';

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

///////////////////////////////////////////////////////////////////////////////////////////////////


export {parseCode};