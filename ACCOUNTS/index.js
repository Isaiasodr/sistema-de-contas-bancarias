
//setup inicial
//modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')


//modulos internos
const fs = require('fs')

console.log('iniciamos o Accounts')

//iniciando a função
operation()
//
function operation(){
    inquirer.prompt([{
        type:'list',
        name:'action',
        message:'o que vc deseja fazer?',
        choices:['criar conta','consultar saldo','depositar','sacar','sair']
    }])
    
    .then((answer) => {
        const action = answer['action']

        if(action ==='criar conta'){
            createAccount()

        }else if(action === 'criar conta'){

        }else if(action==='consultar saldo'){
            getAccountBalance()

        }else if(action ==='depositar'){
            deposit()
    

        }else if (action ==='sacar'){
            withdraw()

        }else if (action === 'sair'){
            console.log(chalk.bgBlue.black('obrigado por utilizar o account'))
            process.exit()
        }

        console.log(action)
    }) //solução das opções
       .catch((err)=> console.log(err))
}

//criar conta

function createAccount(){
    console.log(chalk.bgGreen.black('parabéns por escolher Nosso Banco'))
    console.log(chalk.green('Defina as opções da sua conta a seguir:'))

    buildAccount()
}

//construir conta

function buildAccount(){
    inquirer.prompt([
    {
      name:'accountName',  
      message:'digite um nome para a sua conta:'
    }
    ]).then(answer => {
        const accountName = answer['accountName']

        console.info(accountName)

        //criando banco de dados para buscar contas criadas
        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }
        //verificar se a conta existe
        if(fs.existsSync(`accounts/${accountName}.jason`)){
            console.log(chalk.bgRed.black('Esta conta já existe escolha outro nome!')
            )
            //validação da buildaccount
            buildAccount()
            return
        }
         fs.writeFileSync(`accounts/${accountName}.jason`,
         '{"balance":0}',
         function(err){
             console.log(err)
         },
         ) 
         console.log(chalk.green('Parabéns,a sua conta foi criada!'))
         //escolher a proxima operação
         operation() 

    })
    .catch((err) => console.log(err))
}

//add amount to user account
function deposit(){
    inquirer.prompt([{
        name:'accountName',
        message:'Qual o nome da sua conta?'
    }
])
.then((answer) =>{
    const accountName = answer['accountName']
    if(!checkAccount(accountName)){
        return deposit()
    }
    inquirer.prompt([
        {
            name:'amount',
            message:'quanto vc deseja depositar?'
        },
    ]).then((answer)=>{
        const amount = answer['amount']

        //add an amount
        addAmount(accountName,amount)
        operation()

    }).catch(err => console.log(err))
//verificando se a conta existe


})
.catch(err => console.log(err))
}

//função para chegar conta
function checkAccount(accountName){
    //não esquecer exclamação
    if(!fs.existsSync(`accounts/${accountName}.jason`)){
    console.log(chalk.bgRed.black('esta conta n existe,escolha outro nome'))
    return false
}
return true
}

function addAmount(accountName,amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('ocorreu um erro tente novamente mais tarde'))
        return deposit()
    }

    accountData.balance = parseFloat(amount)+parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.jason`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        }
    )
    console.log(chalk.green(`foi depositado o valor de R$${amount} na sua conta!`)
    )
    

}

function getAccount(accountName){
    const accountJASON = fs.readFileSync(`accounts/${accountName}.jason`,{
        encoding: 'utf8',
        flag:'r'
    })

    return JSON.parse(accountJASON)

}

//show account balance

function getAccountBalance(){
    inquirer
    .prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer)=>{
        const accountName = answer['accountName']
        //verificar exist~encia
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }
        const accountData = getAccount(accountName)
        console.log(chalk.bgBlue.black(
            `olá, o saldo da sua conta é de R$${accountData.balance}`
        ),
        )
         operation()   
    })
    .catch(err => console.log(err))
}
function withdraw(){
    inquirer.prompt([
        {
            name:'accountName',
            message:'qual o nome da sua conta?'
        }
    ]).then((answer)=>{
        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return withdraw()
        }
        inquirer.prompt([
            {
                name: 'amount',
                message: 'quanto voce deseja sacar?'
            }
        ]).then((answer)=>{
          const amount =  answer['amount'] 

          removeAmount(accountName,amount)
          

        }).catch(err =>console.log(err))
    }).catch(err => console.log(err))
}

function removeAmount(accountName,amount){

    const accountData = getAccount(accountName)
    if(!amount){
        console.log(chalk.bgRed.black('ocorreu um erro tente novamente mais tarde!'))
        return withdraw()
    }
    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('saldo insuficiente!'))
        return withdraw()

    }
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/ ${accountName}.jason`,
        JSON.stringify(accountData),
        function(err){
            console.log(err)
        },
    )
        console.log (chalk.green(`foi realizado um saque de ${amount} da sua conta!`))
        return operation()
        
}
