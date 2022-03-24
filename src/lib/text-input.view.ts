import { attr$, Stream$, VirtualDOM } from '@youwol/flux-view'
import { BehaviorSubject } from 'rxjs'

import { distinctUntilChanged } from 'rxjs/operators'

export namespace TextInput {
    export class State {
        public readonly value$: BehaviorSubject<string>

        constructor(value: BehaviorSubject<string> | string = '') {
            this.value$ =
                value instanceof BehaviorSubject
                    ? value
                    : new BehaviorSubject<string>(value)
        }
    }

    export class View implements VirtualDOM {
        public readonly state: State
        public readonly tag = 'input'
        public readonly type = 'text'
        public readonly value: Stream$<string, string>

        oninput = (ev) => this.state.value$.next(ev.target.value)

        constructor({ state, ...rest }: { state: State }) {
            Object.assign(this, rest)
            this.state = state
            this.value = attr$(
                state.value$.pipe(distinctUntilChanged()),
                (v) => v,
            )
        }
    }
}
