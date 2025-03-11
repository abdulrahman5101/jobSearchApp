import { getCompaniesResponse, getUsersResponse } from "./admin.response.js";
import { getCompanies, getUsers } from "./admin.service.js";

export const adminQuery={
    getUsers:{
        type:getUsersResponse,
        resolve:getUsers

    },
    getCompanies:{
        type:getCompaniesResponse,
        resolve:getCompanies
    }
}