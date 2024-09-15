export default function UserProfile({ avatar, username }) {
  return (
    <div className="flex h-full select-none max-lg:w-80">
      <div className=" rounded-full bg-gray-800 p-2">
        <img
          className="h-10 w-auto rounded-full"
          src={avatar}
          alt={`${username} avatar`}
        />
      </div>
      <div className="inline-flex basis-full items-center">
        <p className="ml-4 text-nowrap text-2xl max-lg:text-3xl">{username}</p>
      </div>
    </div>
  );
}
