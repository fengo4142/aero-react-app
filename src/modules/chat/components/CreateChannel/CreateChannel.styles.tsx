import styled from "styled-components";

export const Wrapper = styled.div`
  .ui.segment {
    padding: unset;
  }
  .form-wrapper {
    margin: 0 97px;
    .first-row {
      display: flex;
      justify-content: space-between;

      //todo fix styles
      .cyjodq {
        justify-content: unset;
        .input {
          width: 100%;
        }
        margin-right: 60px;
      }
      .sc-htpNat {
        justify-content: unset;
        width: 36.5%;
        .selection {
          width: 100%;
        }
      }
    }

    .third-row {
      display: flex;
      margin-bottom: 19px;
      min-height: 204px;

      > div {
        width: 50%;
      }

      h3 {
        padding: 19px 0px;
      }
    }

    .text-area {
      textarea {
        min-height: 110px;
        border-radius: 4px;
        border: solid 1px #dce0e6;
      }
    }
    .ui .segment {
      padding: unset;
    }
    hr {
      margin-top: 10px;
    }
  }

  h1 {
    padding: 15px;
    margin: unset;
  }
  hr {
    margin-top: unset;
    margin-bottom: unset;
  }
`;

export const FormFooter = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 25px 95px;

  .ui.primary.button {
    width: 130px;
    border-radius: 16.5px;
    background-color: #3a61a8;

    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.09px;
    text-align: center;
    color: #ffffff;
  }
`;
