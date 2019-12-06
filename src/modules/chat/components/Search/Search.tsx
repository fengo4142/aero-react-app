import React, { useEffect, useState } from "react";
import { Search as LibSearch } from "semantic-ui-react";
import { debounce, escapeRegExp } from "../../../../libComponents/lodash";
import {
  SearchProps,
  SearchResultData
} from "semantic-ui-react/dist/commonjs/modules/Search/Search";

import { Wrapper } from "./Search.styles";
import { UserType } from "../../types";
import { SearchResultProps } from "semantic-ui-react/dist/commonjs/modules/Search/SearchResult";
import { ResultListItem } from "./ResultListItem";

const inputProps = { icon: "search", iconPosition: "left" };

type UserSearchProps = {
  onUserSelect: (userID: string | string[]) => void;
  listUsers?: UserType[];
  items: UserType[];
};

const Search: React.FC<UserSearchProps> = ({
  onUserSelect,
  listUsers = [],
  items
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<UserType[]>(listUsers);
  const [userIdArray, setUserIdArray] = useState<string[]>([]);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setUserIdArray(results.map(item => item.userId));
  }, [results, setUserIdArray]);

  const handleResultSelect = (
    e: React.MouseEvent<HTMLDivElement>,
    { result: { userId, firstName } }: SearchResultData
  ): boolean => {
    if (!userId) {
      return;
    }

    setValue(firstName);
    onUserSelect(userId);
    return false;
  };

  const handleSearchChange = (
    event: React.MouseEvent<HTMLElement>,
    { value }: SearchProps
  ): void => {
    setLoading(true);
    setValue(value);

    setTimeout(() => {
      if (value.length < 1) {
        setValue("");
        return;
      }

      const re = new RegExp(escapeRegExp(value), "i");
      const isMatch = <T extends { firstName: string; lastName: string }>({
        firstName,
        lastName
      }): boolean => re.test(`${firstName} ${lastName}`);

      const newResult = listUsers
        .filter(isMatch)
        .map(user => ({ ...user, key: user.userId }));

      setLoading(false);
      setResults(newResult);
      setValue("");
    }, 300);
  };

  const resultRenderer = ({
    firstName,
    lastName,
    userId,
    title,
    profilePicture,
    selectAll
  }: SearchResultProps): React.ReactElement => {
    return (
      <ResultListItem
        key={userId}
        firstName={firstName}
        lastName={lastName}
        userId={userId}
        title={title}
        profilePicture={profilePicture}
        listUsers={listUsers}
        items={items}
        selectAll={selectAll}
        onUserSelect={onUserSelect}
        userIdArray={userIdArray}
      />
    );
  };

  return (
    <Wrapper>
      <LibSearch
        input={inputProps}
        loading={isLoading}
        onResultSelect={handleResultSelect}
        onSearchChange={debounce(handleSearchChange, 500, { leading: true })}
        results={
          results.length > 1
            ? [{ selectAll: true, key: "selectAll" }, ...results]
            : results
        }
        resultRenderer={resultRenderer}
        value={value}
      />
    </Wrapper>
  );
};

export default Search;
export { Search };
