// for optimizing assests folder 
const gulp=require('gulp');

//import gulp from 'gulp';
const sass=require('gulp-sass')(require('node-sass')); //converts sass tp css 
//import gulpSass from "gulp-sass";
//import nodeSass from "node-sass";
//const sass = gulpSass(nodeSass);

const cssnano=require('gulp-cssnano'); //compresses css to 1 line 
//import cssnano from 'gulp-cssnano';
const rev=require('gulp-rev'); //adds # in the name of the files 
//import rev from 'gulp-rev';

 const uglify=require('gulp-uglify-es').default; //this is used to minify js  //npm i gulp-uglify-es
//import uglify from 'gulp-uglify-es';

// const imagemin=require('gulp-imagemin'); //used to compress images  //npm i gulp-imagemin
//import imagemin from 'gulp-imagemin';
// gulp contains task which needs to be created:- one of the task is to minify the css
gulp.task('css',(done)=> { //css is the name of the task given 
  console.log('minifying css...');
  gulp.src('./assets/sass/**/*.scss') //** means any folder or subfolder inside the assests folder and any .scss files needs to be compressed
     .pipe(sass()) //pipe basically calls the middleware , needs to be passed through gulp-sass module :- converting from sass to css 
     .pipe(cssnano()) //then compressing them 
     .pipe(gulp.dest('./assets.css')); //and put them all here 

    //  changing the naming convention  
    return gulp.src('./assets/**/*.css')
       .pipe(rev()) //renaming with #
       .pipe(gulp.dest('./public/assets')) //putting it in public folder
       .pipe(rev.manifest({
         cwd:'public',//current working directory
         merge:true //if a name of file already exists it will merge ṭhe new name and not create one
       })) //creating a manifest//manifest stores the map of file's new name to file's old name
      .pipe(gulp.dest('./public/assets')); //putting the files here
      
      done();
   })

//making this work by typing gulp css in the terminal

// next task is to minify js files 
gulp.task('js',(done)=>{
   console.log('minifying js...');  
   gulp.src('./assets/**/*.js') //any .js file in assets folder 
    .pipe(uglify()) //calling the uglify middleware 
    .pipe(rev()) //renaming them  
    .pipe(gulp.dest('./public/assets')) //putting the compressed files in public/assets
    .pipe(rev.manifest({
      cwd:'public',//current working directory
      merge:true //if a name of file already exists it will merge ṭhe new name and not create one
    })) //creating a manifest//manifest stores the map of file's new name to file's old name
    .pipe(gulp.dest('./public/assets')); //again have to define the dest for menifests

    done();
})

// next task is to minify the images 
// gulp.task('images',(done)=>{
//    console.log('compressing images...');
//    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)') //finding all the images 
//      .pipe(imagemin()) //using library imagemin 
//      .pipe(rev()) //renaming them 
//      .pipe(rev.manifest({
//       cwd:'public',//current working directory
//       merge:true //if a name of file already exists it will merge ṭhe new name and not create one
//     }))
//     .pipe(gulp.dest('./public/assets')); //putting them in public/assets

//     done();
// })

// next task:- empty the public/assets directory:- whenever project will be build up , previous build up will be deleted 
gulp.task('clean:assets',(done)=>{
   console.log('deleting previous build up..');
   del.sync('./public/assets');
   done();
});

// to run all these four tasks, a new task is created
gulp.task('build',gulp.series('clean:assets','css','js'),(done)=>{
   console.log('building assets');  
   done();
}); //just run gulp build in powershell


