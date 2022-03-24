import { render } from '@youwol/flux-view'
import { BehaviorSubject } from 'rxjs'
import { ColorPicker } from '../index'

test('select', (done) => {
    let color$ = new BehaviorSubject('#abcdef')
    let state = new ColorPicker.State(color$)

    let view = new ColorPicker.View({ state })

    let div = render(view)

    document.body.appendChild(div)
    let input = document.querySelector('input')
    expect(input.value).toEqual('#abcdef')

    color$.next('#fedcba')
    expect(input.value).toEqual('#fedcba')

    input.onchange({ target: { value: '#ffffff' } } as any)
    color$.subscribe((v) => {
        expect(v).toEqual('#ffffff')
        done()
    })
})
