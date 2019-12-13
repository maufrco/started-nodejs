const { sequelize } = require('../../src/app/models');
//limpar todos os dados usados em testes
module.exports = () =>{
    return Promise.all(Object.keys(sequelize.models).map(key=>{
        return sequelize.models[key].destroy({truncate: true, force:true})
    }));
}