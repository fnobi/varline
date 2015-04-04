varline
===================

resolve js dependencies and concat.


## install

```
npm install varline
```

## use in grunt.js

```javascript
// Gruntfile.js

grunt.loadNpmTasks('varline');

grunt.initConfig({
    varline: {
        dev: {
            // script names for resolve
            scripts: ['hoge'],
            
            // output directory
            dest: 'js',
            
            // glob pattern for js dependencies
            loadPath: [JS + '/*.js', JS_LIB + '/*.js'],
            
            // names for name
            ignore: [],
            
            // names for adding dependencies forcibly
            forced: [],
            
            // use warpper module on output
            wrap: true,
            
            // name alias
            alias: {
              $: 'jquery',
              _: 'underscore'
            }
        }
    }
});
```

## use in gulp.js

```javascript
// gulpfile.js

var varline = require('varline').gulp;

gulp.task('js', function () {
    var opts = {
        // glob pattern for js dependencies
        loadPath: [ 'src/js/*.js', 'src/js/lib/*.js' ],

        // use warpper module on output
        wrap: true,

        // name alias
        alias: {
            $: 'jquery',
            _: 'underscore'
        }
    };

    gulp.src('src/js/hoge.js')
        .pipe(varline(opts))
        .pipe(gulp.dest('js'));
});
```
