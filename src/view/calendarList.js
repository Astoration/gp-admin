import React, { Component, createRef, useRef } from 'react';

import DataView from '../container/dataView';

import Popup from 'reactjs-popup';
import { getPlace, getPlaces, patchPlace, postPlace, deletePlace, getUsers,
  deletePlacePhoto, postPlacePhotos, getAdminComments, getAdminMatchings } from '../api';
import { UserContext } from './app';
import moment from 'moment';
import { resources } from '../value/index.xml';

import TUICalendar from "@toast-ui/react-calendar";
import { ISchedule, ICalendarInfo } from "tui-calendar";

import DataViewSearch from '../component/dataViewSearch';

import "tui-calendar/dist/tui-calendar.css";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";


export default class CalendarList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        schedules: [],
        filter: {},
        places: {},
        fields: {
            month: {
                type: 'month',
                name: '월 검색',
            },
            managerId: { type: 'enum', width: '8.5em', name: '매칭 매니저', editable: true, values: {}},
        },
        filterFields: ['month','managerId'],
        filterName: '검색'
    }
    this.calendar = createRef();
  }

  componentDidMount(){
    this.updateSchedule();
  }

  handleSearch(filter) {
    this.updateSchedule(filter);
  }

  handleSearchReset() {
    this.setState({
      filter: {},
    });
  }

  async updateSchedule(updates = {}){
    const { filter } = this.state;
    let query = Object.assign(filter, updates);
    const managers = await getUsers({isAdmin: true});
    var placeResult = await getPlaces();
    var places = {};
    for(let v of placeResult.body.result){
        places[v.id] = v;
      }
    let manager = {};
    for(let v of managers.body.result){
      manager[v.id] = v.name;
    }
    let { status, body } = await (this.props.matching ? getAdminMatchings : getAdminComments)(Object.assign({ hasDating: true,
    isMatching: this.props.matching }, filter, updates));
    
    if (status === 200){
        this.setState({ 
            schedules: body.result,
            filter: updates,
            places,
            fields: {
                month: {
                    type: 'month',
                    name: '월 검색',
                },
                managerId: { type: 'enum', width: '8.5em', name: '매칭 매니저', editable: true, values: manager},
            },
        },()=>{
            this.calendar.current.calendarInst.setDate(query.month != null ? new Date(new Date(query.month) + (9 * 60 * 60 * 1000)) : new Date());
        });
    }
  }

  render() {
      const { filterFields, fields, filterName, mainFilterFields, filter, schedules, places } = this.state;
      return (
      <div className='calendar-list-view'>
        <DataViewSearch filterFields={filterFields} fields={fields}
            header={
                (this.props.matching ? (
                    <div style={{marginLeft:'1.5em'}}>
                        <li className='filter'><div className="searchLabel">매칭건수</div><span className='text'>{schedules.length}</span></li>
                    </div>
                ) : (
                    <div style={{marginLeft:'1.5em'}}>
                        <li className='filter'><div className="searchLabel">방문자수</div><span className='text'>{schedules.length}</span></li>
                    </div>
                ))
            }
            filterName={filterName}
            mainFilterFields={mainFilterFields} fetch={this.updateSchedule.bind(this)}
            onReset={this.handleSearchReset.bind(this)}
            filter={filter} onSearch={this.handleSearch.bind(this)} />
        <TUICalendar
        ref={this.calendar}
        height="800px"
        view="month"
        month={{
            daynames: ['일','월','화','수','목','금','토'],
        }}
        useCreationPopup={true}
        useDetailPopup={true}
        template={{
            popupDetailDate: function(isAllDay, start, end) {
                return (moment(start).format('YYYY.MM.DD hh:mm a'));
            }
        }}
        isReadOnly={true}
        calendars={[
            {
                id: '1',
                name: this.props.matching ? '매칭' : '방문',
                bgColor: '#9e5fff',
                borderColor: '#9e5fff'
            }
        ]}
        schedules={this.state.schedules.map((v)=>(this.props.matching ? ({
            calendarId: "1",
            category: "time",
            isVisible: true,
            title: `${v.sender.name}♥${v.receiver.name}`,
            id: "1",
            body: "",
            attendees: [v.sender.name,v.receiver.name],
            location: places[v.dateAddress] && `${places[v.dateAddress].name}(${places[v.dateAddress].address})`,
            start: v.dateTime,
            end: v.dateTime,
        }) : ({
            calendarId: "1",
            category: "time",
            isVisible: true,
            title: `${v.manager.name}: ${v.user.name} 방문`,
            attendees: [v.manager.name,v.user.name],
            id: "1",
            body: v.body,
            start: v.date,
            end: v.date,
          })))}
        weekDayname={(v) => {
            console.log(v);
            return v;
        }}
        week={{
            weekDayname: (v) => {
                console.log(v);
                return v;
            }
        }}
      />
      </div>
    );
  }
}

CalendarList.contextType = UserContext;