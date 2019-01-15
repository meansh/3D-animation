var canvas, W, H, Vmin, ctx;

window.onload = function() {
    canvas = document.querySelector('canvas');
    document.body.onresize = function() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        Vmin = Math.min(W, H);
        ctx = canvas.getContext('2d');
    }
    document.body.onresize();
    render();
}

function Vector(x, y, z) {
    this.x = x; this.y = y; this.z = z;
    
    this.add = function(v) {
        this.x += v.x; this.y += v.y; this.z += v.z;
    }

    this.sub = function(v) {
        this.x -= v.x; this.y -= v.y; this.z -= v.z;
    }

    this.rotate = function(X, Y, Z, v) {
        if(!v) {
            var x = this.x, y = this.y, z = this.z;

            this.y = y*Math.cos(X) - z*Math.sin(X);
            this.z = y*Math.sin(X) + z*Math.cos(X);

            x = this.x, y = this.y, z = this.z;

            this.x =  x*Math.cos(Y) + z*Math.sin(Y);
            this.z = -x*Math.sin(Y) + z*Math.cos(Y);
            
            x = this.x, y = this.y, z = this.z;

            this.x = x*Math.cos(Z) - y*Math.sin(Z);
            this.y = x*Math.sin(Z) + y*Math.cos(Z);
        } else {
            this.sub(v);
            this.rotate(X, Y, Z);
            this.add(v);
        }
    }

    this.project = function() {
        return new Vector(this.x/this.z, this.y/this.z, 1);
    }
}

var index = 0;
function render() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, W, H);

    var z = 3;
    var verts = [
        new Vector(-1, 1, z+1),
        new Vector(-1,-1, z+1),
        new Vector(-1,-1, z-1),
        new Vector(-1,-1, z+1),
        new Vector( 1,-1, z+1),
        new Vector( 1,-1, z-1),
        new Vector( 1,-1, z+1),
        new Vector( 1, 1, z+1),
        new Vector( 1, 1, z-1),
        new Vector( 1, 1, z+1),
        new Vector(-1, 1, z+1),
        new Vector(-1, 1, z-1),
        new Vector(-1,-1, z-1),
        new Vector( 1,-1, z-1),
        new Vector( 1, 1, z-1),
        new Vector(-1, 1, z-1),
    ];

    // applying rotation around point (0, 0, z)
    for(var v = 0; v < verts.length; v++) {
        var X = Date.now()/5e3, Y = Date.now()/5e3, Z = 0;
        if(index % 3 == 0) X = Date.now()/1e3;
        if(index % 3 == 1) Y = Date.now()/1e3;
        if(index % 3 == 2) Z = Date.now()/1e3;
            verts[v].rotate(X, Y, Z, new Vector(0, 0, z));
            verts[v].add(new Vector(Math.sin(Date.now()/1e3), 0, 0));
        }

    // drawing dots
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    for(var v = 0; v < verts.length; v++) {
        var p = verts[v].project();
        ctx.lineTo(p.x*Vmin/2 + W/2, H/2 - p.y*Vmin/2);
    }
    ctx.stroke();
    window.requestAnimationFrame(render)
}


setInterval(function() { index++ }, 6000);
