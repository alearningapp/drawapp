

export default function Controls(props) {
    const active = props.points[props.activePoint]
    const step = props.grid.snap ? props.grid.size : 1

    let params = []

    if (active.q) {
        params.push(
            <div className="ad-Controls-container"  key="Control point X position">
                <Control
                    name="Control point X position"
                   
                    type="range"
                    min={ 0 }
                    max={ props.w }
                    step={ step }
                    value={ active.q.x }
                    onChange={ (e) => props.setQuadraticPosition("x", e) } />
            </div>
        )
        params.push(
            <div className="ad-Controls-container"  key="Control point Y position">
                <Control
                    name="Control point Y position"
                    type="range"
                    min={ 0 }
                    max={ props.h }
                    step={ step }
                    value={ active.q.y }
                    onChange={ (e) => props.setQuadraticPosition("y", e) } />
            </div>
        )
    } else if (active.c) {
        params.push(
            <div className="ad-Controls-container"  key="First control point X position">
                <Control
                    name="First control point X position"
                   
                    type="range"
                    min={ 0 }
                    max={ props.w }
                    step={ step }
                    value={ active.c[0].x }
                    onChange={ (e) => props.setCubicPosition("x", 0, e) } />
            </div>
        )
        params.push(
            <div className="ad-Controls-container" key="First control point Y position">
                <Control
                    name="First control point Y position"
                    
                    type="range"
                    min={ 0 }
                    max={ props.h }
                    step={ step }
                    value={ active.c[0].y }
                    onChange={ (e) => props.setCubicPosition("y", 0, e) } />
            </div>
        )
        params.push(
            <div className="ad-Controls-container"  key="Second control point X position">
                <Control
                    name="Second control point X position"
                   
                    type="range"
                    min={ 0 }
                    max={ props.w }
                    step={ step }
                    value={ active.c[1].x }
                    onChange={ (e) => props.setCubicPosition("x", 1, e) } />
            </div>
        )
        params.push(
            <div className="ad-Controls-container"  key="Second control point Y position">
                <Control
                    name="Second control point Y position"
                   
                    type="range"
                    min={ 0 }
                    max={ props.h }
                    step={ step }
                    value={ active.c[1].y }
                    onChange={ (e) => props.setCubicPosition("y", 1, e) } />
            </div>
        )
    } else if (active.a) {
        params.push(
            <div className="ad-Controls-container"  key="X Radius">
                <Control
                    name="X Radius"
                   
                    type="range"
                    min={ 0 }
                    max={ props.w }
                    step={ step }
                    value={ active.a.rx }
                    onChange={ (e) => props.setArcParam("rx", e) } />
            </div>
        )
        params.push(
            <div className="ad-Controls-container"   key="Y Radius">
                <Control
                    name="Y Radius"
                  
                    type="range"
                    min={ 0 }
                    max={ props.h }
                    step={ step }
                    value={ active.a.ry }
                    onChange={ (e) => props.setArcParam("ry", e) } />
            </div>
        )
        params.push(
            <div className="ad-Controls-container"   key="Rotation">
                <Control
                    name="Rotation"
                  
                    type="range"
                    min={ 0 }
                    max={ 360 }
                    step={ 1 }
                    value={ active.a.rot }
                    onChange={ (e) => props.setArcParam("rot", e) } />
            </div>
        )
        params.push(
            <div className="ad-Controls-container"   key="Large arc sweep flag">
                <Control
                    name="Large arc sweep flag"
                  
                    type="checkbox"
                    checked={ active.a.laf }
                    onChange={ (e) => props.setArcParam("laf", e) } />
            </div>
        )
        params.push(
            <div className="ad-Controls-container"   key="Sweep flag">
                <Control
                    name="Sweep flag"
                  
                    type="checkbox"
                    checked={ active.a.sf }
                    onChange={ (e) => props.setArcParam("sf", e) } />
            </div>
        )
    }
console.log(params)
    return (
        <div className="ad-Controls">
            <h3 className="ad-Controls-title">
                Parameters
            </h3>

            <div className="ad-Controls-container">
                <Control
                    key="Width"
                    name="Width"
                    type="text"
                    value={ props.w }
                    onChange={ (e) => props.setWidth(e) } />
                <Control
                   key="Height"
                    name="Height"
                    type="text"
                    value={ props.h }
                    onChange={ (e) => props.setHeight(e) } />
                <Control
                 key="Close path"
                    name="Close path"
                    type="checkbox"
                    value={ props.closePath }
                    onChange={ (e) => props.setClosePath(e) } />
            </div>
            <div className="ad-Controls-container">
                <Control
                 key="Grid size"
                    name="Grid size"
                    type="text"
                    value={ props.grid.size }
                    onChange={ (e) => props.setGridSize(e) } />
                <Control
                 key="Snap grid"
                    name="Snap grid"
                    type="checkbox"
                    checked={ props.grid.snap }
                    onChange={ (e) => props.setGridSnap(e) } />
                <Control
                    key="Show grid"
                    name="Show grid"
                    type="checkbox"
                    checked={ props.grid.show }
                    onChange={ (e) => props.setGridShow(e) } />
            </div>
            <div className="ad-Controls-container">
                <Control
                    key="Reset path"
                    type="button"
                    action="reset"
                    value="Reset path"
                    onClick={ (e) => props.reset(e) } />
                <Control
                    key="Restore Defaults"
                    type="button"
                    action="reset"
                    value="Restore Defaults"
                    onClick={ (e) => props.restoreDefaults(e) } />
            </div>

            <h3 className="ad-Controls-title">
                Selected point
            </h3>

            { props.activePoint !== 0 && (
                <div className="ad-Controls-container">
                    <Control
                        name="Point type"
                        type="choices"
                        id="pointType"
                        key="pointType"
                        choices={[
                            { name: "L", value: "l", checked: (!active.q && !active.c && !active.a) },
                            { name: "Q", value: "q", checked: !!active.q },
                            { name: "C", value: "c", checked: !!active.c },
                            { name: "A", value: "a", checked: !!active.a }
                        ]}
                        onChange={ (e) => props.setPointType(e) } />
                </div>
            )}
            <div className="ad-Controls-container">
                <Control
                    name="Point X position"
                    key="Point X positio"
                    type="range"
                    min={ 0 }
                    max={ props.w }
                    step={ step }
                    value={ active.x }
                    onChange={ (e) => props.setPointPosition("x", e) } />
            </div>
            <div className="ad-Controls-container">
                <Control
                    name="Point Y position"
                    key="Point Y position"
                    type="range"
                    min={ 0 }
                    max={ props.h }
                    step={ step }
                    value={ active.y }
                    onChange={ (e) => props.setPointPosition("y", e) } />
            </div>

            { params }

            { props.activePoint !== 0 && (
                <div className="ad-Controls-container">
                    <Control
                       key="Remove this point"

                        type="button"
                        action="delete"
                        value="Remove this point"
                        onClick={ (e) => props.removeActivePoint(e) } />
                </div>
            )}
        </div>
    )
}

