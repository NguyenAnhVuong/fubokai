import { useAuth } from "hooks/useAuth";
import { useSignUpMutation } from "hooks/useSignUp/queries";

export const useSignUp = () => {
  const { updateUsingCartId, updateToken } = useAuth();

  const [signUp] = useSignUpMutation({
    onCompleted: (data) => {
      if (data.signUp) {
        updateUsingCartId(data.signUp.usingCartId);
        updateToken(data.signUp.id, data.signUp.token);
      }
    },
  });

  return { signUp };
};
