
/*global phantom:true*/
/*global require:true*/
/*global console:true*/
(function(exports) {
  "use strict";

  var execFile = require( "child_process" ).execFile;
  var fs = require( "fs" );


  var exit = function(){
    phantom.exit(0);
  };

  exports.crush = function( options ){
    var input = options.input,
      absInput = fs.absolute( input ),
      output = options.output,
      filelist, relFiles, filequery;

    if( fs.isDirectory( absInput ) ){
      if( !fs.exists( output ) ){
        fs.makeDirectory( output );
      } else {
        fs.removeTree( output );
        fs.makeDirectory( output );
      }
      filelist = fs.list( absInput );
      relFiles = filelist.slice( 2 );
      filequery = relFiles.map( function( file ){
        return absInput + "/" + file;
      });
      var arr = [ "-d", output ];
      arr.push.apply( arr , filequery );

      execFile( "pngcrush", arr , null, function( err, stdout, stderr ){
        if( err ){
          console.log( err );
          exit( 1 );
        }
        exit();
      });
    } else {
      execFile( "pngcrush", [ input , output ] , null , function( err, stdout, stderr ){
        exit();
      });
    }
  };

}(typeof exports === 'object' && exports || this));
