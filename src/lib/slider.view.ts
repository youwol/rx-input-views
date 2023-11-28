import { AttributeLike, VirtualDOM } from '@youwol/rx-vdom'
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

export namespace Slider {
    export class State {
        public readonly min$: Observable<number>
        public readonly max$: Observable<number>
        public readonly step$: Observable<number>
        public readonly count$: Observable<number>

        public readonly value$: BehaviorSubject<number>
        public readonly data$ = new Subject<{
            fromListener: string
            event: MouseEvent
            value: number
        }>()

        constructor({
            min,
            max,
            value,
            count,
        }: {
            min: Observable<number> | number
            max: Observable<number> | number
            value: BehaviorSubject<number> | number
            count: Observable<number> | number
        }) {
            this.value$ =
                value instanceof BehaviorSubject
                    ? value
                    : new BehaviorSubject<number>(value)

            this.min$ = min instanceof Observable ? min : of(min)
            this.max$ = max instanceof Observable ? max : of(max)
            this.count$ = count instanceof Observable ? count : of(count)

            this.step$ = combineLatest([
                this.min$,
                this.max$,
                this.count$,
            ]).pipe(map(([mini, maxi, intervals]) => (maxi - mini) / intervals))
        }
    }

    export class View implements VirtualDOM<'input'> {
        public readonly state: State
        public readonly tag = 'input'
        public readonly type = 'range'

        public readonly min: AttributeLike<string>
        public readonly max: AttributeLike<string>
        public readonly step: AttributeLike<string>
        public readonly value: AttributeLike<string>

        onBase = (event: MouseEvent, fromListener: string) => {
            const value = Number(event.target['value'])
            if (value != this.state.value$.getValue()) {
                this.state.value$.next(value)
            }
            this.state.data$.next({ value, event, fromListener })
        }
        oninput = (ev: MouseEvent) => {
            this.onBase(ev, 'oninput')
        }
        onchange = (ev: MouseEvent) => {
            this.onBase(ev, 'onchange')
        }

        constructor({ state, ...rest }: { state: State }) {
            Object.assign(this, rest)
            this.state = state
            this.min = { source$: this.state.min$, vdomMap: (d) => `${d}` }
            this.max = { source$: this.state.max$, vdomMap: (d) => `${d}` }
            this.step = { source$: this.state.step$, vdomMap: (d) => `${d}` }
            this.value = { source$: this.state.value$, vdomMap: (d) => `${d}` }
        }
    }
}
