const {Model} = require('objection')
const knex = require('../settings/db')







Model.knex(knex)

class Order_Product extends Model {
    static get tableName(){
        return "order_product"
    }
}

module.exports = Order_Product
    