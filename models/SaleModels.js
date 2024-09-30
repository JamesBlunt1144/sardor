const {Model} = require('objection')
const knex = require('../settings/db')

Model.knex(knex)

class Sales extends Model {
    static get tableName(){
        return "sales"
    }
}

module.exports = Sales
