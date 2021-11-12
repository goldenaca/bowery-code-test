import axios from "axios";

export const getPokemonPageInfo = async (name) => {
  let normalizedData = {};

  const pokemonData = await axios
    .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .catch((err) => console.log(err));
  const pokemonSpeciesUrl = pokemonData.data.species.url;

  const evolutionChainUrl = await axios
    .get(pokemonSpeciesUrl)
    .then((res) => res.data.evolution_chain.url)
    .catch((err) => console.log(err));

  const callEvoChain = async () => {
    //calls evolution info endpoint
    const evolutionChainData = await axios
      .get(evolutionChainUrl)
      .catch((err) => console.log(err));
    // set base ev
    const baseEv = [evolutionChainData.data.chain.species.name];

    // set first ev/s
    if (evolutionChainData.data.chain.evolves_to.length === 0)
      return { base: baseEv, first: [""], second: [""] };
    const firstEv = evolutionChainData.data.chain.evolves_to.map(
      (data) => data.species.name
    );
    // set second ev
    if (evolutionChainData.data.chain.evolves_to[0].evolves_to.length === 0)
      return { base: baseEv, first: firstEv, second: [""] };
    const secondEv = [
      evolutionChainData.data.chain.evolves_to[0].evolves_to[0].species.name,
    ];
    return { base: baseEv, first: firstEv, second: secondEv };
  };

  normalizedData = {
    moves: pokemonData.data.moves.map((data) => {
      return data.move.name;
    }),
    name: name,
    id: pokemonData.data.id,
    evolutions: await callEvoChain(),
  };

  return normalizedData;
};
