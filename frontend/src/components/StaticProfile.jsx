export default function StaticProfile({ icon, content }) {
  return (
    <a className="btn h-100 container-fluid" href="#">
      <div className="row h-100 align-items-center flex">
        <div className="col h-100">
          <img
            className="img-fluid h-100 rounded-circle border-dark bg-black p-1"
            src={icon}
            alt="profile logo"
          />
        </div>
        <div className="col">{content}</div>
      </div>
    </a>
  );
  return (
    <div className="flex h-full select-none max-lg:w-80 lg:min-w-fit">
      <div className="inline-flex h-full max-w-max basis-full rounded-full bg-gray-800 p-2">
        <img src={icon} alt="logo" />
      </div>
      <div className="flex basis-full items-center">
        <p className="ml-4 text-3xl">
          <span className="italic text-red-500">F</span>
          <span className="italic text-blue-500">J</span> Bot
        </p>
      </div>
    </div>
  );
}
