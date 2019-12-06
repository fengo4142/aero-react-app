import React from "react";
import { Checkbox } from "semantic-ui-react";
import { UserType, SearchResult } from "../../types";

type ResultListItemProps = {
  listUsers?: UserType[];
  items: UserType[];
  selectAll?: boolean;
  onUserSelect: (userID: string | string[]) => void;
  userIdArray: string[];
};

const ResultListItem: React.FC<ResultListItemProps & SearchResult> = ({
  firstName,
  lastName,
  profilePicture,
  title,
  userId,
  selectAll,
  onUserSelect,
  userIdArray,
  items
}) => {
  if (selectAll === true) {
    return (
      <div
        className="select-all"
        onClick={() => {
          onUserSelect(userIdArray);
        }}
      >
        select all
      </div>
    );
  }

  const isExist = items.some(user => user.userId === userId);

  return (
    <div className="search-result">
      <div className="search-name">
        <Checkbox label="" checked={isExist} />
        <img className="user-image" src={profilePicture} alt="img" />
        <span className="user-name">{`${firstName} ${lastName}`}</span>
      </div>
      <span className="user-info">{title}</span>
    </div>
  );
};

export default ResultListItem;
export { ResultListItem };
