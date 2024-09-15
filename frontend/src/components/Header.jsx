import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import Navigation from "./Navigation";
import { Button, ButtonWrapper } from "./Button";
import StaticProfile from "./StaticProfile";
import Dropdown from "../components/Dropdown";

import {
  EllipsisHorizontalIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";

import languages from "../translation.json";
import UserProfile from "./UserProfile";
import apiRoutes from "../utils/apiRoutes";

const navigationItems = [
  { name: "Features", href: "#" },
  { name: "Documentation", href: "#" },
  { name: "Contact", href: "#" },
];

const profileOptions = [{ label: "settings", href: "#" }];

export default function Header({ onAuthorization }) {
  const { t } = useTranslation();
  const userInfo = useLoaderData();
  const [expandNav, setExpandNav] = useState(false);

  function toggleNavVisibility() {
    setExpandNav(!expandNav);
  }

  // {!userInfo || userInfo?.error ? (
  //   /* login button */
  //   <ButtonWrapper className="max-lg:h-24 max-lg:w-full lg:pr-4">
  //     <Button
  //       padded
  //       color="discord"
  //       className="gap-x-2 rounded-xl bg-discord ring-discord/60 max-lg:rounded-none"
  //       onClick={onAuthorization}
  //     >
  //       <img className="h-10" src="./images/dc.png" />
  //       <p>{t("Login")}</p>
  //     </Button>
  //   </ButtonWrapper>
  // ) : (
  //   /* account dropdown */
  //   <Dropdown
  //     expandButtonProps={{
  //       padded: true,
  //       className:
  //         "ring-transparent flex flex-col items-center bg-gray-900 pt-2 text-white max-md:gap-6 lg:h-16 lg:flex-row lg:p-2",
  //       children: (
  //         <UserProfile
  //           avatar={apiRoutes.avatarImage(userInfo.id, userInfo.avatar)}
  //           username={userInfo.global_name}
  //         />
  //       ),
  //     }}
  //     wrapperClass={"min-w-40 max-lg:relative max-lg:w-full "}
  //     itemsPosition={"absolute max-lg:relative"}
  //     items={Object.keys(profileOptions).map((option) => (
  //       /* single profile option */
  //       // TODO:
  //       <Button className="relative flex h-14 w-28 justify-between rounded-none bg-gray-800 py-1 text-xs ring-gray-800/80 max-lg:text-lg lg:h-8"></Button>
  //     ))}
  //   />
  // )}
  //   {/* language dropdown */}
  //   <Dropdown
  //   expandButtonProps={{
  //     padded: true,
  //     className: "ring-transparent",
  //     children: (
  //       <LanguageIcon className="w-16 hover:brightness-50 max-lg:my-6 lg:w-8" />
  //     ),
  //   }}
  //   wrapperClass={"min-w-40 max-lg:relative max-lg:w-full "}
  //   itemsPosition={"absolute max-lg:relative"}
  //   items={Object.keys(languages).map((lang) => (
  //     /* single language option */
  //     <Button className="relative flex h-14 w-28 justify-between rounded-none bg-gray-800 py-1 text-xs ring-gray-800/80 max-lg:text-lg lg:h-8">
  //       <img
  //         className="left-0 w-8 max-lg:absolute max-lg:w-16"
  //         srcSet={`./images/flags/${lang}.svg`}
  //         alt={lang}
  //       />
  //       <p className="flex w-full items-center justify-center">
  //         {languages[lang].langName}
  //       </p>
  //     </Button>
  //   ))}
  // />
  //   <ButtonWrapper className="h-16 w-full lg:hidden">
  //   <Button
  //     padded
  //     className="rounded-none ring-transparent hover:bg-gray-950"
  //     onClick={toggleNavVisibility}
  //   >
  //     <EllipsisHorizontalIcon className="w-32" />
  //   </Button>
  // </ButtonWrapper>
  // flex w-full flex-col items-center bg-gray-900 pt-2 text-white max-md:gap-6 lg:h-16 lg:flex-row lg:p-2
  return (
    <header
      id="main-header"
      className="row container-fluid w-100 bg-dark-subtle ms-0"
    >
      {/* bot profile */}
      <div className="col-2 h-100">
        <StaticProfile icon="./images/FJ_logo.png" />
      </div>
      {/* navigation */}
      <div className="col">
        <Navigation
          className={expandNav ? "" : "max-lg:hidden"}
          items={navigationItems}
        />
      </div>
      {/* login/account button */}
      <div className="col-2">
        {!userInfo || userInfo?.error ? (
          <ButtonWrapper className="max-lg:h-24 max-lg:w-full lg:pr-4">
            <Button
              padded
              color="discord"
              className="gap-x-2 rounded-xl bg-discord ring-discord/60 max-lg:rounded-none"
              onClick={onAuthorization}
            >
              <img className="h-10" src="./images/dc.png" />
              <p>{t("Login")}</p>
            </Button>
          </ButtonWrapper>
        ) : (
          <Dropdown
            expandButtonProps={{
              padded: true,
              className:
                "ring-transparent flex flex-col items-center bg-gray-900 pt-2 text-white max-md:gap-6 lg:h-16 lg:flex-row lg:p-2",
              children: (
                <UserProfile
                  avatar={apiRoutes.avatarImage(userInfo.id, userInfo.avatar)}
                  username={userInfo.global_name}
                />
              ),
            }}
            wrapperClass={"min-w-40 max-lg:relative max-lg:w-full "}
            itemsPosition={"absolute max-lg:relative"}
            items={Object.keys(profileOptions).map((option) => (
              <Button className="relative flex h-14 w-28 justify-between rounded-none bg-gray-800 py-1 text-xs ring-gray-800/80 max-lg:text-lg lg:h-8"></Button>
            ))}
          />
        )}
      </div>
    </header>
  );
}
