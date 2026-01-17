

import {View}		from './Builder.js'
import {Xform}		from './Xform.js'


export class SVG extends View{
	createElement(s){
		return document.createElementNS('http://www.w3.org/2000/svg',s||'svg')
	}
	addObject(v){
		if(v instanceof Rect) return this.add(v.toAttribute())
		return super.addObject(v)
	}
	addAttribute(k,v){
		this.node.setAttribute(k.replaceAll('_','-'),v)
		return this
	}
	token(s){
		let v = new Token(s||this.node.classList[0]||this.node.tagName)
		this.id = v.id
		return this.add({id:v.id})
	}
	xform(){
		this.transform = new Xform().set(this.node)
		return this
	}
	rect(...a){
		return this.add(new Rect(...a).toAttribute())
	}
	position(x,y){
		if(this.node.hasAttribute('x')) return this.add({x,y})
		if(this.transform==null) return this.add({transform:`translate(${x},${y})`})
		this.transform.position = {x,y}
		return this
	}
	visible(v){
		if(v) this.node.removeAttribute('visibility')
		else this.node.setAttribute('visibility','hidden')
		return this
	}
}

class Token{
	constructor(s){
		let id = this.uuid()
		this.id = s?s.toLowerCase()+'-'+id:id
	}
	uuid(){
		let c = (window.crypto||window.msCrypto)
		let a = [...c.getRandomValues(new Uint8Array(16))]
		a[6] = (a[6] & 0x0f) | 0x40 
		a[8] = (a[8] & 0x3f) | 0x80
		let s = a.map(b =>('0'+b.toString(16)).slice(-2)).join('')
		return s.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/,'$1-$2-$3-$4-$5')
	}
}

SVG.Animate = class extends SVG{
	constructor(attributeName,...a){
		super('animate',{attributeName,begin:'indefinite',fill:'freeze'},...a)
	}
	addNumber(n){return this.add({dur:`${n}s`})}
	begin(){
		if(this.node.endElement) this.node.endElement()
		this.node.beginElement()
		return this
	}
}


export class Rect extends Array{
	fromSVG(n){
		this.length=0
		this.push(...[n.x,n.y,n.width,n.height].map(v=>v.baseVal.value))
		return this
	}
	fromClient(n){
		this.length=0
		this.push(n.clientLeft,n.clientTop,n.clientWidth,n.clientHeight)
		return this
	}
	position(x,y)	{this[0]=x;this[1]=y;return this}
	
	get x(){return this[0]}		get width(){return this[2]}
	get y(){return this[1]}		get height(){return this[3]}
	
	toViewBox()		{return {viewBox:this.join(' ')}}
	toAttribute()	{return {x:this[0],y:this[1],width:this[2],height:this[3]}}
	toSize()		{return {width:this[2],height:this[3]}}
}

