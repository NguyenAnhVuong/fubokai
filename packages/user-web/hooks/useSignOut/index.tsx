import { useAuth } from "hooks/useAuth";
import { useCallback } from "react";

export const useSignOut = () => {
  const { updateToken } = useAuth();

  const signOut = useCallback(() => updateToken(null, null), [updateToken]);

  return { signOut };
};
