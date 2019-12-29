const express = require("express");
const graphql = require('graphql');
const egraph = require('express-graphql')
const mysql = require('../../util/db')
const router = express();

var schema=graphql.buildSchema(
    `
     type coupon{
        
     }
     type Query{
        
     }
    `
)