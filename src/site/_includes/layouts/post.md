---
layout: layouts/base.njk
pageClass: posts
---

<p class="date">
  Posted on <time datetime="{{ date }}">{{ date | dateDisplay }}</time>
</p>
<main>
  <h1>{{title}}</h1>
  {{ content | safe }}
  <div class="footnote">
    <p>
      Thanks for reading!
    </p>
  </div>
</main>
