

class Inference{
	var(v){
		if(v==null)	return this
		switch(typeof v){
			case 'boolean'	:return this
			case 'object'	:return this.varObject(v)	
			case 'string'	:return this.varString(v)
			case 'function'	:return this.varFunction(v)
			case 'number'	:return this.varNumber(v)
		}
		console.warn('Unknown type:',v)
		return this
	}
	varObject(v){
		if(v==null)	return this
		let p = Object.getPrototypeOf(v)
		if(p===Object.prototype)	return this.varProperty(v)
		if(p===null)				return this.varProperty(v)
		return this
	}
	varArray(a)		{for(let v of a) this.var(v);return this}
	varProperty(v)	{for(let a of this._entries(v)) this.varEntry(...a);return this}
	varString()		{return this}	varNumber()	{return this}
	varFunction()	{return this}	varEntry()	{return this}
	add(...a)		{
		for(let v of a) Array.isArray(v)?this.varArray(v):this.var(v)
		return this
	}
	_entries(o){//iOS10
		if(Object.entries) return Object.entries(o)
		let a = [],has = Object.prototype.hasOwnProperty
		for(let k in o) if(has.call(o,k)) a.push([k,o[k]])
		return a
	}
}


export class View extends Inference{
	constructor(...a){
		super()
		let args = Shorthand.parse(v=>this.createElement(v),a)
		this.node = args.shift()
		this.add(...args)
	}
	varObject(v){
		if(v instanceof View) return this.varNode(v.node)
		if(v instanceof Node) return this.varNode(v)
		return super.varObject(v)
	}
	varEntry(k,v){
		if(typeof v==='function') return this.varListener(k,v)
		return this.varAttribute(k,v)
	}
	varFunction(v)		{this.varListener('click',v);return this}
	varNumber(v)		{this.varString(v.toString());return this}
	varString(v)		{this.varNode(document.createTextNode(v));return this}
	varNode(v)			{this.node.appendChild(v);return this}//iOS10
	varListener(k,v)	{this.node.addEventListener(k,v);return this}
	varAttribute(k,v)	{this.node.setAttribute(k,v);return this}

	createElement(s)	{return document.createElement(s||'div')}
	getElement(s)		{return this.node.querySelector(s)}
	getElements(s)		{return Array.from(this.node.querySelectorAll(s))}
	remove()			{this.node.remove();return this}
	replace(...a)		{this.node.textContent='';return this.add(...a)}

	style(s){this.node.style.cssText+=';'+s;return this}
	data(o){
		for(let[k,v] of this._entries(o)) this.varAttribute('data-'+k,v)
		return this
	}
	class(...a){
		let list = this.node.classList, force = true
		if(typeof a.slice(-1)[0]!=='string') force = a.pop()
		for(let s of a) s && force?list.add(s):list.remove(s)
		return this
	}
	display(b){
		let s = this.node.style
		b?s.removeProperty('display'):s.display='none'
		return this
	}
}


const Shorthand = {
	parse(create,[v,...args]){
		if(v instanceof Element) return [v,...args]
		if(typeof v!=='string')	 return [create(),v,...args]
		if(v.startsWith('#'))	 return [document.getElementById(v.slice(1))||create(),...args]
		let tokens = v.trim().replace(/\s+/g,'.').split('.')
		let n = create(tokens[0].match(/^[a-z]/)?tokens.shift():'')
		for(let name of tokens) name && n.classList.add(name)
		return [n,...args]
	}
}


