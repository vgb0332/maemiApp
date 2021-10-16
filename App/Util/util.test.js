const util = require("./util")
// @ponicode
describe("_change", () => {
    let inst

    beforeEach(() => {
        inst = new util.ResizeEvent()
    })

    test("0", () => {
        let callFunction = () => {
            inst._change(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst._change(100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst._change(-100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst._change(-5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst._change(0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst._change(NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("onChange", () => {
    let inst

    beforeEach(() => {
        inst = new util.ResizeEvent()
    })

    test("0", () => {
        let callFunction = () => {
            inst.onChange()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("destroy", () => {
    let inst

    beforeEach(() => {
        inst = new util.ResizeEvent()
    })

    test("0", () => {
        let callFunction = () => {
            inst.destroy()
        }
    
        expect(callFunction).not.toThrow()
    })
})
