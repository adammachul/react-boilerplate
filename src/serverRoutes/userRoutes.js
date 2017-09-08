import { Router } from 'express';
import * as UserController from '../controllers/userController';
const router = new Router();

// Get all Posts
router.route('/').get(UserController.getUsers);
router.route('/:email').get(UserController.getUser);

// router.route('/:userid').get(PostController.getCos);

export default router;
