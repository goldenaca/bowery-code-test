import React from "react";
import styles from "../../styles/Nav.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

function Nav() {
  const router = useRouter();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className={styles["nav"]}>
      <Link href="/home">
        <a className={styles["title"]}>PokeDex </a>
      </Link>
      <button onClick={logoutHandler}> Log-out</button>
    </div>
  );
}

export default Nav;
