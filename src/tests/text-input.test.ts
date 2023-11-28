import { render } from '@youwol/rx-vdom'
import { BehaviorSubject } from 'rxjs'
import { TextInput } from '../index'

test('select', (done) => {
    const value$ = new BehaviorSubject('hello')
    const state = new TextInput.State(value$)

    const view = new TextInput.View({ state })

    const div = render(view)

    document.body.appendChild(div)
    const input = document.querySelector('input')
    expect(input.value).toBe('hello')

    value$.next('world')
    expect(input.value).toBe('world')

    input.oninput({ target: { value: 'hello world' } } as never)
    value$.subscribe((v) => {
        expect(v).toBe('hello world')
        done()
    })
})
