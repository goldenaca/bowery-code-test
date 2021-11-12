import React, { useState, useEffect } from "react";
import Image from "next/image";
import Nav from "../../src/components/Nav.js";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import styles from "../../styles/Home.module.css";

const QUERY_URL = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";
const IMAGE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [pokemons, setPokemons] = useState([]);
  const [nextQuery, setNextQuery] = useState({ next: null, prev: null });
  const [queryUrl, setQueryUrl] = useState(QUERY_URL);
  const router = useRouter();

  const displayPokemons = () => {
    if (searchValue)
      return pokemons.map((pokemon, index) => {
        if (pokemon.name.includes(searchValue)) {
          if (loading)
            return (
              <div key={index} className={styles.loading}>
                Loading
              </div>
            );
          return (
            <li key={index} className={styles.cardContainer}>
              <Link href={`/pokemon/${pokemon.name}`}>
                <a>
                  <Image
                    priority
                    className={styles.image}
                    src={`${IMAGE_URL}/${pokemon.id}.png`}
                    alt=""
                    width="100"
                    height="100"
                    layout="responsive"
                  ></Image>
                  <h1 className={styles.pokemonName}>{pokemon.name}</h1>
                </a>
              </Link>
            </li>
          );
        }
      });

    return pokemons.map((pokemon, index) => {
      if (loading)
        return (
          <div key={index} className={styles.loading}>
            Loading
          </div>
        );
      return (
        <li key={index} className={styles.cardContainer}>
          <Link href={`/pokemon/${pokemon.name}`}>
            <a>
              <Image
                priority
                className={styles.image}
                src={`${IMAGE_URL}/${pokemon.id}.png`}
                alt=""
                width="100"
                height="100"
                layout="responsive"
              ></Image>
              <h1 className={styles.pokemonName}>{pokemon.name}</h1>
            </a>
          </Link>
        </li>
      );
    });
  };

  const pageBtnHandler = (e) => {
    if (e.target.value === "prev") {
      if (nextQuery.prev) {
        setQueryUrl(nextQuery.prev);
      }
    } else {
      if (nextQuery.next) {
        setLoading(true);
        setQueryUrl(nextQuery.next);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) return;
    router.push("/");
  });

  useEffect(() => {
    const grabPokemons = async (url) => {
      const pokeData = await axios.get(url);
      const normalizedPokeData = await pokeData.data.results.map((pokemon) => {
        return { name: pokemon.name, id: pokemon.url.split("/")[6] };
      });
      setNextQuery({ next: pokeData.data.next, prev: pokeData.data.previous });
      setPokemons([...normalizedPokeData]);
      setLoading(false);
    };
    grabPokemons(queryUrl);
  }, [queryUrl]);

  return (
    <div className={styles.page}>
      <Nav />
      <form className={styles.formContainerHome}>
        <label>Search by name</label>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
        />
      </form>
      <main>
        <ul className={styles.imagesContainer}>{displayPokemons()}</ul>
        <div className={styles.btnsContainer}>
          <button value="prev" onClick={pageBtnHandler}>
            Prev
          </button>
          <button value="next" onClick={pageBtnHandler}>
            next
          </button>
        </div>
      </main>
    </div>
  );
}
