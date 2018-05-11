import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router';

import BasicLayout from './Layout';
import '../assets/stylesheets/App.css';

export class App extends Component {

  render() {
    return (
      <BasicLayout />
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func,
  items: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    gameData: state.gameData,
  };
}

export default withRouter(connect(mapStateToProps)(App));
