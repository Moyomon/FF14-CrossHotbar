

export class Xform extends Array{
	constructor(...a){
		super(0,0,0,0,0,0,1,1,1)// x,y,z, rx,ry,rz, sx,sy,sz
	}
	get position(){return{x:this[0],y:this[1],z:this[2]}}
	set position({x,y,z}){
		if(Number.isFinite(x)) this[0] = x
		if(Number.isFinite(y)) this[1] = y
		if(Number.isFinite(z)) this[2] = z
		this.update()
	}
	get scale(){return this[6]}
	set scale(v){
		if(Number.isFinite(v)) this[6]=this[7]=this[8] = v
		this.update()
	}
	toString(){
		let t = `translate(${this[0]},${this[1]})`
		let r = this[5]==0?'':` rotate(${this[5]}deg)`
		let s = this[6]==1?'':` scale(${this[6]})`
		return t+r+s
	}
	set(n){
		this.node = n
		return this
	}
	update(){
		this.node && this.node.setAttribute('transform',this.toString())
		return this
	}
}

