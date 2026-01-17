

class Builder{
	add(...a){
		for(let v of a) this.var(v)
		return this
	}
	var(v){
		if(v==null||typeof v=='boolean') return this
		switch(typeof v){
			case 'object'	:this.addObject(v)		;break
			case 'string'	:this.addString(v)		;break
			case 'function'	:this.addFunction(v)	;break
			case 'number'	:this.addNumber(v)		;break
			default:console.warn('Unknown type:',typeof v)
		}
		return this
	}
	addObject(v){
		if(v.constructor==Object)	return this.addProperty(v)
		if(Array.isArray(v)) 		return this.addArray(v)
		return this
	}
	addString()		{return this}	
	addFunction()	{return this}	
	addNumber()		{return this}	
	addProperty(v)	{
		for(let a of Object.entries(v)) this.addEntry(a)
		return this
	}
	addArray(a){return this.add(...a)}
	addEntry(){return this}
}


class Shorthand extends Builder{
	shorthand(a){
		let n,v = a[0]
		switch(true){
			case v instanceof Element	:n = a.shift()					;break
			case typeof v=='string'		:n = this.fromString(a.shift())	;break
		}
		this.node = n||this.createElement()
		return this.add(...a)
	}
	fromString(s){
		if(/^</.test(s)) return this.fromHTML(s)
		if(/^#/.test(s)) return document.getElementById(s.slice(1))
		let a = s.split('.').map(s=>s.trim()).filter(Boolean)
		let n = this.createElement(a.shift())
		if(a.length) n.classList.add(...a)
		return n
	}
	fromHTML(s){
		let n = this.createElement()
		n.innerHTML = s
		return n.firstChild
	}
	createElement(s){return document.createElement(s||'DIV')}
	getElement(s)	{return this.node.querySelector(s)}
	getElements(s)	{return [...this.node.querySelectorAll(s)]}
}


export class View extends Shorthand{
	constructor(...a){
		super().shorthand(a)
	}
	addObject(v){
		switch(true){
			case v instanceof View	:this.node.append(v.node)	;break
			case v instanceof Node	:this.node.append(v)		;break
			default					:super.addObject(v)
		}
		return this
	}
	addEntry(a){
		switch(typeof a[1]){
			case 'function'	:this.node.addEventListener(...a)	;break
			default			:this.addAttribute(...a)
		}
		return this
	}
	addAttribute(k,v){
		this.node.setAttribute(k,v)
		return this
	}
	addFunction(v)	{this.node.onclick = v;return this}
	addNumber(v)	{this.node.append(v);return this}
	addString(v)	{this.node.insertAdjacentHTML('beforeend',v);return this}
	data(o)			{for(let[k,v] of Object.entries(o)) this.node.dataset[k]=v;return this}
	style(s)		{this.node.style.cssText+=s;return this}
	class(...a)		{a.length&&this.node.classList.add(...a);return this}
	remove()		{this.node.remove();return this}
	replace(...a)	{this.node.innerHTML='';return this.add(...a)}/*x ios replaceChildren*/
}


