import React, { Component,forwardRef } from "react";



/**
 * SVG rendering
 */

export default class SVG extends Component {
    render() {
        const {
            path,
            w,
            h,
            grid,
            points,
            activePoint,
            addPoint,
            handleMouseMove,
            setDraggedPoint,
            setDraggedQuadratic,
            setDraggedCubic,svgRef
        } = this.props

        let circles = points.map((p, i, a) => {
            let anchors = []

            if (p.q) {
                anchors.push(
                    <Quadratic
                        key={i}
                        index={ i }
                        p1x={ a[i - 1].x }
                        p1y={ a[i - 1].y }
                        p2x={ p.x }
                        p2y={ p.y }
                        x={ p.q.x }
                        y={ p.q.y }
                        setDraggedQuadratic={ setDraggedQuadratic } />
                )
            } else if (p.c) {
                anchors.push(
                    <Cubic
                        key={i}
                        index={ i }
                        p1x={ a[i - 1].x }
                        p1y={ a[i - 1].y }
                        p2x={ p.x }
                        p2y={ p.y }
                        x1={ p.c[0].x }
                        y1={ p.c[0].y }
                        x2={ p.c[1].x }
                        y2={ p.c[1].y }
                        setDraggedCubic={ setDraggedCubic } />
                )
            }

            return (
                <g className={
                    "ad-PointGroup" +
                    (i === 0 ? "  ad-PointGroup--first" : "") +
                    (activePoint === i ? "  is-active" : "")
                   
                }  key={i}>
                    <Point
                        key={i}
                        index={ i }
                        x={ p.x }
                        y={ p.y }
                        setDraggedPoint={ setDraggedPoint } />
                    { anchors }
                </g>
            )
        })

        return (
            <svg
                className="ad-SVG"
                ref={svgRef}
                width={ w }
                height={ h }
                onClick={ (e) => addPoint(e) }
                onMouseMove={ (e) => handleMouseMove(e) }>
                <Grid
                    w={ w }
                    h={ h }
                    grid={ grid } />
                <path
                    className="ad-Path"
                    d={ path } />
                <g className="ad-Points">
                    { circles }
                </g>
            </svg>
        )
    }
}

function Cubic(props) {
    return (
        <g className="ad-Anchor">
            <line
                className="ad-Anchor-line"
                x1={ props.p1x }
                y1={ props.p1y }
                x2={ props.x1 }
                y2={ props.y1 } />
            <line
                className="ad-Anchor-line"
                x1={ props.p2x }
                y1={ props.p2y }
                x2={ props.x2 }
                y2={ props.y2 } />
            <circle
                className="ad-Anchor-point"
                onMouseDown={ (e) => props.setDraggedCubic(props.index, 0) }
                cx={ props.x1 }
                cy={ props.y1 }
                r={ 6 } />
            <circle
                className="ad-Anchor-point"
                onMouseDown={ (e) => props.setDraggedCubic(props.index, 1) }
                cx={ props.x2 }
                cy={ props.y2 }
                r={ 6 } />
        </g>
    )
}

function Quadratic(props) {
    return (
        <g className="ad-Anchor">
            <line
                className="ad-Anchor-line"
                x1={ props.p1x }
                y1={ props.p1y }
                x2={ props.x }
                y2={ props.y } />
            <line
                className="ad-Anchor-line"
                x1={ props.x }
                y1={ props.y }
                x2={ props.p2x }
                y2={ props.p2y } />
            <circle
                className="ad-Anchor-point"
                onMouseDown={ (e) => props.setDraggedQuadratic(props.index) }
                cx={ props.x }
                cy={ props.y }
                r={ 6 } />
        </g>
    )
}

function Point(props) {
    return (
        <circle
            className="ad-Point"
            onMouseDown={ (e) => props.setDraggedPoint(props.index) }
            cx={ props.x }
            cy={ props.y }
            r={ 8 } />
    )
}

function Grid(props) {
    const { show, snap, size } = props.grid

    let grid = []

    for (let i = 1 ; i < (props.w / size) ; i++) {
        grid.push(
            <line key={i}
                x1={ i * size }
                y1={ 0 }
                x2={ i * size }
                y2={ props.h } />
        )
    }

    for (let i = 1 ; i < (props.h / size) ; i++) {
        grid.push(
            <line key={'y'+i}
                x1={ 0 }
                y1={ i * size }
                x2={ props.w }
                y2={ i * size } />
        )
    }

    return (
        <g className={
            "ad-Grid" +
            ( ! show ? "  is-hidden" : "")
        }>
            { grid }
        </g>
    )
}

