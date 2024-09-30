const {Model} = require('objection')
const knex = require('../settings/db')







Model.knex(knex)

class Orders extends Model {
    static get tableName(){
        return "orders"
    }
}

module.exports = Orders
    