'use strict'

export class Ball {
  constructor() {
    this._x = 0
    this._y = 0
    this._deg = Math.random() * 360
    this._speed = 1
    this._lastCollision = null
    // this._color = '#00f'
  }
}
