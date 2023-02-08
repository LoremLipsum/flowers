import gulp from "gulp";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import csso from 'postcss-csso';
import htmlmin from 'gulp-htmlmin';
import { stacksvg } from "gulp-stacksvg";
import svgo from "gulp-svgmin";
import terser from 'gulp-terser';
import { deleteAsync } from 'del';
import browser from "browser-sync";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import squoosh from 'gulp-libsquoosh';
import gulpIf from 'gulp-if';
import ghpages from 'gh-pages';

const { src, dest, watch, series, parallel } = gulp;
const sass = gulpSass(dartSass);

let isDevelopment = true;

export function getMarkup () {
	return src('./source/pages/*.html')
		.pipe(htmlmin({ collapseWhitespace: !isDevelopment }))
		.pipe(dest('./build'))
}

export function getStyles () {
	return src('./source/styles/*.scss', { sourcemaps: isDevelopment })
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer(),
			csso()
		]))
		.pipe(dest('./build/css', { sourcemaps: false }))
		.pipe(browser.stream());
}

export function getScripts () {
	return src('./source/js/**/*')
		.pipe(terser())
		.pipe(dest('./build/js'))
		.pipe(browser.stream());
}

export function createStack () {
	return src(["./source/icons/**/*.svg", "!./icons/stack.svg"])
		.pipe(svgo())
		.pipe(stacksvg())
		.pipe(dest("./build/icons"));
}

export function optimizeImages () {
	return src('./source/images/**/*.{png,jpg}')
		.pipe(gulpIf(!isDevelopment, squoosh()))
		.pipe(dest('build/images'))
}

export function copyAssets () {
	return src([
		'./source/fonts/**/*.{woff2,woff}',
		'./source/*.ico',
		'./source/images/*.svg*',
		'./source/favicons/*',
		'./source/*.webmanifest'
	], {
		base: './source'
	})
		.pipe(dest('./build'))
}

ghpages.publish('build', function(err) {});

export function removeBuild () {
	return deleteAsync('./build');
};

export function startServer(done) {
	browser.init({
		server: {
			baseDir: './build'
		},
		cors: true,
		notify: false,
		ui: false,
	});
	done();
}

function reloadServer (done) {
	browser.reload();
	done();
}

function watchFiles () {
	watch('./source/styles/**/*.scss', series(getStyles));
	watch('./source/js/*.js', series(getScripts, reloadServer));
	watch('./source/pages/*.html', series(getMarkup, reloadServer));
	watch('./source/icons/**/*.svg', series(createStack, reloadServer));
}

export function compileProject (done) {
	parallel(
		getStyles,
		getMarkup,
		getScripts,
		createStack,
		copyAssets,
		optimizeImages
	)(done);
}

// Production
export function build (done) {
	isDevelopment = false;
	series(
		removeBuild,
		compileProject
	)(done);
}

// Development
export function runDev (done) {
	series(
		removeBuild,
		compileProject,
		startServer,
		watchFiles
	)(done);
}
