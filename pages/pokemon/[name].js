import React from "react";
import Nav from "../../src/components/Nav";
import { getPokemonPageInfo } from "../../src/api/pokemonPageApi";
import Image from "next/image";
import styles from "../../styles/Pokemon.module.css";
import Link from "next/link";
const IMAGE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

function Pokemon({ data }) {
  return (
    <div>
      <Nav />
      <main>
        <div className={styles.pokemonCard}>
          <Image
            className={styles.image}
            src={`${IMAGE_URL}/${data.id}.png`}
            alt=""
            height="400"
            width="400"
          ></Image>
          <div className={styles.pokemonCardInfo}>
            <h1>{data.name}</h1>
            <h3> Evolution chain</h3>
            <ul>
              <li className={styles.evolution}>
                <Link href={`/pokemon/${data.evolutions.base[0]}`}>
                  <a>{data.evolutions.base[0]}</a>
                </Link>
              </li>
              <li>
                {data.evolutions.first.map((item, index) => (
                  <Link key={index} href={`/pokemon/${item}`}>
                    <a>
                      <p className={styles.evolution}>{item}</p>
                    </a>
                  </Link>
                ))}
              </li>
              <li className={styles.evolution}>
                <Link href={`/pokemon/${data.evolutions.second[0]}`}>
                  <a>{data.evolutions.second[0]}</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.movesCard}>
          <h1>{`${data.name} moves`}</h1>
          <div>
            {data.moves.map((move, index) => (
              <p className={styles.move} key={index}>
                {move}
              </p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { name } = params;
  const data = await getPokemonPageInfo(name);
  return { props: { data: data } };
}

export default Pokemon;
