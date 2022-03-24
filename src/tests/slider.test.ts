import { render } from '@youwol/flux-view'
import { BehaviorSubject } from 'rxjs'
import { skip, take } from 'rxjs/operators'
import { Slider } from '../index'

test('slider', (done) => {
    let min$ = new BehaviorSubject(0)
    let max$ = new BehaviorSubject(10)
    let value$ = new BehaviorSubject(5)

    let state = new Slider.State({
        min: min$,
        max: max$,
        value: value$,
        count: 100,
    })

    let view = new Slider.View({ state })

    let div = render(view)

    document.body.appendChild(div)

    let input = document.querySelector('input')
    expect(input.min).toEqual('0')
    expect(input.max).toEqual('10')
    expect(input.value).toEqual('5')

    min$.next(4)
    expect(input.min).toEqual('4')

    // Not working to trigger event : input.dispatchEvent(new MouseEvent("click"))

    state.data$.pipe(take(1)).subscribe(({ fromListener, value }) => {
        expect(value).toEqual(7)
        expect(fromListener).toEqual('onchange')
    })
    state.data$.pipe(skip(1), take(1)).subscribe(({ fromListener, value }) => {
        expect(value).toEqual(2)
        expect(fromListener).toEqual('oninput')
        done()
    })
    view.onchange({ target: { value: 7 } } as any)
    state.value$.subscribe((d) => {
        expect(d).toEqual(7)
    })
    view.oninput({ target: { value: 2 } } as any)
})
