require('../models/database');
const { render } = require('ejs');
const user = require('../models/user');
const categories = require('../models/category');
const movie = require('../models/movies');
const comments=require('../models/comment');
var globaluser='';
let alert = require('alert');
//GET

//login
exports.login = async (req, res) => {
    try {
        // const infoErrorsObj = req.flash('infoErrors');
        // const infoSubmitObj = req.flash('infoSubmit');
        // res.render('login', { title: 'MoviePsych', infoErrorsObj, infoSubmitObj  });
        res.render('login', {msg1:''});
        return;
    }
    catch (error) {
        res.render('404');
        // res.satus(500).send({message: error.message || "Error Occured" });
        console.log("error");
    }
}

//after login
exports.loginsubmit = async (req, res) => {
    try {
        let email = req.body.email;
        globaluser=email;
        // console.log(email);
        let pass = req.body.pass;
        // console.log(pass);
        var data = await user.find({ 'email': email, 'pass': pass });
        if (data.length == 1) {
            try {
                const limit = 20;
                const cat = await categories.find({}).limit(limit);
                const latest = await movie.find({}).sort({ _id: -1 }).limit(limit);
                // console.log(cat.length);
                return res.render('index', { cat, latest });
            }
            catch (error) {
                console.log("index error");
                return res.render('404');
            }
        }
        else {
            return res.render('login', {msg1:'Invalid Credentials'});
        }
    }
    catch (error) {
        console.log(error);
        return res.render('404');
    }
}

//details
exports.expolremovies = async (req, res) => {
    try {
        let movid = req.params.id;
        // console.log(movid);
        const movdet = await movie.findById(movid);
        // console.log(movdet);
        const comm=await comments.find({mid:movid});
        // console.log(comm);
        res.render('details', { movdet, comm });
        return;
    }
    catch {
        return res.render('404');
    }
}

//redirect
exports.redirect = async (req, res) => {
    try {
        const limit = 20;
        const cat = await categories.find({}).limit(limit);
        const latest = await movie.find({}).sort({ _id: -1 }).limit(limit);
        // console.log(cat.length);
        return res.render('index', { cat, latest });

    }
    catch (error) {
        console.log(error);
        return res.render('404');
    }
}

//search
exports.searchmovie = async (req, res) => {
    try {
        let searchterm = req.body.searchTerm;
        // console.log(searchterm);
        // let movdet1 = await movie.find({ $or: [{ name: searchterm }, { cast: searchterm }, { genere: searchterm }] });
        let movdet1=await movie.find( { $text: { $search: searchterm, $diacriticSensitive: true } });
        // console.log(movdet1.length);
        if (movdet1.length==0){
            let movdet1=await movie.find({cast:searchterm});
            // console.log(movdet1.length);
            res.render('search', { movdet1 });
            return;
        }
        res.render('search', { movdet1 });
        return;
    }
    catch (error) {
        return res.render('404');
    }
}

//click submit
exports.submitmovie = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infosubmit');
    res.render('submit-movie', { infoErrorsObj, infoSubmitObj });
}

//submit movie
exports.submitpost = async (req, res) => {
    try {
        let imageUploadFile;
        let uploadPath;
        let newImageName;
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files where uploaded.');
        } 
        else {
            imageUploadFile = req.files.img;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.satus(500).send(err);
            })
        }
        // console.log(req.body.name);
        // console.log(req.body.genere);
        // console.log(req.body.des);
        // console.log(req.body.cast);
        // console.log(newImageName);
        var adddingmovies={
            name:req.body.name,
            genere:req.body.genere,
            des:req.body.des,
            cast:req.body.cast,
            img:newImageName
        };
    //    var j= await newmovie.save();
        // console.log(adddingmovies);
        var m=await movie.create(adddingmovies);
        // console.log(m);
        req.flash('infoSubmit', "Movie has been added");
        res.redirect('/submit');
        return;
    }
    catch (error) {
        req.flash('infoErrors', error);
        res.redirect('/submit');
        return;
    }
}

//latest
exports.latest=async(req, res)=>{
    try{
        const num=20;
        const lmovies=await movie.find({}).sort({_id:-1}).limit(num);
        res.render('latest', {lmovies});
        return;
    }
    catch(error){
        res.render('404');
        return;
    }
}

//sign up page
exports.signuppage=async(req, res)=>{
    try{
        res.render('signup', {msg1:''});
        return;
    }
    catch(error){
        res.render('404');
        return;
    }
}

//user insert
exports.insertuser=async(req, res)=>{
    try{
        let email = req.body.email;
        let pass = req.body.pass;
        globaluser=email;
        var data = await user.find({ 'email': email});
        if (data.length>=1){
            res.render('signup', {msg1:'Credentials already exists'});
        }
        var adduser={
            email:req.body.email,
            pass:req.body.pass,
            name:req.body.name
        };
        var u=await user.create(adduser);
        res.redirect('index');
        return;
    }
    catch(error){
        res.render('404');
        return;
    }
}

//genere
exports.generedisplay=async(req, res)=>{
    try{
        const cat=req.params.name;
        let latest1 = await movie.find({genere:cat});
        res.render('genere', {latest1});
        return;
    }
    catch(error){
        res.render('404');
        return;
    }
}

//logout
exports.logout=async(req, res)=>{
    try{
        res.redirect('/');
        return;
    }
    catch(error){
        res.render('404');
        return;
    }
}

