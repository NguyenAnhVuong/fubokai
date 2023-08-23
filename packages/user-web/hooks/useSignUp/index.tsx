import { useAuth } from "hooks/useAuth";
import { useSignUpMutation } from "hooks/useSignUp/queries";

export const useSignUp = () => {
  const { updateToken } = useAuth();

  const [signUp] = useSignUpMutation({ onCompleted: (data) => data.signUp && updateToken(data.signUp.id, data.signUp.token) });

  return { signUp };
};
