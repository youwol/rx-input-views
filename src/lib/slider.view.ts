import { attr$, Stream$, VirtualDOM } from '@youwol/flux-view'
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs'

import { map } from 'rxjs/operators'


export namespace Slider {


    export class State {

        public readonly min$: BehaviorSubject<number> 
        public readonly max$: BehaviorSubject<number> 
        public readonly value$: BehaviorSubject<number> 
        public readonly step$: Observable<number> 
        public readonly count$ : Observable<number>

        constructor(
            min: BehaviorSubject<number> | number = 0,
            max: BehaviorSubject<number> | number = 1,
            value: BehaviorSubject<number> | number = 0.5,
            count: BehaviorSubject<number> | number = 0.5 ) {
            this.min$ = (min instanceof BehaviorSubject) ? min : new BehaviorSubject<number>(min as number)
            this.max$ = (max instanceof BehaviorSubject) ? max : new BehaviorSubject<number>(max as number)
            this.value$ = (value instanceof BehaviorSubject) ? value : new BehaviorSubject<number>(value as number)
            this.count$ = (count instanceof BehaviorSubject) ? count : new BehaviorSubject<number>(count as number)
            this.step$ = combineLatest([this.min$, this.max$, this.count$]).pipe( map(([min,max, count])=> (max-min)/count))
        }
    }


    export class View implements VirtualDOM {

        public readonly state: State
        public readonly tag = 'input'
        public readonly type = 'range'

        public readonly min : Stream$<number, number>
        public readonly max : Stream$<number, number>
        public readonly step : Stream$<number, number>
        public readonly value : Stream$<number, number>

        oninput = (ev) => {
            let v = Number(ev.target.value)
            v != this.state.value$.getValue() &&  this.state.value$.next(v)
        }

        constructor(
            { state, ...rest}: 
            { state:State}) {
                    
            Object.assign(this, rest)
            this.state = state
            this.min = attr$( this.state.min$, (d) => d)
            this.max = attr$( this.state.max$, (d) => d)
            this.step = attr$( this.state.step$, (d) => d)
            this.value = attr$( this.state.value$, (d) => d)                
        }
    }


}