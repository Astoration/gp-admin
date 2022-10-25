import React, { Component } from 'react';

export default class DataViewAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {},
    };
  }

  handleChange(key, input) {
    if (input.target.value.length > 0) {
      this.setState({
        form: Object.assign({}, this.state.form, { [key]: input.target.value }),
      });
    } else {
      let form = this.state.form;
      delete form[key];
      this.setState({ form: Object.assign({}, form) });
    }
  }

  render() {
    const { tableFields, fields, mainField, addButton } = this.props;

    return (
      <table className='data-view-list-add'>
        <thead>
          <tr>
            {tableFields.map(v => (
              <td
                key={v}
                className={mainField === v ? 'main' : ''}
                style={{ width: fields[v].width }}>
                <input onChange={(e) => { this.handleChange(v, e); }} className='value' placeholder={fields[v].name || ''} type='text' style={{ width: '100%' }} readOnly={fields[v].readOnly} />
              </td>
            ))}
            <td><button onClick={() => { addButton.onClick(this.state.form); }}>{addButton.text}</button></td>
          </tr>
        </thead>
      </table>
    );
  }
}
