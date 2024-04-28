import express from 'express';
import { SystemServices } from '../services/systemServices';

export const systemRoutes = express.Router();

systemRoutes.get('/', SystemServices.homeView);

systemRoutes.get('/health', SystemServices.healthCheck);

systemRoutes.get('/version', SystemServices.systemVersion);
