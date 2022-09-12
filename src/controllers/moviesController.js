const path = require('path');
const db = require('../database/models');

const moment = require('moment')

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
      
      
        db.Genre.findAll({
            order:[
                ['name','ASC'] 
            ]
        })
        .then(allGenres=>{
           
            return res.render("moviesAdd",{ 
                allGenres
            })
        })
        .catch (error => console.log(error))
      
    },
    create: function (req, res) {
    
        
        const {title,awards,release_date,genre_id,rating,length}=req.body 
        db.Movie.create({ 
            title:title.trim(),
            awards:+awards,
            release_date,
            rating:+rating,
            length:+length,
            genre_id:+genre_id
        })
        
        .then(movie=> {
            console.log(movie);
            return res.redirect('/movies/detail/' + movie.id) 
        })

        .catch(error=>{
            console.log(error);
        })
    },
    edit: function(req, res) {
        
         let movie =db.Movie.findByPk(req.params.id) 
         let allGenres =db.Genre.findAll({ 
            order :[ 'name']
         })
        
       Promise.all([movie,allGenres])
         .then(([movie,allGenres])=> { 

        return res.render('moviesEdit',{
            Movie : movie,
            release_date : moment(movie.release_date).format('YYYY-MM-DD'), 
            allGenres,
        })
       })
       .catch(error=> console.log(error));
    },
    update: function (req,res) {
    
       const {title,awards,release_date,genre_id,rating,length}=req.body
        db.Movie.update(
        {
            title:title.trim(),
            awards:+awards,
            release_date,
            rating:+rating,
            length:+length,
            genre_id:+genre_id
        },
        {

            where :{
                id : req.params.id
            }

        })
      
        .then(()=> res.redirect('/movies/detail/'+ req.params.id))
       
        .catch(error=> console.log(error))
        
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id) 
        .then(Movie=>res.render('moviesDelete',{ 
            Movie
        }))
        .catch(error=> console.log(error)); 
        
        

    },
    destroy: function (req, res) {
   

      db.Movie.destroy({ 
        where:{ 
            id: req.params.id 
        }
      })
      .then(()=>res.redirect('/movies')) 
      .catch(error=>console.log(error));
    }
}

module.exports = moviesController;