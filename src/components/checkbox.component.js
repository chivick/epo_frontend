import React, { Component, PropTypes } from 'react';

class Checkbox extends Component {
  state = {
    isChecked: false,
  }

  toggleCheckboxChange = () => {
    const { handleCheckboxChange } = this.props;
    const {isChecked} = this.state;

    this.setState({isChecked: !isChecked});

    if (handleCheckboxChange) {
        handleCheckboxChange(isChecked);
    }
  }

  render() {
    const { label, checked } = this.props;
    const { isChecked } = checked ?? false;

    return (
      <div className="checkbox">
        <label>
          <input
                id={this.props.checkboxId || ""}
                type="checkbox"
                className={`mr-2 mb-1 ml-2 ${this.props.checkboxClass}`}
                value={label}
                checked={isChecked}
                onChange={this.toggleCheckboxChange}
                defaultChecked={this.props.defaultChecked}
            />

          {label}
        </label>
      </div>
    );
  }
}

export default Checkbox;