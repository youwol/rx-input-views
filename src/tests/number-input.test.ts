import { render } from "@youwol/flux-view"
import { BehaviorSubject } from "rxjs"
import { NumberInput } from "../index"

test('simple scenario', (done) => {

    let value$ = new BehaviorSubject(0)
    let state = new NumberInput.State(value$)

    let view = new NumberInput.View({state})

    let div = render(view)
    
    document.body.appendChild(div)
    let input =  document.querySelector('input')
    expect(input.value).toEqual("0")

    value$.next(1)
    expect(input.value).toEqual("1")

    view.oninput( {target:{value:"2"}} as any)
    value$.subscribe( v => {
        expect(v).toEqual(2)
        done()
    })
})
