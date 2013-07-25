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

  var crusher = require( "./lib/pngcrusher" );

  var options = {
    input: phantom.args[0],
    output: phantom.args[1]
  };

  if( !options.input ){
    console.log( "REQUIRES AN INPUT" );
    phantom.exit();
  }

  crusher.crush( options );

}());
