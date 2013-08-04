
~function () {

function Gui(context) {
  this.effectManager = null;
  this.context = context;
  this.gameOverBox = document.querySelector("#gui-gameOver");
  this.pauseBox = document.querySelector("#gui-pause");
  this.continueButtons = document.querySelectorAll("#gui-continue");
  this.replayButtons = document.querySelectorAll("#gui-replay");
  this.quitButtons = document.querySelectorAll("#gui-quit")
}

Gui.prototype.start = function () {
  var self = this;
  for (var i = 0; i < this.continueButtons.length; ++i) {
    this.continueButtons[i].addEventListener("click", function () {
      self.handleContinue();
    });
  }
  for (var i = 0; i < this.replayButtons.length; ++i) {
    this.replayButtons[i].addEventListener("click", function () {
      self.handleReplay();
    });
  }
  for (var i = 0; i < this.quitButtons.length; ++i) {
    this.quitButtons[i].addEventListener("click", function () {
      self.handleQuit();
    });
  }
}

Gui.prototype.attachEffectManager = function (effectManager) {
  this.effectManager = effectManager;
}

Gui.prototype.gameOver = function (score) {
  if (this.effectManager)
    this.effectManager.bloom();
  this.context.pause();
  this.gameOverBox.style.display = "block";
  this.gameOverBox.querySelector("#gui-score").innerHTML = score;
}

Gui.prototype.pause = function () {
  if (this.effectManager)
    this.effectManager.bloom();
  this.context.pause();
  this.pauseBox.style.display = "block";
}

Gui.prototype.handleContinue = function () {
  if (this.effectManager)
    this.effectManager.none();
  this.pauseBox.style.display = "none";
  this.context.play();
}

Gui.prototype.handleReplay = function () {
  window.location.reload();
}

Gui.prototype.handleQuit = function () {
  window.location.replace("index.html");
}

window.Gui = Gui;

}();