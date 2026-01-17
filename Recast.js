

import {SVG,Rect}	from './js/SVG.js'
import {Timer}		from './js/Ticker.js'


export class Recast extends SVG{
	constructor(duration){
		super('g.Recast').token()
		this.radial = new Radial()
		this.meter	= new Meter('#'+this.radial.id).visible(false)
		this.ready	= new Ready().visible(false)
		this.timer	= new Timer(duration,{
			update	:timer=>this.value = timer.value,
			complete:timer=>{
				this.value = 1
				this.ready.visible(true)
				setTimeout(e=>this.ready.visible(false),32)
			},
		})
		this.timer.time = this.timer.duration
		this.add(new SVG('defs',this.radial),this.meter,this.ready)
	}
	start(){this.timer.start();return this}
	set value(n){
		this.radial.value = n
		this.meter.visible(n<1)
	}
	get available(){return this.timer.value==1}
}

Recast.Asset = class extends SVG{
	constructor(){
		super('defs').add(
			new SVG('filter',{id:'Recast-Blur',filterUnits:'userSpaceOnUse'},
				'<feGaussianBlur stdDeviation="1"/>'
			),
			new SVG('radialGradient',{id:'Recast-Flash'},`
				<stop offset="20%" stop-color="white" stop-opacity="0"/>
				<stop offset="80%" stop-color="white" stop-opacity="1"/>
			`),
		)
	}
}


class Radial extends SVG{
	constructor(){
		super('path.Radial').token()
		this.value = 0
	}
	getData(degree,r=20){
		let radian = (degree-90)*Math.PI/180
		let x = r*Math.cos(radian)
		let y = r*Math.sin(radian)
		let a = `A${r},${r} 0 ${degree>180?1:0} 1 ${x.toFixed(3)},${y.toFixed(3)}`
		return `M0,0 L0,${-r} ${a} Z`
	}
	set value(n){this.add({d:this.getData(360*n%360)})}
}


class Meter extends SVG{
	constructor(href){
		super('g.Meter')
		let inner	= new Mask(href)
		let outer	= new Mask(href,true)
		let timer	= {href,fill:'none',stroke:'white',stroke_width:3,stroke_linejoin:'round'}
		let shroud	= {fill:'black',opacity:0.6}
		this.add(
			new SVG('defs',inner,outer),
			new SVG('use.timer',timer,inner.ref,{filter:'url(#Recast-Blur)'}),
			new SVG('rect.shroud',shroud,outer.ref).rect(-20,-20,40,40),
		)
	}
}


class Mask extends SVG{
	constructor(href,reverse){
		super('mask').token().add(
			reverse && new SVG('rect',{fill:'white'}).rect(-20,-20,40,40),
			new SVG('use',{href,fill:reverse?'black':'white'}),
		)
	}
	get ref(){return {mask:`url(#${this.id})`}}
}


class Ready extends SVG{
	constructor(){
		super('rect.Ready',{fill:'url(#Recast-Flash)'}).rect(-20,-20,40,40)
	}
}

