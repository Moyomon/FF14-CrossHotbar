

import {SVG}	from './SVG.js'


export class Sprite extends SVG{
	constructor(src){
		super('defs Sprite').data({src})
		console.log(this)
		this.load(src)
	}
	async load(url){
		let content	= await fetch(url).then(r=>r.text())
		let name	= url.split('/').pop().split('.')[0]
		let svg 	= new DOMParser().parseFromString(content,'image/svg+xml')
		if(svg.querySelector('parsererror')) throw new Error('SVG parsererror')
		let images	= Array.from(svg.querySelectorAll('image[id]'))
		this.add(images.map(n=>new Slice(n,{id:name+'-'+n.id})))
		for(let n of images){
			n.removeAttribute('href')
			n.removeAttribute('xlink:href')
		}
		while(svg.firstChild) svg.removeChild(svg.firstChild)
		content = svg = images = null
	}
}


class Slice extends SVG{
	constructor(n,...a){
		super('symbol Slice',...a)
		let width	= n.width.baseVal.value
		let height	= n.height.baseVal.value
		let viewBox	= [0,0,width,height].join(' ')
		let href	= this.getSafeData(n)
		let image	= new SVG('image',href && {href})
		this.add({width,height,viewBox,preserveAspectRatio:'none'},image)
	}
	getSafeData(n){
		let png	= /^data:(image|\w+)\/png;base64,iVBORw/ //Adobe OK
		let data = n.getAttribute('href')||n.getAttribute('xlink:href')
		if(data && png.test(data)) return data
		return null 
	}
}


