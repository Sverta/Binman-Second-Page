"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
// const eslint = require("gulp-eslint");
const gulp = require("gulp");
 const concat = require("gulp-concat"); // Объединение файлов - конкатенация
 const uglify = require("gulp-uglify"); // Минимизация javascript
 const imagemin = require("gulp-imagemin");
 const newer = require("gulp-newer");
 const plumber = require("gulp-plumber");
 const postcss = require("gulp-postcss");
 const rename = require("gulp-rename");
 const rigger = require('gulp-rigger');
 const sass = require("gulp-sass");
 const webpack = require("webpack");
 const webpackconfig = require("./webpack.config.js");
 const webpackstream = require("webpack-stream");
 const svgSprite = require('gulp-svg-sprite');
 const svgmin = require('gulp-svgmin');

// BrowserSync
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: "./build/assets"
		},
		host: 'localhost',
		port: 9000,
		open: true,
		notify: false  
	});
	done();
}

// BrowserSync Reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}

// Clean assets
function clean() {
	return del(["build/assets/"]);
}

// Optimize Images
function images() {
	return gulp
	.src("./assets/img/*.png")
	.pipe(newer("build/assets/img"))
	.pipe(
		imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.jpegtran({ progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			// imagemin.svgo({
			// 	plugins: [
			// 	{
			// 		removeViewBox: false,
			// 		collapseGroups: true
			// 	}
			// 	]
			// })
			])
		)
	.pipe(gulp.dest("build/assets/img"));
}
// HTML task
function html() {
	return gulp
	.src("./assets/*.html")

	.pipe(rigger())	
	// .pipe(plumber())
	.pipe(gulp.dest("build/assets/"))
	.pipe(browsersync.stream());
}
// SVG task

function svgSpr() {
	return gulp
	.src('./assets/img/**/*.svg')
	.pipe(svgmin({
		js2svg: {
			pretty: true
		}
	}))
	.pipe(svgSprite({
		mode: {
			stack: {
                        sprite: "../sprite.svg"  //sprite file name
                    }
                },
            }
            ))
	// .pipe(
	// 	imagemin([
	// 		imagemin.svgo({
	// 			plugins: [
	// 			{
	// 				removeViewBox: false,
	// 				collapseGroups: true
	// 			}
	// 			]
	// 		})
	// 		])
	// 	)
	.pipe(gulp.dest('build/assets/sprites','assets/sprites'));
};

// CSS task
function css() {
	return gulp
	.src("./assets/scss/**/*.scss")
	.pipe(plumber())
	.pipe(sass({ outputStyle: "expanded" }))
	.pipe(gulp.dest("build/assets/css/"))
	.pipe(rename({ suffix: ".min" }))
	.pipe(postcss([autoprefixer(), cssnano()]))
	.pipe(gulp.dest("build/assets/css/"))
	.pipe(browsersync.stream());
}

// Lint scripts
function scriptsLint() {
	return gulp
	.src(["./assets/js/**/*", "./gulpfile.js"])
	.pipe(plumber())
	// .pipe(eslint())
	// .pipe(eslint.format())
	// .pipe(eslint.failAfterError());
}

// Transpile, concatenate and minify scripts
function scripts() {
	return (
		gulp
		.src([  
			'node_modules/jquery/dist/jquery.js',
			'node_modules/bootstrap/dist/js/bootstrap.js',
			"./assets/js/**/*"])
		.pipe(plumber())
		 .pipe(concat('scripts.js')) // объеденим все js-файлы в один 
        .pipe(uglify()) // вызов плагина uglify - сжатие кода
        .pipe(rigger())
        .pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
		// .pipe(webpackstream(webpackconfig, webpack))
      // folder only, filename is specified in webpack config
      .pipe(gulp.dest("build/assets/js/"))
      .pipe(browsersync.stream())
      );
}
// FONTS task
function fonts() {
	return gulp
	.src("./assets/fonts/**/*")
	.pipe(gulp.dest("build/assets/fonts/"))
	.pipe(browsersync.stream());
}


// Jekyll
// function jekyll() {
// 	return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
// }

// Watch files
function watchFiles() {
	gulp.watch("./assets/html/**/*", html);	
	gulp.watch("./assets/scss/**/*", css);
	gulp.watch("./assets/js/**/*", gulp.series(scriptsLint, scripts));
	// gulp.watch(
	// 	[
	// 	"./_includes/**/*",
	// 	"./_layouts/**/*",
	// 	"./_pages/**/*",
	// 	"./_posts/**/*",
	// 	"./_projects/**/*"
	// 	],
	// 	// gulp.series(jekyll, browserSyncReload)
	// 	);
	gulp.watch("./assets/img/**/*", images);
	gulp.watch("./assets/img/**/*", svgSpr);
	gulp.watch("./assets/fonts/**/*", fonts);	
}

// define complex tasks
const js = gulp.series(scriptsLint, scripts);
const build = gulp.series(clean, gulp.parallel(html, css,fonts, js, svgSpr, images));
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.images = images;
exports.svgSpr = svgSpr;
exports.fonts = fonts;
exports.html = html;
exports.css = css;
exports.js = js;
// exports.jekyll = jekyll;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;