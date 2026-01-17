

class TickerClass extends Set{
	constructor(){
		super()
		this.tick = this.tick.bind(this)
		this.time = performance.now()
		requestAnimationFrame(this.tick)
	}
	tick(now){
		let deltaTime = (now - this.time)/1000
		this.time = now
		for(let v of [...this]) v.update(deltaTime)
		requestAnimationFrame(this.tick)
	}
	remove(v){this.delete(v);return this}
}

export let Ticker = new TickerClass()


export class Timer{
	constructor(...a){
		this.duration	= 1
		this.time		= 0
		this.handlers	= []
		this.add(...a)
	}
	add(...a){
		for(let v of a) switch(typeof v){
			case 'object'	:this.handlers.push(...Object.entries(v))	;break
			case 'function'	:this.addFunction(v)						;break
			case 'number'	:this.duration = v							;break
		}
		return this
	}
	start(){
		this.time = 0
		Ticker.add(this)
		return this.dispatch('update')
	}
	update(deltaTime){
		this.time += deltaTime
		this.dispatch('update')
		if(this.time<this.duration) return this
		Ticker.remove(this)
		return this.dispatch('complete')
	}
	dispatch(type,data){
		this.handlers.filter(a=>a[0]==type).forEach(a=>a[1](data||this))
		return this
	}
	addFunction(complete){return this.add({complete})}
	get value(){return Math.min(this.time/this.duration,1)}
	get remaining(){return Math.max(0,this.duration-this.time)}
}

