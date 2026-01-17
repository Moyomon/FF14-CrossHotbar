

import {SVG,Rect}	from './SVG.js'


export class Sprite extends SVG{
	constructor(src){
		super('defs.Sprite').data({src})
		this.load(src)
	}
	async load(url){
		let svg		= await fetch(url).then(r=>r.text())
		let name	= url.split('/').pop().split('.')[0]
		let images	= new SVG(svg).getElements('image[id]')
		this.add(...images.map(n=>new Item(n,{id:name+'-'+n.id})))
	}
}


class Item extends SVG{
	constructor(n,...a){
		super('symbol',...a)
		let rect	= new Rect().fromSVG(n).position(0,0)
		this.add(rect.toSize(),rect.toViewBox(),{preserveAspectRatio:'none'},this.clean(n))
	}
	clean(n){
		['id','x','y','width','height'].forEach(s=>n.removeAttribute(s))
		return n
	}
}

