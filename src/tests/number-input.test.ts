import { render } from '@youwol/rx-vdom'
import { BehaviorSubject } from 'rxjs'
import { NumberInput } from '../index'

test('simple scenario', (done) => {
    const value$ = new BehaviorSubject(0)
    const state = new NumberInput.State(value$)

    const view = new NumberInput.View({ state })

    const div = render(view)

    document.body.appendChild(div)
    const input = document.querySelector('input')
    expect(input.value).toBe('0')

    value$.next(1)
    expect(input.value).toBe('1')

    view.oninput({ target: { value: '2' } } as never)
    value$.subscribe((v) => {
        expect(v).toBe(2)
        done()
    })
})
