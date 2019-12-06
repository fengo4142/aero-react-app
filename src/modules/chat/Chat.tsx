import React from "react";
import "./App.css";

import Channels from "./components/Channels";
import "semantic-ui-css/semantic.min.css";
import Shortcuts from "../../components/topbar/shortcuts/shortcuts";

import styles from "./chat.module.scss";

import settings from "../../icons/settings.svg";
import search from "../../icons/search.svg";
import { LOGS_HOME_ROUTE } from "../../constants/RouterConstants";
import IconButton from "../../components/iconButton";
import { RouteComponentProps } from "react-router-dom";
import preset from "../../icons/Preset.svg";
import Search from "../../components/search/Search";
import Separator from "../../components/separator";
import Button from "../../components/button";
import SectionHeader from "../../components/sectionHeader";
import { uiRouts } from '../../constants';
import { ChatNavigation } from './components/ChatParts'

const links = [
  { url: uiRouts.channels, name: "Channels" },
  { url: uiRouts.directMassages, name: "Direct Massages" },
  { url: uiRouts.irrops, name: "IRROPs" },
  { url: uiRouts.documents, name: "Documents" }
];

const Chat: React.FC<RouteComponentProps> = ({ history }) => {

  return (
    <>
      <Shortcuts links={links} />
      <SectionHeader
        icon={preset}
        translationID="todo_add_translationID"
        defaultTitle="Channels"
      >
        <div className={styles.chat_tools}>
          <IconButton
            icon={settings}
            onClick={() => {
              history.push(uiRouts.createNewChannel);
            }}
          />
          <IconButton icon={search} />
          <Separator />
          <Button
            translationID="Create New Channel"
            defaultText="Create New Channel"
            onClick={() => {
              history.push(uiRouts.createNewChannel);
            }}
          />
        </div>
      </SectionHeader>

      <ChatNavigation />
    </>
  );
};
export default Chat;
