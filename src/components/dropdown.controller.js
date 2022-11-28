const { Select, Label } = require("../custom");

export function RenderDropDown(props) {
    return (
        <div className={`${props.className ? props.className : "col-md-6"}`}>
            <Label>{props.label}</Label>
            <Select
            disabled={props.disabled || false}
            value={props.selected}
            onChange={(e) => {
                if (props.onChange) {
                    props.onChange(e);
                }
            }}
            >
                
                <option value="">Select</option>
                {
                    props.options && props.options.length > 0 && props.options.map(option => option && <option value={option.value}>{option.label}</option>)
                }
            </Select>
        </div>
    );
}