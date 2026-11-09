import type { AnimeCredits } from "@/lib/bangumi";

export function AnimeCredits({ credits }: { credits: AnimeCredits }) {
  if (!credits.characters.length) return null;
  return <div className="credits-wrap">
    {credits.characters.length > 0 && <section className="credits-section" aria-labelledby="characters-heading">
      <div className="eyebrow dark-eyebrow"><span className="pulse"/> CAST</div>
      <h2 id="characters-heading">角色介紹</h2>
      <div className="credits-grid">{credits.characters.map(character => <article className="credit-card character-card" key={character.id}>
        <a className="credit-person" href={`https://bgm.tv/character/${character.id}`} target="_blank" rel="noreferrer">
          {character.image && <img src={character.image} alt="" loading="lazy"/>}
          <span><strong>{character.name}</strong>{character.relation && <small>{character.relation}</small>}</span>
        </a>
        {character.actors.length > 0 && <div className="voice-actors"><span>CV</span>{character.actors.map(actor => <a href={`https://bgm.tv/person/${actor.id}`} target="_blank" rel="noreferrer" key={actor.id}>{actor.image && <img src={actor.image} alt="" loading="lazy"/>}{actor.name}</a>)}</div>}
      </article>)}</div>
    </section>}
  </div>;
}
