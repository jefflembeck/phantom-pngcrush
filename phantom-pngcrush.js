/*
 * phantom-pngcrush
 * 
 *
 */

/*global phantom:true*/
/*global require:true*/
/*global console:true*/
/*
phantom args sent in:
	[0] - input file
  [1] - output file
*/

(function(){
  "use strict";

  var execFile = require( "child_process" ).execFile;
  var fs = require( "fs" );

  var options = {
    input: phantom.args[0],
    output: phantom.args[1]
  };

  var exit = function(){
    phantom.exit(0);
  };

  //if input is a directory, output should be a directory as well, cycle
  //through entire folder, slam all of the stuff out

  if( !options.input ){
    console.log( "REQUIRES AN INPUT" );
    exit();
  }

  var input = options.input,
    absInput = fs.absolute( input ),
    output = options.output,
    filelist, relFiles, filequery;

  if( fs.isDirectory( absInput ) ){
    if( !fs.exists( output ) ){
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
    execFile( "pngcrush", [ input , options.output ] , null , function( err, stdout, stderr ){
      exit();
    });
  }

}());
