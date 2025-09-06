import Image from "next/image";
import ImageComponent from "./img/page";

export default function Home() {
  return (
    <>
      <h1 className="text-center">Welcome to Smart Bus Portal.
        <ImageComponent/>
      </h1>
    </>
  );
}
