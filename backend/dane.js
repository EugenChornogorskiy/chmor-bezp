import fs from "fs/promises";
async function list() {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`);
    if (!response.ok) throw new Error(`${response.status}`);

    const dane = await response.json();

    const pok = await Promise.all(
      dane.results.map(async (p) => {
        const res = await fetch(p.url);
        if (!res.ok) throw new Error("Failed to fetch Pokemon details");
        return await res.json();
      })
    );

    const newDane = pok.map((e) => ({
      sprite: e.sprites.front_default,
      name: e.name,
      stats: [
        { value: e.stats.find(s => s.stat.name == "hp").base_stat, name: "hp" },
        { value: e.stats.find(s => s.stat.name == "attack").base_stat, name: "attack" },
        { value: e.stats.find(s => s.stat.name == "defense").base_stat, name: "defense" },
        { value: e.stats.find(s => s.stat.name == "speed").base_stat, name: "speed" }
      ],
      types: e.types.map((t) => t.type.name)
    }));
    await fs.writeFile(
      "pokemon.json",
      JSON.stringify(newDane, null, 2),
      "utf-8"
    );
    return newDane;
  } catch (error) {
    console.log(error);
  }
}
list()
const data = await fs.readFile("pokemon.json", "utf-8");
console.log(data)