
~function () {

function Hud() {
  this.hudElement = document.querySelector("#hud");
  this.scoreValue = document.querySelector("#hud-score .value");
  this.lifesValue = document.querySelector("#hud-lifes .value");
  this.currentScore = this.scoreValue.innerHTML;
  this.currentLifes = this.lifesValue.innerHTML;
  this._currentBloodTime = 0;
  this.bloodTime = 1000;
  this.hasBlood = false;
}

Hud.prototype.updateLifes = function (value) {
  if (this.currentLifes != value) {
    this.lifesValue.innerHTML = value;
    this.currentLifes = value;
  }
}

Hud.prototype.updateScore = function (value) {
  if (this.currentScore != value) {
    this.scoreValue.innerHTML = value;
    this.currentScore = value;
  }
}

Hud.prototype.activateBlood = function () {
  this.hasBlood = true;
  this.hudElement.className = "blood";
}

Hud.prototype.updateBlood = function (deltaTime) {
  if (this.hasBlood === false)
    return;
  if (this._currentBloodTime < this.bloodTime)
    this._currentBloodTime += deltaTime;
  else {
    this.hasBlood = false;
    this._currentBloodTime = 0;
    this.hudElement.className = "";
  }
}

window.Hud = Hud;

}();