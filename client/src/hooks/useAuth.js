import { useSelector } from "react-redux";

export default function useAuth() {
  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(user && token);
  return { user, token, isAuthenticated };
}
