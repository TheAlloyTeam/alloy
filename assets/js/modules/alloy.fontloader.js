(function( w ){
    // if the class is already set, we're good.
    if( w.document.documentElement.className.indexOf( "fonts-loaded" ) > -1 ){
        return;
    }
    var fontA = new w.FontFaceObserver( "Playfair Display", {
        weight: 400
    });

    var fontB = new w.FontFaceObserver( "Playfair Display", {
        weight: 700
    });

    var fontC = new w.FontFaceObserver( "Open Sans", {
        weight: 400
    });

    var fontD = new w.FontFaceObserver( "Open Sans", {
        weight: 700
    });

    w.Promise
        .all([fontA.check(), fontB.check(), fontC.check(), fontD.check() ])
        .then(function(){
            w.document.documentElement.className += " fonts-loaded";
        });

}( this ));