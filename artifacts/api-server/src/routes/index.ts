import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cvsRouter from "./cvs";
import templatesRouter from "./templates";
import paymentsRouter from "./payments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cvsRouter);
router.use(templatesRouter);
router.use(paymentsRouter);

export default router;
