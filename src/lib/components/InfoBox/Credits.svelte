<section class="credits" aria-labelledby="credits-title">
  <h4 id="credits-title">Credits</h4>

  <div class="credit-group">
    <span class="credit-role">Maintainer</span>
    <div class="person-row">
      <span>Mehdi El Oualy</span>
      <a href="https://github.com/meel-hd" target="_blank" rel="noreferrer">@meel-hd</a>
    </div>
  </div>

  <div class="credit-group">
    <span class="credit-role">Background artist</span>
    <a href="https://www.voyagerillustration.com/" target="_blank" rel="noreferrer">
      Christian Benavides | Voyager
    </a>
    <p>Default backgrounds are credited to and remain the property of their original owners.</p>
  </div>

  <div class="credit-group">
    <span class="credit-role">Contributors</span>
    <ul>
      <li class="person-row">
        <span>Maxim Kirilyuk</span>
        <a href="https://github.com/werserk" target="_blank" rel="noreferrer">@werserk</a>
      </li>
      <li class="person-row">
        <span>Dylan Shade</span>
        <a href="https://github.com/dpshde" target="_blank" rel="noreferrer">@dpshde</a>
      </li>
      <li class="person-row">
        <span>Danila</span>
        <a href="https://github.com/B1g-data" target="_blank" rel="noreferrer">@B1g-data</a>
      </li>
      <li class="person-row">
        <span>Emmanuel Ebeh</span>
        <a href="https://github.com/manuelebeh" target="_blank" rel="noreferrer">@manuelebeh</a>
      </li>
    </ul>
  </div>
</section>

<style>
  .credits {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.65rem;
    padding: 0 10px;
    text-align: center;
  }

  h4,
  p {
    margin: 0;
  }

  .credit-group {
    display: grid;
    justify-items: center;
    gap: 0.15rem;
    padding: 0.35rem 0;
  }

  .credit-role {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  a,
  .credit-group > span:not(.credit-role) {
    color: white;
    font-weight: 600;
  }

  a:hover {
    text-decoration: underline;
  }

  p,
  .person-row {
    color: rgba(255, 255, 255, 0.75);
    font-size: small;
  }

  ul {
    display: grid;
    gap: 0.2rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .person-row {
    display: flex;
    gap: 0.45rem;
    align-items: baseline;
  }

  .person-row a {
    color: rgba(255, 255, 255, 0.7);
    font-size: small;
    font-weight: 400;
  }
</style>
