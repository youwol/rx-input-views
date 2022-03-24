import { attr$, Stream$, VirtualDOM } from '@youwol/flux-view'
import { BehaviorSubject } from 'rxjs'

export namespace ColorPicker {
    export class State {
        public readonly color$: BehaviorSubject<string>

        constructor(color$: BehaviorSubject<string> | string = '#ffbb00') {
            this.color$ =
                color$ instanceof BehaviorSubject
                    ? color$
                    : new BehaviorSubject<string>(color$)
        }
    }

    export class View implements VirtualDOM {
        public readonly state: State
        public readonly tag = 'input'
        public readonly type = 'color'
        public readonly onchange = (event: any) =>
            this.state.color$.next(event.target.value)

        public readonly value: Stream$<string>

        constructor({ state, ...rest }: { state: State }) {
            this.state = state
            Object.assign(this, rest)
            this.value = attr$(state.color$, (color) => color)
        }
    }
}
