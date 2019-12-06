import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { CreateChannel } from "../CreateChannel";
import { Channels } from "../Channels";
import { uiRouts } from '../../../../constants';

//TODO (refactor) create components in separate files
const DirectMassages = () => <h1>DirectMassages</h1>;
const IRROPs = () => <h1>IRROPs</h1>;
const Documents = () => <h1>Documents</h1>;

const ChatNavigation: React.FC = () => (
  <Switch>
    <Route exact path={uiRouts.channels} component={Channels} />
    <Route exact path={uiRouts.directMassages} component={DirectMassages} />
    <Route exact path={uiRouts.irrops} component={IRROPs} />
    <Route exact path={uiRouts.documents} component={Documents} />
    <Route exact path={uiRouts.createNewChannel} component={CreateChannel} />

    <Redirect from={uiRouts.messenger} exact to={uiRouts.channels} />
  </Switch>
);

export default ChatNavigation;
export { ChatNavigation };
