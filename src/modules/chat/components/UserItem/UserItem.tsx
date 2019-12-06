import React from "react";

import { Wrapper } from "./UserItem.styles";
import { UserType } from "../../types";
import { ReactComponent as Remove } from "../../../../icons/remove.svg";

type UserItemProps = {
  onRemove: (userId: string) => void;
}

const UserItem: React.FC<UserItemProps & UserType> = ({
  profilePicture,
  firstName,
  lastName,
  title,
  onRemove,
  userId
}):  React.ReactElement => {
  return (
    <Wrapper>
      <span>
        <img className="user-image" src={profilePicture} alt="img" />
        <span className="user-name">{`${firstName} ${lastName}`}</span>
      </span>
      <span>
        <span className="user-info">{title}</span>
        <Remove onClick={() => onRemove(userId)} />
      </span>
    </Wrapper>
  );
};

export default UserItem;
export { UserItem };
