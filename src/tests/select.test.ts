import { render } from '@youwol/flux-view'
import { BehaviorSubject } from 'rxjs'
import { Select } from '../index'

test('select', (done) => {
    let items$ = new BehaviorSubject([
        new Select.ItemData('a', 'a'),
        new Select.ItemData('b', 'b'),
    ])
    let id$ = new BehaviorSubject('b')
    let state = new Select.State(items$, id$)

    let view = new Select.View({ state })

    let div = render(view)

    document.body.appendChild(div)

    let items = Array.from(document.querySelectorAll('option'))
    expect(items.map((elem) => elem.innerText)).toEqual(['a', 'b'])
    expect(items[1].selected).toBeTruthy()

    items$.next([
        new Select.ItemData('a', 'a'),
        new Select.ItemData('b', 'b'),
        new Select.ItemData('c', 'c'),
    ])
    id$.next('c')
    items = Array.from(document.querySelectorAll('option'))
    expect(items.map((elem) => elem.innerText)).toEqual(['a', 'b', 'c'])
    expect(items[2].selected).toBeTruthy()

    // 'proper' solution not found (tried items[0].dispatchEvent(new MouseEvent('click')))
    // => we simulate the change
    view.onchange({ target: [{ selected: true, value: 'a' }] })

    state.selectionId$.subscribe((d) => {
        expect(d).toEqual('a')
        done()
    })
})

test('select wit dynamic items & new selectedId', (done) => {
    document.body.innerHTML = ''
    let items$ = new BehaviorSubject([
        new Select.ItemData('a', 'a'),
        new Select.ItemData('b', 'b'),
    ])
    let id$ = new BehaviorSubject('b')
    let state = new Select.State(items$, id$)

    let view = new Select.View({ state })

    let div = render(view)

    document.body.appendChild(div)

    let items = Array.from(document.querySelectorAll('option'))
    expect(items.map((elem) => elem.innerText)).toEqual(['a', 'b'])
    expect(items[1].selected).toBeTruthy()

    items$.next([new Select.ItemData('a', 'a'), new Select.ItemData('c', 'c')])

    items = Array.from(document.querySelectorAll('option'))
    expect(items.map((elem) => elem.innerText)).toEqual(['a', 'c'])
    expect(items[0].selected).toBeTruthy()
    done()
})
