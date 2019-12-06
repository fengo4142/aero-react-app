import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import OperationsLayout from './OperationsLayout';
import SettingsLayout from './settings/SettingsLayout';
import Home from './home/Home';
import ToDo from './toDo/List/ToDoList';
import TopBar from '../components/topbar';
import ModalRoot from './modals/ModalRoot';
import ProfileLayout from './ProfileLayout';
import Chat from './chat';
import { uiRouts } from '../constants';

class MainLayout extends Component {
  componentDidMount() {
    const ApiKey = process.env.REACT_APP_GMAPS_KEY;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${ApiKey}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  render() {
    return (
      <>
        <TopBar />
        <Route exact path={uiRouts.root} component={Home} />
        <Route exact path={uiRouts.todo} component={ToDo} />
        <Route path={uiRouts.messenger} component={Chat} />
        <Route path={uiRouts.settings} component={SettingsLayout} />
        <Route path={uiRouts.ops} component={OperationsLayout} />
        <Route path={uiRouts.profile} component={ProfileLayout} />
        <ModalRoot />
      </>
    );
  }
}

export default MainLayout;
