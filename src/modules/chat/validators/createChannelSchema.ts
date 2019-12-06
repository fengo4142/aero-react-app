import * as yup from "yup";

export const createChannelSchema = yup.object().shape({
  name: yup
    .string()
    .label("First Name")
    .required(),
  privacy: yup
    .string()
    .label("Privacy")
    .required(),
  content: yup
    .string()
    .label("Details")
    .required()
});

export const validateUserIDsSet = (userIDsSet: string[]): string | null => {
  if (userIDsSet.length !== 0) {
    return null;
  }

  return "Please Invite at least one person";
};
