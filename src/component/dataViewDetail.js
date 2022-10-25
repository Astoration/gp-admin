import React, { Component } from 'react';
import Dropdown from 'react-select';
import Dropzone from 'react-dropzone';
import Datetime from 'react-datetime';
import Quill from 'react-quill';
import moment from 'moment';
import 'moment/locale/ko';
import classNames from 'classnames';
import { Link, Prompt } from 'react-router-dom';
import deepEqual from 'deep-equal';
import 'react-datetime/css/react-datetime.css';
import { Editor } from '@tinymce/tinymce-react';
import './dataViewDetail.scss';
import 'quill/dist/quill.snow.css';
import TextareaAutosize from 'react-textarea-autosize';

const ITEM_FULL = {
  text: true,
  photos: true,
  sub: true,
  html: true,
};

// 수정 타입에 따른 데이터 폼 형식
const ITEM_EDIT_TABLE = {
  photos: ({ field, name, value, item, onChangeItem, onChange,
    onChangeItemPermanent,
  }) => item.id == null ? (!field.uploadWithPhoto
      ? (<div>새로 만들어지고 나서 보여집니다.</div>)
      : (
        <ul className='photos'>
          { (value && value[0] && value.map(data => (
          <li>
            <a>
              <span className='content'>
                <img src={data.url} />
              </span>
            </a>
            { (
              <div className='header'>
                <button className='remove' onClick={(e) => {
                  e.preventDefault();
                  onChangeItem({files: null});
                }} />
              </div>
            )}
          </li>
        )))}
          <li className='upload'>
            <Dropzone className='dropzone'
              accept={'image/*'}
              onDrop={files => {
                let i = 0;
                let readers = Array(files.length)
                let results = []
                let completeCount = files.length;
                for(let file of files){
                  readers[i] = new FileReader();
                  var url = readers[i].readAsDataURL(file);
                  readers[i].onloadend = function(e) {
                    results = results.concat([{file, url: this.result}]);
                    completeCount -= 1;
                    if(completeCount <= 0) onChange({ target: {value:(value == null ? [] : value).concat(results)}});
                  };
                  i += 1;
                }
              }}
          >
            사진 선택
          </Dropzone>
          </li>
        </ul>
    )
  ) : (
    <ul className='photos'>
      { (value || []).map((addr, i) => (
        <li key={i}>
          <a href={value[i]} target='_blank'>
            <span className='content'>
              <img src={addr} />
            </span>
          </a>
          <div className='header'>
            { field.selected && (
              <input type='radio' className='select' value={i}
                checked={item[field.selected] === i}
                onChange={() => onChangeItem({ [field.selected]: i })} />
            )}
            <button className='remove' onClick={(e) => {
              e.preventDefault();
              if (confirm('정말 사진을 삭제하시겠습니까?')) {
                field.apiDelete(item.id, i)
                .then(({ status, body }) => {
                  if (status === 200) {
                    onChangeItemPermanent(body);
                  } else {
                    alert('사진 삭제에 실패했습니다: ' + (body.data || body));
                  }
                });
              }
            }} />
          </div>
        </li>
      ))}
      <li className='upload'>
        <Dropzone className='dropzone'
          accept={'image/*'}
          onDrop={files => {
            // Perform upload logic... here.
            let body = {}
            body[name] = files.map(file => ({file: file}));
            field.apiPost(item.id, body)
            .then(({ status, body }) => {
              if (status === 200) onChangeItemPermanent(body);
              else alert('사진 업로드에 실패했습니다: ' + (body.data || body));
            });
          }}
        >
          올리기...
        </Dropzone>
      </li>
    </ul>
  ),
  photo: ({ field, name, value, item, onChange, onChangeItem, onChangeItemPermanent,
  }) => item.id == null ? (
    !field.uploadWithPhoto
    ? (<div>새로 만들어지고 나서 보여집니다.</div>)
    : (
      <ul className='photos'>
        { (item.files && item.files[0] && (
        <li>
          <a>
            <span className='content'>
              <img src={item.files[0].url} />
            </span>
          </a>
          { (
            <div className='header'>
              <button className='remove' onClick={(e) => {
                e.preventDefault();
                onChangeItem({files: null});
              }} />
            </div>
          )}
        </li>
      ))}
        <li className='upload'>
          <Dropzone className='dropzone'
            accept={'image/png'}
            onDrop={files => {
            // Perform upload logic... here.
              var file = files[0];
              var reader = new FileReader();
              var url = reader.readAsDataURL(file);
              reader.onloadend = function(e) {
                onChangeItem({files: [{file, url: reader.result}]});
              };
            }}
        >
          사진 선택
        </Dropzone>
        </li>
      </ul>
  )
  ) : (
    <ul className='photos'>
      { (item[field.thumbs] != null && (
        <li>
          <a href={value} target='_blank'>
            <span className='content'>
              <img src={item[field.thumbs]} />
            </span>
          </a>
          { field.apiDelete && (
            <div className='header'>
              <button className='remove' onClick={(e) => {
                e.preventDefault();
                if (confirm('정말 사진을 삭제하시겠습니까?')) {
                  field.apiDelete(item.id)
                  .then(({ status, body }) => {
                    if (status === 200) {
                      onChangeItemPermanent(body);
                    } else {
                      alert('사진 삭제에 실패했습니다: ' + (body.data || body));
                    }
                  });
                }
              }} />
            </div>
          )}
        </li>
      ))}
      <li className='upload'>
        <Dropzone className='dropzone'
          accept={'image/png'}
          onDrop={files => {
            // Perform upload logic... here.
            field.apiPost(item.id, files[0])
            .then(({ status, body }) => {
              if (status === 200) onChangeItemPermanent(body);
              else alert('사진 업로드에 실패했습니다: ' + (body.data || body));
            });
          }}
        >
          { item[field.thumbs] != null ? '수정...' : '올리기...' }
        </Dropzone>
      </li>
    </ul>
  ),
  id: ({ field, name, value, item, onChange }) => (
    <input type='text' value={value == null ? '' : value} name={name}
      readOnly />
  ),
  user: ({field, value }) => value && (
    (
      field.newTab ? 
      <Link to={`/users/${value.id}`} target="_blank" rel="noopener noreferrer">{value.name}</Link>
      :
      <Link to={`/users/${value.id}`}>{value.name}</Link>
    )
  ),
  company:({ value }) => value && (
    <Link to={`/unions/${value.id}`}>{value.brand}</Link>
  ),
  dynamic: ({ field, name, value, item, onChange,
  }) => {
    return item['type'].indexOf('profile') != -1 ? value && (<Link to={`/users/${value.id}`}>{value.nickname}</Link>) : (<input type='number' value={value == null ? '' : value} name={name}
      readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} onChange={onChange} />);
  },
  string: ({ field, name, value, item, onChange, user }) => (
    <input type='text' value={value == null ? '' : value} name={name}
      readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item, user) : field.readOnly} onChange={onChange} />
  ),
  iframe: ({ field, name, value, item, onChange }) => (
    <div>
      <input width="100%" type='text' value={value == null ? '' : value} name={name}
      readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} onChange={onChange} />
      <iframe width="100%" height="400px" src={value}/>
    </div>
  ),
  password: ({ field, name, value, item, onChange }) => (
    <input type='password' value={value == null ? '' : value} name={name}
      readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} onChange={onChange} />
  ),
  integer: ({ field, name, value, item, onChange }) => (
    <input type='number' value={value == null ? '' : value} name={name}
      min={field.min}
      max={field.max}
      readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} onChange={onChange} />
  ),
  number: ({ field, name, value, item, onChange }) => (
    <input type='number' value={value == null ? '' : value} name={name}
      readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} onChange={onChange} step='any' />
  ),
  benefit: ({ field, name, value, item, onChange }) => (
    <input type='number' value={value == null ? '' : value} name={name}
      readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} onChange={onChange} step='any' />
  ),
  phone: ({ field, name, value, item, onChange }) => (
    <input type='text' value={value == null ? '' : value} name={name}
      readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} onChange={(e) => {
        let value = e.target.value;
        // Convert the number to include hypens...
        value = value.replace(/-/g, '');
        // Region number...
        value = value.replace(/^(02|0\d{2})(\d)/, '$1-$2');
        // Host number...
        value = value.replace(/-(\d{3,4})(\d{4,})$/, '-$1-$2');
        onChange({ target: { value } });
      }} />
  ),
  boolean: ({ field, name, value, item, onChange }) => {
    if ((typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly) {
      return (
        <input type='text' value={value === true ? '네'
          : (value === false ? '아니요' : value)
        } name={name}
          readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} onChange={onChange} />
      );
    }
    let options = [
      { value: false, label: field.values == null ? '아니요' : field.values[0] },
      { value: true, label: field.values == null ? '네' : field.values[1] },
    ];
    return (
      <Dropdown placeholder={field.name} clearable={false}
        options={options}
        className={field.getClasses ? field.getClasses(value) : null}
        value={options[value === true ? 1 : 0]}
        onChange={value => {
          onChange({ target: { value:
            value && value.value,
          } });
        }} />
    );
  },
  button: ({ field, value, item, onChange, fields, onChangeItem }) => {
    if(field.render != null){
      return field.render(item, fields, onChange, onChangeItem);
    }
    return (
      <button className='button' onClick={e => {
        e.preventDefault();
        onChange({ target: { value: true } });
      }}>
        설정
      </button>
    );
  },
  text: ({ field, name, value, item, onChange, onChangeItem, user }) => (
    <TextareaAutosize value={value == null ? '' : value} name={name}
      placeholder={field.placeholder}
      readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item, user) : field.readOnly}
      onChange={field.onChange != null ? field.onChange.bind(null, onChangeItem, onChange, item) : onChange} />
  ),
  html: ({ field, name, value, item, onChange }) => (
    <div className='editor'>
       <Quill value={value == null ? '' : value} name={name}
        readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} theme='snow'
        onChange={e => onChange({ target: { value: e } })} />
    </div>
  ),
  date: ({ field, name, value, item, onChange, user }) => {
    let curTime = new Date(value).getTime();
    return (
      ((typeof field.readOnly === 'function') ? field.readOnly(item, user) : field.readOnly) 
      ? (<input type='text'
      value={value == null ? '없음' : moment(new Date(value)).format('L LT')}
      name={name}
      readOnly />) :  
      (<Datetime onChange={(e) => {
        let value = e;
        if (typeof e !== 'string') value = e.toDate();
        onChange({ target: { value: value.toString() } });
      }}
        value={(isNaN(curTime) || curTime === 0) ? value : new Date(value)}
        name={name} />)
    );
  },
  age: ({ field, name, value, item, onChange }) => {
    let curTime = new Date(value).getTime();
    return (
      <span>
      <Datetime 
      className='age'
      viewMode={'years'}
      dateFormat={'YYYY'}
      viewDate={'YYYY.MM.DD'}
      onChange={(e) => {
        let value = e;
        if (typeof e !== 'string') value = e.toDate();
        onChange({ target: { value: value.toString() } });
      }}
        closeOnTab={false}
        value={(isNaN(curTime) || curTime === 0) ? value : new Date(value)}
        name={name} />
      <label>({new Date().getFullYear()-new Date(value).getFullYear()+1})</label>
      </span>
    );
  },
  dateMeta: ({ field, name, value, item, onChange }) => (
    <input type='text'
      value={value == null ? '없음' : moment(new Date(value)).format('L LT')}
      name={name}
      readOnly />
  ),
  dateOnly: ({ field, name, value, item, onChange }) => {
    let curTime = new Date(value).getTime();
    return (
      <Datetime onChange={(e) => {
        let value = e;
        if (typeof e !== 'string') value = e.toDate();
        onChange({ target: { value: value.toString() } });
      }}
        timeFormat={false}
        closeOnTab={false}
        value={(isNaN(curTime) || curTime === 0) ? value : new Date(value)}
        name={name} />
    );
  },
  time: ({ field, name, value, item, onChange }) => (
    <div className='time'>
      <span className='field'>
        <input type='text' placeholder='시' name={name + 'Hour'}
          value={value == null ? 0 : (Math.floor(value / 1000 / 60 / 60))}
          readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} onChange={(e) => {
            let fixedValue = value || 0;
            let timestamp = (parseInt(e.target.value) || 0) * 1000 * 60 * 60;
            timestamp += fixedValue % (1000 * 60 * 60);
            onChange({ target: { value: timestamp } });
          }} />
      </span>
      <span className='field'>
        <input type='text' placeholder='분' name={name + 'Min'}
          value={value == null ? 0 : (Math.floor(value / 1000 / 60) % 60)}
          readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} onChange={(e) => {
            let fixedValue = value || 0;
            let timestamp = (parseInt(e.target.value) || 0) * 1000 * 60;
            timestamp += fixedValue % (1000 * 60);
            timestamp += Math.floor(fixedValue / 1000 / 60 / 60) * 1000 * 60 *
              60;
            onChange({ target: { value: timestamp } });
          }} />
      </span>
      <span className='field'>
        <input type='text' placeholder='초' name={name + 'Sec'}
          value={value == null ? 0 : (Math.floor(value / 1000) % 60)}
          readOnly={(typeof field.readOnly === 'function') ? field.readOnly(item) : field.readOnly} onChange={(e) => {
            let fixedValue = value || 0;
            let timestamp = (parseInt(e.target.value) || 0) * 1000;
            timestamp += fixedValue % (1000);
            timestamp += Math.floor(fixedValue / 1000 / 60) * 1000 * 60;
            onChange({ target: { value: timestamp } });
          }} />
      </span>
    </div>
  ),
  place: ({ field, name, value, item, onChange }) =>{
    let values = field.values;
    if(field.getValues != null){
      values = field.getValues();
    }
    return (
      <Dropdown placeholder='선택...' clearable={false}
        options={values.map((value) => {
          return ({
            label: value.name+`(${value.address})`, value: value.id,
          });
        })}
        name={name}
        value={(
          values.find(v => v.id == value) != null ? (
            { value: value, label: (values.find(v => v.id == value) && (values.find(v => v.id == value).name+`(${values.find(v => v.id == value).address})`)) }
          ) : (value == null ? undefined : { value: value, label: value })
        )}
        onChange={value => {
          onChange({ target: { value:
          value && Array.isArray(value)
            ? value.map(v => v.value).join(',')
            : (value && value.value),
          } });
        }} />
    )},
  enum: ({ field, name, value, item, onChange, onChangeItem, user }) =>
    (Array.isArray(field.values) ? (
    // We do addition / subtraction to workaround weird error
      <Dropdown placeholder='선택...' clearable={false}
        options={field.values.map((label, value) => {
          var disabled = ((typeof field.readOnly === 'function') ? field.readOnly(item, user) : field.readOnly);
          if (label.disabled != null) {
            disabled = label.disabled;
            label = label.text;
          }
          return ({
            label, value: value + (field.offset || 0), disabled,
          });
        })}
        name={name}
        className={field.getClasses ? field.getClasses(value) : null}
        multi={field.multiple}
        value={field.multiple ? (
        (Array.isArray(value) ? value : (value+'' || '').split(',')).map(v => parseInt(v)).filter(v => !isNaN(v))
        .map(v => field.values[v - (field.offset || 0)] != null ? (
          { value: v, label: field.values[v - (field.offset || 0)] }
        ) : (v == null ? undefined : { value: v, label: v }))
      ) : (
        field.values[value - (field.offset || 0)] != null ? (
          { value: value, label: field.values[value - (field.offset || 0)] }
        ) : (value == null ? undefined : { value: value, label: value })
      )}
        onChange={field.onChange != null ? field.onChange.bind(null, onChangeItem, item) : ((value) => {
          onChange({ target: { value:
          value && Array.isArray(value)
            ? value.map(v => v.value).join(',')
            : (value && value.value),
          } });
        })} />
  ) : (
    <Dropdown placeholder='선택...' clearable={false}
      options={Object.keys(field.values).map((value) => ({
        label: field.values[value],
        value,
        disabled: ((typeof field.readOnly === 'function') ? field.readOnly(item, user) : field.readOnly),
      }))}
      name={name}
      className={field.getClasses ? field.getClasses(value) : null}
      value={field.values[value] != null ? (
        { value, label: field.values[value] }
      ) : { value, label: value }}
      onChange={value => onChange({ target: { value: value.value } })} />
  )),
  sub: ({ field, name, value, item, originalItem, onChangeItem,
    onChangeItemPermanent,
  }) => (
    <div className='sub-form'>
      { Object.keys(field.fields).map(name2 => !field.fields[name2].hidden && (
        renderRow(name2, field.fields, originalItem[name] || {},
          item[name] || {},
          e => onChangeItem({ [name]: Object.assign({}, item[name], {
            [name2]: e.target.type === 'checkbox'
              ? e.target.checked : e.target.value,
          }) }),
          data => onChangeItem({
            [name]: Object.assign({}, item[name], data),
          }),
          data => onChangeItemPermanent({
            [name]: Object.assign({}, item[name], data),
          }),
        )
      ))}
    </div>
    ),
  title: ({field,name,value}) => (
    (<div></div>)
  ),
};

