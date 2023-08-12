const express =require('express');
const router = express.Router();
const movieController=require('../controllers/movieController');

//app routes
router.get('/', movieController.login);
router.get('/logout', movieController.logout);
router.post('/', movieController.insertuser);
router.post('/index', movieController.loginsubmit);
router.get('/index', movieController.redirect);
router.get('/details/:id', movieController.expolremovies);
router.post('/search', movieController.searchmovie);
router.get('/submit', movieController.submitmovie);
router.post('/submit', movieController.submitpost);
router.get('/explore-latest', movieController.latest);
router.get('/register', movieController.signuppage);
router.get('/genere/:name', movieController.generedisplay);
router.get('/about', movieController.about);
router.post('/commentpost', movieController.commentpost);

router.get('/adminindex', movieController.adminindex);
router.get('/adminlogin', movieController.adminlogin);
router.post('/adminindex', movieController.checkadmin);
router.post('/adminsearch', movieController.adminsearch);
router.get('/admingenere/:name', movieController.admingenere);
router.get('/adetails/:id', movieController.aexpolremovies);
router.post('/adetails', movieController.deletemovie);
router.post('/update', movieController.updatemovies);
router.post('/updatemovie', movieController.updatehere);
router.get('/alogout', movieController.alogout);

module.exports=router;