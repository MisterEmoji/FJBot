export default function CountryFlag({ name }) {
  return (
    <object
      data={`../../public/images/flags/${name}.svg`}
      type="image/svg+xml"
    ></object>
  );
}
