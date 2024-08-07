
// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'js',
    paths: {
        'esri': 'https://js.arcgis.com/4.30/esri',
        'app': 'app',
        'utils': 'utils',
        'categories':"../config/categories.json"

    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['js/app']);