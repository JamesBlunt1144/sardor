const {Model} = require('objection')
const knex = require('../settings/db')







Model.knex(knex)

class Order_Client extends Model {
    static get tableName(){
        return "order_client"
    }
}

module.exports = Order_Client
    