const renderRow = (name, fields, originalItem, item, onChange, onChangeItem,
  onChangeItemPermanent, user
) => {
  if(item == null) item = {};
  if(originalItem == null) originalItem = {};
  return (
    <div key={name}
    style={{
      width: fields[name].detailWidth
    }}
    className={classNames('form-row', {
      full: ITEM_FULL[fields[name].type] || fields[name].full,
      block: fields[name].block,
      small: fields[name].small,
      half: fields[name].half,
      vertical: fields[name].vertical,
      title: fields[name].type == 'title',
      edited: fields[name].editedFields != null
      ? (fields[name].editedFields.some(n =>
        !deepEqual(item[n], originalItem[n])))
      : (!deepEqual(item[name], originalItem[name])),
    })}>
      <div className='content'>
        <label htmlFor={name}>{fields[name].name}</label>
        {(ITEM_EDIT_TABLE[fields[name].type] ||
        ITEM_EDIT_TABLE['string'])({
          field: fields[name],
          name: name,
          value: fields[name].getter ? fields[name].getter(item, item[name])
            : item[name],
          item,
          originalItem,
          onChange,
          onChangeItem,
          onChangeItemPermanent,
          fields,
          user
        })
      }
      </div>
    </div>
  );
};

export default class DataViewDetail extends Component {
  componentWillMount() {
    const { header, footer, id, item } = this.props;
    this.setState({
      options: {},
      newItem: this.props.item,
      edited: false,
      header: header && header(id, item),
      footer: footer && footer(id, item, this.props.patch, Object.assign({},{ update: this.updateOption.bind(this) })),
    });
  }

