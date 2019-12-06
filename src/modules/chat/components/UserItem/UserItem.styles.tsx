import styled from "styled-components";

export const Wrapper = styled.li`
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 341px;
  width: 100%;
  height: 32px;
  border-radius: 18px;
  background-color: #3a61a8;
  margin: 9px 0;
  border-radius: 18px;
  padding: 3px 5px;

  .user-name {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.79;
    letter-spacing: 0.09px;
    color: #ffffff;
    padding: 0 3px;
  }

  .user-info {
    font-size: 12px;
    text-align: right;
    color: #dedede;
  }

  img {
    height: 26px;
    width: 26px;
    border-radius: 50%;
  }
  
  svg{
    cursor: pointer;
  }
`;
