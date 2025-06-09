import SignupStepper from "../components/auth/SignupStepper";
// import SignupStepper from "../components/auth/SignupStepper";
import signupImage from "../assets/png/signup.png";
import logo from "../assets/png/logo.png"; // Import your logo

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel: Logo, Heading, Image */}
      <div className="hidden lg:block w-3/5 pl-8 relative">
        {/* Logo */}
        <img
          src={logo}
          alt="SwiftSupply Logo"
          className="absolute left-12 top-14 h-18 w-auto z-20"
        />

        {/* Heading and Subtext */}
        <div className="absolute left-50 top-[25%] pl-8 z-10">
          <h1 className="text-4xl font-bold mb-5">
            Sign Up to <span className="inline-block">SwiftSupply</span>
          </h1>
          <p className="text-xl mb-2 text-[gray] font-semibold">If you already have an account</p>
          <span className="text-xl text-[gray] font-semibold">
            You can{" "}
            <a
              href="/login"
              className="text-[#B1153C] font-bold underline cursor-pointer"
            >
              Login here !
            </a>
          </span>
        </div>

        {/* Signup Illustration Image */}
        <img
          src={signupImage}
          className="absolute left-0 bottom-5 max-h-[500px] pl-8"
          alt=""
        />
      </div>

      {/* Right Panel: Stepper Form */}
      <div className="flex-1 flex items-center justify-center">
        <SignupStepper />
      </div>
    </div>
  );
}
