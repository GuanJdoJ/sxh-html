const { series, src, dest, watch } = require('gulp');
var $ = require('gulp-load-plugins')();
//加入括号调用 对函数进行实例化
var open = require('open');

// src:源代码
// build 编译之后的代码
// prdPath 用于部署
var app = {
	srcPath: 'src/',
	devPath: 'build/',
};
// src**/*代表对这个文件夹下的所有文件进行深度编译 同时读取所有文件  如果加了后缀js，代表只读取js

function css() {
	return src(app.srcPath + 'css/**')
		.pipe(dest(app.devPath + 'css'))
		.pipe($.connect.reload());
}

function public() {
	return src(app.srcPath + 'public/**')
		.pipe(dest(app.devPath + 'public'))
		.pipe($.connect.reload());
}

function html() {
	return src(app.srcPath + '**/*.html')
		.pipe(dest(app.devPath))
		.pipe($.connect.reload());
}

function less() {
	return src(app.srcPath + 'css/**/*.less')
		.pipe($.plumber())
		.pipe($.less())
		.pipe($.autoprefixer())
		.pipe(dest(app.devPath + 'css'))
		.pipe($.cssmin())
		.pipe($.connect.reload());
}

function js() {
	return src(app.srcPath + 'js/**/*.js')
		.pipe($.plumber())
		.pipe(dest(app.devPath + 'js'))
		.pipe($.uglify())
		.pipe($.connect.reload());
}

function image() {
	return src(app.srcPath + 'images/**')
		.pipe(dest(app.devPath + 'images'))
		.pipe($.connect.reload());
}

function fonts() {
	return src(app.srcPath + 'fonts/**')
		.pipe(dest(app.devPath + 'fonts'))
		.pipe($.connect.reload());
}

const build = series( js, less, css, public, html, image, fonts, function (cb) {
	cb()
});

const serve = series(build, function (cb) {
	$.connect.server({
		root: [app.devPath],
		livereload: true,
		port: 8090
	});

	open('http://localhost:8090');
	//实时构建
	watch(app.srcPath + '**/*.html',
		html
	);
	watch(app.srcPath + 'css/**/*.less',
		less
	);
	watch(app.srcPath + 'css/**',
		css
	);
	watch(app.srcPath + 'js/**/*.js',
		js
	);
	watch(app.srcPath + 'images/**',
		image
	);
	cb()
});

exports.default = serve;
exports.build = build;
