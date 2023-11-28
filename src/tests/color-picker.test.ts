import { render } from '@youwol/rx-vdom'
import { BehaviorSubject } from 'rxjs'
import { ColorPicker } from '../index'

test('select', async () => {
    const color$ = new BehaviorSubject('#abcdef')
    const state = new ColorPicker.State(color$)

    const view = new ColorPicker.View({ state })

    const div = render(view)

    document.body.appendChild(div)
    const input = document.querySelector('input')
    expect(input.value).toBe('#abcdef')

    color$.next('#fedcba')
    expect(input.value).toBe('#fedcba')

    input.onchange({ target: { value: '#ffffff' } } as never)
    color$.subscribe((v) => {
        expect(v).toBe('#ffffff')
    })
})
