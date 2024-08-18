const APIURL = "http://api.github.com/users/";

const $main = $("#main");
const $form = $("#form");
const $search = $("#search");

function getUser(username) {
  $.ajax({
    url: APIURL + username,
    method: "GET",
    success: function (data) {
      createUserCard(data);
      getRepos(username);
    },
    error: function (err) {
      if (err.status == 404) {
        createErrorCard("No profile with this username");
      }
    },
  });
}

function getRepos(username) {
  $.ajax({
    url: APIURL + username + "/repos?sort=created",
    method: "GET",
    success: function (data) {
      addReposToCard(data);
    },
    error: function () {
      createErrorCard("Problem fetching repos");
    },
  });
}

function createUserCard(user) {
  const cardHTML = `
    <div class="card">
      <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar" />
      </div>
      <div class="user-info">
        <h2>${user.name}</h2>
        <p>${user.bio}</p>
        <ul>
          <li>${user.followers} <strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.public_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>`;

  $main.html(cardHTML);
}

function createErrorCard(msg) {
  const cardHTML = `<div class="card"><h1>${msg}</h1></div>`;
  $main.html(cardHTML);
}

function addReposToCard(repos) {
  const $reposEl = $("#repos");

  repos.slice(0, 5).forEach((repo) => {
    const $repoEl = $("<a></a>")
      .addClass("repo")
      .attr("href", repo.html_url)
      .attr("target", "_blank")
      .text(repo.name);

    $reposEl.append($repoEl);
  });
}

$form.on("submit", function (e) {
  e.preventDefault();

  const user = $search.val();

  if (user) {
    getUser(user);
    $search.val("");
  }
});
