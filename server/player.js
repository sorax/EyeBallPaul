'use strict'

class Player {
  constructor() {
    this.defenceSize
    this._deg
    this.id
    // this._name = localStorage.getItem('playerName') || ''
    this.name
    this.score = 0
  }

  set deg(deg) {
    if (deg < 0) return deg + 360
    if (degrees >= 360) return degrees - 360
    // this._deg %= 360
    this._deg = deg
  }

  get deg() {
    return this._deg
  }

  // set name(name) {
  //   localStorage.setItem('playerName', name)
  //   this._name = name
  // }

  // get name() {
  //   return this._name
  // }

  addScore() {
    this.score++
  }
}
module.exports = Player
