import { Company } from "../../../db/models/company.model.js";
import { User } from "../../../db/models/user.model.js";
import { isAuthenticated } from "../../../graphql/auth.graphql.js";
import { isAuthorized } from "../../../graphql/authorization.graphql.js";
import { roles } from "../../../utils/enums.js";
import { mesaages } from "../../../utils/messages/index.js";

export const getUsers = async (parent, args, context) => {
  await isAuthenticated(context);
  isAuthorized(roles.ADMIN,context.userExist)
const users =await User.find()
if (users.length<1) {
    throw new Error(mesaages.USER.notFound)
    
}
return {success:true,data:users}
};

export const getCompanies = async (parent, args, context) => {
  await isAuthenticated(context);
  isAuthorized(roles.ADMIN,context.userExist)
const companies =await Company.find()
if (companies.length<1) {
    throw new Error(mesaages.COMPANY.notFound)
    
}
return {success:true,data:companies}
};