//about
exports.about = async(req, res)=>{
    try{
        res.render('about');
        return;
    }
    catch(error){
        res.render('404');
        return;
    }
}

//adminlogin
exports.adminlogin = async(req, res)=>{
    try{
        res.render('adminlogin', {msg1:""});
        return;
    }
    catch(error){
        res.render('404');
    }
}

//adminindex
exports.adminindex = async(req, res)=>{
    try {
        const limit = 20;
        const cat = await categories.find({}).limit(limit);
        const latest = await movie.find({}).sort({ _id: -1 }).limit(limit);
        return res.render('adminindex', { cat, latest });
    }
    catch (error) {
        return res.render('404');
    }
}

//adminloginpost
exports.checkadmin = async(req, res)=>{
    try{
        let email = req.body.email;
        let pass = req.body.pass;
        if (email=="som@gmail.com" && pass=="som") {
            try {
                const limit = 20;
                const cat = await categories.find({}).limit(limit);
                const latest = await movie.find({}).sort({ _id: -1 }).limit(limit);
                return res.render('adminindex', { cat, latest });
            }
            catch (error) {
                return res.render('404');
            }
        }
        else {
            return res.render('adminlogin', {msg1:'Invalid Credentials'});
        }
    }
    catch(error){
        res.render('404');
    }
}

//adminsearch
exports.adminsearch = async(req, res)=>{
    try{
        let searchterm = req.body.searchTerm;
        // console.log(searchterm);
        // let movdet1 = await movie.find({ $or: [{ name: searchterm }, { cast: searchterm }, { genere: searchterm }] });
        let movdet1=await movie.find( { $text: { $search: searchterm, $diacriticSensitive: true } });
        // console.log(movdet1.length);
        if (movdet1.length==0){
            let movdet1=await movie.find({cast:searchterm});
            // console.log(movdet1.length);
            res.render('adminsearch', { movdet1 });
            return;
        }
        res.render('adminsearch', { movdet1 });
        return;
    }
    catch(error){
        return res.render('404');
    }
}

//admincategories
exports.admingenere = async(req, res)=>{
    try{
        const cat=req.params.name;
        let latest1 = await movie.find({genere:cat});
        res.render('admingenere', {latest1});
        return;
    }
    catch(error){
        res.render('404');
        return;
    }
}

//adminmovie details
exports.aexpolremovies = async(req, res)=>{
    try {
        let movid = req.params.id;
        // console.log(movid);
        const movdet = await movie.findById(movid);
        // console.log(movdet);
        res.render('admindetails', { movdet });
        return;
    }
    catch {
        return res.render('404');
    }
}

//delete
exports.deletemovie=async(req, res)=>{
    try{
        const mid=req.body.id;
        // console.log(mid);
        const delmovie=await movie.findOneAndDelete({_id:mid});
        // console.log(delmovie);
        // const limit = 20;
        // const cat = await categories.find({}).limit(limit);
        // const latest = await movie.find({}).sort({ _id: -1 }).limit(limit);
        // return res.render('adminindex', { cat, latest });
        return res.redirect('adminindex');
    }
    catch(error){
        res.render('404');
        return;
    }
}
//update
exports.updatemovies=async(req, res)=>{
    try{
        let movid = req.body.id;
        const movdet = await movie.findById(movid);
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infosubmit');
        res.render('updatemovie', { infoErrorsObj, infoSubmitObj, movdet });
    }
    catch(error){
        res.redirect('404');
        return;
    }
}
exports.updatehere = async (req, res) => {
    try {
        let imageUploadFile;
        let uploadPath;
        let newImageName;
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files where uploaded.');
        } 
        else {
            imageUploadFile = req.files.img;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.satus(500).send(err);
            })
        }
        const filter={_id:req.body.id};
        // console.log(filter);
        // console.log(req.body.name);
        // console.log(req.body.genere);
        // console.log(req.body.des);
        // console.log(req.body.cast);
        // console.log(newImageName);
        const adddingmovies={
            name:req.body.name,
            genere:req.body.genere,
            des:req.body.des,
            cast:req.body.cast,
            img:newImageName
        };
        await movie.findOneAndUpdate(filter,adddingmovies);
        // console.log(m);
        req.flash('infoSubmit', "Movie has been updated");
        // const limit = 20;
        // const cat = await categories.find({}).limit(limit);
        // const latest = await movie.find({}).sort({ _id: -1 }).limit(limit);
        // return res.render('adminindex', { cat, latest });
        return res.redirect('adminindex');
    }
    catch (error) {
        req.flash('infoErrors', error);
        res.redirect('/submit');
        return;
    }
}

//commentpost
exports.commentpost = async(req, res)=>{
    try{
        var email=globaluser;
        var movid=req.body.movieid;
        var comment=req.body.comment;
        // console.log(email+" "+movid+" "+comment);
        var adduser={
            email:globaluser,
            comment:req.body.comment,
            mid:req.body.movieid,
        };
        var q=await comments.find({email:globaluser, mid:movid});
        if (q.length>=1){
            res.redirect('index');
            return;
        }
        var u=await comments.create(adduser);
        res.redirect('index');
        return;
    }
    catch(error){
        res.render('404');
    }
}

//adminlogout
exports.alogout = async(req, res)=>{
    try{
        return res.render('adminlogin', {msg1:""});
    }
    catch(error){
        return res.render('404');
    }
}