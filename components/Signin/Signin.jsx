import React from "react";
import Image from "next/image";
import shape from "../../public/Shape.png";
import SignInForm from "./SignInForm";
import justice from "../../public/justice.svg";

const Signin = () => {
  return (
    <div className="flex h-screen max-lg:flex-col">
      <div className="basis-1/2 flex-1 bg-[#F3EAE7] relative flex flex-col items-center justify-center h-full">
        <div className="relative flex flex-col items-center">
          <Image
            src={shape}
            alt="Decorative Shape"
            width={420}
            height={420}
            className="object-cover md:min-w-[25rem] w-[15rem] rounded-3xl md:h-[28rem] h-[18rem]"
          />
          <Image
            src={justice}
            alt="Justice Image"
            width={400}
            height={200}
            className="object-contain md:w-80 w-40 absolute md:bottom-[-100px] bottom-[-50px]"
          />
        </div>
      </div>
      <div className="basis-1/2 flex-1 flex justify-center items-center h-full max-lg:w-full bg-white">
        <SignInForm />
      </div>
    </div>
  );
}

export default Signin;
