import React, { Component } from "react";
import { Calendar } from "@fullcalendar/core";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import luxonPlugin from "@fullcalendar/luxon2";
import moment from "moment";
import Router from "next/router";

export default class CalendarDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendar: null
    };
    this.calendarRef = React.createRef();
  }

  componentDidMount() {
    
    const events = this.props.schedule[0].map((val)=>{
      const startTime = val?.time.split(" - ")[0];
      var momentObj = moment(startTime, ["h:mm A"])
      return {
        title: val?.name,
        id:val?.room_id,
        description:val?.room_id,
        rrule: {
          freq: 'weekly',
          interval: 1,
          byweekday: [ 'MO' ,'TU', 'WE', 'TH', 'FR' ],
          dtstart: `2012-02-01T${momentObj.format("HH:mm")}`,
        },
        duration: "00:40",
      }
    })

    const calendar = new Calendar(this.calendarRef.current, {
      plugins: [
        timeGridPlugin,
        luxonPlugin,
        listPlugin,
        rrulePlugin,
        interactionPlugin
      ],
      headerToolbar: {
        center: "title",
        end: "today prev,next",
        start: ""
        
      },
      selectable: false,
      editable: false,
      displayEventEnd: true,
      displayEventTime: true,
      eventBackgroundColor:'#00adb5',
      eventBorderColor:'#ffffff',
      eventTimeFormat:"hh:mm",
      eventMinHeight:50,
      events: events,
      eventClick:(e)=>{
        Router.push({
          pathname: `/classroom/[room_id]/[section]`,
          query: {
            room_id: e.event.id,
            section: e.event.title
          }
        })
      },

      eventDrop: this.eventDrop
    });

    calendar.render();
    this.setState({ calendar });
  }

  eventDrop = (info) => {
    console.log("DROP", info.event.start);
  };

  render() {
    return <div ref={this.calendarRef} />;
  }
}
