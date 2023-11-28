import { render } from '@youwol/rx-vdom'
import { BehaviorSubject } from 'rxjs'
import { take } from 'rxjs/operators'
import { Slider } from '../index'

test('slider', async () => {
    const min$ = new BehaviorSubject(0)
    const max$ = new BehaviorSubject(10)
    const value$ = new BehaviorSubject(5)

    const state = new Slider.State({
        min: min$,
        max: max$,
        value: value$,
        count: 100,
    })

    const view = new Slider.View({ state })

    const div = render(view)

    document.body.appendChild(div)

    const input = document.querySelector('input')
    expect(input.min).toBe('0')
    expect(input.max).toBe('10')
    expect(input.value).toBe('5')

    min$.next(4)
    expect(input.min).toBe('4')

    // Not working to trigger event : input.dispatchEvent(new MouseEvent("click"))
    view.onchange({ target: { value: 7 } } as never)
    state.data$.pipe(take(1)).subscribe(({ fromListener, value }) => {
        expect(value).toBe(7)
        expect(fromListener).toBe('onchange')
    })
    view.oninput({ target: { value: 2 } } as never)
    state.data$.pipe(take(1)).subscribe(({ fromListener, value }) => {
        expect(value).toBe(2)
        expect(fromListener).toBe('oninput')
    })
})
