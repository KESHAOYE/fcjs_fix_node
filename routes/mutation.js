const express = require("express");
const {buildSchema} = require('graphql');
const egraph = require('express-graphql')
const router = express.Router();

var schema = buildSchema(`
   input AccountInput{
       id: ID!
       name:String
       age:Int
       sex:String
       deparment:String
   }
   type Account{
       name:String
       age:Int
       sex:String
       deparment:String
   }
   type mutation{
       createAccount(input:AccountInput):Account
   }
`)

var root = {
   createAccount ({input}) {
     return input.id
   },
   Account(){
       return {}
   }
}

router.get("/", egraph({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

module.exports=router