import { AttributeLike, VirtualDOM } from '@youwol/rx-vdom'
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs'

export namespace NumberInput {
    export class State {
        public readonly value$: BehaviorSubject<number>
        public readonly min$: BehaviorSubject<number>
        public readonly max$: BehaviorSubject<number>

        constructor(
            value: BehaviorSubject<number> | number,
            min: BehaviorSubject<number> | number = -Number.MAX_VALUE,
            max: BehaviorSubject<number> | number = Number.MAX_VALUE,
        ) {
            this.value$ =
                value instanceof BehaviorSubject
                    ? value
                    : new BehaviorSubject<number>(value)
            this.min$ =
                min instanceof BehaviorSubject
                    ? min
                    : new BehaviorSubject<number>(min)
            this.max$ =
                max instanceof BehaviorSubject
                    ? max
                    : new BehaviorSubject<number>(max)
        }
    }

    export class View implements VirtualDOM<'input'> {
        public readonly state: State
        public readonly tag = 'input'
        public readonly type = 'text'
        public readonly value: AttributeLike<string>
        public readonly min: AttributeLike<string>
        public readonly max: AttributeLike<string>

        oninput = (ev) => {
            let v = parseFloat(ev.target.value)
            v = Math.min(
                Math.max(v, this.state.min$.getValue()),
                this.state.max$.getValue(),
            )
            if (!isNaN(v) && v != this.state.value$.getValue()) {
                this.state.value$.next(v)
            }
        }

        constructor({ state, ...rest }: { state: State }) {
            Object.assign(this, rest)
            this.state = state

            this.value = state.value$.pipe(
                distinctUntilChanged(),
                map((s) => `${s}`),
            )
            this.min = state.min$.pipe(
                distinctUntilChanged(),
                map((s) => `${s}`),
            )
            this.max = state.max$.pipe(
                distinctUntilChanged(),
                map((s) => `${s}`),
            )
        }
    }
}
