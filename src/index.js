import "./styles.css";
import $ from "jquery";

let intervalId, update, playerHit, computerHit;

let board = {
  height: $(window).height(),
  width: $(window).width()
};
let keys = {
  37: "left",
  38: "up",
  39: "right",
  40: "down"
};

$(document).ready(function() {
  let ball = {
    width: 30,
    height: 30,
    ySpeed: 0,
    maxAngle: 60
  };
  let settings = {
    frameRate: 30,
    updateTime: 1000
  };
  ball.x = board.width / 2 - ball.width / 2;
  ball.y = board.height / 2 - ball.height / 2;
  ball.speed = board.width * 0.03 > 30 ? 30 : 0.03 * board.width;
  ball.xSpeed = -1 * ball.speed;
  console.log(ball.speed);
  let player = {
    x: 0,
    y: board.height / 2 - 15,
    width: 10,
    height: 100,
    up: false,
    down: false,
    right: false,
    left: false
  };
  let computer = {
    x: board.width - 10,
    y: board.height / 2 - 15,
    width: 10,
    height: 100
  };
  function computerMove() {
    if (ball.y >= computer.y + computer.height / 2) {
      computer.y += ball.speed;
    } else if (ball.y < computer.y) {
      computer.y -= ball.speed;
    }
    if (computer.y < 0) {
      computer.y = 0;
    } else if (computer.y + computer.height > board.height) {
      computer.y = board.height - computer.height;
    }
    $("#computer").css({
      top: String(computer.y) + "px"
    });
  }
  function playerMove() {
    player.y += ball.speed * (Number(player.down) - Number(player.up));
    player.x += ball.speed * (Number(player.right) - Number(player.left));
    if (player.y < 0) {
      player.y = 0;
    } else if (player.y + player.height > board.height) {
      player.y = board.height - player.height;
    }
    if (player.x <= 0) {
      player.x = 0;
    }
    $("#player").css({
      top: player.y,
      left: player.x
    });
  }
  function resetGame(x) {
    ball.x = board.width / 2 - ball.width / 2;
    ball.y = board.height / 2 - ball.height / 2;
    ball.xSpeed = -1 * ball.speed;
    ball.ySpeed = 0;
    computer.x = board.width - 10;
    computer.y = board.height / 2 - 15;
    player.y = board.height / 2 - 15;
    player.x = 0;
    if (x === "player") {
      $("#playerScore").text(Number($("#playerScore").text()) + 1);
    } else if (x === "computer") {
      $("#computerScore").text(Number($("#computerScore").text()) + 1);
    }
    $("#player").css({
      left: 0,
      top: String(board.height / 2 - player.height / 2) + "px"
    });
    $("#computer").css({
      right: 0,
      top: String(board.height / 2 - computer.height / 2) + "px"
    });
    $("#ball").css({
      left: String(board.width / 2 - ball.width / 2) + "px",
      top: String(board.height / 2 - ball.height / 2) + "px"
    });
  }
  function ballMove() {
    ball.x += ball.xSpeed;
    ball.y += ball.ySpeed;
    if (
      ball.x <= player.x &&
      ball.x - ball.xSpeed >= player.x &&
      ball.y + ball.height >= player.y &&
      ball.y <= player.y + player.height
    ) {
      ball.x = player.x;
      playerHit = ball.y + ball.height / 2 - player.y - player.height / 2;
      ball.xSpeed =
        ball.speed *
        Math.cos(
          (((playerHit * 2) / player.height) * ball.maxAngle * Math.PI) / 180
        );
      ball.ySpeed =
        ball.speed *
        Math.sin(
          (((playerHit * 2) / player.height) * ball.maxAngle * Math.PI) / 180
        );
    } else if (
      ball.x + ball.width >= computer.x &&
      ball.x + ball.width - ball.xSpeed <= computer.x &&
      ball.y + ball.height >= computer.y &&
      ball.y <= computer.y + computer.height
    ) {
      ball.x = computer.x - ball.width;
      computerHit = ball.y + ball.height / 2 - computer.y - computer.height / 2;
      ball.xSpeed =
        -1 *
        ball.speed *
        Math.cos(
          (((computerHit * 2) / computer.height) * ball.maxAngle * Math.PI) /
            180
        );
      ball.ySpeed =
        ball.speed *
        Math.sin(
          (((computerHit * 2) / computer.height) * ball.maxAngle * Math.PI) /
            180
        );
    } else if (ball.y + ball.height >= board.height) {
      ball.y = board.height - ball.height;
      ball.ySpeed *= -1;
    } else if (ball.y <= 0) {
      ball.y = 0;
      ball.ySpeed *= -1;
    } else if (ball.x <= 0) {
      clearInterval(intervalId);
      clearTimeout(update);
      update = setTimeout(function() {
        resetGame("computer");
        intervalId = setInterval(game, settings.frameRate);
      }, settings.updateTime);
    } else if (ball.x >= board.width) {
      ball.x = board.width;
      clearInterval(intervalId);
      clearTimeout(update);
      update = setTimeout(function() {
        resetGame("player");
        intervalId = setInterval(game, settings.frameRate);
      }, settings.frameRate);
    }
    $("#ball").css({
      top: ball.y,
      left: ball.x
    });
  }
  function game() {
    ballMove();
    playerMove();
    computerMove();
  }
  $(window).resize(function() {
    clearInterval(intervalId);
    board = {
      width: $(window).width(),
      height: $(window).height()
    };
    ball.speed = board.width * 0.03 > 30 ? 30 : board.width * 0.03;
    computer.x = board.width - 10;
  });
  $(document).on("keydown", function(e) {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      e.preventDefault();
      player[keys[e.keyCode]] = true;
    }
  });
  $(document).on("keyup", function(e) {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      e.preventDefault();
      player[keys[e.keyCode]] = false;
    }
  });
  $("#start").click(function() {
    intervalId = setInterval(game, 30);
  });
  $("#stop").click(function() {
    clearInterval(intervalId);
  });
});
