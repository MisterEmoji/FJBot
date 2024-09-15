import apiRoutes from "../utils/apiRoutes";
import Cookies from "js-cookies";

export default async function landingLoader() {
  if (!Cookies.getItem("loggedIn")) return null;

  // fetch basic user info if user is logged in

  try {
    // this data is now available through useLoaderData() function

    // temp
    return { global_name: "Cuute doggy" };
    //return (await fetch(apiRoutes.user)).json();
  } catch (e) {
    console.log(e);
    throw new Response("Undefined error", { status: 400 });
  }
}
