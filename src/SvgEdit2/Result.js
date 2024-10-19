export default function Result(props) {
    return (
        <div className="ad-Result">
            <textarea
                className="ad-Result-textarea"
                value={ props.path }
                readOnly
                onFocus={ (e) => e.target.select() } />
        </div>
    )
}