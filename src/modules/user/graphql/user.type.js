import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const userType = new GraphQLObjectType({
  name: "user",
  fields: {
    _id: {
      type: GraphQLID,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    provider: {
      type: GraphQLString,
    },
    DOB: {
      type: GraphQLString,
      resolve: (parent) => {
        return parent.DOB.toISOString();
      },
    },
    isConfirmed: {
      type: GraphQLBoolean,
    },
    profilePic: {
        type:new GraphQLObjectType({
            name:"profilePic",
            fields:{
                secure_url: {
                    type: GraphQLString,
                  },
                  public_id: {
                    type: GraphQLString,
                  },
            }
        })
   
    },
    createdAt: {
      type: GraphQLString,
      resolve: (parent) => {
        return parent.createdAt.toISOString();
      },
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (parent) => {
        return parent.updatedAt.toISOString();
      },
    },
  },
});
