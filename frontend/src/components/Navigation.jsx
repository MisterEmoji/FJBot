import { withTranslation } from "react-i18next";

// get translation context from 't' prop
function Navigation({ className, items, t }) {
  // return (
  //   <nav
  //     className={`flex w-full basis-full items-center justify-center max-lg:flex-wrap lg:space-x-16 xl:space-x-24 ${className ?? ""}`}
  //   >
  //     {items.map((item, i) => (
  //       <a
  //         key={i}
  //         className={`${
  //           i % 2 ? "max-lg:bg-gray-700" : "max-lg:bg-gray-800"
  //         } text-center text-red-50 transition-all hover:text-red-100 hover:underline max-lg:basis-full max-lg:py-12 max-lg:text-lg max-lg:hover:bg-gray-950`}
  //         href={item.href}
  //       >
  //         {t(item.name)}
  //       </a>
  //     ))}
  //   </nav>
  // );
  return (
    <nav
      className={`nav justify-content-center container-fluid ${className ?? ""}`}
    >
      {items.map((item, i) => (
        <a key={i} className="nav-link m-4" href={item.href}>
          {t(item.name)}
        </a>
      ))}
    </nav>
  );
}

export default withTranslation()(Navigation);
