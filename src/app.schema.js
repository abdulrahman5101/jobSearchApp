import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { adminQuery } from "./modules/admin/graphql/admin.query.js";

const query = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...adminQuery,
  },
});

export const schema = new GraphQLSchema({
  query,
});
