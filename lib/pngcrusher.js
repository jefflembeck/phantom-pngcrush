
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

  var handleProcess = function( err , stdout , stderr ){
    if( err ){
      console.log( err );
      exit( 1 );
    }
    exit();
  };

  exports.makeOutputDir = function( outputDir ){
    var output = fs.absolute( outputDir );
    if( !fs.exists( output ) ){
      fs.makeDirectory( output );
    } else {
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


  exports.crush = function( options ){
    var input = options.input,
      absInput = fs.absolute( input ),
      output = options.output,
      filequery;

    if( fs.isDirectory( absInput ) ){
      this.makeOutputDir( output );
      filequery = this.buildQuery( absInput , output );
      execFile( "pngcrush", filequery , null, handleProcess );
    } else {
      execFile( "pngcrush", [ input , output ] , null , handleProcess );
    }
  };

}(typeof exports === 'object' && exports || this));
