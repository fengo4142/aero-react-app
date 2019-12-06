import React from "react";

import { Wrapper } from "./UserList.styles";
import { UserType } from "../../types";
import { UserItem } from "../UserItem";

type UsersListRemoveProps = {
  items: UserType[],
  onRemove: (userId: string) => void;
}

const UserList: React.FC<UsersListRemoveProps> = ({ items, onRemove }):  React.ReactElement => {
  return (
    <Wrapper>
      {items.map(user => (
        <UserItem {...user} onRemove={onRemove} key={user.userId} />
      ))}
    </Wrapper>
  );
};

export default UserList;
export { UserList };
