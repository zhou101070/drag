import {reactive, ref} from 'vue'

export function useDrag() {
    const originalPosition = reactive({x: 0, y: 0})
    const clientPosition = reactive({x: 0, y: 0})
    const mousedownOffset = reactive({x: 0, y: 0})
    const elementPosition = reactive({x: 0, y: 0})

    const target = ref<HTMLDivElement>()

    function getRelativeCoordinates(target: HTMLDivElement) {
        const {left: x, top: y} = target.getBoundingClientRect()
        return {x: originalPosition.x - x, y: originalPosition.y - y}
    }

    function mousedown(e: MouseEvent) {
        const {clientX: x, clientY: y} = e
        target.value = <HTMLDivElement>e.target
        Object.assign(originalPosition, {x, y})
        console.log(originalPosition.x, originalPosition.y, e)

        Object.assign(clientPosition, getRelativeCoordinates(target.value))
        document.addEventListener('mousemove', mousemove)
    }

    function mouseup(e: MouseEvent) {
        const {clientX: x, clientY: y} = e
        Object.assign(elementPosition, {x, y})
        document.removeEventListener('mousemove', mousemove)
    }

    function mousemove(e: MouseEvent) {
        const {clientX: x, clientY: y} = e
        Object.assign(mousedownOffset, {x, y})
        target.value.style.transform = `translate(${x - clientPosition.x}px,${y - clientPosition.y}px)`
    }

    return {originalPosition, mousedownOffset, elementPosition, mousedown, mouseup, mousemove}
}

(function f() {
    let target = null
    window.targetList = []
    const originalPosition = {x: 0, y: 0}
    const clientPosition = {x: 0, y: 0}

    function getRelativeCoordinates(target, clientX, clientY) {
        const {left: x, top: y} = target.getBoundingClientRect()
        return {x: clientX - x, y: clientY - y}
    }

    function mousemove(e) {
        const {clientX: x, clientY: y} = e
        target.style.transform = `translate(${x - clientPosition.x - originalPosition.x}px,${y - clientPosition.y - originalPosition.y}px)`
    }

    document.addEventListener('mousedown', function (e) {
        const {clientX, clientY} = e
        console.log(clientX, clientY)
        target = document.elementFromPoint(clientX, clientY)
        if (!window.targetList.includes(target)) window.targetList.push(target)
        target.style.pointerEvents = 'none'
        // target.addEventListener('click', function (e) {
        //     e.stopPropagation()
        //     e.preventDefault()
        // })
        const {left: x, top: y} = target.getBoundingClientRect()
        Object.assign(originalPosition, {x, y})
        if (target === document.body) return
        Object.assign(clientPosition, getRelativeCoordinates(target, clientX, clientY))

        if (target.init) {
            originalPosition.x = target.x
            originalPosition.y = target.y
        } else {
            target.init = true
            target.x = originalPosition.x
            target.y = originalPosition.y
        }
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', (e) => {
            document.removeEventListener('mousemove', mousemove)
            target.style.pointerEvents = ''
        })
        e.preventDefault()
    })
})()
