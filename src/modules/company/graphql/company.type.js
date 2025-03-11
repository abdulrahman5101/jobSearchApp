import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const companyType = new GraphQLObjectType({
  name: "company",
  fields: {
    _id: {
      type: GraphQLID,
    },
    companyName: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    industry: {
      type: GraphQLString,
    },
    address: {
      type: GraphQLString,
    },
    numberOfEmployees: {
      type: GraphQLInt,
    },
    companyEmail: {
      type: GraphQLString,
    },
    createdBy: {
      type: GraphQLID,
    },
    logo: {
      type: new GraphQLObjectType({
        name: "logo",
        fields: {
          secure_url: {
            type: GraphQLString,
          },
          public_id: {
            type: GraphQLString,
          },
        },
      }),
    },
    coverPic: {
      type: new GraphQLObjectType({
        name: "coverPic",
        fields: {
          secure_url: {
            type: GraphQLString,
          },
          public_id: {
            type: GraphQLString,
          },
        },
      }),
    },
    HRs: {
      type: new GraphQLList(GraphQLID),
    },
    bannedAt: {
      type: GraphQLString,
      resolve: (parent) => {
        return parent.createdAt.toISOString();
      },
    },
    deletedAt: {
      type: GraphQLString,
      resolve: (parent) => {
        return parent.createdAt.toISOString();
      },
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
    legalAttachment: {
      type: new GraphQLObjectType({
        name: "legalAttachment",
        fields: {
          secure_url: {
            type: GraphQLString,
          },
          public_id: {
            type: GraphQLString,
          },
        },
      }),
    },
    approvedByAdmin:{
      type:GraphQLBoolean
    }
  },
});
