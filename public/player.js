'use strict'

export class Player {
  constructor() {
    this._deg = 0
    this._name = localStorage.getItem('playerName') || ''
    this._score = 0
    this._team
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

  set name(name) {
    this._name = name
  }

  get name() {
    return this._name
  }

  score() {
    this._score++
  }

  set team(team) {
    this._team = team
  }

  get team() {
    return this._team
  }
}
