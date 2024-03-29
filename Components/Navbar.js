import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { HiSun, HiMoon } from "react-icons/hi";
import { AiOutlineGoogle } from "react-icons/ai";
import { auth, provider } from "../Firebase/Firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { IoLogOutOutline } from "react-icons/io5";
import Alert from "./Alert";
import { useDispatch } from "react-redux";

function Navbar({ topics }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [signedName, setSignedName] = useState(false)
  const { theme, setTheme } = useTheme();
  const [viewAlert, setViewAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setIsMounted(true);
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "STORE_USER", payload: user });
      setLogin(true);
      setSignedName(user.photo)
    }
  }, []);

  const toggleTheme = () => {
    if (isMounted) {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };
  const handelSignOut = () => {
    signOut(auth)
      .then((res) => {
        setLogin(false);
        localStorage.removeItem("user");
        dispatch({ type: "REMOVE_USER" });
        setViewAlert(true);
        setAlertMessage("Hope to see you again !!");
        setTimeout(() => {
          setViewAlert(false);
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handelSignIn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const userObj = {
          name: res.user.displayName,
          photo: res.user.photoURL,
          token: res.user.accessToken,
          uid: res.user.uid,
        };

        localStorage.setItem("user", JSON.stringify(userObj));
        dispatch({ type: "STORE_USER", payload: userObj });
        setLogin(true);
        setViewAlert(true);
        setAlertMessage(`Hello ${res.user.displayName}`);
        setTimeout(() => {
          setViewAlert(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Alert show={viewAlert} type="success" message={alertMessage} />
      <header className="fixed w-full border-t-4 bg-white dark:bg-dark border-teal-600 dark:border-teal-900 shadow dark:shadow-2 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex">
              <Link href="/">
                <a className="flex items-center hover:text-teal-600 text-gray-800 dark:text-gray-50">
                  <span className="mx-1 font-semibold text-base md:text-base">
                    AVOCADEV.ID
                  </span>
                </a>
              </Link>
            </div>

            <div className="flex items-center -mx-3">
              <button
                className="flex items-center mx-2 lg:mx-4 text-base text-gray-800 hover:text-teal-600 dark:text-gray-50"
                onClick={toggleTheme}
              >
                <span className="text-lg">
                  {isMounted && theme === "dark" ? (
                    <HiSun className="text-xl" />
                  ) : (
                    <HiMoon className="text-xl" />
                  )}
                </span>
              </button>

              {isLogin ? (
                <span className="md:flex items-center">
                  <span className="hidden md:block text-sm font-medium"><img className="avatar" src= {signedName}></img></span>
                </span>
              ) : (
                <span className="md:flex items-center" onClick={handelSignIn}>
                  <span className="hidden md:block text-sm font-medium">
                    {}
                  </span>
                </span>
              )}

              <button className="flex items-center mx-2 lg:mx-4 text-base text-gray-800 hover:text-teal-600 dark:text-gray-50">
                {isLogin ? (
                  <span
                    className="md:flex items-center"
                    onClick={handelSignOut}
                  >
                    <span className="hidden md:block text-sm font-medium">
                    </span>
                    <IoLogOutOutline className="text-xl mx-1" />
                  </span>
                ) : (
                  <span className="md:flex items-center" onClick={handelSignIn}>
                    <span className="hidden md:block text-sm font-medium">
                      {" "}
                      Sign In
                    </span>
                    <AiOutlineGoogle className="text-xl mx-1" />
                  </span>
                )}
              </button>
              
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
