import { connectBD } from "./db/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import adminRouter from "./modules/admin/admin.controller.js";
import companyRouter from "./modules/company/company.controller.js";
import jobRouter from "./modules/jobopportunity/jobopportunity.controller.js";
import applicationRouter from "./modules/application/application.controller.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./app.schema.js";
import { globalError, notFound } from "./utils/index.js";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";

const bootStrap = async (app, express) => {
  app.use(
    rateLimit({
      windowMs: 2 * 60 * 1000,
      limit: 10,
      legacyHeaders: false,
      limit: (req, res, next) => {},
      handler: (req, res, next, options) => {
        return next(new Error(options.message, { cause: options.statusCode }));
      },
      legacyHeaders: false,
    })
  );
  app.use(helmet());

  await connectBD();
  app.all(
    "/graphql",
    createHandler({
      schema,
      context: (req) => {
        const { token } = req.headers;
        return { token };
      },
      formatError: (error) => {
        return {
          success: false,
          statusCode: error.originalError?.cause || 500,
          message: error.originalError?.message,
          stack: error.originalError?.stack,
        };
      },
    })
  );
  // app.use(cronJob)
  app.use(cors("*"));
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/admin", adminRouter);
  app.use("/company", companyRouter);
  app.use("/job", jobRouter);
  app.use("/application", applicationRouter);

  app.use("*", notFound);
  app.use(globalError);
};
export default bootStrap;
