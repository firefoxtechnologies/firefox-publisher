import { useState } from "react";
import { Link } from "react-router-dom";
import { CtaBand } from "../components/ui.jsx";
import { PROJECTS, PROJECT_CATS } from "../data/catalog.js";
import { usePageMeta } from "../hooks.js";

export default function Portfolio() {
  usePageMeta("Portfolio | Firefox Publishers", "Selected projects showing the objective, the work completed and what was delivered.");
  const [filter, setFilter] = useState("all");
  const chips = [{ id: "all", label: "All" }, ...PROJECT_CATS];
  const label = (id) => PROJECT_CATS.find((c) => c.id === id).label;
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="crumbs"><Link to="/">Home</Link> / Portfolio</p>
          <h1>Portfolio</h1>
          <p className="lead">Each project shows the objective, the work we completed and what was delivered. The work leads; our branding stays secondary.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2 className="sr-only">Projects</h2>
          <div className="filters" role="group" aria-label="Filter projects">
            {chips.map((c) => (
              <button key={c.id} type="button" className={"chip" + (filter === c.id ? " active" : "")} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="grid grid--3" id="projects">
            {PROJECTS.map((p) => (
              <article className="work" key={p.title} hidden={filter !== "all" && p.cat !== filter}>
                <div className="work__img" role="img" aria-label="Placeholder for project image">Project image</div>
                <div className="work__body">
                  <p className="tag">{label(p.cat)}</p>
                  <h3>{p.title}</h3>
                  <dl>
                    <dt>Objective</dt><dd>What the client wanted to achieve.</dd>
                    <dt>Work completed</dt><dd>What Firefox Publishers did.</dd>
                    <dt>Deliverables</dt><dd>What was handed over.</dd>
                  </dl>
                </div>
              </article>
            ))}
          </div>
          <p className="note">Placeholders. Publish only real projects, permissioned visuals and substantiated results, and keep each client's identity distinct from ours.</p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
