

import {SVG,Rect}	from './js/SVG.js'


export class Logger extends SVG{
	constructor(){
		super('g.Logger')
		this.history = []
	}
	addString(s){
		//console.log(s)
		if(this.history.length==12) this.history.length = 0
		let action = new Icon('#'+s).position(45*(this.history.length-11/2),0)
		this.history.push(action)
		this.replace(...this.history)
		return this
	}
}

class Icon extends SVG{
	constructor(href){
		super('g.Icon')
		let rect = new Rect(-20,-20,40,40)
		this.add(
			new SVG('rect',rect,{rx:5,ry:5,stroke:"#000",'stroke-width':2}),
			new SVG('g',{mask:'url(#CrossHotbar-ButtonMask)'},
				new SVG('use',{href},rect),
				new SVG('use',{href:'#CrossHotbar-button'},rect),
			)
		)
	}
}


class Layout extends Array{
	constructor(...a){
		super(...a).scale(1)
		if(this.length) window.addEventListener('resize',e=>this.resize())
	}
	scale(n){this._scale = n;return this.resize()}
	resize(){return this}
	apply(locater){
		let {width,height} = document.documentElement.getBoundingClientRect()
		//console.log(width,height)
		this.forEach((v,i)=>{
			let {x,y} = locater(i)
			v.add({transform:`translate(${x*width},${y*height}) scale(${this._scale})`})
		})
		return this
	}
}

export class Center extends Layout{
	resize(){
		return this.apply(i=>({x:0.5,y:0.5}))
	}
}

export class Vertical extends Layout{
	resize(){
		let n = this.length+1
		return this.apply(i=>({x:0.5,y:(i+1)/n}))
	}
}


