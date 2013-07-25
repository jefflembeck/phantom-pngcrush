/*global require:true*/
/*global console:true*/
(function(exports) {
  "use strict";

  var execFile = require( "child_process" ).execFile;
  var fs = require( "fs" );

  exports.makeOutputDir = function( outputDir , isDir ){
    var output = fs.absolute( outputDir );
    if( !fs.exists( output ) ){
      fs.makeDirectory( output );
    } else if( isDir ){
      fs.removeTree( output );
      fs.makeDirectory( output );
    }
  };

  exports.buildQuery = function( absInput , output ){
    var filelist, relFiles, filequery, arr;
    filelist = fs.list( absInput );
    relFiles = filelist.slice( 2 );
    filequery = relFiles.map( function( file ){
      return absInput + "/" + file;
    });
    arr = [ "-d", output ];
    arr.push.apply( arr , filequery );
    return arr;
  };


  exports.crush = function( options , callback ){
    var input = options.input,
      absInput = fs.absolute( input ),
      output = options.outputDir,
      outputFile = options.outputFilename,
      filequery;

    if( typeof output !== "undefined" && output !== null ){
      this.makeOutputDir( output, fs.isDirectory( absInput ) );
    }
    if( fs.isDirectory( absInput ) ){
      filequery = this.buildQuery( absInput , output );
      execFile( "pngcrush", filequery , null, function( err , stdout, stderr ){
        if( err ){
          console.log( err );
        }
        callback();
      });
    } else {
      execFile( "pngcrush", [ input , output + outputFile ] , null , function( err , stdout, stderr ){
        if( err ){
          console.log( err );
        }
        callback();
      });
    }
  };

}(typeof exports === 'object' && exports || this));

