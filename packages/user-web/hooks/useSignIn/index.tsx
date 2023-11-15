import { useAuth } from "hooks/useAuth";
import { useSignInMutation } from "hooks/useSignIn/queries";

export const useSignIn = () => {
  const { updateUsingCartId, updateToken } = useAuth();

  const [signIn] = useSignInMutation({
    onCompleted: (data) => {
      if (data.signIn) {
        updateToken(data.signIn.id, data.signIn.token);
        updateUsingCartId(data.signIn.usingCartId);
      }
    },
  });

  return { signIn };
};
