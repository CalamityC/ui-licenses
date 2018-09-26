import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import Dashboard from './routes/Dashboard';
import Tabs from './components/Tabs';

export default class Licenses extends React.Component {
  static manifest = Object.freeze({
    query: {},
    resultCount: {},
  });

  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
    match: PropTypes.shape({
      path: PropTypes.string,
    }),
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);

    this.connectedDashboard = props.stripes.connect(Dashboard);
  }

  getCurrentPage(props) {
    const { match, location } = props;
    const lStripped = location.pathname.substring(match.path.length + 1);
    const rStripped = lStripped.split('/')[0];

    return rStripped;
  }

  render() {
    const { stripes, match } = this.props;
    const currentPage = this.getCurrentPage(this.props);

    return (
      <React.Fragment>
        <Tabs
          tab={currentPage}
          parentResources={this.props.resources}
          parentMutator={this.props.mutator}
        />
        <Switch>
          <Route
            path={`${match.path}/dashboard`}
            render={() => <this.connectedDashboard stripes={stripes} />}
          />
          <Redirect
            exact
            from={`${match.path}`}
            to={`${match.path}/dashboard`}
          />
        </Switch>
      </React.Fragment>
    );
  }
}
