import styled from "styled-components";

export const Wrapper = styled.div`
  .ui.search .prompt {
    border-radius: 5px;
    width: 335px;
    height: 36px;
  }

  .select-all {
    font-size: 12px;
    color: #242e42;
  }

  .search-result {
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search-name {
      display: flex;
      align-items: center;
    }

    .ui.checkbox label:before {
      border-radius: 50%;
    }
    .ui.checkbox label:after {
      font-size: 12px;
      top: -4px;
    }

    .user-name {
      font-size: 14px;
      font-weight: bold;
      line-height: 1.79;
      letter-spacing: 0.09px;
      color: #242e42;
      padding: 0 3px;
    }

    .user-info {
      font-size: 12px;
      text-align: right;
      color: #242e42;
    }
    img {
      padding: 0px 3px;
      height: 26px;
      width: 26px;
      border-radius: 50%;
    }
  }

  .ui.search > .results .result {
    padding: 4px 10px;
    border-bottom: unset;
  }

  .user-image {
    height: 26px;
  }
`;
