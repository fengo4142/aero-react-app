import React from "react";
import { Formik, Form, Field } from "formik";
import { Field as FromField } from "../../../../../components/forms/Field";

import { Button } from "semantic-ui-react";
import {
  createChannelSchema,
  validateUserIDsSet
} from "../../../validators/createChannelSchema";
import { Input, Select, TextArea } from "../../../../../components/forms";
import { FormFooter } from "../CreateChannel.styles";
import { Search } from "../../Search";
import { UserList } from "../../UserList";
import { FormValues, UserType } from "../../../types";

const countryOptions = [
  { key: "prv", value: "private", text: "Private" },
  { key: "pbl", value: "public", text: "Public" }
];

export interface CreateChannelFormProps {
  onUserSelect: (userID: string | string[]) => void;
  onRemove: (userID: string) => void;
  createChannel: (values: object) => void;
  items: UserType[] | [];
  userIDs: string[];
  userId: string;
  airportId: string;
}

const form = {
  reset: null,
  setErrors: null
};

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({
  createChannel,
  userIDs,
  items,
  onUserSelect,
  onRemove,
  userId,
  airportId
}) => {
  const initialValues: FormValues = {
    name: "",
    privacy: "",
    content: "",
    invitedPeople: null
  };

  const handleSubmit = ({ name, privacy, content }, actions): void => {
    const isInvited = validateUserIDsSet(userIDs);

    if (isInvited) {
      form.setErrors({
        invitedPeople: isInvited
      });
      actions.setSubmitting(false);
      return;
    }

    createChannel({
      variables: {
        name,
        content,
        users: userIDs,
        type: privacy === "private",
        airportId,
        userId
      }
    });
    actions.setSubmitting(false);
  };

  const selectedUsers = items.filter(({ userId }) => userIDs.includes(userId));

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createChannelSchema}
      onSubmit={handleSubmit}
      render={({ isSubmitting, resetForm, setErrors, errors }) => {
        form.reset = resetForm;
        form.setErrors = setErrors;

        return (
          <div>
            <Form>
              <div className="form-wrapper">
                <div className="first-row">
                  <Field
                    key="name"
                    name="name"
                    render={formProps => {
                      return (
                        <Input
                          placeholder="Please Enter the Name of Channel"
                          type="text"
                          labelText="Name of Channel"
                          disabled={isSubmitting}
                          {...formProps}
                        />
                      );
                    }}
                  />
                  <Field
                    key="privacy"
                    name="privacy"
                    render={formProps => {
                      return (
                        <Select
                          placeholder="Please select Privacy"
                          labelText="Privacy"
                          disabled={isSubmitting}
                          options={countryOptions}
                          {...formProps}
                        />
                      );
                    }}
                  />
                </div>
                <hr />
                <div className="second-row">
                  <Field
                    key="content"
                    name="content"
                    render={formProps => {
                      return (
                        <div className="text-area">
                          <TextArea
                            placeholder=""
                            disabled={isSubmitting}
                            labelText="Details"
                            {...formProps}
                          />
                        </div>
                      );
                    }}
                  />
                </div>

                <hr />
                <div className="third-row">
                  <FromField
                    labelText="Invite people"
                    error={errors.invitedPeople}
                  >
                    <Search
                      onUserSelect={onUserSelect}
                      listUsers={items}
                      items={selectedUsers}
                    />
                  </FromField>
                  <FromField labelText="Invited people">
                    {items && (
                      <UserList items={selectedUsers} onRemove={onRemove} />
                    )}
                  </FromField>
                </div>
              </div>
              <hr />

              <FormFooter>
                <Button type="submit" primary>
                  Create
                </Button>
              </FormFooter>
            </Form>
          </div>
        );
      }}
    />
  );
};
export default CreateChannelForm;
