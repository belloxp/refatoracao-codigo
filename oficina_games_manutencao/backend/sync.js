const {Cliente, Console, Agendamento} = require('./models/rel')
const conn = require('./db/conn')

async function syncDataBase(){
    try{
        await conn.sync({force:true})
        console.log('sync tabelas . . .')
    }catch(err){    
        console.error('erro ao sincronizar tabelas'  ,err)
    }finally{
        await conn.close()
        console.log('fechando a conexão com o banco de dados . . .')
    }
}

syncDataBase()