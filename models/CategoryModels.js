const {Model} = require('objection')
const knex = require('../settings/db')







Model.knex(knex)

class Categories extends Model {
    static get tableName(){
        return "category"
    }
}

module.exports = Categories
    