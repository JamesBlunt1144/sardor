const {Model} = require('objection')
const knex = require('../settings/db')






Model.knex(knex)

class Products extends Model {
    static get tableName(){
        return "product"
    }
}

module.exports = Products