  updateOption(options){
    const { header, footer, id, item } = this.props;
    this.setState({
      options,
      footer: footer && footer(id, item, this.props.patch, Object.assign(options, { update: this.updateOption.bind(this) })),
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.noUpdate) {
      this.noUpdate = false;
      return;
    }
    const { header, footer, item, id } = nextProps;
    if (this.props.id !== id || this.props.header !== header || (item != null && item.id == null)) {
      this.setState({
        header: header && header(id, item),
        footer: footer && footer(id, item, this.props.patch, Object.assign({},{ update: this.updateOption.bind(this) })),
      });
    }
    if (this.props.item !== nextProps.item) {
      this.setState({ newItem: nextProps.item, edited: false });
    }
  }
  componentDidMount() {

  }

  componentWillUnmount() {
    this.unmounted = true;
  }
  handleChange(field, e) {
    let value = e.target.type === 'checkbox' ? e.target.checked
      : e.target.value;
    let data = { [field]: value };
    if (this.props.fields[field].setIgnore) data = {};
    if (this.props.fields[field].onChange) {
      Object.assign(data, this.props.fields[field].onChange(
        this.state.newItem, value,
      ));
    }
    this.handleChangeItem(data);
  }
  handleChangeItem(data) {
    let newItem = Object.assign({}, this.state.newItem, data);
    let edited = !deepEqual(newItem, this.props.item);
    this.setState({ newItem, edited });
  }
  handleChangeItemPermanent(data) {
    let newItem = Object.assign({}, this.state.newItem, data);
    this.setState({ newItem });
    this.noUpdate = true;
    let oldItem = Object.assign({}, this.props.item, data);
    this.props.onChangePermanent(oldItem);
  }
  handleDelete(e) {
    e.preventDefault();
    this.props.onDelete();
  }
  handleLoungeDelete(e) {
    e.preventDefault();
    this.props.onLoungeDelete();
  }
  handleToggle(e){
    e.preventDefault();
    this.props.toggleDetail();
  }
  handleReset(e) {
    e.preventDefault();
    this.setState({ newItem: this.props.item, edited: false });
  }
  handleSubmit(e) {
    e.preventDefault();
    // Get difference between original data and new data
    let output = {};
    const { newItem } = this.state;
    if (this.props.new || this.props.noDiff) {
      output = newItem;
    } else {
      const { item } = this.props;
      for (let key in newItem) {
        if (newItem[key] !== item[key]) output[key] = newItem[key];
        if (newItem[key] == null) delete newItem[key];
      }
    }
    this.props.onSubmit(output);
  }
  render() {
    let { fields, listLink, item: originalItem, deletable, saveLabel, user, inlineCreate, toggleDetail, id } =
      this.props;
    const { newItem: item, edited, header, footer, force } = this.state;
    return (
      <div className='data-view-detail'>
        {/* <Prompt when={!force && edited} message={location => '저장하지 않은 정보가 있습니다. 정말로 나가시겠습니까?'} /> */}
        <form onSubmit={this.handleSubmit.bind(this)}>
          { header }
          { Object.keys(fields).map(field => {
            if(id == 'new' && (fields[field].readOnly || ['dateMeta','id'].includes(fields[field].type))) return;
            if(fields[field].permission != null && (Array.isArray(fields[field].permission) ? !fields[field].permission.includes(user && user.permission) : field.permission !== user.permission)) return;
            return (((typeof fields[field].hidden) === 'function') ? !fields[field].hidden(item, user) : !fields[field].hidden) && (
            renderRow(field, fields, originalItem, item,
              this.handleChange.bind(this, field),
              this.handleChangeItem.bind(this),
              this.handleChangeItemPermanent.bind(this),
              user)
            );
          })}
          <div className='footer'>
            <div className='left'>
              { listLink && ( inlineCreate ? (<button className="button" onClick={this.handleToggle.bind(this)}>목록으로</button>) : (
                <Link to={listLink} className='button back'>목록으로</Link>
              ))}
            </div>
            <div className='right'>
              { deletable && (
                <button onClick={this.handleDelete.bind(this)}
                  className='button delete'
                >삭제</button>
              )}
              { (
                <input type='reset' className='button reset' value='초기화'
                  onClick={this.handleReset.bind(this)} />
              )}
              { (
                <input type='submit' className='button submit'
                  value={saveLabel || '저장'} />
              )}
            </div>
          </div>
        </form>
        { id != 'new' && footer }
      </div>
    );
  }
}
