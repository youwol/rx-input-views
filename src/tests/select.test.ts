import { render } from '@youwol/rx-vdom'
import { BehaviorSubject } from 'rxjs'
import { Select } from '../index'

test('select', (done) => {
    const items$ = new BehaviorSubject([
        new Select.ItemData('a', 'a'),
        new Select.ItemData('b', 'b'),
    ])
    const id$ = new BehaviorSubject('b')
    const state = new Select.State(items$, id$)

    const view = new Select.View({ state })

    const div = render(view)

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
        expect(d).toBe('a')
        done()
    })
})

test('select wit dynamic items & new selectedId', (done) => {
    document.body.innerHTML = ''
    const items$ = new BehaviorSubject([
        new Select.ItemData('a', 'a'),
        new Select.ItemData('b', 'b'),
    ])
    const id$ = new BehaviorSubject('b')
    const state = new Select.State(items$, id$)

    const view = new Select.View({ state })

    const div = render(view)

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
