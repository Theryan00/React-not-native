import MainTemplate from "../../components/templates/main.template";
import React, { useContext, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import Button from '@material-ui/core/Button';
import { projectDatabase } from "../../firebase/firebase";
import SchedulerDataService from "../../services/scheduler.service";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { withStyles } from "@material-ui/core/styles";
import AddSchedulerEvent from "./AddSchedulerEvent";
import PropTypes from 'prop-types';
import { OpenInBrowserSharp } from "@material-ui/icons";

const styles = theme => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    form: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
    fab: {
        margin: 0,
        top: "auto",
        right: 20,
        bottom: 20,
        left: "auto",
        position: "fixed",
    },
});

class Scheduler extends React.Component {
    constructor(props) {
        super(props);
        this.state = { eventsList: [], show: false, currentEvents: [] }

    }

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = (e) => {
        e.stopPropagation(); 
        this.setState({ show: false });
        window.location.reload();
    };

    componentDidMount() {
        projectDatabase.ref("schedule").once("value", snapshot => {
            let eventsList = [];
            snapshot.forEach(snap => {
                let key = snap.key
                let data = snap.val()
                eventsList.push({ id: key, title: data.title, startTime: data.startTime, endTime: data.endTime, color: data.color, daysOfWeek: data.daysOfWeek });
            });

            this.setState({ eventsList: eventsList });
            console.log(this.state.eventsList)
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <MainTemplate>
                {this.renderSidebar()}
                <div style={{ marginLeft: 5 + 'em', marginRight: 5 + 'em' }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                        initialView="timeGridWeek"
                        slotMinTime="06:00:00"
                        slotMaxTime="23:00:00"
                        headerToolbar={{
                            left: "prev,next",
                            center: "title",
                            right: "dayGrid, timeGridWeek, listWeek"
                        }}
                        //initialView="timeGrid"
                        //weekends={false}
                        eventClick={this.handleEventClick}
                        events={this.state.eventsList}
                    //dateClick={this.handleClickOpen}
                    />
                </div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.show}
                    onClose={this.hideModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                >
                    <Fade in={this.state.show}>
                        <div className={classes.paper}>
                            <h2 id="transition-modal-title">Add Event</h2>
                            <div className={classes.form} noValidate autoComplete="off">
                                <AddSchedulerEvent />
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </MainTemplate>

        )
    }

    renderSidebar() {
        return (
            <div className='app-sidebar' style={{
                width: 150 + 'px',
                lineHeight: 1.5,
                background: '#ffff11f',
                borderRight: 1 + 'px'
            }}
            >
                <div className='app-sidebar-section' style={{ padding: 2 + 'em' }} >
                    <Button style={{ margin: 1 + 'em', float: 'center' }} class="btn  btn-primary" onClick={this.showModal}>Add</Button>
                </div>
            </div>
        )
    }

    handleEventClick = (clickInfo) => {
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            SchedulerDataService.remove(clickInfo.event.id)
        }
        window.location.reload(); 
    }

    handleEvents = (events) => {
        events = this.state.eventsList
        this.setState({
            currentEvents: events
        })
    }
}

Scheduler.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Scheduler);