function Control(props) {
    const {
        name,
        type,
        ..._props
    } = props

    let control = "", label = ""
console.log(props)
    switch (type) {
        case "range": control = <Range { ..._props } />
        break
        case "text": control = <Text { ..._props } />
        break
        case "checkbox": control = <Checkbox { ..._props } />
        break
        case "button": control = <Button { ..._props } />
        break
        case "choices": control = <Choices { ..._props } />
        break
    }

    if (name) {
        label = (
            <label className="ad-Control-label">
                { name }
            </label>
        )
    }

    return (
        <div className="ad-Control">
            { label }
            { control }
        </div>
    )
}

function Choices(props) {
    console.log(props)
    let choices = props.choices.map((c, i) => {
        return (
            <label className="ad-Choice" key={i}>
                <input
                    className="ad-Choice-input"
                    type="radio"
                    key={i}
                    value={ c.value }
                    checked={ c.checked }
                    name={ props.id }
                    onChange={ props.onChange } />
                <div className="ad-Choice-fake">
                    { c.name }
                </div>
            </label>
        )
    })

    return (
        <div className="ad-Choices">
            { choices }
        </div>
    )
}

function Button(props) {
    return (
        <button
            className={
                "ad-Button" +
                (props.action ? "  ad-Button--" + props.action : "")
            }
            type="button"
            onClick={ props.onClick }>
            { props.value }
        </button>
    )
}

function Checkbox(props) {
    return (
        <label className="ad-Checkbox">
            <input
                className="ad-Checkbox-input"
                type="checkbox"
                onChange={ props.onChange }
                checked={ props.checked } />
            <div className="ad-Checkbox-fake" />
        </label>
    )
}

function Text(props) {
    return (
        <input
            className="ad-Text"
            type="text"
            value={ props.value }
            onChange={ props.onChange } />
    )
}

function Range(props) {
    return (
        <div className="ad-Range">
            <input
                className="ad-Range-input"
                type="range"
                min={ props.min }
                max={ props.max }
                step={ props.step }
                value={ props.value }
                onChange={ props.onChange } />
            <input
                className="ad-Range-text  ad-Text"
                type="text"
                value={ props.value }
                onChange={ props.onChange } />
        </div>
    )
}

