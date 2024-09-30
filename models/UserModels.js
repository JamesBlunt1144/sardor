const {Model} = require('objection')
const knex = require('../settings/db')

Model.knex(knex)

class Users extends Model {
    static get tableName(){
        return "user"
    }
}

module.exports = Users
