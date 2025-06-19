import { Router } from 'express';
import { delete_job, get_jobs, get_job, post_job, put_job,scanResumeAndJD, generateQA, saveQA } from './job.controller';
import { upload } from './upload.middleware';


const router = Router();


router.post('/scan', scanResumeAndJD); 
router.post('/generateInterview',generateQA );
router.post('/saveInterview/:jobId',saveQA );
router.get('/', get_jobs);
router.post('/', upload.single('resume'), post_job);
router.get('/:job_id', get_job); 
router.put('/:job_id', put_job);
router.delete('/:job_id', delete_job);


export default router;