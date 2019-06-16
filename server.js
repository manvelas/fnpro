
//! Requiring modules  --  START
var Grass = require("./modules/Grass.js");
var GrassEater = require("./modules/GrassEater.js");
var Wolf = require("./modules/Wolf.js");
var People = require("./modules/People.js");
var Tractor = require("./modules/Tractor.js");
let random = require('./modules/random');
//! Requiring modules  --  END


//! Setting global arrays  --  START
grassArr = [];
grassEaterArr = [];
WolfArr = [];
PeopleArr = [];
TractorArr = []; 
matrix = [];
grassHashiv = 0;
grassEaterHashiv = 0;
WolfHashiv = 0;
PeopleHashiv = 0;
TractorHashiv = 0;
//! Setting global arrays  -- END




//! Creating MATRIX -- START
function matrixGenerator(matrixSize, grass, grassEater, Wolf , People , Tractor) {
    for (let i = 0; i < matrixSize; i++) {
        matrix[i] = [];
        for (let o = 0; o < matrixSize; o++) {
            matrix[i][o] = 0;
        }
    }
    for (let i = 0; i < grass; i++) {
        let customX = Math.floor(random(matrixSize)); // 0-9
        let customY = Math.floor(random(matrixSize)); // 4
        matrix[customY][customX] = 1;
    }
    for (let i = 0; i < grassEater; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 2;
    }
    for (let i = 0; i < Wolf; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 3;
    }
    for (let i = 0; i < People; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 4;
    }
    for (let i = 0; i < Tractor; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 5;
    }
}
matrixGenerator(20, 1, 1);
//! Creating MATRIX -- END



//! SERVER STUFF  --  START
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static("."));
app.get('/', function (req, res) {
    res.redirect('index.html');
});
server.listen(3000);
//! SERVER STUFF END  --  END



function creatingObjects() {
    for (var y = 0; y < matrix.length; y++) {
        for (var x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 2) {
                var grassEater = new GrassEater(x, y);
                grassEaterArr.push(grassEater);
            } 
            else if (matrix[y][x] == 1) {
                var grass = new Grass(x, y);
                grassArr.push(grass);
                grassHashiv++;
            }
            else if (matrix[y][x] == 3) {
                var wolf = new Wolf(x, y);
                WolfArr.push(wolf);
                WolfHashiv++;
            }
            else if (matrix[y][x] == 4) {
                var people = new People(x, y);
                PeopleArr.push(people);
                PeopleHashiv++;
            }
            else if (matrix[y][x] == 5) {
                var tractor = new Tractor(x, y);
                TractorArr.push(tractor);
                TractorHashiv++;
            }
        }
    }
}
creatingObjects();

function game() {
    if (grassArr[0] !== undefined) {
        for (var i in grassArr) {
            grassArr[i].mul();
        }
    }
    if (grassEaterArr[0] !== undefined) {
        for (var i in grassEaterArr) {
            grassEaterArr[i].eat();
            grassEaterArr[i].mul();
            grassEaterArr[i].move();
        }
    }
    if (WolfArr[0] !== undefined) {
        for (var i in WolfArr) {
            WolfArr[i].eat();
            WolfArr[i].mul();
            WolfArr[i].move();
        }
    }
    if (PeopleArr[0] !== undefined) {
        for (var i in PeopleArr) {
            PeopleArr[i].eat();
            PeopleArr[i].mul();
            PeopleArr[i].move();
        }
    }
    if (TractorArr[0] !== undefined) {
        for (var i in TractorArr) {
            TractorArr[i].eat();
            TractorArr[i].mul();
            TractorArr[i].move();
        }
    }

    //! Object to send
    let sendData = {
        matrix: matrix,
        grassCounter: grassHashiv,
        grassEaterCounter: grassEaterHashiv,
        WolfCounter: WolfHashiv,
        PeopleCounter: PeopleHashiv,
        TractorCounter: TractorHashiv
    }

    //! Send data over the socket to clients who listens "data"
    io.sockets.emit("data", sendData);
}



setInterval(game, 1000)