

import {Timer}	from './js/Ticker.js'


export class InputProvider extends Timer{
	constructor(...a){
		super(...a)
		this.keys = [
			'ButtonSouth','ButtonEast','ButtonWest','ButtonNorth',
			'LeftShoulder','RightShoulder','LeftTrigger','RightTrigger',
			'Select','Start','LeftStick','RightStick',
			'DpadUp','DpadDown','DpadLeft','DpadRight',
		]
		this.buttons = this.keys.map(v=>false)
		this.start()
	}
	addFunction(button){return this.add({button})}
	update(deltaTime){
		this.events.forEach(e=>this.dispatch('button',e))
		return this
	}
	get events(){
		let input = navigator.getGamepads().find(Boolean)
		if(input==null) return []
		let a = input.buttons.map(v=>v.value>0.5)
		let events = a.map((pressed,i)=>{
			if(this.keys[i]==null||pressed==this.buttons[i]) return null
			return {type:pressed?'pressed':'released',button:this.keys[i]}
		})
		this.buttons = a
		return events.filter(Boolean)
	}
}


export class InputMapper extends InputProvider{
	constructor(...a){
		super(...a)
		this.shiftState	= 0
		this.shift		= 'None'
		this.shiftKeys	= ['None','Right','Left']
		this.bothKeys	= ['RightLeft','RightLeft','LeftRight']
	}
	get events(){
		let a = super.events
		return this.getShiftEvents(a).concat(this.getButtonEvents(a))
	}
	getButtonEvents(events,type='pressed'){
		let a = events.filter(e=>e.type==type&&/Trigger$/.test(e.button)==false)
		return a.map(e=>({type:e.button,shift:this.shift}))
	}
	getShiftEvents(events){
		let a = []
		let state = this.shiftState
		events.forEach(e=>{
			switch(e.button+'_'+e.type){
				case 'LeftTrigger_pressed'	:state|=2	;break
				case 'LeftTrigger_released'	:state&=1	;break
				case 'RightTrigger_pressed'	:state|=1	;break
				case 'RightTrigger_released':state&=2	;break
			}
		})
		if(state != this.shiftState){
			this.shift = this.shiftKeys[state]||this.bothKeys[this.shiftState]
			a.push({type:'Shift',shift:this.shift})
		}
		this.shiftState = state
		return a
	}
}

