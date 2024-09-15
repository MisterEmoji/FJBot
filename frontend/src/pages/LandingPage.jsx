import apiRoutes from "../utils/apiRoutes";
import Header from "../components/Header";

export default function LandingPage() {
  function handleAuth() {
    document.location.href = apiRoutes.auth;
  }

  return (
    <>
      <Header onAuthorization={handleAuth} />
    </>
  );
}
