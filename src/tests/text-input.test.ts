import { render } from '@youwol/flux-view'
import { BehaviorSubject } from 'rxjs'
import { TextInput } from '../index'

test('select', (done) => {
    let value$ = new BehaviorSubject('hello')
    let state = new TextInput.State(value$)

    let view = new TextInput.View({ state })

    let div = render(view)

    document.body.appendChild(div)
    let input = document.querySelector('input')
    expect(input.value).toEqual('hello')

    value$.next('world')
    expect(input.value).toEqual('world')

    input.oninput({ target: { value: 'hello world' } } as any)
    value$.subscribe((v) => {
        expect(v).toEqual('hello world')
        done()
    })
})
