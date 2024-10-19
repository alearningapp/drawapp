import React, { Component } from "react";
import SVG from "./SVG"; // Ensure this component exists
import Controls from "./Controls"; // Ensure this component exists
import Result from "./Result"; // Ensure this component exists
import  './Style.css';
export default class SvgEditPlayer extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            w: 800,
            h: 600,
            grid: {
                show: true,
                snap: true,
                size: 50
            },
            ctrl: false,
            points: [
                { x: 100, y: 300 },
                { x: 200, y: 300, q: { x: 150, y: 50 } },
                { x: 300, y: 300, q: { x: 250, y: 550 } },
                { x: 400, y: 300, q: { x: 350, y: 50 } },
                { x: 500, y: 300, c: [{ x: 450, y: 550 }, { x: 450, y: 50 }] },
                { x: 600, y: 300, c: [{ x: 550, y: 50 }, { x: 550, y: 550 }] },
                { x: 700, y: 300, a: { rx: 50, ry: 50, rot: 0, laf: 1, sf: 1 } }
            ],
            activePoint: 2,
            draggedPoint: false,
            draggedQuadratic: false,
            draggedCubic: false,
            closePath: false
        };
        this.svgRef = React.createRef();
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    componentDidUpdate(prevProps, prevState) {
    }

    positiveNumber(n) {
        n = parseInt(n, 10);
        return isNaN(n) || n < 0 ? 0 : n;
    }

    setWidth = (e) => {
        const v = Math.max(this.positiveNumber(e.target.value), 1);
        this.setState({ w: v });
    };

    setHeight = (e) => {
        const v = Math.max(this.positiveNumber(e.target.value), 1);
        this.setState({ h: v });
    };

    setGridSize = (e) => {
        const grid = { ...this.state.grid };
        const v = this.positiveNumber(e.target.value);
        const min = 1;
        const max = Math.min(this.state.w, this.state.h);
        grid.size = Math.min(Math.max(v, min), max / 2);
        this.setState({ grid });
    };

    setGridSnap = (e) => {
        this.setState(prevState => ({
            grid: { ...prevState.grid, snap: e.target.checked }
        }));
    };

    setGridShow = (e) => {
        this.setState(prevState => ({
            grid: { ...prevState.grid, show: e.target.checked }
        }));
    };

    setClosePath = (e) => {
        this.setState({ closePath: e.target.checked });
    };

    getMouseCoords = (e) => {
        const rect = this.svgRef.current.getBoundingClientRect();
        let x = Math.round(e.pageX - rect.left);
        let y = Math.round(e.pageY - rect.top);

        if (this.state.grid.snap) {
            x = this.state.grid.size * Math.round(x / this.state.grid.size);
            y = this.state.grid.size * Math.round(y / this.state.grid.size);
        }

        return { x, y };
    };
    addPoint = (e) => {
        const coords = this.getMouseCoords(e);
        this.setState((prevState) => ({
            points: [...prevState.points, { x: coords.x, y: coords.y }],
            activePoint: prevState.points.length, // Set the new point as active
        }));
    };
    setDraggedPoint = (index) => {
        this.setState({ draggedPoint: index });
    };

    cancelDragging = () => {
        this.setState({ draggedPoint: null });
    };
    setPointType = (e) => {
        const points = [...this.state.points];
        const active = this.state.activePoint;

        if (active !== 0) {
            const v = e.target.value;
            // Update point type based on selection
            switch (v) {
                case "l":
                    points[active] = { x: points[active].x, y: points[active].y };
                    break;
                case "q":
                    points[active] = {
                        x: points[active].x,
                        y: points[active].y,
                        q: {
                            x: (points[active].x + points[active - 1].x) / 2,
                            y: (points[active].y + points[active - 1].y) / 2,
                        },
                    };
                    break;
                case "c":
                    points[active] = {
                        x: points[active].x,
                        y: points[active].y,
                        c: [
                            {
                                x: (points[active].x + points[active - 1].x - 50) / 2,
                                y: (points[active].y + points[active - 1].y) / 2,
                            },
                            {
                                x: (points[active].x + points[active - 1].x + 50) / 2,
                                y: (points[active].y + points[active - 1].y) / 2,
                            },
                        ],
                    };
                    break;
                case "a":
                    points[active] = {
                        x: points[active].x,
                        y: points[active].y,
                        a: {
                            rx: 50,
                            ry: 50,
                            rot: 0,
                            laf: 1,
                            sf: 1,
                        },
                    };
                    break;
                default:
                    break;
            }
            this.setState({ points });
        }
    };

    setPointPosition = (coord, e) => {
        const coords = { ...this.state.points[this.state.activePoint] };
        const v = this.positiveNumber(e.target.value);

        if (coord === "x" && v > this.state.w) v = this.state.w;
        if (coord === "y" && v > this.state.h) v = this.state.h;

        coords[coord] = v;
        this.setPointCoords(coords);
    };

    setPointCoords = (coords) => {
        const points = [...this.state.points];
        const active = this.state.activePoint;

        points[active].x = coords.x;
        points[active].y = coords.y;

        this.setState({ points });
    };
    removeActivePoint = (e) => {
        let points = this.state.points
        let active = this.state.activePoint
        
        if (points.length > 1 && active !== 0) {
            points.splice(active, 1)

            this.setState({
                points,
                activePoint: points.length - 1
            })
        }
    };
    generatePath() {
        const { points, closePath } = this.state;
        let d = "";

        points.forEach((p, i) => {
            if (i === 0) {
                d += "M ";
            } else if (p.q) {
                d += `Q ${p.q.x} ${p.q.y} `;
            } else if (p.c) {
                d += `C ${p.c[0].x} ${p.c[0].y} ${p.c[1].x} ${p.c[1].y} `;
            } else if (p.a) {
                d += `A ${p.a.rx} ${p.a.ry} ${p.a.rot} ${p.a.laf} ${p.a.sf} `;
            } else {
                d += "L ";
            }
            d += `${p.x} ${p.y} `;
        });

        if (closePath) d += "Z";

        return d;
    }

    reset = () => {
        const w = this.state.w;
        const h = this.state.h;
        const points = [{ x: w / 2, y: h / 2 }];

        this.setState({
            points,
            activePoint: 0,
        });
    };

    restoreDefaults = () => {
    };

    handleKeyDown = (e) => {
        if (e.shiftKey) this.setState({ shiftKey: true });
    };

    handleKeyUp = (e) => {
        if (!e.shiftKey) this.setState({ shiftKey: false });
    };
    handleMouseMove = (e) => {
        if (!this.state.shiftKey) {
            const coords = this.getMouseCoords(e);
            if (this.state.draggedPoint) {
                this.setPointCoords(coords);
            } else if (this.state.draggedQuadratic) {
                this.setQuadraticCoords(coords);
            } else if (this.state.draggedCubic !== false) {
                this.setCubicCoords(coords, this.state.draggedCubic);
            }
        }
    };
    setDraggedCubic = (index) => {
        this.setState({ draggedCubic: index });
    };
    setCubicCoords(e) {
        const coords = this.getMouseCoords(e);
        const points = [...this.state.points];
        const activeCubicIndex = this.state.draggedCubic;

        if (points[activeCubicIndex].c) {
            points[activeCubicIndex].c[1] = { x: coords.x, y: coords.y }; // Update second control point for cubic
            this.setState({ points });
        }
    }
    render() {
        return (
            <div className="ad-Container" onMouseUp={this.cancelDragging}>
                <div className="ad-Container-main">
                    <div className="ad-Container-svg">
                        <SVG
                            svgRef={this.svgRef}
                            path={this.generatePath()}
                            {...this.state}
                            addPoint={this.addPoint}
                            setDraggedPoint={this.setDraggedPoint}
                            setDraggedQuadratic={this.setDraggedQuadratic}
                            setDraggedCubic={this.setDraggedCubic}
                            handleMouseMove={this.handleMouseMove}
                        />
                    </div>
                </div>

                <div className="ad-Container-controls">
                    <Controls
                        {...this.state}
                        reset={this.reset}
                        restoreDefaults={this.restoreDefaults}
                        removeActivePoint={this.removeActivePoint}
                        setPointPosition={this.setPointPosition}
                        setWidth={this.setWidth}
                        setHeight={this.setHeight}
                        setGridSize={this.setGridSize}
                        setGridSnap={this.setGridSnap}
                        setGridShow={this.setGridShow}
                        setClosePath={this.setClosePath}
                    />
                    <Result path={this.generatePath()} />
                </div>
            </div>
        );
    }
}
