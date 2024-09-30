const {Model} = require('objection')
const knex = require('../settings/db')







Model.knex(knex)

class Clients extends Model {
    static get tableName(){
        return "client"
    }
}

module.exports = Clients
    