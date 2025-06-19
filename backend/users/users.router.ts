import { Router } from 'express';
import { signin, signup, signout, refreshToken } from './users.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/signin', signin);
router.post('/signup', upload.single('profile_picture'), signup);
router.post('/signout', signout);
router.post('/refresh-token', refreshToken);


export default router;