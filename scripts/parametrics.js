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
        fInit, fGetParametrics, fDraw;

    fInit = function() {
        oCanvas = document.querySelector( "canvas" );
        if ( !( oContext = oCanvas.getContext( "2d" ) ) ) {
            return console.error( "Seriously, dude?" );
        }
        iWidth = oCanvas.clientWidth;
        iHeight = oCanvas.clientHeight;

        oCanvas.width = iWidth * 2;
        oCanvas.height = iHeight * 2;

        oContext.clearRect( 0, 0, iWidth * 2, iHeight * 2 );
        oContext.translate( iWidth, iHeight );

        fDraw();
        fDraw( true );
    };

    fGetParametrics = function( bMagic ) {
        var iRandomParam = Math.random() * 10;

        return {
            "rand": iRandomParam,
            "eq": [
                new RandomEQ( ( bMagic ? -135 : Math.random() * -1 * iWidth / 3 ), Math.random() * -1 * iRandomParam ),
                new RandomEQ( ( bMagic ? -165 : Math.random() * -1 * iWidth / 2 ), Math.random() * iRandomParam ),
                new RandomEQ( ( bMagic ? 150 : Math.random() * -1 * iWidth / 3 ), Math.random() * iRandomParam ),
                new RandomEQ( ( bMagic ? 135 : Math.random() * -1 * iWidth ), Math.random() * iRandomParam )
            ],
        };
    };

    fDraw = function( bMagic ) {
        var oParams = fGetParametrics( bMagic ),
            aPos1 = oParams.eq[ 0 ].getNext(),
            aPos2 = oParams.eq[ 0 ].getNext(),
            iLoopCount = 180 + Math.round( Math.random() * 180 ) * Math.round( Math.random() * 2 ),
            aLoopPosOne, aLoopPosTwo, aLoopPosThree, aLoopPosFour;

        oContext.strokewidth = Math.ceil( Math.random() * 3 );
        oContext.strokeStyle = "rgba( " + Math.floor( Math.random() * 255 ) + ", " + Math.floor( Math.random() * 255 ) + ", " + Math.floor( Math.random() * 255 ) + ", " + ( 0.25 + Math.random() * 0.75 ) + " )";

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
