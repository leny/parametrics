/* leny/parametrics
 *
 * /script/parametrics - main script
 *
 * coded by leny@flatLand!
 * started at 23/10/2016
 */

// NOTE: this is a bug W.I.P. Some wild & shiny refactors may appear.

window.RandomEQ = function( iRadius, iDelta ) {
    this.radius = iRadius;
    this.delta = iDelta;
    this.centerX = 0;
    this.centerY = 0;
    this.translation = 0;
};

window.RandomEQ.prototype.getNext = function() {
    var iX = this.centerX + Math.cos( this.translation ) * this.radius,
        iY = this.centerY + Math.sin( this.translation ) * this.radius;

    this.translation += this.delta;
    return [ iX, iY ];
};

( function() {

    "use strict";

    var oCanvas, iWidth, iHeight, oContext,
        fInit, fFillForm, fExtractForm, fExtractSeed, fDraw, fDrawWave;

    fExtractSeed = function( sSeed ) {
        var oParams, iWaves,
            oGenerator = new MersenneTwister( sSeed );

        oParams = {
            "width": 1920,
            "height": 1080,
            "x": 960,
            "y": 540,
            "waves": [],
        };

        iWaves = Math.ceil( oGenerator.random() * 3 );

        while ( iWaves-- ) {
            oParams.waves.push( {
                "color": "rgba( " + Math.floor( oGenerator.random() * 255 ) + ", " + Math.floor( oGenerator.random() * 255 ) + ", " + Math.floor( oGenerator.random() * 255 ) + ", " + ( 0.25 + oGenerator.random() * 0.75 ) + " )",
                "eq": [
                    new RandomEQ( oGenerator.random() * -1 * 1080 / 4, oGenerator.random() * -1 * 10 ),
                    new RandomEQ( oGenerator.random() * -1 * 1080 / 3, oGenerator.random() * 10 ),
                    new RandomEQ( oGenerator.random() * -1 * 1080 / 2, oGenerator.random() * 10 ),
                    new RandomEQ( oGenerator.random() * -1 * 1080 / 2, oGenerator.random() * -1 * 10 )
                ],
                "loops": Math.round( oGenerator.random() * 720 ),
                "thickness": Math.ceil( oGenerator.random() * 3 ),
            } );
        }

        return oParams;
    };

    fInit = function() {
        var iSeed, oParams;

        oCanvas = document.querySelector( "canvas" );
        if ( !( oContext = oCanvas.getContext( "2d" ) ) ) {
            return console.error( "Seriously, dude?" );
        }

        if ( location.hash ) {
            iSeed = parseInt( location.hash.replace( "#", "" ) );
        }

        iSeed = isNaN( iSeed ) ? Math.round( Math.random() * 1000000000 * 1000000000 ) : iSeed;

        fDraw( iSeed );

        document.querySelector( ".frame" ).addEventListener( "click", function( oEvent ) {
            oEvent.preventDefault();
            fDraw( Math.round( Math.random() * 1000000000 * 1000000000 ) );
        } );
    };

    fDraw = function( iSeed ) {
        var oParams = fExtractSeed( iSeed );

        location.hash = iSeed;

        oCanvas.width = oParams.width;
        oCanvas.height = oParams.height;
        oContext.clearRect( 0, 0, oParams.width, oParams.height );
        oContext.fillStyle = "white";
        oContext.fillRect( 0, 0, oParams.width, oParams.height );
        oContext.translate( oParams.x, oParams.y );

        oParams.waves.forEach( fDrawWave );
    }

    fDrawWave = function( oParams ) {
        var aPos1 = oParams.eq[ 0 ].getNext(),
            aPos2 = oParams.eq[ 0 ].getNext(),
            iLoopCount = oParams.loops,
            aLoopPosOne, aLoopPosTwo, aLoopPosThree, aLoopPosFour;

        oContext.strokeWidth = oParams.thickness;
        oContext.strokeStyle = oParams.color;

        oContext.beginPath( aPos1[ 0 ] + aPos2[ 0 ], aPos1[ 1 ], aPos2[ 1 ] );

        while ( iLoopCount-- ) {
            aLoopPosOne = oParams.eq[ 0 ].getNext();
            aLoopPosTwo = oParams.eq[ 1 ].getNext();
            aLoopPosThree = oParams.eq[ 2 ].getNext();
            aLoopPosFour = oParams.eq[ 3 ].getNext();
            oContext.bezierCurveTo( aLoopPosFour[ 0 ], aLoopPosFour[ 1 ], aLoopPosThree[ 0 ], aLoopPosThree[ 1 ], aLoopPosOne[ 0 ] + aLoopPosTwo[ 0 ], aLoopPosOne[ 1 ] + aLoopPosTwo[ 1 ] );
            oContext.stroke();
        }

        oContext.closePath();
    };

    window.addEventListener( "DOMContentLoaded", fInit );

} )();
