import { GraphQLBoolean, GraphQLList, GraphQLObjectType } from "graphql";
import { userType } from "../../user/graphql/user.type.js";
import { companyType } from "../../company/graphql/company.type.js";

export const getUsersResponse=new GraphQLObjectType({
    name:"getUsersResponse",
    fields:{
        success:{type:GraphQLBoolean},
        data:{type:new GraphQLList(userType)}
    }
})
export const getCompaniesResponse=new GraphQLObjectType({
    name:"getCompaniesResponse",
    fields:{
        success:{type:GraphQLBoolean},
        data:{type:new GraphQLList(companyType)}
    }
})