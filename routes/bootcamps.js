const express = require('express');

const courseRouter = require('./courses');



const {getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require ('../controllers/bootcamps')



const router = express.Router();

const {protect,authorize} = require('../middleware/auth')
//Re-route into another resource

router.use('/:bootcampId/courses',courseRouter);

router.route('/:id/photo')
.put(bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance')
.get(getBootcampsInRadius)


router.route('/')
.get(getBootcamps) 
.post(protect,authorize('publisher','admin'),createBootcamp)

router.route('/:id')
.get(getBootcamp)
.put(protect,authorize('publisher','admin'),updateBootcamp)
.delete(protect,authorize('publisher','admin'),deleteBootcamp)
;
module.exports = router;