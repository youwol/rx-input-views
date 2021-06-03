import { attr$, Stream$, VirtualDOM } from '@youwol/flux-view'
import { BehaviorSubject, Observable } from 'rxjs'

import { distinctUntilChanged, map } from 'rxjs/operators'


export namespace NumberInput {


    export class State {

        public readonly value$ : BehaviorSubject<number>
        public readonly min$ : BehaviorSubject<number>
        public readonly max$ : BehaviorSubject<number>
        
        constructor( 
            value : BehaviorSubject<number> | number,
            min: BehaviorSubject<number> | number = -Number.MAX_VALUE, 
            max: BehaviorSubject<number> | number = Number.MAX_VALUE
            ){
            this.value$ = (value instanceof BehaviorSubject)
                ? value
                : new BehaviorSubject<number>(value as number)
            this.min$ = (min instanceof BehaviorSubject)
                ? min 
                : new BehaviorSubject<number>(min as number)
            this.max$ = (max instanceof BehaviorSubject)
                ? max 
                : new BehaviorSubject<number>(max as number)
        }
    }


    export class View implements VirtualDOM {

        public readonly state: State
        public readonly tag = 'input'
        public readonly type = 'text'
        public readonly value : Stream$<number>
        public readonly min : Stream$<number>
        public readonly max : Stream$<number>

        oninput = (ev) => {
            let v = parseFloat(ev.target.value)
            v =  Math.min( Math.max(v, this.state.min$.getValue()), this.state.max$.getValue() )
            if( !isNaN(v) && v != this.state.value$.getValue())
                this.state.value$.next(v)
        }

        constructor({state, ...rest} : {state: State}) {
            Object.assign(this, rest)
            this.state = state

            this.value =  attr$(state.value$.pipe( distinctUntilChanged()), (v) => v )
            this.min =  attr$(state.min$.pipe( distinctUntilChanged()), (v) => v )
            this.max =  attr$(state.max$.pipe( distinctUntilChanged()), (v) => v )
        }
    }
}