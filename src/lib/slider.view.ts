import { attr$, Stream$, VirtualDOM } from '@youwol/flux-view'
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs'

import { map } from 'rxjs/operators'


export namespace Slider {


    export class State {

        public readonly min$: Observable<number> 
        public readonly max$: Observable<number> 
        public readonly step$: Observable<number> 
        public readonly count$ : Observable<number>

        public readonly value$: BehaviorSubject<number> 
        public readonly data$ = new Subject<{fromListener:string, event: MouseEvent, value: number}>()

        constructor(
            { min, max, value, count }:
            {
                min: Observable<number> | number,
                max: Observable<number> | number,
                value: BehaviorSubject<number> | number,
                count: Observable<number> | number 
            }) {

            this.value$ = (value instanceof BehaviorSubject) 
                ? value 
                : new BehaviorSubject<number>(value as number)

            this.min$ = (min instanceof Observable) 
                ? min 
                : of(min)
            this.max$ = (max instanceof Observable) 
                ? max 
                : of(max)
            this.count$ = (count instanceof Observable) 
                ? count 
                : of(count)

            this.step$ = combineLatest([this.min$, this.max$, this.count$]).pipe(
                 map(([min,max, count])=> (max-min)/count)
                 )
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

        onBase = (event: MouseEvent, fromListener: string) => {
            let value = Number(event.target['value']);
            if( value!= this.state.value$.getValue()){
                this.state.value$.next(value)
            }
            this.state.data$.next({value, event, fromListener})
        }
        oninput = (ev: MouseEvent) => {
            this.onBase(ev,'oninput')
        }
        onchange = (ev: MouseEvent) => {
            this.onBase(ev,'onchange')
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